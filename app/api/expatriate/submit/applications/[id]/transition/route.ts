// app/api/applications/[id]/transition/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canTransition } from "@/lib/workflow";
import type { ApplicationStatus, EventType } from "../../../../../../../lib/db-types";

const EVENT_FOR_TRANSITION: Partial<Record<ApplicationStatus, EventType>> = {
  UNDER_PERUSAL: "PERUSAL_STARTED",
  UNDER_VERIFICATION: "VERIFICATION_STARTED",
  AWAITING_COMMITTEE: "ESCALATED_TO_COMMITTEE",
  AWAITING_PS_APPROVAL: "ESCALATED_TO_PS",
  PS_APPROVED: "PS_APPROVED",
  PS_DECLINED: "PS_DECLINED",
  FORWARDED_TO_INTERIOR: "FORWARDED_TO_INTERIOR",
  WITHDRAWN: "WITHDRAWN",
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; 

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to, note } = (await req.json()) as {
    to: ApplicationStatus;
    note?: string;
  };

  const application = await prisma.application.findUnique({
    where: { id },
    include: { documents: true },
  });
  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!canTransition(application.status, to, session.user.role)) {
    return NextResponse.json(
      { error: `Transition ${application.status} → ${to} not allowed` },
      { status: 403 }
    );
  }

  // ─── Stage-specific guards ───
  if (to === "UNDER_VERIFICATION") {
    const pending = application.documents.some(
      (d) => d.perusalStatus === "PENDING"
    );
    if (pending) {
      return NextResponse.json(
        { error: "All documents must be perused first" },
        { status: 400 }
      );
    }
  }
  if (to === "AWAITING_COMMITTEE") {
    const unverified = application.documents.some(
      (d) => d.verificationStatus !== "ACCEPTED"
    );
    if (unverified) {
      return NextResponse.json(
        { error: "All documents must be verified and accepted" },
        { status: 400 }
      );
    }
  }
  if (to === "AWAITING_PS_APPROVAL") {
    const votes = await prisma.committeeVote.findMany({
      where: { applicationId: application.id },
    });
    if (votes.length === 0) {
      return NextResponse.json(
        { error: "Committee has not voted" },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: {
      status: to,
      perusalStartedAt:
        to === "UNDER_PERUSAL" ? new Date() : undefined,
      verificationStartedAt:
        to === "UNDER_VERIFICATION" ? new Date() : undefined,
      committeeDecidedAt:
        to === "AWAITING_PS_APPROVAL" ? new Date() : undefined,
      psDecidedAt:
        to === "PS_APPROVED" || to === "PS_DECLINED" ? new Date() : undefined,
      forwardedAt:
        to === "FORWARDED_TO_INTERIOR" ? new Date() : undefined,
    },
  });

  await prisma.applicationEvent.create({
    data: {
      applicationId: application.id,
      type: EVENT_FOR_TRANSITION[to] ?? "NOTE_ADDED",
      actorId: session.user.id,
      message: note,
      metadata: { from: application.status, to },
    },
  });

  return NextResponse.json(updated);
}