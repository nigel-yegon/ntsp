// app/components/dashboard/business-verification-badge.tsx
"use client";

import type { BusinessVerification } from "@/lib/generated/prisma/enums";

const LABELS: Record<BusinessVerification, string> = {
  PENDING: "Pending Review",
  PENDING_TRA_CHECK: "TRA Check",
  APPROVED: "Approved",
  SUSPENDED: "Suspended",
  REJECTED: "Rejected",
};

const STYLES: Record<BusinessVerification, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  PENDING_TRA_CHECK: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  APPROVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  SUSPENDED: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export function BusinessVerificationBadge({
  status,
}: {
  status: BusinessVerification;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}