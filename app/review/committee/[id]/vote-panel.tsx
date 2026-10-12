// app/review/committee/[id]/vote-panel.tsx
"use client";

import { castVote } from "@/app/components/review/actions";

type Vote = {
  decision: "APPROVE" | "DECLINE" | "ABSTAIN";
  comment: string | null;
};

export function VotePanel({
  applicationId,
  existingVote,
}: {
  applicationId: string;
  existingVote: Vote | null;
}) {
  return (
    <section className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-900 dark:bg-brand-950/20">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800 dark:text-brand-300">
        {existingVote ? "Change your vote" : "Cast your vote"}
      </h2>
      <form action={castVote} className="mt-4 space-y-4">
        <input type="hidden" name="applicationId" value={applicationId} />

        <fieldset>
          <legend className="sr-only">Decision</legend>
          <div className="grid grid-cols-3 gap-2">
            {(["APPROVE", "DECLINE", "ABSTAIN"] as const).map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-cream-300 bg-cream-50 p-3 text-sm transition has-checked:border-brand-400 has-checked:bg-brand-100 dark:border-deep-700 dark:bg-deep-900 dark:has-checked:border-brand-500 dark:has-checked:bg-brand-950/40"
              >
                <input
                  type="radio"
                  name="decision"
                  value={option}
                  defaultChecked={existingVote?.decision === option}
                  required
                  className="h-4 w-4 accent-brand-500"
                />
                <span className="text-deep-800 dark:text-cream-100">
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
            Comment (optional)
          </span>
          <textarea
            name="comment"
            rows={3}
            defaultValue={existingVote?.comment ?? ""}
            className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
          />
        </label>

        <button
          type="submit"
          className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-medium text-deep-800 transition hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-deep-950"
        >
          {existingVote ? "Update vote" : "Submit vote"}
        </button>
      </form>
    </section>
  );
}