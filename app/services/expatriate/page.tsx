// app/services/expatriate/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
      <header className="hero-band -mx-4 mb-10 rounded-3xl px-6 py-10 sm:-mx-6 lg:-mx-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 dark:text-brand-400">
          Services / Expatriate
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-deep-800 dark:text-cream-100 sm:text-4xl">
          Expatriate Vetting &amp; Work Permits
        </h1>
        <div className="divider-gold mt-4" aria-hidden="true" />
        <p className="mt-4 max-w-2xl text-deep-600 dark:text-cream-400">
          Submit a new application or continue a draft. Applications are
          reviewed by perusal, verification, and the committee before being
          forwarded to the Ministry of Interior.
        </p>
      </header>

      {drafts.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-deep-500 dark:text-cream-500">
            Drafts
          </h2>
          <ul className="space-y-2">
            {drafts.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/services/expatriate/${d.id}`}
                  className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm transition hover:border-brand-400 hover:shadow-sm dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-semibold text-brand-700 dark:text-brand-400">
                      {d.referenceNo}
                    </p>
                    <p className="truncate text-sm text-deep-800 dark:text-cream-100">
                      {d.applicantName || "Untitled draft"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-deep-500 dark:text-cream-500">
                    <span>Updated {d.updatedAt.toLocaleDateString()}</span>
                    <span
                      aria-hidden="true"
                      className="transition group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </div>
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