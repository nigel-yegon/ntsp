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
    next: ["COMMITTEE_APPROVED", "COMMITTEE_DECLINED"],
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