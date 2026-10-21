// app/review/verification/[id]/verification-actions.tsx
"use client";

import { useState } from "react";

type Decision = "ACCEPTED" | "REJECTED" | "NEEDS_RESUBMISSION";

export function VerificationDocumentActions({
  documentId,
  action,
  currentDecision,
}: {
  documentId: string;
  action: (formData: FormData) => Promise<void>;
  /** Optional — when set, "Accept" is replaced by "Change decision"
   *  and the buttons are always visible. Omit for the current
   *  "only when PENDING" behaviour. */
  currentDecision?: "PENDING" | Decision;
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null);

  const showButtons = currentDecision === undefined || currentDecision === "PENDING";

  return (
    <>
      {!notesOpen && showButtons && (
        <div className="flex flex-wrap gap-2">
          <form action={action}>
            <input type="hidden" name="documentId" value={documentId} />
            <input type="hidden" name="stage" value="verification" />
            <input type="hidden" name="decision" value="ACCEPTED" />
            <button
              type="submit"
              className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              Accept
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setPendingDecision("REJECTED");
              setNotesOpen(true);
            }}
            className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
          >
            Reject
          </button>

          <button
            type="button"
            onClick={() => {
              setPendingDecision("NEEDS_RESUBMISSION");
              setNotesOpen(true);
            }}
            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
          >
            Needs resubmission
          </button>
        </div>
      )}

      {notesOpen && pendingDecision && (
        <form action={action} className="w-full space-y-2">
          <input type="hidden" name="documentId" value={documentId} />
          <input type="hidden" name="stage" value="verification" />
          <input type="hidden" name="decision" value={pendingDecision} />
          <label className="block text-xs font-medium text-deep-700 dark:text-cream-300">
            Reviewer notes (required)
            <textarea
              name="notes"
              required
              rows={2}
              className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-brand-400 px-3 py-1.5 text-xs font-medium text-deep-800 hover:bg-brand-500"
            >
              Submit decision
            </button>
            <button
              type="button"
              onClick={() => {
                setNotesOpen(false);
                setPendingDecision(null);
              }}
              className="rounded-lg border border-cream-300 px-3 py-1.5 text-xs text-deep-700 hover:bg-cream-100 dark:border-deep-700 dark:text-cream-300 dark:hover:bg-deep-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
}