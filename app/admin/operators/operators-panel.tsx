// app/admin/operators/operators-panel.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { listOperators, type OperatorRow } from "../actions/operators";
import { OperatorApprovalRow } from "./operator-approval-row";

export function OperatorsPanel({ search = "" }: { search?: string }) {
  const [rows, setRows] = useState<OperatorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function refresh() {
    try {
      const data = await listOperators();
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listOperators();
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Optimistic update: called by the row after a successful approve/reject
  function applyStatus(id: string, status: string) {
    setRows((curr) =>
      curr.map((r) => (r.id === id ? { ...r, verificationStatus: status } : r))
    );
    startTransition(() => {
      refresh();
    });
  }

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.businessName.toLowerCase().includes(q) ||
      r.userEmail.toLowerCase().includes(q) ||
      r.contactEmail.toLowerCase().includes(q) ||
      (r.traLicenseNumber || "").toLowerCase().includes(q)
    );
  });

  const pending = filtered.filter((r) => r.verificationStatus === "PENDING");
  const approved = filtered.filter((r) => r.verificationStatus === "APPROVED");
  const rejected = filtered.filter((r) => r.verificationStatus === "REJECTED");

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-700 dark:bg-slate-950/40 dark:text-slate-300"
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">
              Tour Operators
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
              Verify TRA licenses and approve tour operators for listing on the platform.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {loading && rows.length === 0 && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900"
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-deep-200 p-10 text-center text-sm text-deep-500 dark:border-deep-800 dark:text-cream-500">
          {search
            ? `No operators match "${search}".`
            : "No tour operators registered yet."}
        </div>
      )}

      {pending.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Pending Review ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((r) => (
              <OperatorApprovalRow
                key={r.id}
                op={r}
                onStatusChange={(status) => applyStatus(r.id, status)}
              />
            ))}
          </div>
        </section>
      )}

      {approved.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Approved ({approved.length})
          </h3>
          <div className="space-y-3">
            {approved.map((r) => (
              <OperatorApprovalRow
                key={r.id}
                op={r}
                onStatusChange={(status) => applyStatus(r.id, status)}
              />
            ))}
          </div>
        </section>
      )}

      {rejected.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
            Rejected ({rejected.length})
          </h3>
          <div className="space-y-3">
            {rejected.map((r) => (
              <OperatorApprovalRow
                key={r.id}
                op={r}
                onStatusChange={(status) => applyStatus(r.id, status)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}