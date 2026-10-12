// app/components/expatriate/expatriate-form.tsx
"use client";

import { Stepper } from "./stepper";
import { STEP_DEFINITIONS } from "./steps";
import { useExpatriateForm } from "./form-context";
import { ApplicantStep } from "./steps/applicant-details";
import { PurposeStep } from "./steps/purpose-letter";
import { CompanyStep } from "./steps/company-documents";
import { SupportingStep } from "./steps/supporting-documents";
import { ReviewStep } from "./steps/review-submit";

export function ExpatriateForm() {
  const { state } = useExpatriateForm();
  const step = STEP_DEFINITIONS.find((s) => s.id === state.step)!;

  return (
    <div>
      <Stepper />
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
          {step.title}
        </h2>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          {step.description}
        </p>
      </header>

      {step.id === "applicant" && <ApplicantStep />}
      {step.id === "purpose" && <PurposeStep />}
      {step.id === "company" && <CompanyStep />}
      {step.id === "supporting" && <SupportingStep />}
      {step.id === "review" && <ReviewStep />}
    </div>
  );
}