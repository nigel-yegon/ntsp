// app/admin/businesses/businesses-panel.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  listBusinesses,
  setBusinessStatus,
  type BusinessRow,
} from "../actions/businesses";
import { BusinessVerificationBadge } from "@/app/components/dashboard/business-verification-badge";
import type { BusinessVerification } from "@/lib/generated/prisma/enums";

type StatusFilter =
  | "ALL"
  | "PENDING"
  | "PENDING_TRA_CHECK"
  | "APPROVED"
  | "SUSPENDED"
  | "REJECTED";

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "PENDING_TRA_CHECK", label: "TRA Check" },
  { key: "APPROVED", label: "Approved" },
  { key: "SUSPENDED", label: "Suspended" },
  { key: "REJECTED", label: "Rejected" },
];

export function BusinessesPanel({ search = "" }: { search?: string }) {
  const [rows, setRows] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listBusinesses();
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "ALL" && r.verificationStatus !== filter) return false;
      if (!q) return true;
      return (
        r.businessName.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q) ||
        r.contactEmail.toLowerCase().includes(q) ||
        (r.registrationNo || "").toLowerCase().includes(q)
      );
    });
  }, [rows, search, filter]);

  function handleStatusChange(
    id: string,
    status: BusinessVerification,
    reason?: string
  ) {
    startTransition(async () => {
      try {
        const err = await setBusinessStatus(id, status, reason);
        if (err) {
          alert(err);
        } else {
          setRows((curr) =>
            curr.map((r) =>
              r.id === id ? { ...r, verificationStatus: status } : r
            )
          );
        }
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to update status");
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
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
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M9 21v-4h6v4M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
            </svg>
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">
              Businesses
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
              Manage all registered businesses, including accommodations and
              operators.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filter === f.key
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-deep-300 bg-cream-50 text-deep-700 hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && rows.length === 0 && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900"
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-deep-200 p-10 text-center text-sm text-deep-500 dark:border-deep-800 dark:text-cream-500">
          No businesses match your current filters.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="relative overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 p-5 pl-6 dark:border-deep-800 dark:bg-deep-900"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
                    {r.businessName}
                  </h3>
                  <BusinessVerificationBadge
                    status={r.verificationStatus as BusinessVerification}
                  />
                  {r.businessType === "TOUR_OPERATOR" && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      Operator
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
                  {r.userEmail} · {r.listingCount} listings
                </p>
                <div className="mt-2 grid gap-1 text-xs text-deep-600 dark:text-cream-400 sm:grid-cols-2">
                  {r.registrationNo && <p>Reg No: {r.registrationNo}</p>}
                  {r.kraPin && <p>KRA PIN: {r.kraPin}</p>}
                  {r.traLicenseNumber && (
                    <p>
                      TRA License:{" "}
                      <span className="font-mono">{r.traLicenseNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-wrap gap-2">
                {r.verificationStatus !== "APPROVED" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(r.id, "APPROVED")}
                    disabled={pending}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Approve
                  </button>
                )}
                {r.verificationStatus !== "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => {
                      const reason = prompt("Reason for rejection?");
                      if (reason) handleStatusChange(r.id, "REJECTED", reason);
                    }}
                    disabled={pending}
                    className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    Reject
                  </button>
                )}
                {r.verificationStatus !== "SUSPENDED" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(r.id, "SUSPENDED")}
                    disabled={pending}
                    className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-60 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/40"
                  >
                    Suspend
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}