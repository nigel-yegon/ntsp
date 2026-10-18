// app/admin/incidents/incidents-panel.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  listIncidents,
  updateIncidentStatus,
  type IncidentRow,
  type IncidentStatus,
} from "../actions/incidents";

// ── Status config ────────────────────────────────────────────
const STATUS_META: Record<
  IncidentStatus,
  { label: string; pillBg: string; pillText: string; bar: string }
> = {
  OPEN: {
    label: "Open",
    pillBg: "bg-red-100 dark:bg-red-950",
    pillText: "text-red-800 dark:text-red-200",
    bar: "bg-red-500",
  },
  UNDER_REVIEW: {
    label: "Under review",
    pillBg: "bg-amber-100 dark:bg-amber-950",
    pillText: "text-amber-800 dark:text-amber-200",
    bar: "bg-amber-500",
  },
  RESOLVED: {
    label: "Resolved",
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

const CATEGORY_LABEL: Record<IncidentRow["category"], string> = {
  WILDLIFE: "Wildlife",
  SAFETY: "Safety",
  OPERATOR: "Operator",
  FACILITY: "Facility",
  GUIDES: "Guides",
  OTHER: "Other",
};

// Next-step options per current status. Mirrors the server-side
// TRANSITIONS table in actions/incidents.ts. If you change one,
// change both — or extract to a shared lib.
const NEXT_STEPS: Record<IncidentStatus, IncidentStatus[]> = {
  OPEN: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["RESOLVED", "CLOSED", "OPEN"],
  RESOLVED: ["CLOSED", "UNDER_REVIEW"],
  CLOSED: ["UNDER_REVIEW"],
};

type Filter = "ALL" | IncidentStatus;

export function IncidentsPanel() {
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("OPEN");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const rows = await listIncidents();
        if (!cancelled) setIncidents(rows);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      ALL: incidents.length,
      OPEN: 0,
      UNDER_REVIEW: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };
    for (const i of incidents) c[i.status]++;
    return c;
  }, [incidents]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return incidents;
    return incidents.filter((i) => i.status === filter);
  }, [filter, incidents]);

  const editing = incidents.find((i) => i.id === editingId);

  async function handleTransition(
    incident: IncidentRow,
    to: IncidentStatus,
    notes: string
  ) {
    const previous = incidents;

    // Optimistic update
    setIncidents((curr) =>
      curr.map((i) =>
        i.id === incident.id
          ? {
              ...i,
              status: to,
              reviewNotes: notes.trim() || i.reviewNotes,
              reviewedAt: new Date(),
              reviewerName: "You",
            }
          : i
      )
    );

    startTransition(async () => {
      try {
        const updated = await updateIncidentStatus({
          id: incident.id,
          to,
          reviewNotes: notes,
        });
        // Reconcile with server truth (stamps the real reviewer name)
        setIncidents((curr) =>
          curr.map((i) => (i.id === updated.id ? updated : i))
        );
        setEditingId(null);
      } catch (err) {
        setIncidents(previous);
        alert(err instanceof Error ? err.message : "Failed to update");
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-start gap-3">
        <span
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
          aria-hidden
        >
          <ShieldIcon />
        </span>
        <div>
          <h2 className="text-xl font-bold text-rose-700 dark:text-rose-300">
            Incidents
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
            Review incident reports submitted by the public. Advance reports
            through review, record notes, and close resolved cases.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Filter chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip
          label="All"
          count={counts.ALL}
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
        />
        {(Object.keys(STATUS_META) as IncidentStatus[]).map((s) => (
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

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        {/* List */}
        <div className="space-y-3">
          {loading && incidents.length === 0 && <LoadingSkeletons />}

          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-deep-200 p-10 text-center text-sm text-deep-500 dark:border-deep-800 dark:text-cream-500">
              No incidents in this view.
            </div>
          )}

          {filtered.map((inc) => (
            <IncidentCard
              key={inc.id}
              incident={inc}
              active={editingId === inc.id}
              onClick={() => setEditingId(inc.id)}
            />
          ))}
        </div>

        {/* Detail drawer */}
        <div>
          {editing ? (
            <IncidentDetail
              key={editing.id}
              incident={editing}
              onClose={() => setEditingId(null)}
              onTransition={(to, notes) =>
                handleTransition(editing, to, notes)
              }
            />
          ) : (
            <div className="sticky top-6 rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50 p-8 text-center dark:border-rose-800 dark:bg-rose-950/30">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                <ShieldIcon />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-deep-800 dark:text-cream-100">
                Select an incident
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-deep-600 dark:text-cream-400">
                Choose a report to see its details and advance its status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Subcomponents ────────────────────────────────────────────

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

function IncidentCard({
  incident,
  active,
  onClick,
}: {
  incident: IncidentRow;
  active: boolean;
  onClick: () => void;
}) {
  const meta = STATUS_META[incident.status];
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative w-full overflow-hidden rounded-2xl border bg-cream-50 p-5 pl-6 text-left transition dark:bg-deep-900",
        active
          ? "border-rose-300 ring-2 ring-rose-500/20 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30"
          : "border-deep-200 hover:border-rose-400 dark:border-deep-800 dark:hover:border-rose-600",
      ].join(" ")}
    >
      <span
        className={`absolute inset-y-0 left-0 w-1 ${meta.bar} ${
          active ? "opacity-100" : "opacity-60"
        }`}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-deep-800 dark:text-cream-100">
              {incident.title}
            </h3>
            <span
              className={`rounded-full ${meta.pillBg} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.pillText}`}
            >
              {meta.label}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-deep-500 dark:text-cream-500">
            {incident.referenceNo}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-deep-600 dark:text-cream-400">
            {incident.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-deep-500 dark:text-cream-500">
            <span className="inline-flex items-center gap-1">
              <TagIcon />
              {CATEGORY_LABEL[incident.category]}
            </span>
            {incident.location && (
              <span className="inline-flex items-center gap-1">
                <PinIcon />
                {incident.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <ClockIcon />
              {new Date(incident.reportedAt).toLocaleDateString()}
            </span>
            {incident.attachments.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <PaperclipIcon />
                {incident.attachments.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function IncidentDetail({
  incident,
  onClose,
  onTransition,
}: {
  incident: IncidentRow;
  onClose: () => void;
  onTransition: (to: IncidentStatus, notes: string) => void;
}) {
  const [notes, setNotes] = useState(incident.reviewNotes ?? "");
  const [target, setTarget] = useState<IncidentStatus | "">("");
  const meta = STATUS_META[incident.status];
  const nextSteps = NEXT_STEPS[incident.status];

  return (
    <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900">
      <span className={`block h-1 w-full ${meta.bar}`} aria-hidden />

      <div className="flex items-start justify-between border-b border-deep-200 px-5 py-4 dark:border-deep-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-600 dark:text-rose-400">
            Incident
          </div>
          <h3 className="mt-1 font-semibold text-deep-800 dark:text-cream-100">
            {incident.title}
          </h3>
          <p className="mt-1 font-mono text-xs text-deep-500 dark:text-cream-500">
            {incident.referenceNo}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-deep-400 transition hover:text-deep-700 dark:text-cream-500 dark:hover:text-cream-100"
          aria-label="Close details"
        >
          <XIcon />
        </button>
      </div>

      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
        <div className="space-y-5">
          {/* Meta grid */}
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <Meta label="Status">
              <span
                className={`inline-block rounded-full ${meta.pillBg} px-2 py-0.5 font-bold uppercase tracking-wider ${meta.pillText}`}
              >
                {meta.label}
              </span>
            </Meta>
            <Meta label="Category">{CATEGORY_LABEL[incident.category]}</Meta>
            <Meta label="Reported">
              {new Date(incident.reportedAt).toLocaleString()}
            </Meta>
            <Meta label="Occurred">
              {incident.occurredAt
                ? new Date(incident.occurredAt).toLocaleString()
                : "—"}
            </Meta>
          </dl>

          {/* Location */}
          {incident.location && (
            <Section title="Location">
              <p className="text-sm text-deep-700 dark:text-cream-300">
                {incident.location}
              </p>
            </Section>
          )}

          {/* Description */}
          <Section title="Description">
            <p className="whitespace-pre-wrap text-sm leading-6 text-deep-700 dark:text-cream-300">
              {incident.description}
            </p>
          </Section>

          {/* Reporter */}
          <Section title="Reporter">
            {incident.reporterName ||
            incident.reporterEmail ||
            incident.reporterPhone ? (
              <ul className="space-y-1 text-sm text-deep-700 dark:text-cream-300">
                {incident.reporterName && <li>{incident.reporterName}</li>}
                {incident.reporterEmail && (
                  <li>
                    <a
                      href={`mailto:${incident.reporterEmail}`}
                      className="text-rose-700 underline-offset-2 hover:underline dark:text-rose-300"
                    >
                      {incident.reporterEmail}
                    </a>
                  </li>
                )}
                {incident.reporterPhone && (
                  <li>
                    <a
                      href={`tel:${incident.reporterPhone}`}
                      className="text-rose-700 underline-offset-2 hover:underline dark:text-rose-300"
                    >
                      {incident.reporterPhone}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm italic text-deep-500 dark:text-cream-500">
                Anonymous
              </p>
            )}
          </Section>

          {/* Attachments */}
          {incident.attachments.length > 0 && (
            <Section title={`Attachments (${incident.attachments.length})`}>
              <ul className="space-y-1.5">
                {incident.attachments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-deep-200 px-3 py-2 text-xs dark:border-deep-800"
                  >
                    <span className="inline-flex items-center gap-2 text-deep-700 dark:text-cream-300">
                      <PaperclipIcon />
                      {a.fileName}
                    </span>
                    <span className="text-deep-500 dark:text-cream-500">
                      {(a.sizeBytes / 1024).toFixed(0)} KB
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Review trail */}
          {incident.reviewedAt && (
            <Section title="Review trail">
              <p className="text-xs text-deep-500 dark:text-cream-500">
                Reviewed by{" "}
                <span className="font-medium text-deep-700 dark:text-cream-300">
                  {incident.reviewerName ?? "Admin"}
                </span>{" "}
                on {new Date(incident.reviewedAt).toLocaleString()}
              </p>
              {incident.reviewNotes && (
                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-cream-100 p-3 text-sm text-deep-700 dark:bg-deep-950 dark:text-cream-300">
                  {incident.reviewNotes}
                </p>
              )}
            </Section>
          )}

          {/* Transition controls */}
          <div className="border-t border-deep-200 pt-4 dark:border-deep-800">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">
                Review notes
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add notes for the next reviewer or for the record."
                className="w-full rounded-xl border border-deep-200 bg-cream-100 px-3.5 py-3 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-rose-500 focus:bg-cream-50 focus:ring-2 focus:ring-rose-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500"
              />
            </label>

            <div className="mt-3 flex flex-wrap gap-2">
              {nextSteps.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setTarget(s);
                    onTransition(s, notes);
                  }}
                  disabled={target !== ""}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                >
                  {s === "OPEN" && incident.status !== "OPEN"
                    ? "Reopen"
                    : s === "UNDER_REVIEW" && incident.status !== "OPEN"
                      ? "Reopen review"
                      : `Mark as ${STATUS_META[s].label.toLowerCase()}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small pieces ─────────────────────────────────────────────

function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-deep-500 dark:text-cream-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-deep-800 dark:text-cream-200">
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
          className="h-32 animate-pulse rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900"
        />
      ))}
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  className: "h-5 w-5",
};

function ShieldIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg {...iconBase} className="h-3.5 w-3.5">
      <path d="M20 12l-8 8-9-9V4h7l10 8Z" />
      <circle cx="7.5" cy="7.5" r="1" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconBase} className="h-3.5 w-3.5">
      <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...iconBase} className="h-3.5 w-3.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg {...iconBase} className="h-3.5 w-3.5">
      <path d="m21 12-8.5 8.5a5 5 0 1 1-7-7L14 5a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-2.8-2.8L15 8.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg {...iconBase} className="h-5 w-5">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}