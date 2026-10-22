// app/services/profile/profile-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProfileForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);

    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      companyName: String(data.get("companyName") ?? "").trim(),
      companyRegNo: String(data.get("companyRegNo") ?? "").trim(),
      kraPin: String(data.get("kraPin") ?? "").trim(),
      tourismLicenceNo: String(data.get("tourismLicenceNo") ?? "").trim(),
    };

    const res = await fetch("/api/profile/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setErrors(body.errors ?? ["Something went wrong. Try again."]);
      setSubmitting(false);
      return;
    }

    router.push("/services");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset
        disabled={submitting}
        className="space-y-4 rounded-2xl border border-deep-200 bg-cream-50 p-6 dark:border-deep-800 dark:bg-deep-900"
      >
        <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
          Your details
        </legend>
        <Field
          name="name"
          label="Full name"
          required
          autoComplete="name"
          defaultValue={defaultName}
        />
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">
            Email
          </span>
          <input
            type="email"
            value={defaultEmail}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-deep-200 bg-cream-100 px-3 py-2 text-sm text-deep-500 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-500"
          />
          <span className="mt-1 block text-xs text-deep-500 dark:text-cream-500">
            Tied to your sign-in. Contact support to change it.
          </span>
        </label>
      </fieldset>

      <fieldset
        disabled={submitting}
        className="space-y-4 rounded-2xl border border-deep-200 bg-cream-50 p-6 dark:border-deep-800 dark:bg-deep-900"
      >
        <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
          Your company
        </legend>
        <Field name="companyName" label="Company name" required />
        <Field
          name="companyRegNo"
          label="Certificate of Incorporation number"
          required
          hint="The number on your certificate, not the CR12."
        />
        <Field
          name="kraPin"
          label="KRA PIN"
          hint="Optional now, required before submitting applications."
        />
        <Field
          name="tourismLicenceNo"
          label="Tourism licence number"
          hint="Optional now, required before submitting applications."
        />
      </fieldset>

      {errors.length > 0 && (
        <ul
          role="alert"
          className="space-y-1 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
        >
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-60 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400 dark:focus-visible:ring-offset-deep-950"
      >
        {submitting ? "Saving…" : "Complete profile"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">
        {label}
        {required && (
          <span
            className="ml-1 text-brand-600 dark:text-brand-400"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-deep-200 bg-cream-100 px-3 py-2 text-sm text-deep-800 transition placeholder:text-deep-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500"
      />
      {hint && (
        <span className="mt-1 block text-xs text-deep-500 dark:text-cream-500">
          {hint}
        </span>
      )}
    </label>
  );
}