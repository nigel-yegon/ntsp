// app/review/ps/[id]/ps-decision-panel.tsx
"use client";

import { psDecision } from "@/app/components/review/actions";

export function PsDecisionPanel({
  applicationId,
  forwardOnly = false,
}: {
  applicationId: string;
  forwardOnly?: boolean;
}) {
  if (forwardOnly) {
    return (
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
          Ready to forward
        </h2>
        <p className="mt-2 text-sm text-deep-700 dark:text-cream-200">
          The application is approved. Forward the recommendation to the
          Ministry of Interior.
        </p>
        <form action={psDecision} className="mt-4 space-y-3">
          <input type="hidden" name="applicationId" value={applicationId} />
          <input type="hidden" name="to" value="FORWARDED_TO_INTERIOR" />
          <label className="block">
            <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
              Forwarding note (optional)
            </span>
            <textarea
              name="note"
              rows={2}
              className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-deep-950"
          >
            Forward to Ministry of Interior
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-900 dark:bg-brand-950/20">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800 dark:text-brand-300">
        Decision
      </h2>
      <form action={psDecision} className="mt-4 space-y-3">
        <input type="hidden" name="applicationId" value={applicationId} />
        <label className="block">
          <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
            Note (required for decline)
          </span>
          <textarea
            name="note"
            rows={3}
            className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            name="to"
            value="PS_APPROVED"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-deep-950"
          >
            Approve
          </button>
          <button
            type="submit"
            name="to"
            value="PS_DECLINED"
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:focus-visible:ring-offset-deep-950"
          >
            Decline
          </button>
        </div>
      </form>
    </section>
  );
}