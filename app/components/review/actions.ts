// app/components/review/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  committeeQuorum,
  evaluateTransition,
  transitionRequiresNote,
  type ApplicationStatus,
  type DocumentForGate,
  type DocumentReviewStatus,
  type EventType,
  type Role,
  type VoteDecision,
} from "@/lib/workflow";

// ─── Auth helpers ───────────────────────────────────────────────

type SessionUser = {
  id: string;
  role: Role;
  email?: string | null;
  name?: string | null;
};

async function requireUser(): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user as SessionUser;
}

function requireRole(user: SessionUser, allowed: Role[]): void {
  if (!allowed.includes(user.role)) {
    throw new Error(`Forbidden: requires one of ${allowed.join(", ")}`);
  }
}

// ─── Path revalidation ──────────────────────────────────────────

function revalidateReviewPaths(applicationId: string) {
  revalidatePath(`/review/perusal/${applicationId}`);
  revalidatePath(`/review/verification/${applicationId}`);
  revalidatePath(`/review/committee/${applicationId}`);
  revalidatePath(`/review/ps/${applicationId}`);
  revalidatePath("/review/perusal");
  revalidatePath("/review/verification");
  revalidatePath("/review/committee");
  revalidatePath("/review/ps");
  revalidatePath("/services/applications");
}

// ─── Document review (peruser OR verifier) ─────────────────────

/**
 * Record a document decision for either stage:
 *   - stage = "perusal"      → PERUSER or ADMIN; writes perusalStatus / perusedById / perusedAt
 *   - stage = "verification" → VERIFIER or ADMIN; writes verificationStatus / reviewedById / reviewedAt
 *
 * Verifiers may not sign off a document that hasn't been perused yet.
 */
export async function reviewDocument(formData: FormData) {
  const user = await requireUser();

  const documentId = String(formData.get("documentId"));
  const stage = String(formData.get("stage")) as "perusal" | "verification";
  const decision = String(formData.get("decision")) as DocumentReviewStatus;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (stage === "perusal") {
    requireRole(user, ["PERUSER", "ADMIN"]);
  } else if (stage === "verification") {
    requireRole(user, ["VERIFIER", "ADMIN"]);
  } else {
    throw new Error(`Unknown stage: ${stage}`);
  }

  const existing = await prisma.document.findUniqueOrThrow({
    where: { id: documentId },
    select: {
      applicationId: true,
      fileName: true,
      perusalStatus: true,
      application: { select: { status: true } },
    },
  });

  // Stage/status alignment — a document review only makes sense
  // while the application is actually in that stage.
  if (stage === "perusal") {
    const allowed: ApplicationStatus[] = ["SUBMITTED", "UNDER_PERUSAL"];
    if (!allowed.includes(existing.application.status)) {
      throw new Error(
        `Cannot review at perusal: application is ${existing.application.status}.`
      );
    }
  } else if (existing.perusalStatus === "PENDING") {
    throw new Error("Cannot verify a document that has not been perused yet.");
  }

  const eventType: EventType =
    stage === "perusal" ? "DOCUMENT_PERUSED" : "DOCUMENT_VERIFIED";

  await prisma.$transaction([
    prisma.document.update({
      where: { id: documentId },
      data:
        stage === "perusal"
          ? {
              perusalStatus: decision,
              reviewNotes: notes,
              perusedById: user.id,
              perusedAt: new Date(),
            }
          : {
              verificationStatus: decision,
              reviewNotes: notes,
              reviewedById: user.id,
              reviewedAt: new Date(),
            },
    }),
    prisma.applicationEvent.create({
      data: {
        applicationId: existing.applicationId,
        type: eventType,
        actorId: user.id,
        message: `${existing.fileName}: ${decision}${
          notes ? ` — ${notes}` : ""
        }`,
        metadata: {
          documentId,
          stage,
          decision,
          actorRole: user.role,
        },
      },
    }),
  ]);

  revalidateReviewPaths(existing.applicationId);
}

// ─── Committee vote ─────────────────────────────────────────────

/**
 * Cast or change the caller's vote. Does NOT transition the
 * application — a committee member makes the explicit transition
 * once quorum is reached (see `transitionApplication`).
 */
export async function castVote(formData: FormData) {
  const user = await requireUser();
  requireRole(user, ["COMMITTEE_MEMBER", "ADMIN"]);

  const applicationId = String(formData.get("applicationId"));
  const decision = String(formData.get("decision")) as VoteDecision;
  const comment = String(formData.get("comment") ?? "").trim() || null;

  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    select: { status: true },
  });
  if (application.status !== "AWAITING_COMMITTEE") {
    throw new Error(
      `Cannot vote: application status is ${application.status}`
    );
  }

  await prisma.$transaction([
    prisma.committeeVote.upsert({
      where: {
        applicationId_voterId: { applicationId, voterId: user.id },
      },
      create: { applicationId, voterId: user.id, decision, comment },
      update: { decision, comment },
    }),
    prisma.applicationEvent.create({
      data: {
        applicationId,
        type: "COMMITTEE_VOTE_CAST",
        actorId: user.id,
        message: `Voted ${decision}${comment ? ` — ${comment}` : ""}`,
        metadata: { decision },
      },
    }),
  ]);

  revalidatePath(`/review/committee/${applicationId}`);
  revalidatePath("/review/committee");
}

// ─── Transition ─────────────────────────────────────────────────

const EVENT_FOR_TRANSITION: Record<ApplicationStatus, EventType> = {
  DRAFT: "NOTE_ADDED",
  SUBMITTED: "SUBMITTED",
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

type TimestampField =
  | "submittedAt"
  | "perusalStartedAt"
  | "verificationStartedAt"
  | "committeeDecidedAt"
  | "psDecidedAt"
  | "forwardedAt";

const TIMESTAMP_FOR_TRANSITION: Partial<
  Record<ApplicationStatus, TimestampField>
> = {
  SUBMITTED: "submittedAt",
  UNDER_PERUSAL: "perusalStartedAt",
  UNDER_VERIFICATION: "verificationStartedAt",
  COMMITTEE_DECLINED: "committeeDecidedAt",
  AWAITING_PS_APPROVAL: "committeeDecidedAt",
  PS_APPROVED: "psDecidedAt",
  PS_DECLINED: "psDecidedAt",
  FORWARDED_TO_INTERIOR: "forwardedAt",
};

/**
 * The single entry point for application state changes. Guards:
 *   1. role + edge + document readiness + note requirement (via `evaluateTransition`)
 *   2. committee quorum (state machine alone cannot check votes)
 */
export async function transitionApplication(formData: FormData) {
  const user = await requireUser();
  const role = user.role;

  const applicationId = String(formData.get("applicationId"));
  const to = String(formData.get("to")) as ApplicationStatus;
  const note = String(formData.get("note") ?? "").trim();

  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    select: {
      id: true,
      status: true,
      documents: {
        select: {
          slotRequired: true,
          perusalStatus: true,
          verificationStatus: true,
        },
      },
    },
  });

  // Map to the shape the workflow helpers expect, honoring
  // `slotRequired` from the DB instead of assuming true.
  const docs: DocumentForGate[] = application.documents.map((d) => ({
    slotRequired: d.slotRequired,
    perusalStatus: d.perusalStatus as DocumentReviewStatus,
    verificationStatus: d.verificationStatus as DocumentReviewStatus,
  }));

  // 1. Role + edge + doc readiness + note requirement.
  const result = evaluateTransition({
    from: application.status,
    to,
    role,
    docs,
    note,
  });
  if (!result.ok) {
    throw new Error(result.message);
  }

  // 2. Committee quorum — state machine can't check votes.
  if (
    application.status === "AWAITING_COMMITTEE" &&
    (to === "AWAITING_PS_APPROVAL" || to === "COMMITTEE_DECLINED")
  ) {
    const votes = await prisma.committeeVote.findMany({
      where: { applicationId },
      select: { decision: true },
    });
    const q = committeeQuorum(votes);

    if (to === "AWAITING_PS_APPROVAL" && !q.approved) {
      throw new Error(
        `Quorum not met: ${q.approves} approve, ${q.declines} decline.`
      );
    }
    if (to === "COMMITTEE_DECLINED" && !q.declined) {
      throw new Error(
        `Quorum not met: ${q.declines} decline, ${q.approves} approve.`
      );
    }
  }

  // 3. Persist state + audit event atomically.
  const timestampField = TIMESTAMP_FOR_TRANSITION[to];
  const eventType = EVENT_FOR_TRANSITION[to] ?? "NOTE_ADDED";
  const metadata = {
    from: application.status,
    to,
    actorRole: user.role,
    ...(transitionRequiresNote(to) ? { noteRequired: true } : {}),
  };

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: {
        status: to,
        ...(timestampField ? { [timestampField]: new Date() } : {}),
      },
    }),
    prisma.applicationEvent.create({
      data: {
        applicationId,
        type: eventType,
        actorId: user.id,
        message: note || null,
        metadata,
      },
    }),
  ]);

  revalidateReviewPaths(applicationId);
}

// ─── PS convenience alias ───────────────────────────────────────

export async function psDecision(formData: FormData) {
  return transitionApplication(formData);
}