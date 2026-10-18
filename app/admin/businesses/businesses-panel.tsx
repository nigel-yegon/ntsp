// app/admin/businesses/businesses-panel.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  listBusinesses,
  setBusinessStatus,
  type BusinessRow,
} from "../actions/businesses";

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";

const STATUS_LABEL: Record<BusinessRow["verificationStatus"], string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  SUSPENDED: "Suspended",
  REJECTED: "Rejected",
};

const STATUS_TONE: Record<BusinessRow["verificationStatus"], string> = {
  PENDING:
    "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  APPROVED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  SUSPENDED:
    "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  REJECTED:
    "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
};

export function BusinessesPanel({ search = "" }: { search?: string }) {
  const [rows, setRows] = useState<BusinessRow[] | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("PENDING");
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refresh() {
    try {
      const data = await listBusinesses();
      setRows(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function updateStatus(
    id: string,
    status: BusinessRow["verificationStatus"],
    rejectionReason?: string
  ) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await setBusinessStatus(id, status, rejectionReason);
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update");
      } finally {
        setPendingId(null);
        setRejectingId(null);
        setReason("");
      }
    });
  }

  const filtered = useMemo(() => {
    if (!rows) return null;
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "ALL" && r.verificationStatus !== filter) return false;
      if (!q) return true;
      return [
        r.businessName,
        r.ownerName,
        r.ownerEmail,
        r.contactEmail,
        r.contactPhone ?? "",
        r.registrationNo ?? "",
        r.kraPin ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, filter, search]);

  const trimmedSearch = search.trim();

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Businesses</h2>
        <div className="flex flex-wrap gap-1">
          {(["ALL", "PENDING", "APPROVED", "SUSPENDED", "REJECTED"] as const).map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  filter === s
                    ? "bg-brand-400 text-deep-800"
                    : "text-deep-600 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-800"
                }`}
              >
                {s === "ALL" ? "All" : STATUS_LABEL[s]}
              </button>
            )
          )}
        </div>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {rows === null ? (
        <p className="text-sm text-deep-500 dark:text-cream-400">Loading…</p>
      ) : filtered?.length === 0 ? (
        <p className="rounded-xl border border-dashed border-cream-300 bg-cream-50 p-6 text-sm text-deep-500 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-400">
          {trimmedSearch
            ? `No businesses match "${trimmedSearch}".`
            : "No businesses match this filter."}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered!.map((b) => (
            <li
              key={b.id}
              className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium">{b.businessName}</h3>
                  <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                    {b.contactEmail}
                    {b.contactPhone ? ` · ${b.contactPhone}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                    Registered by {b.ownerName} ({b.ownerEmail}) ·{" "}
                    {b.listingCount}{" "}
                    {b.listingCount === 1 ? "listing" : "listings"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_TONE[b.verificationStatus]}`}
                >
                  {STATUS_LABEL[b.verificationStatus]}
                </span>
              </div>

              {b.description && (
                <p className="mt-3 text-sm text-deep-600 dark:text-cream-300">
                  {b.description}
                </p>
              )}

              {(b.registrationNo || b.kraPin || b.website) && (
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                  {b.registrationNo && (
                    <div className="flex gap-1.5">
                      <dt className="text-deep-500 dark:text-cream-400">
                        Reg. no.:
                      </dt>
                      <dd>{b.registrationNo}</dd>
                    </div>
                  )}
                  {b.kraPin && (
                    <div className="flex gap-1.5">
                      <dt className="text-deep-500 dark:text-cream-400">
                        KRA PIN:
                      </dt>
                      <dd>{b.kraPin}</dd>
                    </div>
                  )}
                  {b.website && (
                    <div className="flex gap-1.5">
                      <dt className="text-deep-500 dark:text-cream-400">
                        Website:
                      </dt>
                      <dd>
                        <a
                          href={b.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 underline underline-offset-2 dark:text-brand-400"
                        >
                          {b.website}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              )}

              {b.rejectionReason && (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  Rejection reason: {b.rejectionReason}
                </p>
              )}

              <div className="mt-4 border-t border-cream-200 pt-4 dark:border-deep-800">
                {rejectingId === b.id && (
                  <div className="mb-3">
                    <label className="block">
                      <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
                        Reason (optional — visible to the business)
                      </span>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950"
                      />
                    </label>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {b.verificationStatus !== "APPROVED" &&
                    rejectingId !== b.id && (
                      <button
                        type="button"
                        onClick={() => updateStatus(b.id, "APPROVED")}
                        disabled={isPending && pendingId === b.id}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {isPending && pendingId === b.id
                          ? "Approving…"
                          : "Approve"}
                      </button>
                    )}

                  {b.verificationStatus !== "REJECTED" &&
                    rejectingId !== b.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setRejectingId(b.id);
                          setReason("");
                        }}
                        disabled={isPending}
                        className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                      >
                        Reject
                      </button>
                    )}

                  {rejectingId === b.id && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(b.id, "REJECTED", reason)}
                        disabled={isPending}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        {isPending ? "Rejecting…" : "Confirm rejection"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectingId(null);
                          setReason("");
                        }}
                        disabled={isPending}
                        className="rounded-lg border border-cream-300 px-4 py-2 text-sm font-medium transition hover:bg-cream-100 disabled:opacity-60 dark:border-deep-700 dark:hover:bg-deep-800"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {b.verificationStatus === "APPROVED" &&
                    rejectingId !== b.id && (
                      <button
                        type="button"
                        onClick={() => updateStatus(b.id, "SUSPENDED")}
                        disabled={isPending && pendingId === b.id}
                        className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-100 disabled:opacity-60 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                      >
                        {isPending && pendingId === b.id
                          ? "Suspending…"
                          : "Suspend"}
                      </button>
                    )}

                  {b.verificationStatus === "SUSPENDED" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(b.id, "APPROVED")}
                      disabled={isPending && pendingId === b.id}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {isPending && pendingId === b.id
                        ? "Reinstating…"
                        : "Reinstate"}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}