// app/api/expatriate/submit/applications/[id]/transition/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  canTransition,
  committeeQuorum,
  NOTE_REQUIRED_FOR_TRANSITIONS,
} from "@/lib/workflow";
import type {
  ApplicationStatus,
  EventType,
} from "../../../../../../../lib/db-types";

const EVENT_FOR_TRANSITION: Partial<Record<ApplicationStatus, EventType>> = {
  UNDER_PERUSAL: "PERUSAL_STARTED",
  UNDER_VERIFICATION: "VERIFICATION_STARTED",
  AWAITING_COMMITTEE: "ESCALATED_TO_COMMITTEE",
  COMMITTEE_APPROVED: "COMMITTEE_APPROVED",
  COMMITTEE_DECLINED: "COMMITTEE_DECLINED",
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

  const actorRole = session.user.role as Parameters<typeof canTransition>[2];

  if (!canTransition(application.status, to, actorRole)) {
    return NextResponse.json(
      { error: `Transition ${application.status} → ${to} not allowed` },
      { status: 403 }
    );
  }

  // ── Required note guard ───────────────────────────────────
  const trimmedNote = typeof note === "string" ? note.trim() : "";
  if (
    NOTE_REQUIRED_FOR_TRANSITIONS.includes(to) &&
    trimmedNote.length < 5
  ) {
    return NextResponse.json(
      { error: `A comment of at least 5 characters is required for ${to}` },
      { status: 400 }
    );
  }

  // ── Stage-specific guards ─────────────────────────────────
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

  // ── Committee quorum guards (Option A) ────────────────────
  if (
    application.status === "AWAITING_COMMITTEE" &&
    (to === "AWAITING_PS_APPROVAL" || to === "COMMITTEE_DECLINED")
  ) {
    const votes = await prisma.committeeVote.findMany({
      where: { applicationId: application.id },
      select: { decision: true },
    });
    const quorum = committeeQuorum(votes);

    if (to === "AWAITING_PS_APPROVAL" && !quorum.approved) {
      return NextResponse.json(
        {
          error: `Quorum not met: ${quorum.approves} approve, ${quorum.declines} decline. Need at least ${quorum.needApprove} more approve vote(s) and more approves than declines.`,
          quorum,
        },
        { status: 400 }
      );
    }

    if (to === "COMMITTEE_DECLINED" && !quorum.declined) {
      return NextResponse.json(
        {
          error: `Quorum not met: ${quorum.declines} decline, ${quorum.approves} approve. Need at least ${quorum.needDecline} more decline vote(s) and more declines than approves.`,
          quorum,
        },
        { status: 400 }
      );
    }
  }

  // ── AWAITING_PS_APPROVAL from legacy COMMITTEE_APPROVED ───
  if (
    to === "AWAITING_PS_APPROVAL" &&
    application.status === "COMMITTEE_APPROVED"
  ) {
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

  // ── Status write ──────────────────────────────────────────
  const updated = await prisma.application.update({
    where: { id: application.id },
    data: {
      status: to,
      perusalStartedAt: to === "UNDER_PERUSAL" ? new Date() : undefined,
      verificationStartedAt:
        to === "UNDER_VERIFICATION" ? new Date() : undefined,
      committeeDecidedAt:
        to === "AWAITING_PS_APPROVAL" || to === "COMMITTEE_DECLINED"
          ? new Date()
          : undefined,
      psDecidedAt:
        to === "PS_APPROVED" || to === "PS_DECLINED" ? new Date() : undefined,
      forwardedAt:
        to === "FORWARDED_TO_INTERIOR" ? new Date() : undefined,
    },
  });

  // ── Event trail ───────────────────────────────────────────
  await prisma.applicationEvent.create({
    data: {
      applicationId: application.id,
      type: EVENT_FOR_TRANSITION[to] ?? "NOTE_ADDED",
      actorId: session.user.id,
      message: trimmedNote || null,
      metadata: { from: application.status, to },
    },
  });

  return NextResponse.json(updated);
}