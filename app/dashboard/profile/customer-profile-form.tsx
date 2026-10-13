// app/dashboard/profile/customer-profile-form.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCustomerProfile } from "./profile-actions";

export function CustomerProfileForm({
  defaultName,
  defaultPhone,
  email,
}: {
  defaultName: string;
  defaultPhone: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setSaved(false);

    startTransition(async () => {
      const result = await updateCustomerProfile({ name, phone });
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
        Your details
      </h3>

      <Field
        label="Full name"
        value={name}
        onChange={setName}
        required
      />

      <Field
        label="Phone number"
        value={phone}
        onChange={setPhone}
        placeholder="+254 700 000 000"
        hint="Optional. Shared with businesses you contact."
      />

      <ReadOnlyField
        label="Email"
        value={email}
        hint="Contact support to change the email on your account."
      />

      {errors.length > 0 && <Errors errors={errors} />}
      {saved && <SavedBanner />}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-400 px-5 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-brand-500 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

// ─── Shared primitives (also used by business form) ─────────────────

export function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  hint,
  type = "text",
  as = "input",
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  type?: string;
  as?: "input" | "textarea";
  rows?: number;
}) {
  const baseClass =
    "mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100";

  return (
    <label className="block">
      <span className="block text-sm font-medium text-deep-800 dark:text-cream-100">
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
      {as === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={rows ?? 4}
          className={baseClass}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
      {hint && (
        <span className="mt-1 block text-xs text-deep-500 dark:text-cream-400">
          {hint}
        </span>
      )}
    </label>
  );
}

export function ReadOnlyField({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-deep-800 dark:text-cream-100">
        {label}
      </span>
      <input
        type="text"
        value={value}
        readOnly
        className="mt-1 w-full cursor-not-allowed rounded-lg border border-cream-200 bg-cream-100 px-3 py-2 text-sm text-deep-500 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-400"
      />
      {hint && (
        <span className="mt-1 block text-xs text-deep-500 dark:text-cream-400">
          {hint}
        </span>
      )}
    </label>
  );
}

export function Errors({ errors }: { errors: string[] }) {
  return (
    <ul
      role="alert"
      className="space-y-1 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
    >
      {errors.map((e) => (
        <li key={e}>{e}</li>
      ))}
    </ul>
  );
}

export function SavedBanner() {
  return (
    <p
      role="status"
      className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
    >
      Profile saved.
    </p>
  );
}