// app/components/expatriate/steps/company-documents.tsx
"use client";

import { FileUpload } from "../file-upload";
import { STEP_DEFINITIONS, visibleSlots } from "../steps";
import { useExpatriateForm } from "../form-context";
import { SectionHeading } from "./applicant-details";

export function CompanyStep() {
  const { state } = useExpatriateForm();
  const step = STEP_DEFINITIONS.find((s) => s.id === "company")!;
  const slots = visibleSlots(step, state.applicant.permitClass, state.applicant.isRenewal);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Company documents"
        description="Registration and compliance documents for the employing company."
      />
      {slots.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-cream-300 bg-cream-100/40 px-4 py-6 text-center text-sm text-deep-500 dark:border-deep-700 dark:bg-deep-950/40 dark:text-cream-500">
          No company documents are required for this permit class.
        </p>
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