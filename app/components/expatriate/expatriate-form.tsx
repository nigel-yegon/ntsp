// app/components/expatriate/expatriate-form.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Stepper } from "./stepper";
import { STEP_DEFINITIONS } from "./steps";
import { useExpatriateForm } from "./form-context";
import { ApplicantStep } from "./steps/applicant-details";
import { PurposeStep } from "./steps/purpose-letter";
import { CompanyStep } from "./steps/company-documents";
import { SupportingStep } from "./steps/supporting-documents";
import { ReviewStep } from "./steps/review-submit";

// ─── Persistence hook (unchanged shape) ───────────────────────
export function useExpatriatePersistence() {
  const { state, markSaved } = useExpatriateForm();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function persist(mode: "draft" | "submit") {
    setError(null);

    const fd = new FormData();
    fd.set("mode", mode);
    if (state.applicationId) fd.set("applicationId", state.applicationId);
    fd.set("applicant", JSON.stringify(state.applicant));

    for (const [slotId, files] of Object.entries(state.documents)) {
      for (const f of files) {
        if (f.file) fd.append(`documents[${slotId}]`, f.file, f.name);
      }
    }

    const res = await fetch("/api/expatriate/submit", { method: "POST", body: fd });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? "Failed to save");
    }

    const body = (await res.json()) as {
      id: string;
      referenceNo: string;
      status: "DRAFT" | "SUBMITTED";
    };

    markSaved(body);
    if (mode === "draft") setSavedAt(new Date());
    return body;
  }

  return {
    pending,
    error,
    savedAt,
    saveDraft: () =>
      startTransition(async () => {
        try {
          await persist("draft");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to save");
        }
      }),
    submit: () =>
      startTransition(async () => {
        try {
          const body = await persist("submit");
          window.location.href = `/services/applications/${body.id}`;
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to submit");
        }
      }),
  };
}

// ─── Form shell ───────────────────────────────────────────────
export function ExpatriateForm() {
  const { state, setStep } = useExpatriateForm();
  const stepIndex = STEP_DEFINITIONS.findIndex((s) => s.id === state.step);
  const step = STEP_DEFINITIONS[stepIndex];

  if (!step) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-300 bg-red-50 p-5 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
      >
        Unknown step &quot;{state.step}&quot;. Please reload the page.
      </div>
    );
  }

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEP_DEFINITIONS.length - 1;

  const goPrev = () => !isFirst && setStep(STEP_DEFINITIONS[stepIndex - 1].id);
  const goNext = () => !isLast && setStep(STEP_DEFINITIONS[stepIndex + 1].id);

  const { pending, error, savedAt, saveDraft, submit } = useExpatriatePersistence();
  const titleId = `step-title-${step.id}`;

  return (
    <div className="space-y-6">
      <Stepper />

      <section
        aria-labelledby={titleId}
        className="overflow-hidden rounded-3xl border border-cream-300 bg-cream-50 shadow-sm dark:border-deep-800 dark:bg-deep-900"
      >
        {/* Header band */}
        <header className="border-b border-cream-300 bg-linear-to-br from-cream-50 via-cream-100 to-cream-200 px-6 py-6 dark:border-deep-800 dark:from-deep-900 dark:via-deep-900 dark:to-deep-950">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 dark:text-brand-400">
            Step {stepIndex + 1} of {STEP_DEFINITIONS.length}
          </p>
          <h2
            id={titleId}
            className="mt-1 text-2xl font-semibold tracking-tight text-deep-800 dark:text-cream-100"
          >
            {step.title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-deep-600 dark:text-cream-400">
            {step.description}
          </p>
        </header>

        {/* Body */}
        <div className="px-6 py-7">
          <div key={step.id}>
            {step.id === "applicant" && <ApplicantStep />}
            {step.id === "purpose" && <PurposeStep />}
            {step.id === "company" && <CompanyStep />}
            {step.id === "supporting" && <SupportingStep />}
            {step.id === "review" && <ReviewStep />}
          </div>
        </div>

        {/* Inline notices */}
        {(state.status === "DRAFT" && state.referenceNo) || error ? (
          <div className="space-y-3 px-6 pb-4">
            {state.status === "DRAFT" && state.referenceNo && (
              <p
                role="status"
                aria-live="polite"
                className="rounded-2xl border border-brand-300 bg-brand-50 px-4 py-3 text-xs text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-200"
              >
                Draft saved as{" "}
                <span className="font-mono">{state.referenceNo}</span>
                {savedAt ? ` at ${savedAt.toLocaleTimeString()}` : ""}. You can
                close this page and resume from{" "}
                <Link
                  href="/services/expatriate"
                  className="font-medium underline underline-offset-2 hover:text-brand-950 dark:hover:text-brand-100"
                >
                  your drafts
                </Link>
                .
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
              >
                {error}
              </p>
            )}
          </div>
        ) : null}

        {/* Sticky footer */}
        <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-cream-300 bg-cream-100/60 px-6 py-4 backdrop-blur-sm dark:border-deep-800 dark:bg-deep-950/60 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={goPrev}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-xl border border-deep-300 bg-cream-50 px-4 py-2 text-sm font-medium text-deep-700 transition hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300 dark:hover:bg-deep-800"
              >
                <ChevronLeftIcon />
                Back
              </button>
            )}

            <button
              type="button"
              onClick={saveDraft}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-deep-300 bg-cream-50 px-4 py-2 text-sm font-medium text-deep-700 transition hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300 dark:hover:bg-deep-800"
            >
              <SaveIcon />
              {pending ? "Saving…" : "Save as draft"}
            </button>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {!isLast && (
              <button
                type="button"
                onClick={goNext}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-deep-800 px-4 py-2 text-sm font-semibold text-cream-100 transition hover:bg-deep-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400 dark:focus-visible:ring-offset-deep-950"
              >
                Next
                <ChevronRightIcon />
              </button>
            )}

            {isLast && (
              <button
                type="button"
                onClick={submit}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400 dark:focus-visible:ring-offset-deep-950"
              >
                {pending ? "Submitting…" : "Submit application"}
                {!pending && <CheckIcon />}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Inline icons ─────────────────────────────────────────────
const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

function ChevronLeftIcon() {
  return (
    <svg {...iconBase} className="h-4 w-4">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg {...iconBase} className="h-4 w-4">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg {...iconBase} className="h-4 w-4">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg {...iconBase} className="h-4 w-4">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}