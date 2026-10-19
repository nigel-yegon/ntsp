// app/investment/inquiry/inquiry-form.tsx
"use client";

import { useState } from "react";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; referenceNo: string; id: string }
  | { kind: "error"; message: string };

const INVESTOR_TYPES = [
  { value: "INDIVIDUAL", label: "Individual investor" },
  { value: "COMPANY", label: "Company" },
  { value: "FUND", label: "Investment fund" },
  { value: "FAMILY_OFFICE", label: "Family office" },
  { value: "OTHER", label: "Other" },
] as const;

const INTERESTS = [
  { value: "LODGE_RESORT", label: "High-end lodges & resorts" },
  { value: "COASTAL", label: "Coastal tourism" },
  { value: "ECO_TOURISM", label: "Eco-tourism" },
  { value: "MICE", label: "MICE facilities" },
  { value: "CULTURAL_HERITAGE", label: "Cultural & heritage" },
  { value: "INFRASTRUCTURE", label: "Tourism infrastructure" },
  { value: "DOMESTIC_LEISURE", label: "Domestic leisure" },
  { value: "TECHNOLOGY", label: "Technology in tourism" },
  { value: "OTHER", label: "Other / multiple" },
] as const;

const SCALES = [
  { value: "UNDER_10M", label: "Under KShs 10M" },
  { value: "FROM_10M_50M", label: "KShs 10M – 50M" },
  { value: "FROM_50M_100M", label: "KShs 50M – 100M" },
  { value: "FROM_100M_500M", label: "KShs 100M – 500M" },
  { value: "ABOVE_500M", label: "Above KShs 500M" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
] as const;

export function InvestorInquiryForm() {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set()
  );

  function toggleInterest(value: string) {
    setSelectedInterests((curr) => {
      const next = new Set(curr);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    setFieldErrors({});
    setState({ kind: "submitting" });

    const form = new FormData(e.currentTarget);

    // Remove any inputs named "interests" that the browser auto-includes
    form.delete("interests");
    for (const v of selectedInterests) {
      form.append("interests", v);
    }

    let res: Response;
    try {
      res = await fetch("/api/investment/inquiries", {
        method: "POST",
        body: form,
      });
    } catch {
      setState({
        kind: "error",
        message: "Network error. Please check your connection and try again.",
      });
      return;
    }

    if (res.status === 201) {
      const data = (await res.json()) as { id: string; referenceNo: string };
      setState({
        kind: "success",
        id: data.id,
        referenceNo: data.referenceNo,
      });
      return;
    }

    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      issues?: Record<string, string[]>;
    };
    if (body.issues) setFieldErrors(body.issues);
    setState({
      kind: "error",
      message: body.error ?? `Submission failed (${res.status}).`,
    });
  }

  if (state.kind === "success") {
    return (
      <div className="rounded-2xl border border-brand-300 bg-brand-50 p-6 dark:border-brand-700 dark:bg-brand-900/30">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-400 text-sm font-bold text-deep-900"
          >
            ✓
          </span>
          <div>
            <h2 className="text-lg font-semibold text-brand-800 dark:text-brand-200">
              Inquiry received
            </h2>
            <p className="mt-1 text-sm text-brand-700 dark:text-brand-300">
              Your reference number is{" "}
              <span className="font-mono font-semibold text-brand-900 dark:text-brand-100">
                {state.referenceNo}
              </span>
              . Our investment team will review your inquiry and follow up by
              email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const busy = state.kind === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset className="space-y-4" disabled={busy}>
        <legend className="text-base font-semibold text-deep-900 dark:text-cream-100">
          Your details
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            name="fullName"
            required
            errors={fieldErrors}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            required
            errors={fieldErrors}
            placeholder="you@example.com"
          />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            errors={fieldErrors}
            placeholder="+254 …"
          />
          <Field label="Country" name="country" errors={fieldErrors} />
          <Field
            label="Company / organisation"
            name="company"
            errors={fieldErrors}
            placeholder="Optional"
          />
        </div>
      </fieldset>

      <hr className="divider-gold" />

      <fieldset className="space-y-4" disabled={busy}>
        <legend className="text-base font-semibold text-deep-900 dark:text-cream-100">
          Investment profile
        </legend>

        <Field label="Investor type" name="investorType" errors={fieldErrors}>
          <select
            name="investorType"
            className={inputClass}
            defaultValue="INDIVIDUAL"
          >
            {INVESTOR_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <p className="text-sm font-medium text-deep-700 dark:text-cream-200">
            Areas of interest{" "}
            <span className="text-xs font-normal text-deep-500 dark:text-cream-500">
              (select all that apply)
            </span>
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {INTERESTS.map((i) => (
              <label
                key={i.value}
                className="flex cursor-pointer items-start gap-2 rounded-lg border border-cream-300 bg-cream-100 px-3 py-2 text-sm transition has-checked:border-brand-400 has-checked:bg-brand-50 dark:border-deep-700 dark:bg-deep-950 dark:has-checked:border-brand-500 dark:has-checked:bg-brand-950/40"
              >
                <input
                  type="checkbox"
                  checked={selectedInterests.has(i.value)}
                  onChange={() => toggleInterest(i.value)}
                  className="mt-0.5 h-4 w-4 rounded border-deep-300"
                  style={{ accentColor: "var(--brand-500)" }}
                />
                <span className="text-deep-800 dark:text-cream-100">
                  {i.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Field
          label="Investment scale"
          name="scale"
          errors={fieldErrors}
        >
          <select name="scale" className={inputClass} defaultValue="">
            <option value="">Prefer not to say</option>
            {SCALES.filter((s) => s.value !== "PREFER_NOT_TO_SAY").map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      <hr className="divider-gold" />

      <fieldset className="space-y-4" disabled={busy}>
        <legend className="text-base font-semibold text-deep-900 dark:text-cream-100">
          Your message
        </legend>

        <Textarea
          label="Tell us about your interest in Kenya's tourism sector"
          name="message"
          required
          rows={6}
          maxLength={5000}
          errors={fieldErrors}
          placeholder="Background, investment thesis, specific opportunities you're evaluating, any questions you have."
        />
      </fieldset>

      {state.kind === "error" && (
        <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-deep-500 dark:text-cream-500">
          Your inquiry will be reviewed by the authority&apos;s investment team.
          Fields marked with <span className="text-brand-600">*</span> are
          required.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 rounded-md bg-brand-400 px-5 py-2.5 text-sm font-semibold text-deep-900 shadow-sm transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Sending…" : "Submit inquiry"}
        </button>
      </div>
    </form>
  );
}

// ─── Form primitives ─────────────────────────────────────────

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  errors,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  errors: Record<string, string[]>;
  children?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-deep-700 dark:text-cream-200">
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </span>
      {children ?? (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      <FieldError errors={errors[name]} />
    </label>
  );
}

function Textarea({
  label,
  name,
  rows = 4,
  required,
  placeholder,
  maxLength,
  errors,
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  errors: Record<string, string[]>;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-deep-700 dark:text-cream-200">
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className={inputClass}
      />
      <FieldError errors={errors[name]} />
    </label>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="mt-1 block text-xs text-red-600">{errors[0]}</span>;
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-400 focus:bg-cream-100 focus:ring-2 focus:ring-brand-400/30 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:border-brand-500 dark:focus:bg-deep-900";