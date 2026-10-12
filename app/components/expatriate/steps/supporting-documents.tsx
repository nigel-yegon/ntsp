// app/components/expatriate/steps/supporting-documents.tsx
"use client";

import { FileUpload } from "../file-upload";
import { STEP_DEFINITIONS, visibleSlots } from "../steps";
import { useExpatriateForm } from "../form-context";
import { StepNav } from "./applicant-details";

export function SupportingStep() {
  const { state, setStep } = useExpatriateForm();
  const step = STEP_DEFINITIONS.find((s) => s.id === "supporting")!;
  const slots = visibleSlots(
    step,
    state.applicant.permitClass,
    state.applicant.isRenewal
  );

  const allRequired = slots
    .filter((s) => s.required)
    .every((s) => (state.documents[s.id] ?? []).length > 0);

  return (
    <div className="space-y-6">
      {slots.length === 0 && (
        <p className="text-sm text-deep-500 dark:text-cream-400">
          No additional documents are required for this permit class.
        </p>
      )}
      {slots.map((slot) => (
        <FileUpload key={slot.id} slot={slot} />
      ))}
      <StepNav
        onBack={() => setStep("company")}
        onNext={() => setStep("review")}
        nextDisabled={!allRequired}
      />
    </div>
  );
}