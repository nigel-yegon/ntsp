// app/review/perusal/page.tsx
import Link from "next/link";
import { requireRole } from "@/app/components/review/require-role";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/app/components/review/status-badge";

export default async function PerusalListPage() {
  await requireRole(["VERIFIER", "ADMIN"]);

  const applications = await prisma.application.findMany({
    where: { status: { in: ["SUBMITTED", "UNDER_PERUSAL"] } },
    orderBy: { submittedAt: "asc" },
    include: { company: true },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
          Document perusal
        </h1>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          Applications waiting for initial document review.
        </p>
      </header>

      {applications.length === 0 ? (
        <p className="text-sm text-deep-500 dark:text-cream-400">
          No applications awaiting perusal.
        </p>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li key={app.id}>
              <Link
                href={`/review/perusal/${app.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cream-300 bg-cream-50 p-4 transition hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-deep-800 dark:text-cream-100">
                    {app.applicantName}
                  </p>
                  <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                    {app.referenceNo} · {app.company.name}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}