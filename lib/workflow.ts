// lib/workflow.ts

type Role =
  | "EMPLOYER"
  | "ADMIN"
  | "VERIFIER"
  | "COMMITTEE_MEMBER"
  | "PERMANENT_SECRETARY";

type ApplicationStatus =
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

export const TRANSITIONS: Record<
  ApplicationStatus,
  { next: ApplicationStatus[]; allowedRoles: Role[] }
> = {
  DRAFT: {
    next: ["SUBMITTED", "WITHDRAWN"],
    allowedRoles: ["EMPLOYER", "ADMIN"],
  },
  SUBMITTED: {
    next: ["UNDER_PERUSAL", "WITHDRAWN"],
    allowedRoles: ["VERIFIER", "ADMIN"],
  },
  UNDER_PERUSAL: {
    next: ["UNDER_VERIFICATION", "WITHDRAWN"],
    allowedRoles: ["VERIFIER", "ADMIN"],
  },
  UNDER_VERIFICATION: {
    next: ["AWAITING_COMMITTEE", "WITHDRAWN"],
    allowedRoles: ["VERIFIER", "ADMIN"],
  },
  AWAITING_COMMITTEE: {
    // Option A: committee recommendation goes straight to the PS.
    // COMMITTEE_APPROVED is kept for legacy rows only.
    next: ["AWAITING_PS_APPROVAL", "COMMITTEE_DECLINED"],
    allowedRoles: ["COMMITTEE_MEMBER", "ADMIN"],
  },
  COMMITTEE_APPROVED: {
    next: ["AWAITING_PS_APPROVAL"],
    allowedRoles: ["ADMIN", "COMMITTEE_MEMBER"],
  },
  COMMITTEE_DECLINED: {
    next: [],
    allowedRoles: [],
  },
  AWAITING_PS_APPROVAL: {
    next: ["PS_APPROVED", "PS_DECLINED"],
    allowedRoles: ["PERMANENT_SECRETARY", "ADMIN"],
  },
  PS_APPROVED: {
    next: ["FORWARDED_TO_INTERIOR"],
    allowedRoles: ["PERMANENT_SECRETARY", "ADMIN"],
  },
  PS_DECLINED: {
    next: [],
    allowedRoles: [],
  },
  FORWARDED_TO_INTERIOR: {
    next: [],
    allowedRoles: [],
  },
  WITHDRAWN: {
    next: [],
    allowedRoles: [],
  },
};

export function canTransition(
  from: ApplicationStatus,
  to: ApplicationStatus,
  role: Role
) {
  const rule = TRANSITIONS[from];
  if (!rule) return false;
  return rule.next.includes(to) && rule.allowedRoles.includes(role);
}

/** Whether every required document has passed the current review stage. */
export function documentsReadyForStage(
  docs: { perusalStatus: string; verificationStatus: string; slotRequired: boolean }[],
  stage: "PERUSAL" | "VERIFICATION"
) {
  const required = docs.filter((d) => d.slotRequired);
  if (stage === "PERUSAL") {
    return required.every((d) => d.perusalStatus !== "PENDING");
  }
  return required.every((d) => d.verificationStatus === "ACCEPTED");
}

// ─── Note requirements ──────────────────────────────────────
// Transitions that MUST carry a note. The audit needs to know
// *why* the case moved, not just that it moved. Enforced by the
// transition route, the `transitionApplication` server action,
// and the UI (`required minLength={5}` on each form's note).
export const NOTE_REQUIRED_FOR_TRANSITIONS: ReadonlyArray<ApplicationStatus> =
  [
    "AWAITING_COMMITTEE",
    "AWAITING_PS_APPROVAL",
    "COMMITTEE_DECLINED",
    "PS_APPROVED",
    "PS_DECLINED",
  ] as const;

// ─── Committee quorum ───────────────────────────────────────
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
  votes: { decision: VoteDecision }[]
): QuorumState {
  const approves = votes.filter((v) => v.decision === "APPROVE").length;
  const declines = votes.filter((v) => v.decision === "DECLINE").length;
  const abstains = votes.filter((v) => v.decision === "ABSTAIN").length;

  const approved =
    approves >= COMMITTEE_QUORUM && approves > declines;
  const declined =
    declines >= COMMITTEE_QUORUM && declines > approves;

  return {
    approves,
    declines,
    abstains,
    total: votes.length,
    approved,
    declined,
    needApprove: Math.max(0, COMMITTEE_QUORUM - approves),
    needDecline: Math.max(0, COMMITTEE_QUORUM - declines),
  };
}