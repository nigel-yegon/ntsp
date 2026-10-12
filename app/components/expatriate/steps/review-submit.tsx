// app/components/expatriate/steps/review-submit.tsx
"use client";

import { useState } from "react";
import { STEP_DEFINITIONS, visibleSlots } from "../steps";
import { useExpatriateForm } from "../form-context";
import { StepNav } from "./applicant-details";

export function ReviewStep() {
  const { state, setStep, reset } = useExpatriateForm();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null
  );

  const onSubmit = async () => {
    setSubmitting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("applicant", JSON.stringify(state.applicant));
      for (const [slotId, files] of Object.entries(state.documents)) {
        for (const f of files) {
          formData.append(`documents[${slotId}]`, f.file, f.name);
        }
      }

      const response = await fetch("/api/expatriate/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Submission failed (${response.status})`);

      setResult({
        ok: true,
        message:
          "Application received. You will receive a confirmation email shortly.",
      });
      reset();
    } catch (err) {
      setResult({
        ok: false,
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const { applicant } = state;
  const permitLabel =
    applicant.permitClass === "class-g"
      ? "Class G — Investor"
      : applicant.permitClass === "class-d"
      ? "Class D — Employee"
      : applicant.permitClass === "special-pass"
      ? "Special Pass"
      : "—";

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
          Applicant
        </h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          <Row label="Full name" value={applicant.fullName} />
          <Row label="Nationality" value={applicant.nationality} />
          <Row label="Passport number" value={applicant.passportNumber} />
          <Row label="Email" value={applicant.email} />
          <Row label="Phone" value={applicant.phone} />
          <Row label="Permit class" value={permitLabel} />
          <Row
            label="Application type"
            value={applicant.isRenewal ? "Renewal" : "First application"}
          />
        </dl>
      </section>

      {STEP_DEFINITIONS.filter((s) => s.slots.length > 0).map((step) => {
        const slots = visibleSlots(
          step,
          applicant.permitClass,
          applicant.isRenewal
        );
        return (
          <section key={step.id}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
              {step.title}
            </h3>
            <ul className="space-y-2">
              {slots.map((slot) => {
                const files = state.documents[slot.id] ?? [];
                return (
                  <li
                    key={slot.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm dark:border-deep-700 dark:bg-deep-900"
                  >
                    <span className="text-deep-700 dark:text-cream-200">
                      {slot.label}
                    </span>
                    <span
                      className={
                        files.length
                          ? "text-deep-600 dark:text-cream-300"
                          : "text-brand-600 dark:text-brand-400"
                      }
                    >
                      {files.length
                        ? `${files.length} file${files.length > 1 ? "s" : ""}`
                        : slot.required
                        ? "Missing"
                        : "Not provided"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {result && (
        <p
          role="status"
          className={`rounded-lg border p-3 text-sm ${
            result.ok
              ? "border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-700 dark:bg-brand-950/30 dark:text-brand-300"
              : "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
          }`}
        >
          {result.message}
        </p>
      )}

      <StepNav
        onBack={() => setStep("supporting")}
        onNext={onSubmit}
        nextLabel={submitting ? "Submitting…" : "Submit application"}
        nextDisabled={submitting}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-deep-500 dark:text-cream-400">{label}</dt>
      <dd className="text-sm text-deep-800 dark:text-cream-100">
        {value || "—"}
      </dd>
    </div>
  );
}