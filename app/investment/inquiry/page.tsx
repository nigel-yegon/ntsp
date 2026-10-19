// app/investment/inquiry/page.tsx
import type { Metadata } from "next";
import FadeIn from "@/app/components/fade-in";
import { InvestorInquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Investor inquiry — NTSP",
  description:
    "Get in touch about tourism investment opportunities in Kenya. Tell us about your background and interests, and the authority will follow up.",
};

export default function InvestorInquiryPage() {
  return (
    <main className="min-h-screen bg-cream-200 dark:bg-deep-950">
      <section className="hero-band border-b border-cream-300/60 dark:border-deep-800">
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Investment
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-deep-900 dark:text-cream-100 sm:text-4xl">
            Investor inquiry
          </h1>
          <div className="divider-gold mt-5 w-24" />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-deep-600 dark:text-cream-300 sm:text-base">
            Tell us about your investment background and areas of interest. The
            authority will review your inquiry and get back to you with
            opportunities that match your focus.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn whenVisible>
          <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 shadow-sm dark:border-deep-800 dark:bg-deep-900 sm:p-8">
            <InvestorInquiryForm />
          </div>
        </FadeIn>
      </div>
    </main>
  );
}