// app/admin/inquiries/inquiries-panel.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  listInvestorInquiries,
  updateInvestorInquiryStatus,
  type InvestorInquiryRow,
  type InquiryStatus,
} from "../actions/inquiries";

const STATUS_META: Record<
  InquiryStatus,
  { label: string; pillBg: string; pillText: string; bar: string }
> = {
  NEW: {
    label: "New",
    pillBg: "bg-brand-100 dark:bg-brand-950",
    pillText: "text-brand-800 dark:text-brand-200",
    bar: "bg-brand-500",
  },
  IN_REVIEW: {
    label: "In review",
    pillBg: "bg-amber-100 dark:bg-amber-950",
    pillText: "text-amber-800 dark:text-amber-200",
    bar: "bg-amber-500",
  },
  CONTACTED: {
    label: "Contacted",
    pillBg: "bg-emerald-100 dark:bg-emerald-950",
    pillText: "text-emerald-800 dark:text-emerald-200",
    bar: "bg-emerald-500",
  },
  CLOSED: {
    label: "Closed",
    pillBg: "bg-slate-200 dark:bg-slate-800",
    pillText: "text-slate-700 dark:text-slate-300",
    bar: "bg-slate-500",
  },
};

const INTEREST_LABEL: Record<string, string> = {
  LODGE_RESORT: "Lodges & resorts",
  COASTAL: "Coastal",
  ECO_TOURISM: "Eco-tourism",
  MICE: "MICE",
  CULTURAL_HERITAGE: "Cultural & heritage",
  INFRASTRUCTURE: "Infrastructure",
  DOMESTIC_LEISURE: "Domestic leisure",
  TECHNOLOGY: "Technology",
  OTHER: "Other",
};

const SCALE_LABEL: Record<string, string> = {
  UNDER_10M: "Under KShs 10M",
  FROM_10M_50M: "KShs 10M – 50M",
  FROM_50M_100M: "KShs 50M – 100M",
  FROM_100M_500M: "KShs 100M – 500M",
  ABOVE_500M: "Above KShs 500M",
  PREFER_NOT_TO_SAY: "Not disclosed",
};

const NEXT_STATUSES: Record<InquiryStatus, InquiryStatus[]> = {
  NEW: ["IN_REVIEW", "CLOSED"],
  IN_REVIEW: ["CONTACTED", "CLOSED"],
  CONTACTED: ["CLOSED"],
  CLOSED: [],
};

type Filter = "ALL" | InquiryStatus;

export function InquiriesPanel({ search = "" }: { search?: string }) {
  const [rows, setRows] = useState<InvestorInquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("NEW");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listInvestorInquiries();
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

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      ALL: rows.length,
      NEW: 0,
      IN_REVIEW: 0,
      CONTACTED: 0,
      CLOSED: 0,
    };
    for (const r of rows) c[r.status]++;
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "ALL" && r.status !== filter) return false;
      if (!q) return true;
      return [
        r.referenceNo,
        r.fullName,
        r.email,
        r.company ?? "",
        r.country ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, filter, search]);

  const editing = rows.find((r) => r.id === editingId);

  async function handleTransition(
    row: InvestorInquiryRow,
    to: InquiryStatus,
    notes: string
  ) {
    const previous = rows;
    setRows((curr) =>
      curr.map((r) =>
        r.id === row.id
          ? {
              ...r,
              status: to,
              reviewNotes: notes.trim() || r.reviewNotes,
              reviewedAt: new Date(),
              reviewerName: "You",
            }
          : r
      )
    );
    startTransition(async () => {
      try {
        const updated = await updateInvestorInquiryStatus({
          id: row.id,
          status: to,
          reviewNotes: notes,
        });
        setRows((curr) => curr.map((r) => (r.id === updated.id ? updated : r)));
        setEditingId(null);
      } catch (e) {
        setRows(previous);
        alert(e instanceof Error ? e.message : "Failed to update");
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-start gap-3">
        <span
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
          aria-hidden
        >
          <InboxIcon />
        </span>
        <div>
          <h2 className="text-xl font-bold text-brand-700 dark:text-brand-300">
            Investor inquiries
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
            Review and respond to investor inquiries submitted through the
            public site.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip
          label="All"
          count={counts.ALL}
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
        />
        {(Object.keys(STATUS_META) as InquiryStatus[]).map((s) => (
          <FilterChip
            key={s}
            label={STATUS_META[s].label}
            count={counts[s]}
            active={filter === s}
            onClick={() => setFilter(s)}
            tone={STATUS_META[s]}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_460px]">
        <div className="space-y-3">
          {loading && rows.length === 0 && <LoadingSkeletons />}

          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-deep-200 p-10 text-center text-sm text-deep-500 dark:border-deep-800 dark:text-cream-500">
              {search.trim()
                ? `No inquiries match "${search.trim()}".`
                : "No inquiries in this view."}
            </div>
          )}

          {filtered.map((r) => {
            const meta = STATUS_META[r.status];
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setEditingId(r.id)}
                className={[
                  "relative w-full overflow-hidden rounded-2xl border bg-cream-50 p-5 pl-6 text-left transition dark:bg-deep-900",
                  editingId === r.id
                    ? "border-brand-300 ring-2 ring-brand-500/20 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/30"
                    : "border-deep-200 hover:border-brand-400 dark:border-deep-800 dark:hover:border-brand-600",
                ].join(" ")}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-1 ${meta.bar} ${editingId === r.id ? "opacity-100" : "opacity-60"}`}
                />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-deep-800 dark:text-cream-100">
                        {r.fullName}
                      </h3>
                      <span
                        className={`rounded-full ${meta.pillBg} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.pillText}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-deep-500 dark:text-cream-500">
                      {r.referenceNo}
                    </p>
                    <p className="mt-1 text-xs text-deep-600 dark:text-cream-400">
                      {r.email}
                      {r.company ? ` · ${r.company}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-deep-500 dark:text-cream-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-deep-600 dark:text-cream-400">
                  {r.message}
                </p>
                {r.interests.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.interests.slice(0, 4).map((i) => (
                      <span
                        key={i}
                        className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-medium text-deep-700 dark:bg-deep-800 dark:text-cream-300"
                      >
                        {INTEREST_LABEL[i] ?? i}
                      </span>
                    ))}
                    {r.interests.length > 4 && (
                      <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-medium text-deep-700 dark:bg-deep-800 dark:text-cream-300">
                        +{r.interests.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div>
          {editing ? (
            <InquiryDetail
              key={editing.id}
              row={editing}
              onClose={() => setEditingId(null)}
              onTransition={(to, notes) =>
                handleTransition(editing, to, notes)
              }
            />
          ) : (
            <EmptyDrawer />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Subcomponents ──────────────────────────────────────────

function FilterChip({
  label,
  count,
  active,
  onClick,
  tone,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  tone?: { pillBg: string; pillText: string };
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-deep-800 bg-deep-800 text-cream-50 dark:border-cream-100 dark:bg-cream-100 dark:text-deep-900"
          : tone
            ? `${tone.pillBg} ${tone.pillText} border-transparent hover:opacity-80`
            : "border-deep-200 bg-cream-50 text-deep-600 hover:bg-cream-100 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-400 dark:hover:bg-deep-800",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
          active
            ? "bg-cream-50 text-deep-800 dark:bg-deep-900 dark:text-cream-100"
            : "bg-cream-100 text-deep-600 dark:bg-deep-800 dark:text-cream-400",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

function InquiryDetail({
  row,
  onClose,
  onTransition,
}: {
  row: InvestorInquiryRow;
  onClose: () => void;
  onTransition: (to: InquiryStatus, notes: string) => void;
}) {
  const [notes, setNotes] = useState(row.reviewNotes ?? "");
  const meta = STATUS_META[row.status];
  const nextSteps = NEXT_STATUSES[row.status];

  return (
    <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900">
      <span className={`block h-1 w-full ${meta.bar}`} aria-hidden />
      <div className="flex items-start justify-between border-b border-deep-200 px-5 py-4 dark:border-deep-800">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-700 dark:text-brand-300">
            Investor inquiry
          </div>
          <h3 className="mt-1 font-semibold text-deep-800 dark:text-cream-100">
            {row.fullName}
          </h3>
          <p className="mt-1 font-mono text-xs text-deep-500 dark:text-cream-500">
            {row.referenceNo}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-deep-400 transition hover:text-deep-700 dark:text-cream-500 dark:hover:text-cream-100"
          aria-label="Close"
        >
          <XIcon />
        </button>
      </div>
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
        <div className="space-y-4">
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <Meta label="Email">
              <a
                href={`mailto:${row.email}`}
                className="text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
              >
                {row.email}
              </a>
            </Meta>
            <Meta label="Phone">{row.phone ?? "—"}</Meta>
            <Meta label="Company">{row.company ?? "—"}</Meta>
            <Meta label="Country">{row.country ?? "—"}</Meta>
            <Meta label="Type">{row.investorType ?? "—"}</Meta>
            <Meta label="Scale">
              {row.scale ? (SCALE_LABEL[row.scale] ?? row.scale) : "—"}
            </Meta>
          </dl>

          {row.interests.length > 0 && (
            <Section title="Interests">
              <div className="flex flex-wrap gap-1.5">
                {row.interests.map((i) => (
                  <span
                    key={i}
                    className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                  >
                    {INTEREST_LABEL[i] ?? i}
                  </span>
                ))}
              </div>
            </Section>
          )}

          <Section title="Message">
            <p className="whitespace-pre-wrap text-sm leading-6 text-deep-700 dark:text-cream-300">
              {row.message}
            </p>
          </Section>

          {(row.reviewedAt || row.reviewNotes) && (
            <Section title="Review trail">
              {row.reviewedAt && (
                <p className="text-xs text-deep-500 dark:text-cream-500">
                  Last reviewed by{" "}
                  <span className="font-medium text-deep-700 dark:text-cream-300">
                    {row.reviewerName ?? "Admin"}
                  </span>{" "}
                  on {new Date(row.reviewedAt).toLocaleString()}
                </p>
              )}
              {row.reviewNotes && (
                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-cream-100 p-3 text-sm text-deep-700 dark:bg-deep-950 dark:text-cream-300">
                  {row.reviewNotes}
                </p>
              )}
            </Section>
          )}

          {nextSteps.length > 0 && (
            <div className="border-t border-deep-200 pt-4 dark:border-deep-800">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">
                  Notes
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Notes for the record."
                  className="w-full rounded-xl border border-deep-200 bg-cream-100 px-3.5 py-3 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-500 focus:bg-cream-50 focus:ring-2 focus:ring-brand-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500"
                />
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {nextSteps.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onTransition(s, notes)}
                    className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-deep-900 transition hover:bg-brand-400"
                  >
                    Mark as {STATUS_META[s].label.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-deep-500 dark:text-cream-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-deep-800 dark:text-cream-200">
        {children}
      </dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-deep-500 dark:text-cream-500">
        {title}
      </h4>
      {children}
    </div>
  );
}

function LoadingSkeletons() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900"
        />
      ))}
    </div>
  );
}

function EmptyDrawer() {
  return (
    <div className="sticky top-6 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 p-8 text-center dark:border-brand-800 dark:bg-brand-950/30">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
        <InboxIcon />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-deep-800 dark:text-cream-100">
        Select an inquiry
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-deep-600 dark:text-cream-400">
        Click an inquiry to see details and update its status.
      </p>
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  className: "h-5 w-5",
};

function InboxIcon() {
  return (
    <svg {...iconBase}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg {...iconBase}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}