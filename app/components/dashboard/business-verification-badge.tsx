// app/components/dashboard/business-verification-badge.tsx
import type { BusinessVerification } from "@/lib/db-types";

const LABELS: Record<BusinessVerification, string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  SUSPENDED: "Suspended",
  REJECTED: "Rejected",
};

const TONES: Record<BusinessVerification, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  APPROVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
};

export function BusinessVerificationBadge({
  status,
}: {
  status: BusinessVerification;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}