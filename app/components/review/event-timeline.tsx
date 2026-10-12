// app/components/review/event-timeline.tsx
import type { ApplicationEvent, User } from "../../../lib/db-types";

type EventWithActor = ApplicationEvent & { actor: User | null };

const EVENT_LABELS: Record<string, string> = {
  SUBMITTED: "Application submitted",
  PERUSAL_STARTED: "Document perusal started",
  DOCUMENT_PERUSED: "Document perused",
  VERIFICATION_STARTED: "Document verification started",
  DOCUMENT_VERIFIED: "Document verified",
  ESCALATED_TO_COMMITTEE: "Escalated to committee",
  COMMITTEE_VOTE_CAST: "Committee vote cast",
  COMMITTEE_APPROVED: "Committee approved",
  COMMITTEE_DECLINED: "Committee declined",
  ESCALATED_TO_PS: "Escalated to Permanent Secretary",
  PS_APPROVED: "Permanent Secretary approved",
  PS_DECLINED: "Permanent Secretary declined",
  FORWARDED_TO_INTERIOR: "Forwarded to Ministry of Interior",
  WITHDRAWN: "Withdrawn",
  NOTE_ADDED: "Note added",
};

export function EventTimeline({ events }: { events: EventWithActor[] }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-deep-500 dark:text-cream-400">
        No activity yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-cream-300 pl-5 dark:border-deep-700">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-6.5 top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-cream-50 bg-brand-400 dark:border-deep-900"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-deep-800 dark:text-cream-100">
              {EVENT_LABELS[event.type] ?? event.type}
            </p>
            <time className="text-xs text-deep-500 dark:text-cream-400">
              {event.createdAt.toLocaleString()}
            </time>
          </div>
          {event.actor && (
            <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
              by {event.actor.name}
            </p>
          )}
          {event.message && (
            <p className="mt-1 text-sm text-deep-700 dark:text-cream-200">
              {event.message}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}