// app/components/expatriate/steps/purpose-letter.tsx
"use client";

import { FileUpload } from "../file-upload";
import { STEP_DEFINITIONS, visibleSlots } from "../steps";
import { useExpatriateForm } from "../form-context";
import { StepNav } from "./applicant-details";

export function PurposeStep() {
  const { state, setStep } = useExpatriateForm();
  const step = STEP_DEFINITIONS.find((s) => s.id === "purpose")!;
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
      {slots.map((slot) => (
        <FileUpload key={slot.id} slot={slot} />
      ))}
      <StepNav
        onBack={() => setStep("applicant")}
        onNext={() => setStep("company")}
        nextDisabled={!allRequired}
      />
    </div>
  );
}