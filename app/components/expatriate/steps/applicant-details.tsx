// app/components/expatriate/steps/applicant-details.tsx
"use client";

import { useExpatriateForm, type PermitClass } from "../form-context";
import { STEP_DEFINITIONS } from "../steps";

const PERMIT_OPTIONS: { value: PermitClass; label: string }[] = [
  { value: "class-g", label: "Class G — Investor" },
  { value: "class-d", label: "Class D — Employee" },
  { value: "special-pass", label: "Special Pass" },
];

export function ApplicantStep() {
  const { state, setApplicant, setStep } = useExpatriateForm();
  const { applicant } = state;

  const isValid =
    applicant.fullName.trim() &&
    applicant.nationality.trim() &&
    applicant.passportNumber.trim() &&
    applicant.email.trim() &&
    applicant.phone.trim() &&
    applicant.permitClass;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
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

      <fieldset>
        <legend className="text-sm font-medium text-deep-800 dark:text-cream-100">
          Permit class <span className="text-brand-600 dark:text-brand-400">*</span>
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {PERMIT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`
                flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition
                ${
                  applicant.permitClass === opt.value
                    ? "border-brand-400 bg-brand-50 dark:border-brand-500 dark:bg-brand-950/30"
                    : "border-cream-300 bg-cream-50 hover:border-brand-300 dark:border-deep-700 dark:bg-deep-900"
                }
              `}
            >
              <input
                type="radio"
                name="permitClass"
                value={opt.value}
                checked={applicant.permitClass === opt.value}
                onChange={() => setApplicant({ permitClass: opt.value })}
                className="h-4 w-4 accent-brand-500"
              />
              <span className="text-deep-800 dark:text-cream-100">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-3 text-sm text-deep-800 dark:text-cream-100">
        <input
          type="checkbox"
          checked={applicant.isRenewal}
          onChange={(e) => setApplicant({ isRenewal: e.target.checked })}
          className="h-4 w-4 accent-brand-500"
        />
        This is a renewal of an existing permit
      </label>

      <StepNav
        onNext={() => setStep("purpose")}
        nextDisabled={!isValid}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-deep-800 dark:text-cream-100">
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
        onChange={(e) => onChange(e.target.value)}
        className="
          mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm
          text-deep-800
          focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40
          dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100
        "
      />
    </label>
  );
}

export function StepNav({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-cream-300 px-4 py-2 text-sm font-medium text-deep-700 transition hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:border-deep-700 dark:text-cream-300 dark:hover:bg-deep-800"
        >
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="
          rounded-lg bg-brand-400 px-4 py-2 text-sm font-medium text-deep-800 transition
          hover:bg-brand-500
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          dark:focus-visible:ring-offset-deep-950
        "
      >
        {nextLabel}
      </button>
    </div>
  );
}