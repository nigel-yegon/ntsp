// app/components/dashboard/booking-status-badge.tsx
import type { BookingStatus } from "../../../lib/db-types";

const LABELS: Record<BookingStatus, string> = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

const TONES: Record<BookingStatus, string> = {
  REQUESTED: "bg-brand-100 text-brand-800 dark:bg-brand-950/40 dark:text-brand-300",
  CONFIRMED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  DECLINED: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  CANCELLED: "bg-cream-200 text-deep-600 dark:bg-deep-800 dark:text-cream-400",
  COMPLETED: "bg-cream-200 text-deep-600 dark:bg-deep-800 dark:text-cream-400",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}