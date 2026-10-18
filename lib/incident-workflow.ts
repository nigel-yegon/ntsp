// lib/incident-workflow.ts
// Centralised incident workflow. Both the server actions and the
// admin panel import from here so the transition matrix and status
// metadata never drift between enforcement and UI.

export type IncidentStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";

export type IncidentCategory =
  | "WILDLIFE"
  | "SAFETY"
  | "OPERATOR"
  | "FACILITY"
  | "GUIDES"
  | "OTHER";

export const INCIDENT_STATUSES: readonly IncidentStatus[] = [
  "OPEN",
  "UNDER_REVIEW",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
] as const;

export const INCIDENT_CATEGORIES: readonly IncidentCategory[] = [
  "WILDLIFE",
  "SAFETY",
  "OPERATOR",
  "FACILITY",
  "GUIDES",
  "OTHER",
] as const;

// ── Transition matrix ───────────────────────────────────────
// ESCALATED is terminal: once forwarded to a higher authority,
// the case leaves this workflow. To bring it back, that's a
// separate process outside the panel.
export const TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  OPEN: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["ESCALATED", "RESOLVED", "CLOSED", "OPEN"],
  ESCALATED: [],
  RESOLVED: ["CLOSED", "UNDER_REVIEW"],
  CLOSED: ["UNDER_REVIEW"],
};

export function canTransition(
  from: IncidentStatus,
  to: IncidentStatus
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

// ── Display metadata ────────────────────────────────────────
// Tailwind class strings are defined once so the panel doesn't
// hardcode them. Distinct hues per status: rose (open), amber
// (under review), violet (escalated), emerald (resolved),
// slate (closed).
export type StatusMeta = {
  label: string;
  description: string;
  pillBg: string;
  pillText: string;
  bar: string;
  chipBg: string;
};

export const STATUS_META: Record<IncidentStatus, StatusMeta> = {
  OPEN: {
    label: "Open",
    description: "Awaiting initial review.",
    pillBg: "bg-rose-100 dark:bg-rose-950",
    pillText: "text-rose-800 dark:text-rose-200",
    bar: "bg-rose-500",
    chipBg: "bg-rose-50 dark:bg-rose-950/40",
  },
  UNDER_REVIEW: {
    label: "Under review",
    description: "Being investigated by the review team.",
    pillBg: "bg-amber-100 dark:bg-amber-950",
    pillText: "text-amber-800 dark:text-amber-200",
    bar: "bg-amber-500",
    chipBg: "bg-amber-50 dark:bg-amber-950/40",
  },
  ESCALATED: {
    label: "Escalated",
    description: "Forwarded to a higher authority. Out of the review queue.",
    pillBg: "bg-violet-100 dark:bg-violet-950",
    pillText: "text-violet-800 dark:text-violet-200",
    bar: "bg-violet-500",
    chipBg: "bg-violet-50 dark:bg-violet-950/40",
  },
  RESOLVED: {
    label: "Resolved",
    description: "Issue addressed. Awaiting closure or final sign-off.",
    pillBg: "bg-emerald-100 dark:bg-emerald-950",
    pillText: "text-emerald-800 dark:text-emerald-200",
    bar: "bg-emerald-500",
    chipBg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  CLOSED: {
    label: "Closed",
    description: "Case finalised.",
    pillBg: "bg-slate-200 dark:bg-slate-800",
    pillText: "text-slate-700 dark:text-slate-300",
    bar: "bg-slate-500",
    chipBg: "bg-slate-100 dark:bg-slate-800/40",
  },
};

// ── Escalation ──────────────────────────────────────────────
// Suggested recipients, used only as datalist hints in the UI.
// The DB accepts free text so real-world recipients (which vary
// by incident) aren't blocked by a fixed list.
export const ESCALATION_SUGGESTIONS = [
  "Kenya Wildlife Service",
  "Ministry of Tourism",
  "National Police Service",
  "County Government",
  "Tourism Regulatory Authority",
] as const;

// ── Filter helpers ──────────────────────────────────────────
// "Active" is the panel's default view: everything the review
// team might still act on. Escalated cases are excluded — they're
// out of this workflow.
export const ACTIVE_STATUSES: readonly IncidentStatus[] = [
  "OPEN",
  "UNDER_REVIEW",
] as const;

export type FilterKey = "ACTIVE" | "ALL" | IncidentStatus;