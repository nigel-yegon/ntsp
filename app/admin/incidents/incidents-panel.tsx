"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  listIncidents,
  updateIncidentStatus,
  addIncidentNote,
  type IncidentRow,
} from "../actions/incidents";
import {
  STATUS_META,
  TRANSITIONS,
  INCIDENT_STATUSES,
  ESCALATION_SUGGESTIONS,
  ACTIVE_STATUSES,
  type IncidentStatus,
  type FilterKey,
} from "@/lib/incident-workflow";

const CATEGORY_LABEL: Record<IncidentRow["category"], string> = {
  WILDLIFE: "Wildlife",
  SAFETY: "Safety",
  OPERATOR: "Operator",
  FACILITY: "Facility",
  GUIDES: "Guides",
  OTHER: "Other",
};

export function IncidentsPanel({ search = "" }: { search?: string }) {
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("ACTIVE");
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
    const c: Record<FilterKey, number> = {
      ACTIVE: 0,
      ALL: incidents.length,
      OPEN: 0,
      UNDER_REVIEW: 0,
      ESCALATED: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };
    for (const i of incidents) {
      c[i.status]++;
      if (ACTIVE_STATUSES.includes(i.status)) c.ACTIVE++;
    }
    return c;
  }, [incidents]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return incidents.filter((i) => {
      if (filter === "ACTIVE" && !ACTIVE_STATUSES.includes(i.status)) return false;
      if (filter !== "ACTIVE" && filter !== "ALL" && i.status !== filter)
        return false;
      if (!q) return true;
      return [i.referenceNo, i.title, i.location ?? "", i.reporterEmail ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [incidents, filter, search]);

  const editing = incidents.find((i) => i.id === editingId);

  async function handleTransition(
    incident: IncidentRow,
    to: IncidentStatus,
    notes: string,
    escalatedTo?: string
  ) {
    const previous = incidents;

    setIncidents((curr) =>
      curr.map((i) => {
        if (i.id !== incident.id) return i;
        return {
          ...i,
          status: to,
          reviewNotes: notes.trim() || i.reviewNotes,
          reviewedAt: new Date(),
          reviewerName: "You",
          ...(to === "ESCALATED"
            ? {
                escalatedTo: escalatedTo?.trim() || null,
                escalatedAt: new Date(),
                escalatedByName: "You",
              }
            : {}),
        };
      })
    );

    startTransition(async () => {
      try {
        const updated = await updateIncidentStatus({
          id: incident.id,
          to,
          reviewNotes: notes,
          escalatedTo,
        });
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

  async function handleAddNote(incident: IncidentRow, note: string) {
    const previous = incidents;

    setIncidents((curr) =>
      curr.map((i) =>
        i.id === incident.id
          ? {
              ...i,
              reviewNotes: note,
              reviewedAt: new Date(),
              reviewerName: "You",
            }
          : i
      )
    );

    startTransition(async () => {
      try {
        const updated = await addIncidentNote({ id: incident.id, note });
        setIncidents((curr) =>
          curr.map((i) => (i.id === updated.id ? updated : i))
        );
      } catch (err) {
        setIncidents(previous);
        alert(err instanceof Error ? err.message : "Failed to save note");
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
            through review, record notes, escalate to higher authority, and
            close resolved cases.
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
          label="Active"
          count={counts.ACTIVE}
          active={filter === "ACTIVE"}
          onClick={() => setFilter("ACTIVE")}
        />
        <FilterChip
          label="All"
          count={counts.ALL}
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
        />
        {INCIDENT_STATUSES.map((s) => (
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
          {loading && incidents.length === 0 && <LoadingSkeletons />}

          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-deep-200 p-10 text-center text-sm text-deep-500 dark:border-deep-800 dark:text-cream-500">
              {search.trim()
                ? `No incidents match "${search.trim()}".`
                : "No incidents in this view."}
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

        <div>
          {editing ? (
            <IncidentDetail
              key={editing.id}
              incident={editing}
              onClose={() => setEditingId(null)}
              onTransition={(to, notes, escalatedTo) =>
                handleTransition(editing, to, notes, escalatedTo)
              }
              onAddNote={(note) => handleAddNote(editing, note)}
            />
          ) : (
            <EmptyDrawer />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Subcomponents ───────────────────────────────────────────

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
          ? `border-rose-300 ring-2 ring-rose-500/20 ${meta.chipBg}`
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
          {incident.status === "ESCALATED" && incident.escalatedTo && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-800 dark:bg-violet-950 dark:text-violet-200">
              <ArrowUpRightIcon />
              Escalated to {incident.escalatedTo}
            </p>
          )}
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
  onAddNote,
}: {
  incident: IncidentRow;
  onClose: () => void;
  onTransition: (
    to: IncidentStatus,
    notes: string,
    escalatedTo?: string
  ) => void;
  onAddNote: (note: string) => void;
}) {
  const [notes, setNotes] = useState(incident.reviewNotes ?? "");
  const [escalatedTo, setEscalatedTo] = useState(incident.escalatedTo ?? "");
  const [showEscalate, setShowEscalate] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [pendingTo, setPendingTo] = useState<IncidentStatus | "">("");

  const meta = STATUS_META[incident.status];
  const nextSteps = TRANSITIONS[incident.status];
  const isTerminal = nextSteps.length === 0;

  function handleAdvance(to: IncidentStatus) {
    if (to === "ESCALATED") {
      setShowEscalate(true);
      return;
    }
    setPendingTo(to);
    onTransition(to, notes);
  }

  function handleEscalateConfirm() {
    if (!escalatedTo.trim()) return;
    setPendingTo("ESCALATED");
    onTransition("ESCALATED", notes, escalatedTo.trim());
  }

  async function handleSaveNote() {
    if (!notes.trim()) return;
    setSavingNote(true);
    try {
      onAddNote(notes.trim());
    } finally {
      setSavingNote(false);
    }
  }

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

          {incident.location && (
            <Section title="Location">
              <p className="text-sm text-deep-700 dark:text-cream-300">
                {incident.location}
              </p>
            </Section>
          )}

          <Section title="Description">
            <p className="whitespace-pre-wrap text-sm leading-6 text-deep-700 dark:text-cream-300">
              {incident.description}
            </p>
          </Section>

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

          {incident.attachments.length > 0 && (
            <Section title={`Attachments (${incident.attachments.length})`}>
              <ul className="space-y-1.5">
                {incident.attachments.map((a) => (
                  <li key={a.id}>
                    <a
                      href={`/api/admin/incidents/${incident.id}/attachments/${a.id}`}
                      download={a.fileName}
                      className="flex items-center justify-between rounded-lg border border-deep-200 px-3 py-2 text-xs transition hover:border-rose-400 hover:bg-rose-50 dark:border-deep-800 dark:hover:border-rose-600 dark:hover:bg-rose-950/30"
                    >
                      <span className="inline-flex items-center gap-2 text-deep-700 dark:text-cream-300">
                        <PaperclipIcon />
                        <span className="underline-offset-2 hover:underline">
                          {a.fileName}
                        </span>
                      </span>
                      <span className="text-deep-500 dark:text-cream-500">
                        {(a.sizeBytes / 1024).toFixed(0)} KB
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {incident.status === "ESCALATED" && (
            <div className="rounded-lg border border-violet-300 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/30">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white"
                >
                  <ArrowUpRightIcon />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-violet-900 dark:text-violet-100">
                    Escalated to {incident.escalatedTo ?? "higher authority"}
                  </h4>
                  {incident.escalatedAt && (
                    <p className="mt-1 text-xs text-violet-700 dark:text-violet-300">
                      {incident.escalatedByName ?? "Admin"} on{" "}
                      {new Date(incident.escalatedAt).toLocaleString()}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-violet-700 dark:text-violet-300">
                    This case is out of the review queue. To bring it back,
                    that&apos;s a separate process outside this panel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {(incident.reviewedAt || incident.reviewNotes) && (
            <Section title="Review trail">
              {incident.reviewedAt && (
                <p className="text-xs text-deep-500 dark:text-cream-500">
                  Last reviewed by{" "}
                  <span className="font-medium text-deep-700 dark:text-cream-300">
                    {incident.reviewerName ?? "Admin"}
                  </span>{" "}
                  on {new Date(incident.reviewedAt).toLocaleString()}
                </p>
              )}
              {incident.reviewNotes && (
                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-cream-100 p-3 text-sm text-deep-700 dark:bg-deep-950 dark:text-cream-300">
                  {incident.reviewNotes}
                </p>
              )}
            </Section>
          )}

          {!isTerminal && (
            <div className="border-t border-deep-200 pt-4 dark:border-deep-800">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">
                  {incident.reviewNotes ? "Update notes" : "Review notes"}
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes for the next reviewer or for the record."
                  className="w-full rounded-xl border border-deep-200 bg-cream-100 px-3.5 py-3 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-rose-500 focus:bg-cream-50 focus:ring-2 focus:ring-rose-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500"
                />
              </label>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNote}
                  disabled={
                    savingNote ||
                    !notes.trim() ||
                    notes === (incident.reviewNotes ?? "")
                  }
                  className="text-xs font-semibold text-rose-700 underline-offset-2 hover:underline disabled:opacity-40 dark:text-rose-300"
                >
                  {savingNote
                    ? "Saving note…"
                    : "Save note without changing status"}
                </button>
              </div>

              {showEscalate ? (
                <div className="mt-4 rounded-lg border border-violet-300 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-950/30">
                  <label className="block">
                    <span className="text-xs font-semibold text-violet-900 dark:text-violet-100">
                      Escalate to *
                    </span>
                    <input
                      value={escalatedTo}
                      onChange={(e) => setEscalatedTo(e.target.value)}
                      list="escalation-suggestions"
                      placeholder="e.g. Kenya Wildlife Service"
                      className="mt-1 block w-full rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm text-deep-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-violet-700 dark:bg-deep-950 dark:text-cream-100"
                    />
                    <datalist id="escalation-suggestions">
                      {ESCALATION_SUGGESTIONS.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </label>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleEscalateConfirm}
                      disabled={pendingTo !== "" || !escalatedTo.trim()}
                      className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
                    >
                      Confirm escalation
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEscalate(false)}
                      disabled={pendingTo !== ""}
                      className="rounded-lg border border-violet-300 px-4 py-2 text-xs font-semibold text-violet-800 transition hover:bg-violet-100 dark:border-violet-700 dark:text-violet-200 dark:hover:bg-violet-900/40"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {nextSteps.map((s) => {
                    const isEscalate = s === "ESCALATED";
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAdvance(s)}
                        disabled={pendingTo !== ""}
                        className={[
                          "rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60",
                          isEscalate
                            ? "bg-violet-600 text-white hover:bg-violet-700"
                            : s === "OPEN" && incident.status !== "OPEN"
                              ? "border border-deep-300 bg-cream-100 text-deep-700 hover:bg-cream-200 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-200 dark:hover:bg-deep-800"
                              : "bg-rose-600 text-white hover:bg-rose-700",
                        ].join(" ")}
                      >
                        {buttonLabel(s, incident.status)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function buttonLabel(to: IncidentStatus, from: IncidentStatus): string {
  if (to === "OPEN" && from !== "OPEN") return "Reopen";
  if (to === "UNDER_REVIEW" && (from === "RESOLVED" || from === "CLOSED")) {
    return "Reopen review";
  }
  if (to === "ESCALATED") return "Escalate to higher authority";
  return `Mark as ${STATUS_META[to].label.toLowerCase()}`;
}

function EmptyDrawer() {
  return (
    <div className="sticky top-6 rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50 p-8 text-center dark:border-rose-800 dark:bg-rose-950/30">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
        <ShieldIcon />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-deep-800 dark:text-cream-100">
        Select an incident
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-deep-600 dark:text-cream-400">
        Choose a report to see its details, record notes, and advance its
        status.
      </p>
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

// ── Icons ───────────────────────────────────────────────────

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

function ArrowUpRightIcon() {
  return (
    <svg {...iconBase} className="h-3.5 w-3.5">
      <path d="M7 17 17 7M7 7h10v10" />
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