// app/components/marketplace/booking-request-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  accommodationId?: number;
  tourPackageId?: number;
  /** Tour packages typically know their own check-out; hide the field. */
  showCheckOut?: boolean;
  defaultCheckOutDays?: number;
  isSignedIn: boolean;
};

export function BookingRequestForm({
  accommodationId,
  tourPackageId,
  showCheckOut = true,
  defaultCheckOutDays,
  isSignedIn,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Default check-in: tomorrow. Default check-out: check-in + N days.
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckIn = tomorrow.toISOString().slice(0, 10);

  const initialCheckOut = (() => {
    if (!defaultCheckOutDays) return "";
    const d = new Date(tomorrow);
    d.setDate(d.getDate() + defaultCheckOutDays);
    return d.toISOString().slice(0, 10);
  })();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      checkIn: String(data.get("checkIn") ?? ""),
      guests: Number(data.get("guests") ?? 1),
      notes: String(data.get("notes") ?? ""),
    };
    if (accommodationId) payload.accommodationId = accommodationId;
    if (tourPackageId) payload.tourPackageId = tourPackageId;
    if (showCheckOut) {
      payload.checkOut = String(data.get("checkOut") ?? "") || undefined;
    }

    const res = await fetch("/api/dashboard/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to submit request.");
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    router.refresh();
  }

  if (!isSignedIn) {
    return (
      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900">
        <h3 className="text-base font-semibold text-deep-800 dark:text-cream-100">
          Request a booking
        </h3>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          Sign in or create a traveller account to send a request directly to
          this business.
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.pathname : "/"
            )}`}
            className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-medium text-deep-800 hover:bg-brand-500"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-cream-300 px-4 py-2 text-sm font-medium text-deep-700 hover:bg-cream-100 dark:border-deep-700 dark:text-cream-300 dark:hover:bg-deep-800"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
        <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
          Request sent
        </h3>
        <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
          The business has been notified. Track progress in your{" "}
          <Link
            href="/dashboard/bookings"
            className="underline underline-offset-2"
          >
            bookings
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900"
    >
      <h3 className="text-base font-semibold text-deep-800 dark:text-cream-100">
        Request a booking
      </h3>
      <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
        Send a request. The business confirms or declines, and you'll see the
        status in your dashboard.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
            Check-in
          </span>
          <input
            name="checkIn"
            type="date"
            required
            defaultValue={defaultCheckIn}
            min={new Date().toISOString().slice(0, 10)}
            className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
          />
        </label>

        {showCheckOut && (
          <label className="block">
            <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
              Check-out
            </span>
            <input
              name="checkOut"
              type="date"
              required
              defaultValue={initialCheckOut}
              min={defaultCheckIn}
              className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
            />
          </label>
        )}

        <label className="block">
          <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
            Guests
          </span>
          <input
            name="guests"
            type="number"
            min={1}
            max={20}
            defaultValue={2}
            required
            className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
          Notes (optional)
        </span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Any special requests, dietary needs, or questions."
          className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
        />
      </label>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full rounded-lg bg-brand-400 px-4 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-brand-500 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send booking request"}
      </button>
    </form>
  );
}