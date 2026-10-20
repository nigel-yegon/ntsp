// app/admin/operators/operator-approval-row.tsx
"use client";

import { useState, useTransition } from "react";
import { approveOperator, rejectOperator } from "../actions/operators";

type Op = {
  id: string;
  businessName: string;
  contactEmail: string;
  traLicenseNumber: string | null;
  traLicenseDocUrl: string | null;
  katoMember: boolean;
  verificationStatus: string;
  createdAt: Date;
  userEmail: string;
};

export function OperatorApprovalRow({
  op,
  onStatusChange,
}: {
  op: Op;
  onStatusChange?: (status: "APPROVED" | "REJECTED") => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleApprove() {
    startTransition(async () => {
      setError(null);
      const err = await approveOperator(op.id);
      if (err) {
        setError(err);
      } else {
        onStatusChange?.("APPROVED");
      }
    });
  }

  function handleReject() {
    const reason = prompt("Reason for rejection?");
    if (!reason) return;
    startTransition(async () => {
      setError(null);
      const err = await rejectOperator(op.id, reason);
      if (err) {
        setError(err);
      } else {
        onStatusChange?.("REJECTED");
      }
    });
  }

  const isPending = op.verificationStatus === "PENDING";
  const isApproved = op.verificationStatus === "APPROVED";

  return (
    <div className="rounded-xl border border-cream-300 bg-cream-50 p-4 dark:border-deep-700 dark:bg-deep-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-deep-800 dark:text-cream-100">
              {op.businessName}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isApproved
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : isPending
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
              }`}
            >
              {op.verificationStatus}
            </span>
            {op.katoMember && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                KATO
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-deep-500 dark:text-cream-400">
            {op.userEmail} · Registered {op.createdAt.toLocaleDateString()}
          </p>
          <p className="mt-2 text-sm text-deep-700 dark:text-cream-300">
            <strong>TRA License:</strong>{" "}
            <span className="font-mono">{op.traLicenseNumber ?? "—"}</span>
          </p>
          {op.traLicenseDocUrl && (
            <a
              href={`/api/files/${op.traLicenseDocUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              View uploaded certificate →
            </a>
          )}
        </div>

        {isPending && (
          <div className="flex shrink-0 gap-2">
            <button
              onClick={handleApprove}
              disabled={pending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {pending ? "…" : "Approve"}
            </button>
            <button
              onClick={handleReject}
              disabled={pending}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
            >
              Reject
            </button>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}