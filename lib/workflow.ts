// lib/workflow.ts

// lib/workflow.ts

export type EventType =
  | "SUBMITTED"
  | "PERUSAL_STARTED"
  | "DOCUMENT_PERUSED"
  | "VERIFICATION_STARTED"
  | "DOCUMENT_VERIFIED"
  | "ESCALATED_TO_COMMITTEE"
  | "COMMITTEE_VOTE_CAST"
  | "COMMITTEE_APPROVED"
  | "COMMITTEE_DECLINED"
  | "ESCALATED_TO_PS"
  | "PS_APPROVED"
  | "PS_DECLINED"
  | "FORWARDED_TO_INTERIOR"
  | "WITHDRAWN"
  | "NOTE_ADDED";

// ─── Roles ──────────────────────────────────────────────────────

export type Role =
  | "EMPLOYER"
  | "CUSTOMER"
  | "BUSINESS"
  | "OPERATOR"
  | "PERUSER"
  | "VERIFIER"
  | "COMMITTEE_MEMBER"
  | "PERMANENT_SECRETARY"
  | "ADMIN";

// ─── Statuses ───────────────────────────────────────────────────

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_PERUSAL"
  | "UNDER_VERIFICATION"
  | "AWAITING_COMMITTEE"
  | "COMMITTEE_APPROVED"
  | "COMMITTEE_DECLINED"
  | "AWAITING_PS_APPROVAL"
  | "PS_APPROVED"
  | "PS_DECLINED"
  | "FORWARDED_TO_INTERIOR"
  | "WITHDRAWN";

export type DocumentReviewStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "NEEDS_RESUBMISSION";

export type DocumentForGate = {
  slotRequired: boolean;
  perusalStatus: DocumentReviewStatus;
  verificationStatus: DocumentReviewStatus;
};

/** Whether an application in the given status is still editable by its owner. */
export function isEditableByOwner(status: ApplicationStatus): boolean {
  return status === "DRAFT";
}

/** Whether the given role can view/edit this application as its owner. */
export function isOwnerRole(role: Role): boolean {
  return role === "EMPLOYER";
}

// ─── Transition table ───────────────────────────────────────────

export const TRANSITIONS: Record<
  ApplicationStatus,
  { next: ApplicationStatus[]; allowedRoles: Role[] }
> = {
  DRAFT: {
    next: ["SUBMITTED", "WITHDRAWN"],
    allowedRoles: ["EMPLOYER", "ADMIN"],
  },
  SUBMITTED: {
    // PERUSER opens perusal
    next: ["UNDER_PERUSAL", "WITHDRAWN"],
    allowedRoles: ["PERUSER", "ADMIN"],
  },
  UNDER_PERUSAL: {
    // PERUSER completes perusal and hands to verification
    next: ["UNDER_VERIFICATION", "WITHDRAWN"],
    allowedRoles: ["PERUSER", "ADMIN"],
  },
  UNDER_VERIFICATION: {
    // VERIFIER completes verification and escalates to committee
    next: ["AWAITING_COMMITTEE", "WITHDRAWN"],
    allowedRoles: ["VERIFIER", "ADMIN"],
  },
  AWAITING_COMMITTEE: {
    next: ["AWAITING_PS_APPROVAL", "COMMITTEE_DECLINED"],
    allowedRoles: ["COMMITTEE_MEMBER", "ADMIN"],
  },
  // Legacy only — retained so old rows can still be advanced.
  COMMITTEE_APPROVED: {
    next: ["AWAITING_PS_APPROVAL"],
    allowedRoles: ["ADMIN", "COMMITTEE_MEMBER"],
  },
  COMMITTEE_DECLINED: { next: [], allowedRoles: [] },
  AWAITING_PS_APPROVAL: {
    next: ["PS_APPROVED", "PS_DECLINED"],
    allowedRoles: ["PERMANENT_SECRETARY", "ADMIN"],
  },
  PS_APPROVED: {
    next: ["FORWARDED_TO_INTERIOR"],
    allowedRoles: ["PERMANENT_SECRETARY", "ADMIN"],
  },
  PS_DECLINED: { next: [], allowedRoles: [] },
  FORWARDED_TO_INTERIOR: { next: [], allowedRoles: [] },
  WITHDRAWN: { next: [], allowedRoles: [] },
};

// ─── Stage metadata (perusal vs verification queues) ────────────

export type StageKey =
  | "applicant"
  | "perusal"
  | "verification"
  | "committee"
  | "ps"
  | "closed";

export const STAGE_META: Record<
  ApplicationStatus,
  { stage: StageKey; roles: Role[]; slaHours?: number }
> = {
  DRAFT:                 { stage: "applicant",    roles: ["EMPLOYER", "ADMIN"] },
  SUBMITTED:             { stage: "perusal",      roles: ["PERUSER", "ADMIN"],          slaHours: 48 },
  UNDER_PERUSAL:         { stage: "perusal",      roles: ["PERUSER", "ADMIN"],          slaHours: 72 },
  UNDER_VERIFICATION:    { stage: "verification", roles: ["VERIFIER", "ADMIN"],         slaHours: 120 },
  AWAITING_COMMITTEE:    { stage: "committee",    roles: ["COMMITTEE_MEMBER", "ADMIN"], slaHours: 168 },
  COMMITTEE_APPROVED:    { stage: "committee",    roles: ["ADMIN"] },
  COMMITTEE_DECLINED:    { stage: "closed",       roles: [] },
  AWAITING_PS_APPROVAL:  { stage: "ps",           roles: ["PERMANENT_SECRETARY", "ADMIN"], slaHours: 168 },
  PS_APPROVED:           { stage: "ps",           roles: ["PERMANENT_SECRETARY", "ADMIN"] },
  PS_DECLINED:           { stage: "closed",       roles: [] },
  FORWARDED_TO_INTERIOR: { stage: "closed",       roles: [] },
  WITHDRAWN:             { stage: "closed",       roles: [] },
};

// ─── Basic role/edge check ──────────────────────────────────────

export function canTransition(
  from: ApplicationStatus,
  to: ApplicationStatus,
  role: Role
): boolean {
  const rule = TRANSITIONS[from];
  if (!rule) return false;
  return rule.next.includes(to) && rule.allowedRoles.includes(role);
}

// ─── Document gates ─────────────────────────────────────────────

/**
 * Perusal gate: every required slot must have been *looked at*
 * (i.e. not still PENDING). Rejected / needs-resubmission both
 * count as "reviewed" — the applicant handles resubmission.
 */
export function documentsReadyForPerusal(docs: DocumentForGate[]): boolean {
  const required = docs.filter((d) => d.slotRequired);
  return required.every((d) => d.perusalStatus !== "PENDING");
}

/**
 * Verification gate: every required slot must be ACCEPTED at
 * verification time. Perusal status is checked separately so a
 * verifier cannot sign off a document that was never perused.
 */
export function documentsReadyForVerification(docs: DocumentForGate[]): boolean {
  const required = docs.filter((d) => d.slotRequired);
  return required.every(
    (d) =>
      d.verificationStatus === "ACCEPTED" &&
      d.perusalStatus !== "PENDING"
  );
}

/** Convenience wrapper retained for callers that pass a stage name. */
export function documentsReadyForStage(
  docs: DocumentForGate[],
  stage: "PERUSAL" | "VERIFICATION"
): boolean {
  return stage === "PERUSAL"
    ? documentsReadyForPerusal(docs)
    : documentsReadyForVerification(docs);
}

// ─── Note requirements ──────────────────────────────────────────

export const NOTE_REQUIRED_FOR_TRANSITIONS: ReadonlyArray<ApplicationStatus> = [
  "AWAITING_COMMITTEE",
  "AWAITING_PS_APPROVAL",
  "COMMITTEE_DECLINED",
  "PS_APPROVED",
  "PS_DECLINED",
] as const;

export const NOTE_MIN_LENGTH = 5;

export function transitionRequiresNote(to: ApplicationStatus): boolean {
  return NOTE_REQUIRED_FOR_TRANSITIONS.includes(to);
}

// ─── Unified transition evaluator ───────────────────────────────

export type TransitionFailureReason =
  | "invalid_transition"
  | "role_not_allowed"
  | "documents_incomplete"
  | "note_required";

export type TransitionResult =
  | { ok: true }
  | { ok: false; reason: TransitionFailureReason; message: string };

export type EvaluateTransitionArgs = {
  from: ApplicationStatus;
  to: ApplicationStatus;
  role: Role;
  docs: DocumentForGate[];
  note?: string | null;
};

/**
 * The single source of truth for whether a transition is allowed.
 * Routes, server actions, and UI should all call this rather than
 * re-implementing the rules.
 */
export function evaluateTransition({
  from,
  to,
  role,
  docs,
  note,
}: EvaluateTransitionArgs): TransitionResult {
  const rule = TRANSITIONS[from];
  if (!rule) {
    return {
      ok: false,
      reason: "invalid_transition",
      message: `Unknown source status "${from}".`,
    };
  }
  if (!rule.next.includes(to)) {
    return {
      ok: false,
      reason: "invalid_transition",
      message: `Cannot move from ${from} to ${to}.`,
    };
  }
  if (!rule.allowedRoles.includes(role)) {
    return {
      ok: false,
      reason: "role_not_allowed",
      message: `Role ${role} cannot perform ${from} → ${to}.`,
    };
  }

  if (to === "UNDER_VERIFICATION" && !documentsReadyForPerusal(docs)) {
    return {
      ok: false,
      reason: "documents_incomplete",
      message:
        "All required documents must be perused before moving to verification.",
    };
  }

  if (to === "AWAITING_COMMITTEE" && !documentsReadyForVerification(docs)) {
    return {
      ok: false,
      reason: "documents_incomplete",
      message:
        "All required documents must be accepted at verification before escalation to the committee.",
    };
  }

  if (transitionRequiresNote(to)) {
    const trimmed = (note ?? "").trim();
    if (trimmed.length < NOTE_MIN_LENGTH) {
      return {
        ok: false,
        reason: "note_required",
        message: `A note of at least ${NOTE_MIN_LENGTH} characters is required for ${from} → ${to}.`,
      };
    }
  }

  return { ok: true };
}

// ─── Committee quorum ───────────────────────────────────────────

const DEFAULT_COMMITTEE_QUORUM = 2;

export const COMMITTEE_QUORUM = Number(
  process.env.COMMITTEE_QUORUM ?? DEFAULT_COMMITTEE_QUORUM
);

export type VoteDecision = "APPROVE" | "DECLINE" | "ABSTAIN";

export type QuorumState = {
  approves: number;
  declines: number;
  abstains: number;
  total: number;
  /** true when approves >= quorum AND approves > declines */
  approved: boolean;
  /** true when declines >= quorum AND declines > approves */
  declined: boolean;
  /** How many more APPROVE votes are needed to reach the quorum */
  needApprove: number;
  /** How many more DECLINE votes are needed to reach the quorum */
  needDecline: number;
};

export function committeeQuorum(
  votes: { decision: VoteDecision }[],
  quorum: number = COMMITTEE_QUORUM
): QuorumState {
  const approves = votes.filter((v) => v.decision === "APPROVE").length;
  const declines = votes.filter((v) => v.decision === "DECLINE").length;
  const abstains = votes.filter((v) => v.decision === "ABSTAIN").length;

  const approved = approves >= quorum && approves > declines;
  const declined = declines >= quorum && declines > approves;

  return {
    approves,
    declines,
    abstains,
    total: votes.length,
    approved,
    declined,
    needApprove: Math.max(0, quorum - approves),
    needDecline: Math.max(0, quorum - declines),
  };
}