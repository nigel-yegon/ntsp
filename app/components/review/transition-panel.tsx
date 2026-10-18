// app/components/review/transition-panel.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { transitionApplication } from "@/app/components/review/actions";

export function TransitionPanel({
  applicationId,
  from,
  to,
  label,
  noteRequired = false,
  noteRequiredMessage,
  disabled = false,
  disabledMessage,
}: {
  applicationId: string;
  from: string;
  to: string;
  label: string;
  noteRequired?: boolean;
  noteRequiredMessage?: string;
  disabled?: boolean;
  disabledMessage?: string;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, startTransition] = useTransition();

  function submit(form: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await transitionApplication(form);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Transition failed");
      }
    });
  }

  if (disabled) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
        {disabledMessage ?? "This action is currently unavailable."}
      </div>
    );
  }

  return (
    <form
      action={submit}
      className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-900 dark:bg-brand-950/20"
    >
      <input type="hidden" name="applicationId" value={applicationId} />
      <input type="hidden" name="to" value={to} />

      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800 dark:text-brand-300">
        {label}
      </h2>

      {noteRequired && (
        <label className="mt-3 block">
          <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
            {noteRequiredMessage ?? "Note (required)"}
          </span>
          <textarea
            name="note"
            rows={3}
            required
            minLength={5}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={submitting}
            className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
          />
        </label>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 rounded-lg bg-brand-400 px-4 py-2 text-sm font-medium text-deep-800 transition hover:bg-brand-500 disabled:opacity-60"
      >
        {submitting ? "Saving…" : label}
      </button>

      {error && (
        <p className="mt-3 rounded-lg border border-red-300 bg-red-50 p-2 text-xs text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}