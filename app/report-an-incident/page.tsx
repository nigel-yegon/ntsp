// app/report-an-incident/page.tsx
import type { Metadata } from "next";
import IncidentForm from "./incident-form";

export const metadata: Metadata = {
  title: "Report an incident",
  description:
    "Report a wildlife, safety, operator, facility, or guide-related incident to the tourism authority. Anonymous submissions are accepted.",
};

export default function ReportAnIncidentPage() {
  return (
    <main className="min-h-screen bg-cream-200 text-deep-800 dark:bg-deep-950 dark:text-cream-200">
      {/* Hero band — matches other public pages */}
      <section className="hero-band border-b border-cream-300/60 dark:border-deep-800">
        <div className="mx-auto max-w-3xl px-4 pt-16 pb-10 sm:pt-20 sm:pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Tourism Authority
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-deep-900 dark:text-cream-100 sm:text-4xl">
            Report an incident
          </h1>
          <div className="divider-gold mt-5 w-24" />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-deep-600 dark:text-cream-300">
            Use this form to report a wildlife, safety, operator, facility, or
            guide-related incident. You may submit anonymously. If you provide
            contact details, the authority may follow up for clarification.
            You will receive a reference number to track your report.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-deep-500 dark:text-cream-400">
            If this is an emergency, contact local emergency services first.
          </p>
        </div>
      </section>

      {/* Form body — sits on the cream canvas, panel is a lighter card */}
      <section className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <div className="rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-sm sm:p-8 dark:border-deep-800 dark:bg-deep-900">
          <IncidentForm />
        </div>
      </section>
    </main>
  );
}