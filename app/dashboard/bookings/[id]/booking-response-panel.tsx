// app/dashboard/bookings/[id]/booking-response-panel.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BookingResponsePanel({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<"CONFIRMED" | "DECLINED" | null>(null);
  const [responseNote, setResponseNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(decision: "CONFIRMED" | "DECLINED") {
    setSubmitting(true);
    setError(null);

    const res = await fetch(`/api/dashboard/bookings/${bookingId}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, responseNote: responseNote.trim() || undefined }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save response.");
      setSubmitting(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-5 border-t border-cream-200 pt-5 dark:border-deep-800">
      <p className="text-xs font-medium uppercase tracking-wide text-deep-500 dark:text-cream-400">
        Respond to this request
      </p>

      <label className="mt-3 block">
        <span className="sr-only">Response note</span>
        <textarea
          value={responseNote}
          onChange={(e) => setResponseNote(e.target.value)}
          rows={3}
          placeholder="Optional note to the customer — e.g. confirmation details, payment link, or reason for declining."
          disabled={submitting}
          className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 disabled:opacity-60 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
        />
      </label>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => submit("CONFIRMED")}
          disabled={submitting}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting && pending === "CONFIRMED" ? "Saving…" : "Confirm booking"}
        </button>
        <button
          type="button"
          onClick={() => submit("DECLINED")}
          disabled={submitting}
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
        >
          {submitting && pending === "DECLINED" ? "Saving…" : "Decline"}
        </button>
      </div>
    </div>
  );
}