// app/components/review/applicant-card.tsx
import type { Application, Company } from "@/lib/db-types";

type Props = {
  application: Application & { company: Company };
};

const PERMIT_LABELS = {
  CLASS_G: "Class G — Investor",
  CLASS_D: "Class D — Employee",
  SPECIAL_PASS: "Special Pass",
} as const;

export function ApplicantCard({ application }: Props) {
  return (
    <section className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
            {application.applicantName}
          </h2>
          <p className="mt-0.5 text-sm text-deep-500 dark:text-cream-400">
            {PERMIT_LABELS[application.permitClass]} ·{" "}
            {application.applicationType === "RENEWAL"
              ? "Renewal"
              : "First application"}
          </p>
        </div>
        <span className="rounded-lg bg-deep-900/5 px-3 py-1 font-mono text-xs text-deep-600 dark:bg-cream-100/5 dark:text-cream-400">
          {application.referenceNo}
        </span>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <Row label="Nationality" value={application.applicantNationality} />
        <Row label="Passport number" value={application.applicantPassportNo} />
        <Row label="Email" value={application.applicantEmail} />
        <Row label="Phone" value={application.applicantPhone} />
        <Row label="Employer" value={application.company.name} />
        <Row
          label="Company reg. no."
          value={application.company.registrationNo}
        />
      </dl>

      {application.purposeStatement && (
        <div className="mt-5 border-t border-cream-200 pt-4 dark:border-deep-800">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
            Purpose of entry
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-deep-700 dark:text-cream-200">
            {application.purposeStatement}
          </p>
        </div>
      )}
    </section>
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