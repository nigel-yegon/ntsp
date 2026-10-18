// app/components/review/actions.ts
"use server";

import { revalidatePath } from "next/cache";
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

/**
 * Cast or change the caller's vote. Does NOT transition the
 * application — that's a separate, explicit action by a
 * committee member once quorum is reached (see
 * `transitionApplication` below). Auto-transitioning on vote
 * count is what the old workflow did; Option A makes the
 * recommendation an explicit step with its own note.
 */
export async function castVote(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "COMMITTEE_MEMBER" && user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const applicationId = String(formData.get("applicationId"));
  const decision = String(formData.get("decision")) as VoteDecision;
  const comment = String(formData.get("comment") ?? "").trim() || null;

  // Voting only makes sense at the committee stage.
  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    select: { status: true },
  });
  if (application.status !== "AWAITING_COMMITTEE") {
    throw new Error(
      `Cannot vote: application status is ${application.status}`
    );
  }

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

  revalidatePath(`/review/committee/${applicationId}`);
  revalidatePath("/review/committee");
}

/**
 * Generic transition. Used by:
 *   - perusal page:  UNDER_PERUSAL → UNDER_VERIFICATION
 *   - verification:  UNDER_VERIFICATION → AWAITING_COMMITTEE
 *   - committee:     AWAITING_COMMITTEE → AWAITING_PS_APPROVAL
 *                    AWAITING_COMMITTEE → COMMITTEE_DECLINED
 *   - PS page:       AWAITING_PS_APPROVAL → PS_APPROVED | PS_DECLINED
 *                    PS_APPROVED → FORWARDED_TO_INTERIOR
 *
 * The transition route enforces the same guards (quorum,
 * note requirements, role, matrix), so client and server are
 * consistent by construction.
 */
export async function transitionApplication(formData: FormData) {
  const user = await requireUser();

  const applicationId = String(formData.get("applicationId"));
  const to = String(formData.get("to")) as ApplicationStatus;
  const note = String(formData.get("note") ?? "").trim();

  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
  });

  // Role gate via the matrix.
  const role = user.role as Parameters<typeof canTransition>[2];
  if (!canTransition(application.status, to, role)) {
    throw new Error(`Transition ${application.status} → ${to} not allowed`);
  }

  // Note requirement — shared with the route via lib/workflow.
  if (
    NOTE_REQUIRED_FOR_TRANSITIONS.includes(to) &&
    note.length < 5
  ) {
    throw new Error(
      `A comment of at least 5 characters is required for ${to}`
    );
  }

  // Stage-specific guards (mirrored from the route — keep them
  // in sync if you ever change one).
  if (to === "UNDER_VERIFICATION") {
    const pending = await prisma.document.count({
      where: { applicationId, perusalStatus: "PENDING" },
    });
    if (pending > 0) {
      throw new Error("All documents must be perused first");
    }
  }
  if (to === "AWAITING_COMMITTEE") {
    const unverified = await prisma.document.count({
      where: { applicationId, NOT: { verificationStatus: "ACCEPTED" } },
    });
    if (unverified > 0) {
      throw new Error("All documents must be verified and accepted");
    }
  }
  if (
    application.status === "AWAITING_COMMITTEE" &&
    (to === "AWAITING_PS_APPROVAL" || to === "COMMITTEE_DECLINED")
  ) {
    const votes = await prisma.committeeVote.findMany({
      where: { applicationId },
      select: { decision: true },
    });
    const quorum = committeeQuorum(votes);

    if (to === "AWAITING_PS_APPROVAL" && !quorum.approved) {
      throw new Error(
        `Quorum not met: ${quorum.approves} approve, ${quorum.declines} decline.`
      );
    }
    if (to === "COMMITTEE_DECLINED" && !quorum.declined) {
      throw new Error(
        `Quorum not met: ${quorum.declines} decline, ${quorum.approves} approve.`
      );
    }
  }

  await prisma.application.update({
    where: { id: applicationId },
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

  const EVENT_FOR_TRANSITION: Partial<Record<ApplicationStatus, string>> = {
    UNDER_PERUSAL: "PERUSAL_STARTED",
    UNDER_VERIFICATION: "VERIFICATION_STARTED",
    AWAITING_COMMITTEE: "ESCALATED_TO_COMMITTEE",
    COMMITTEE_DECLINED: "COMMITTEE_DECLINED",
    AWAITING_PS_APPROVAL: "ESCALATED_TO_PS",
    PS_APPROVED: "PS_APPROVED",
    PS_DECLINED: "PS_DECLINED",
    FORWARDED_TO_INTERIOR: "FORWARDED_TO_INTERIOR",
    WITHDRAWN: "WITHDRAWN",
  };

  await prisma.applicationEvent.create({
    data: {
      applicationId,
      type: (EVENT_FOR_TRANSITION[to] ?? "NOTE_ADDED") as any,
      actorId: user.id,
      message: note || null,
      metadata: { from: application.status, to },
    },
  });

  revalidatePath(`/review/committee/${applicationId}`);
  revalidatePath(`/review/perusal/${applicationId}`);
  revalidatePath(`/review/verification/${applicationId}`);
  revalidatePath(`/review/ps/${applicationId}`);
  revalidatePath("/review/committee");
  revalidatePath("/review/perusal");
  revalidatePath("/review/verification");
  revalidatePath("/review/ps");
  revalidatePath("/services/applications");
}

export async function psDecision(formData: FormData) {
  // Alias of `transitionApplication` for PS-page backward
  // compatibility. The PS page can keep calling `psDecision`
  // and get the same guards, note requirement, and audit trail.
  return transitionApplication(formData);
}