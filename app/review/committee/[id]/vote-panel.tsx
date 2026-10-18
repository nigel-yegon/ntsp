// app/review/committee/[id]/vote-panel.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  castVote,
  transitionApplication,
} from "@/app/components/review/actions";
import type { QuorumState } from "@/lib/workflow";

type Vote = {
  decision: "APPROVE" | "DECLINE" | "ABSTAIN";
  comment: string | null;
};

export function VotePanel({
  applicationId,
  existingVote,
  quorum,
}: {
  applicationId: string;
  existingVote: Vote | null;
  quorum: QuorumState;
}) {
  const router = useRouter();
  const [voteError, setVoteError] = useState<string | null>(null);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [voting, startVote] = useTransition();
  const [deciding, startDecide] = useTransition();

  const busy = voting || deciding;

  function onVote(form: FormData) {
    setVoteError(null);
    startVote(async () => {
      try {
        await castVote(form);
        router.refresh();
      } catch (err) {
        setVoteError(err instanceof Error ? err.message : "Vote failed");
      }
    });
  }

  function onDecide(form: FormData) {
    setDecisionError(null);
    startDecide(async () => {
      try {
        await transitionApplication(form);
        router.refresh();
      } catch (err) {
        setDecisionError(
          err instanceof Error ? err.message : "Transition failed"
        );
      }
    });
  }

  return (
    <section className="space-y-4">
      {/* ── Cast / change your vote ─────────────────────── */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-900 dark:bg-brand-950/20">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800 dark:text-brand-300">
          {existingVote ? "Change your vote" : "Cast your vote"}
        </h2>
        <form action={onVote} className="mt-4 space-y-4">
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
                    disabled={busy}
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
              disabled={busy}
              className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 disabled:opacity-60 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-medium text-deep-800 transition hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-60 dark:focus-visible:ring-offset-deep-950"
          >
            {voting
              ? "Saving…"
              : existingVote
                ? "Update vote"
                : "Submit vote"}
          </button>
        </form>
        {voteError && (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-red-300 bg-red-50 p-2 text-xs text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
          >
            {voteError}
          </p>
        )}
      </div>

      {/* ── Record committee recommendation ─────────────── */}
      {quorum.approved && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            Record committee recommendation
          </h2>
          <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
            Quorum reached ({quorum.approves} approve ·{" "}
            {quorum.declines} decline). Submitting forwards this application
            to the Permanent Secretary. A note is required.
          </p>
          <form action={onDecide} className="mt-3 space-y-3">
            <input type="hidden" name="applicationId" value={applicationId} />
            <input type="hidden" name="to" value="AWAITING_PS_APPROVAL" />
            <label className="block">
              <span className="block text-xs font-medium text-emerald-900 dark:text-emerald-200">
                Reason for recommendation *
              </span>
              <textarea
                name="note"
                rows={3}
                required
                minLength={5}
                disabled={busy}
                placeholder="Summarise the committee's reasoning."
                className="mt-1 w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-deep-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-60 dark:border-emerald-800 dark:bg-deep-950 dark:text-cream-100"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {deciding ? "Forwarding…" : "Forward to PS"}
            </button>
          </form>
          {decisionError && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-red-300 bg-red-50 p-2 text-xs text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
            >
              {decisionError}
            </p>
          )}
        </div>
      )}

      {/* ── Record committee decline ─────────────────────── */}
      {quorum.declined && (
        <div className="rounded-2xl border border-red-300 bg-red-50/60 p-5 dark:border-red-900 dark:bg-red-950/20">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-red-800 dark:text-red-300">
            Record committee decline
          </h2>
          <p className="mt-1 text-xs text-red-700 dark:text-red-400">
            Quorum reached ({quorum.declines} decline ·{" "}
            {quorum.approves} approve). This closes the application at the
            committee stage. A note is required.
          </p>
          <form action={onDecide} className="mt-3 space-y-3">
            <input type="hidden" name="applicationId" value={applicationId} />
            <input type="hidden" name="to" value="COMMITTEE_DECLINED" />
            <label className="block">
              <span className="block text-xs font-medium text-red-900 dark:text-red-200">
                Reason for decline *
              </span>
              <textarea
                name="note"
                rows={3}
                required
                minLength={5}
                disabled={busy}
                placeholder="Summarise why the committee declined the application."
                className="mt-1 w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-deep-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-60 dark:border-red-800 dark:bg-deep-950 dark:text-cream-100"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {deciding ? "Recording…" : "Record decline"}
            </button>
          </form>
          {decisionError && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-red-300 bg-red-50 p-2 text-xs text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
            >
              {decisionError}
            </p>
          )}
        </div>
      )}
    </section>
  );
}