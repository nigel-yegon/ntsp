// app/components/review/status-badge.tsx
import type { ApplicationStatus, DocumentReviewStatus } from "../../../lib/db-types";

const APPLICATION_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_PERUSAL: "Under perusal",
  UNDER_VERIFICATION: "Under verification",
  AWAITING_COMMITTEE: "Awaiting committee",
  COMMITTEE_APPROVED: "Committee approved",
  COMMITTEE_DECLINED: "Committee declined",
  AWAITING_PS_APPROVAL: "Awaiting PS approval",
  PS_APPROVED: "PS approved",
  PS_DECLINED: "PS declined",
  WITHDRAWN: "Withdrawn",
  FORWARDED_TO_INTERIOR: "Forwarded to Interior",
};

const APPLICATION_TONES: Record<ApplicationStatus, string> = {
  DRAFT: "bg-cream-200 text-deep-600 dark:bg-deep-800 dark:text-cream-400",
  SUBMITTED: "bg-brand-100 text-brand-800 dark:bg-brand-950/40 dark:text-brand-300",
  UNDER_PERUSAL: "bg-brand-100 text-brand-800 dark:bg-brand-950/40 dark:text-brand-300",
  UNDER_VERIFICATION: "bg-brand-100 text-brand-800 dark:bg-brand-950/40 dark:text-brand-300",
  AWAITING_COMMITTEE: "bg-brand-200 text-brand-900 dark:bg-brand-900/50 dark:text-brand-200",
  COMMITTEE_APPROVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  COMMITTEE_DECLINED: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  AWAITING_PS_APPROVAL: "bg-brand-200 text-brand-900 dark:bg-brand-900/50 dark:text-brand-200",
  PS_APPROVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  PS_DECLINED: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  WITHDRAWN: "bg-cream-200 text-deep-600 dark:bg-deep-800 dark:text-cream-400",
  FORWARDED_TO_INTERIOR: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${APPLICATION_TONES[status]}`}
    >
      {APPLICATION_LABELS[status]}
    </span>
  );
}

const DOC_LABELS: Record<DocumentReviewStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  NEEDS_RESUBMISSION: "Needs resubmission",
};

const DOC_TONES: Record<DocumentReviewStatus, string> = {
  PENDING: "bg-cream-200 text-deep-600 dark:bg-deep-800 dark:text-cream-400",
  ACCEPTED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  NEEDS_RESUBMISSION: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
};

export function DocumentStatusBadge({ status }: { status: DocumentReviewStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${DOC_TONES[status]}`}
    >
      {DOC_LABELS[status]}
    </span>
  );
}