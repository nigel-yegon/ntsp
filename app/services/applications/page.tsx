// app/services/applications/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/app/components/review/status-badge";
import { ApplicationFiltersBar } from "./filters-bar";
import { Pagination } from "./pagination";
import {
  parseFilters,
  toQueryString,
  PAGE_SIZES,
} from "@/lib/application-filters";

type ApplicationWhereInput = NonNullable<
  NonNullable<Parameters<typeof prisma.application.count>[0]>["where"]
>;

export const dynamic = "force-dynamic";

const PERMIT_LABELS: Record<string, string> = {
  CLASS_G: "Class G — Investor",
  CLASS_D: "Class D — Employee",
  SPECIAL_PASS: "Special Pass",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return null; // middleware handles redirect; belt-and-braces
  }

  const filters = parseFilters(await searchParams);

  // ── Role-based scoping ──────────────────────────────────────
  // Employers see only their own applications. Reviewers, PS, and
  // admins see everything. This is the security boundary — the URL
  // is guessable, so scoping must happen here, not in the UI.
  const scopeWhere: ApplicationWhereInput =
    user.role === "EMPLOYER"
      ? { submittedById: user.id }
      : {};

  // ── Build the where clause from filters ─────────────────────
  const where: ApplicationWhereInput = {
    ...scopeWhere,
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.permitClass ? { permitClass: filters.permitClass } : {}),
    ...(filters.applicationType
      ? { applicationType: filters.applicationType }
      : {}),
    ...(filters.companyId ? { companyId: filters.companyId } : {}),
    ...(filters.from || filters.to
      ? {
          submittedAt: {
            ...(filters.from ? { gte: new Date(filters.from) } : {}),
            ...(filters.to
              ? { lte: new Date(`${filters.to}T23:59:59.999Z`) }
              : {}),
          },
        }
      : {}),
    ...(filters.q
      ? {
          OR: [
            { referenceNo: { contains: filters.q, mode: "insensitive" } },
            { applicantName: { contains: filters.q, mode: "insensitive" } },
            {
              applicantPassportNo: {
                contains: filters.q,
                mode: "insensitive",
              },
            },
            { applicantEmail: { contains: filters.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }],
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
      include: {
        company: { select: { name: true } },
        submittedBy: { select: { name: true, email: true } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
            Applications
          </h1>
          <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
            {user.role === "EMPLOYER"
              ? "Your submitted and draft applications."
              : "All applications across every company."}
          </p>
        </div>
        {user.role === "EMPLOYER" && (
          <Link
            href="/services/expatriate"
            className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-medium text-deep-800 transition hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            Start a new application
          </Link>
        )}
      </header>

      <ApplicationFiltersBar filters={filters} />

      <p className="mb-3 mt-6 text-sm text-deep-500 dark:text-cream-400">
        {total} {total === 1 ? "application" : "applications"}
        {filters.pageSize !== 25 || filters.page > 1
          ? ` · showing ${(filters.page - 1) * filters.pageSize + 1}–${Math.min(
              filters.page * filters.pageSize,
              total
            )}`
          : ""}
      </p>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-sm text-deep-500 dark:text-cream-400">
            No applications match your filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-cream-300 dark:border-deep-700">
          <table className="min-w-full divide-y divide-cream-200 dark:divide-deep-800">
            <thead className="bg-cream-100 dark:bg-deep-900">
              <tr>
                <Th>Reference</Th>
                <Th>Applicant</Th>
                <Th>Permit</Th>
                <Th>Type</Th>
                {user.role !== "EMPLOYER" && <Th>Company</Th>}
                <Th>Status</Th>
                <Th>Submitted</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 bg-cream-50 dark:divide-deep-800 dark:bg-deep-950">
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="transition hover:bg-cream-100 dark:hover:bg-deep-900"
                >
                  <Td>
                    <Link
                      href={
                        user.role === "EMPLOYER"
                          ? `/services/expatriate/${app.id}`
                          : `/review/perusal/${app.id}`
                      }
                      className="font-mono text-xs text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
                    >
                      {app.referenceNo}
                    </Link>
                  </Td>
                  <Td>
                    <span className="text-deep-800 dark:text-cream-100">
                      {app.applicantName}
                    </span>
                    <span className="block text-xs text-deep-500 dark:text-cream-400">
                      {app.applicantNationality}
                    </span>
                  </Td>
                  <Td>{PERMIT_LABELS[app.permitClass] ?? app.permitClass}</Td>
                  <Td>
                    {app.applicationType === "RENEWAL" ? "Renewal" : "First"}
                  </Td>
                  {user.role !== "EMPLOYER" && (
                    <Td>
                      <span className="text-deep-700 dark:text-cream-200">
                        {app.company.name}
                      </span>
                    </Td>
                  )}
                  <Td>
                    <StatusBadge status={app.status} />
                  </Td>
                  <Td>
                    <span className="text-xs text-deep-500 dark:text-cream-400">
                      {app.submittedAt
                        ? app.submittedAt.toLocaleDateString()
                        : "—"}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={filters.page}
        pageSize={filters.pageSize}
        total={total}
        totalPages={totalPages}
        currentFilters={filters}
      />
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-deep-500 dark:text-cream-400">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="whitespace-nowrap px-4 py-3 text-sm">{children}</td>
  );
}