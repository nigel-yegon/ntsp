// app/admin/operators/operator-approval-row.tsx
"use client";

import { useState, useTransition } from "react";
import { approveOperator, rejectOperator } from "../actions/operators";
import { Modal } from "@/app/components/modal";

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
  onStatusChange?: (status: "APPROVED" | "REJECTED" | "PENDING") => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const isPending = op.verificationStatus === "PENDING";
  const isApproved = op.verificationStatus === "APPROVED";
  const isRejected = op.verificationStatus === "REJECTED";

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

  function handleRejectSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectReason.trim()) return;

    startTransition(async () => {
      setError(null);
      const err = await rejectOperator(op.id, rejectReason.trim());
      if (err) {
        setError(err);
      } else {
        setIsModalOpen(false);
        setRejectReason("");
        onStatusChange?.("REJECTED");
      }
    });
  }

  return (
    <>
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

          <div className="flex shrink-0 flex-wrap gap-2">
            {isPending && (
              <button
                onClick={handleApprove}
                disabled={pending}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {pending ? "…" : "Approve"}
              </button>
            )}

            {(isPending || isApproved) && (
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={pending}
                className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:bg-deep-900 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                {isApproved ? "Revoke" : "Reject"}
              </button>
            )}

            {isRejected && (
              <button
                onClick={handleApprove}
                disabled={pending}
                className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60 dark:border-emerald-800 dark:bg-deep-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
              >
                {pending ? "…" : "Re-approve"}
              </button>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>
        )}
      </div>

      {/* Reject / Revoke Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !pending && setIsModalOpen(false)}
        title={isApproved ? "Revoke Operator Approval" : "Reject Operator"}
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={pending}
              className="rounded-lg border border-deep-200 bg-transparent px-4 py-2 text-sm font-semibold text-deep-700 transition hover:bg-cream-100 dark:border-deep-800 dark:text-cream-300 dark:hover:bg-deep-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRejectSubmit}
              disabled={pending || !rejectReason.trim()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {pending ? "Processing…" : isApproved ? "Confirm Revoke" : "Confirm Reject"}
            </button>
          </>
        }
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-sm text-deep-600 dark:text-cream-400">
            {isApproved
              ? "Revoking this operator will immediately remove their dashboard access and unpublish all their active listings."
              : "Rejecting this operator will prevent them from accessing the platform."}
          </p>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-deep-700 dark:text-cream-300">
              Reason for {isApproved ? "revocation" : "rejection"} *
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
              rows={3}
              placeholder={isApproved ? "e.g. TRA license has expired or been suspended." : "e.g. Invalid TRA license number provided."}
              className="w-full rounded-lg border border-deep-200 bg-cream-100 px-3 py-2 text-sm text-deep-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100"
            />
            <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
              This note will be stored on the operator's profile.
            </p>
          </div>
        </form>
      </Modal>
    </>
  );
}