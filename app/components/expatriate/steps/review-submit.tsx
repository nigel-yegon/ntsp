// app/components/expatriate/steps/review-submit.tsx
"use client";

import { useExpatriateForm } from "../form-context";
import { SLOT_LOOKUP } from "../steps";
import { SectionHeading } from "./applicant-details";

export function ReviewStep() {
  const { state } = useExpatriateForm();
  const { applicant, documents } = state;

  const uploadedSlots = Object.entries(documents).filter(
    ([, files]) => files.length > 0,
  );

  return (
    <div className="space-y-8">
      <SectionHeading
        title="Review your application"
        description="Check that everything is correct before you submit."
      />

      <section className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-100/50 dark:border-deep-800 dark:bg-deep-950/40">
        <div className="border-b border-cream-300 px-5 py-3 dark:border-deep-800">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-deep-500 dark:text-cream-500">
            Applicant
          </h3>
        </div>
        <dl className="grid gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-2">
          <Row label="Full name" value={applicant.fullName} />
          <Row label="Nationality" value={applicant.nationality} />
          <Row label="Passport no." value={applicant.passportNumber} />
          <Row label="Email" value={applicant.email} />
          <Row label="Phone" value={applicant.phone} />
          <Row
            label="Permit class"
            value={
              applicant.permitClass === "class-g"
                ? "Class G — Investor"
                : applicant.permitClass === "class-d"
                  ? "Class D — Employee"
                  : applicant.permitClass === "special-pass"
                    ? "Special Pass"
                    : "—"
            }
          />
          <Row
            label="Application type"
            value={applicant.isRenewal ? "Renewal" : "First application"}
          />
        </dl>
      </section>

      <div className="divider-gold" aria-hidden="true" />

      <section className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-100/50 dark:border-deep-800 dark:bg-deep-950/40">
        <div className="border-b border-cream-300 px-5 py-3 dark:border-deep-800">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-deep-500 dark:text-cream-500">
            Documents
          </h3>
        </div>
        {uploadedSlots.length === 0 ? (
          <p className="px-5 py-6 text-sm text-deep-500 dark:text-cream-500">
            No documents uploaded.
          </p>
        ) : (
          <ul className="space-y-3 px-5 py-4">
            {uploadedSlots.map(([slotId, files]) => {
              const slot = SLOT_LOOKUP[slotId];
              return (
                <li key={slotId}>
                  <p className="text-sm font-medium text-deep-800 dark:text-cream-100">
                    {slot?.label ?? slotId}
                  </p>
                  <ul className="mt-1 ml-4 list-disc text-xs text-deep-600 dark:text-cream-400">
                    {files.map((f) => (
                      <li key={f.id}>
                        {f.name}{" "}
                        <span className="text-deep-500 dark:text-cream-500">
                          ({Math.ceil(f.size / 1024)} KB)
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-4 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-200">
        Ready? Click{" "}
        <strong className="font-semibold">Submit application</strong> below to
        send it for perusal. You can also save it as a draft and return later.
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-deep-500 dark:text-cream-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-deep-800 dark:text-cream-100">
        {value || "—"}
      </dd>
    </div>
  );
}