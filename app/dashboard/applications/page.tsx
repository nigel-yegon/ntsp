// app/dashboard/applications/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/app/components/review/status-badge";

export const dynamic = "force-dynamic";

const PERMIT_LABELS: Record<string, string> = {
  CLASS_G: "Class G — Investor",
  CLASS_D: "Class D — Employee",
  SPECIAL_PASS: "Special Pass",
};

export default async function CustomerApplicationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const applications = await prisma.application.findMany({
    where: { applicantEmail: session.user.email },
    orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }],
    include: {
      company: { select: { name: true } },
    },
  });

  return (
    <section>
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
          Applications
        </h2>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          Work permit applications submitted on your behalf, matched by email
          address{" "}
          <span className="font-mono text-deep-700 dark:text-cream-200">
            {session.user.email}
          </span>
          .
        </p>
      </header>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-sm text-deep-500 dark:text-cream-400">
            No applications found with your email address. If an employer is
            filing one on your behalf, ask them to use{" "}
            <span className="font-mono">{session.user.email}</span> as your
            contact email.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {applications.map((app) => (
            <li
              key={app.id}
              className="rounded-xl border border-cream-300 bg-cream-50 p-4 dark:border-deep-700 dark:bg-deep-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-deep-500 dark:text-cream-400">
                    {app.referenceNo}
                  </p>
                  <p className="mt-1 font-medium text-deep-800 dark:text-cream-100">
                    {PERMIT_LABELS[app.permitClass] ?? app.permitClass}
                    {app.applicationType === "RENEWAL" ? " · Renewal" : " · First application"}
                  </p>
                  <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                    Filed by {app.company.name}
                    {app.submittedAt
                      ? ` · submitted ${app.submittedAt.toLocaleDateString()}`
                      : " · draft"}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}