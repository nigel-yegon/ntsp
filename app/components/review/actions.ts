// app/components/review/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canTransition } from "@/lib/workflow";
import { tallyVotes } from "@/lib/tally";
import type {
  ApplicationStatus,
  DocumentReviewStatus,
  VoteDecision,
} from "@/lib/db-types";

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function reviewDocument(formData: FormData) {
  const user = await requireUser();

  const documentId = String(formData.get("documentId"));
  const stage = String(formData.get("stage")) as "perusal" | "verification";
  const decision = String(formData.get("decision")) as DocumentReviewStatus;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (user.role !== "VERIFIER" && user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const doc = await prisma.document.update({
    where: { id: documentId },
    data:
      stage === "perusal"
        ? {
            perusalStatus: decision,
            reviewNotes: notes,
            reviewedById: user.id,
            reviewedAt: new Date(),
          }
        : {
            verificationStatus: decision,
            reviewNotes: notes,
            reviewedById: user.id,
            reviewedAt: new Date(),
          },
  });

  await prisma.applicationEvent.create({
    data: {
      applicationId: doc.applicationId,
      type: stage === "perusal" ? "DOCUMENT_PERUSED" : "DOCUMENT_VERIFIED",
      actorId: user.id,
      message: `${doc.fileName}: ${decision}${notes ? ` — ${notes}` : ""}`,
      metadata: { documentId, stage, decision },
    },
  });

  revalidatePath(`/review/perusal/${doc.applicationId}`);
  revalidatePath(`/review/verification/${doc.applicationId}`);
}

export async function castVote(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "COMMITTEE_MEMBER" && user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const applicationId = String(formData.get("applicationId"));
  const decision = String(formData.get("decision")) as VoteDecision;
  const comment = String(formData.get("comment") ?? "").trim() || null;

  await prisma.committeeVote.upsert({
    where: {
      applicationId_voterId: { applicationId, voterId: user.id },
    },
    create: { applicationId, voterId: user.id, decision, comment },
    update: { decision, comment },
  });

  await prisma.applicationEvent.create({
    data: {
      applicationId,
      type: "COMMITTEE_VOTE_CAST",
      actorId: user.id,
      message: `Voted ${decision}${comment ? ` — ${comment}` : ""}`,
      metadata: { decision },
    },
  });

  const votes = await prisma.committeeVote.findMany({
    where: { applicationId },
  });

  if (votes.length >= 3) {
    const outcome = tallyVotes(votes);
    if (outcome !== "TIE") {
      const next: ApplicationStatus =
        outcome === "APPROVED" ? "COMMITTEE_APPROVED" : "COMMITTEE_DECLINED";

      await prisma.application.update({
        where: { id: applicationId },
        data: { status: next },
      });

      await prisma.applicationEvent.create({
        data: {
          applicationId,
          type:
            outcome === "APPROVED"
              ? "COMMITTEE_APPROVED"
              : "COMMITTEE_DECLINED",
          actorId: user.id,
          message: `Committee outcome: ${outcome}`,
        },
      });
    }
  }

  revalidatePath(`/review/committee/${applicationId}`);
}

export async function psDecision(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "PERMANENT_SECRETARY" && user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const applicationId = String(formData.get("applicationId"));
  const to = String(formData.get("to")) as ApplicationStatus;
  const note = String(formData.get("note") ?? "").trim() || null;

  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
  });

  if (!canTransition(application.status, to, user.role)) {
    throw new Error(`Transition ${application.status} → ${to} not allowed`);
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: to,
      psDecidedAt:
        to === "PS_APPROVED" || to === "PS_DECLINED" ? new Date() : undefined,
      forwardedAt: to === "FORWARDED_TO_INTERIOR" ? new Date() : undefined,
    },
  });

  await prisma.applicationEvent.create({
    data: {
      applicationId,
      type:
        to === "PS_APPROVED"
          ? "PS_APPROVED"
          : to === "PS_DECLINED"
          ? "PS_DECLINED"
          : "FORWARDED_TO_INTERIOR",
      actorId: user.id,
      message: note,
      metadata: { from: application.status, to },
    },
  });

  revalidatePath("/review/ps");
  revalidatePath(`/review/ps/${applicationId}`);
}