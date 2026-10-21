// app/components/expatriate/steps/applicant-details.tsx
"use client";

import { useExpatriateForm, type PermitClass } from "../form-context";

const PERMIT_OPTIONS: { value: PermitClass; label: string; hint: string }[] = [
  { value: "class-g", label: "Class G", hint: "Investor" },
  { value: "class-d", label: "Class D", hint: "Employee" },
  { value: "special-pass", label: "Special Pass", hint: "Short-term" },
];

export function ApplicantStep() {
  const { state, setApplicant } = useExpatriateForm();
  const { applicant } = state;

  return (
    <div className="space-y-8">
      {/* Identity */}
      <section>
        <SectionHeading
          title="Applicant identity"
          description="Details as they appear on the passport."
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            value={applicant.fullName}
            onChange={(v) => setApplicant({ fullName: v })}
            required
          />
          <Field
            label="Nationality"
            value={applicant.nationality}
            onChange={(v) => setApplicant({ nationality: v })}
            required
          />
          <Field
            label="Passport number"
            value={applicant.passportNumber}
            onChange={(v) => setApplicant({ passportNumber: v })}
            required
          />
        </div>
      </section>

      {/* Contact */}
      <section>
        <SectionHeading
          title="Contact"
          description="We will send reference updates to this email."
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Email address"
            type="email"
            value={applicant.email}
            onChange={(v) => setApplicant({ email: v })}
            required
          />
          <Field
            label="Phone number"
            type="tel"
            value={applicant.phone}
            onChange={(v) => setApplicant({ phone: v })}
            required
          />
        </div>
      </section>

      {/* Permit class */}
      <section>
        <SectionHeading
          title="Permit class"
          description="Determines which supporting documents are required."
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {PERMIT_OPTIONS.map((opt) => {
            const active = applicant.permitClass === opt.value;
            return (
              <label
                key={opt.value}
                className={`
                  group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm transition
                  focus-within:ring-2 focus-within:ring-brand-400 focus-within:ring-offset-2 focus-within:ring-offset-cream-50 dark:focus-within:ring-offset-deep-950
                  ${
                    active
                      ? "border-brand-400 bg-brand-50 dark:border-brand-500 dark:bg-brand-950/40"
                      : "border-cream-300 bg-cream-50 hover:border-brand-300 dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-700"
                  }
                `}
              >
                <input
                  type="radio"
                  name="permitClass"
                  value={opt.value}
                  checked={active}
                  onChange={() => setApplicant({ permitClass: opt.value })}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`
                    mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition
                    ${
                      active
                        ? "border-brand-500"
                        : "border-cream-400 dark:border-deep-600"
                    }
                  `}
                >
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-brand-500" />
                  )}
                </span>
                <span>
                  <span className="block font-medium text-deep-800 dark:text-cream-100">
                    {opt.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-deep-500 dark:text-cream-500">
                    {opt.hint}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Renewal */}
      <label className="flex items-start gap-3 rounded-2xl border border-cream-300 bg-cream-100/60 p-4 dark:border-deep-800 dark:bg-deep-950/40">
        <input
          type="checkbox"
          checked={applicant.isRenewal}
          onChange={(e) => setApplicant({ isRenewal: e.target.checked })}
          className="mt-0.5 h-4 w-4 accent-brand-500"
        />
        <span>
          <span className="block text-sm font-medium text-deep-800 dark:text-cream-100">
            This is a renewal of an existing permit
          </span>
          <span className="mt-0.5 block text-xs text-deep-500 dark:text-cream-500">
            We will reuse your previously submitted documents where possible.
          </span>
        </span>
      </label>
    </div>
  );
}

// ─── Shared helpers (also used by other steps) ────────────────
export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-deep-500 dark:text-cream-500">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
          {description}
        </p>
      )}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-deep-600 dark:text-cream-400">
        {label}
        {required && (
          <span className="ml-1 text-brand-600 dark:text-brand-400" aria-hidden="true">
            *
          </span>
        )}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-deep-800 shadow-sm transition placeholder:text-deep-400 focus:border-brand-400 focus:bg-cream-100 focus:outline-none focus:ring-2 focus:ring-brand-400/30 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-600 dark:focus:border-brand-500 dark:focus:bg-deep-950"
      />
    </label>
  );
}