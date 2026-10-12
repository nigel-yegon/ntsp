// app/components/review/stage-list.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "./status-badge";
import type { ApplicationStatus } from "../../../lib/db-types";

export async function StageList({
  statuses,
  basePath,
  title,
  subtitle,
  emptyMessage,
}: {
  statuses: ApplicationStatus[];
  basePath: string;
  title: string;
  subtitle: string;
  emptyMessage: string;
}) {
  const applications = await prisma.application.findMany({
    where: { status: { in: statuses } },
    orderBy: { submittedAt: "asc" },
    include: { company: true },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
          {title}
        </h1>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          {subtitle}
        </p>
      </header>

      {applications.length === 0 ? (
        <p className="text-sm text-deep-500 dark:text-cream-400">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li key={app.id}>
              <Link
                href={`${basePath}/${app.id}`}
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