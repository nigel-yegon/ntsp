// app/services/expatriate/page.tsx
import { ExpatriateFormProvider } from "@/app/components/expatriate/form-context";
import { ExpatriateForm } from "@/app/components/expatriate/expatriate-form";

export const metadata = {
  title: "Expatriate Vetting & Work Permits — NTSP",
  description:
    "Apply for a work permit, special pass, or renewal. Upload required documents step by step.",
};

export default function ExpatriatePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-deep-800 dark:text-cream-100">
          Expatriate Vetting & Work Permits
        </h1>
        <p className="mt-2 text-deep-500 dark:text-cream-400">
          Complete the steps below to submit your application. Your progress
          is saved in this browser session.
        </p>
      </header>
      <ExpatriateFormProvider>
        <ExpatriateForm />
      </ExpatriateFormProvider>
    </main>
  );
}