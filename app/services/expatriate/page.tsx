// app/services/expatriate/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ExpatriateFormProvider } from "@/app/components/expatriate/form-context";
import { ExpatriateForm } from "@/app/components/expatriate/expatriate-form";

export default async function ExpatriatePage() {
  const session = await getServerSession(authOptions);
  const drafts = session?.user
    ? await prisma.application.findMany({
        where: { submittedById: session.user.id, status: "DRAFT" },
        orderBy: { updatedAt: "desc" },
        take: 5,
      })
    : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-deep-800 dark:text-cream-100">
          Expatriate Vetting & Work Permits
        </h1>
        <p className="mt-2 text-deep-500 dark:text-cream-400">
          Submit a new application or continue a draft.
        </p>
      </header>

      {drafts.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
            Drafts
          </h2>
          <ul className="space-y-2">
            {drafts.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/services/expatriate/${d.id}`}
                  className="flex items-center justify-between rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 text-sm transition hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900"
                >
                  <span className="text-deep-800 dark:text-cream-100">
                    {d.referenceNo} — {d.applicantName}
                  </span>
                  <span className="text-deep-500 dark:text-cream-400">
                    Updated {d.updatedAt.toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ExpatriateFormProvider>
        <ExpatriateForm />
      </ExpatriateFormProvider>
    </main>
  );
}