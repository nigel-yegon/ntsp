// app/components/marketplace/inquiry-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  accommodationId?: number;
  tourPackageId?: number;
  businessName: string;
  isSignedIn: boolean;
};

export function InquiryForm({
  accommodationId,
  tourPackageId,
  businessName,
  isSignedIn,
}: Props) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    threadId: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);
    setError(null);

    const payload: Record<string, unknown> = { body: body.trim() };
    if (accommodationId) payload.accommodationId = accommodationId;
    if (tourPackageId) payload.tourPackageId = tourPackageId;

    const res = await fetch("/api/dashboard/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to send inquiry.");
      setSubmitting(false);
      return;
    }

    const data = await res.json();
    setBody("");
    setSubmitting(false);
    setSuccess({ threadId: data.threadId });
    router.refresh();
  }

  if (!isSignedIn) {
    return (
      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900">
        <h3 className="text-base font-semibold text-deep-800 dark:text-cream-100">
          Message {businessName}
        </h3>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          Have a question? Sign in to send a message and track the reply.
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            href="/login"
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
          Message sent
        </h3>
        <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
          {businessName} has been notified. View the conversation in your{" "}
          <Link
            href={`/dashboard/messages/${success.threadId}`}
            className="underline underline-offset-2"
          >
            messages
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
        Message {businessName}
      </h3>
      <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
        Send a question or inquiry. Replies appear in your dashboard.
      </p>

      <label className="mt-4 block">
        <span className="sr-only">Message</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          required
          placeholder={`Ask ${businessName} a question…`}
          disabled={submitting}
          className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 disabled:opacity-60 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
        />
      </label>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !body.trim()}
        className="mt-4 w-full rounded-lg bg-deep-800 px-4 py-2.5 text-sm font-medium text-cream-100 transition hover:bg-deep-900 disabled:opacity-60 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}