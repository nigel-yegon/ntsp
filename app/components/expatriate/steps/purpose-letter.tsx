// app/components/expatriate/steps/purpose-letter.tsx
"use client";

import { FileUpload } from "../file-upload";
import { STEP_DEFINITIONS, visibleSlots } from "../steps";
import { useExpatriateForm } from "../form-context";
import { SectionHeading } from "./applicant-details";

export function PurposeStep() {
  const { state } = useExpatriateForm();
  const step = STEP_DEFINITIONS.find((s) => s.id === "purpose")!;
  const slots = visibleSlots(step, state.applicant.permitClass, state.applicant.isRenewal);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Purpose of entry"
        description="Upload the letter describing the purpose of this application."
      />
      {slots.length === 0 ? (
        <EmptyState message="No purpose documents are required for this permit class." />
      ) : (
        <div className="space-y-4">
          {slots.map((slot) => (
            <FileUpload key={slot.id} slot={slot} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-cream-300 bg-cream-100/40 px-4 py-6 text-center text-sm text-deep-500 dark:border-deep-700 dark:bg-deep-950/40 dark:text-cream-500">
      {message}
    </p>
  );
}