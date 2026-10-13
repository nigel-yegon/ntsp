// app/admin/businesses/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BusinessVerificationBadge } from "@/app/components/dashboard/business-verification-badge";
//import { BusinessApprovalPanel } from "./business-approval-panel";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "APPROVED", "SUSPENDED", "REJECTED"] as const;
type Status = (typeof STATUSES)[number];

export default async function AdminBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status: Status | "ALL" = STATUSES.includes(rawStatus as Status)
    ? (rawStatus as Status)
    : "ALL";

  const businesses = await prisma.businessProfile.findMany({
    where: status === "ALL" ? {} : { verificationStatus: status },
    orderBy: [{ verificationStatus: "asc" }, { createdAt: "desc" }],
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          _count: {
            select: {
              ownedAccommodations: true,
              ownedTourPackages: true,
            },
          },
        },
      },
    },
  });

  return (
    <section>
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
            Businesses
          </h2>
          <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
            {businesses.length}{" "}
            {businesses.length === 1 ? "business" : "businesses"}
            {status !== "ALL" ? ` · filtered by ${status}` : ""}
          </p>
        </div>
        <nav className="flex flex-wrap gap-1">
          <FilterLink active={status === "ALL"} href="/admin/businesses">
            All
          </FilterLink>
          {STATUSES.map((s) => (
            <FilterLink
              key={s}
              active={status === s}
              href={`/admin/businesses?status=${s}`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </FilterLink>
          ))}
        </nav>
      </header>

      {businesses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-10 text-center text-sm text-deep-500 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-400">
          No businesses match this filter.
        </p>
      ) : (
        <ul className="space-y-3">
          {businesses.map((b) => {
            const listingCount =
              b.user._count.ownedAccommodations +
              b.user._count.ownedTourPackages;
            return (
              <li
                key={b.id}
                className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium text-deep-800 dark:text-cream-100">
                      {b.businessName}
                    </h3>
                    <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                      {b.contactEmail}
                      {b.contactPhone ? ` · ${b.contactPhone}` : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                      Registered by {b.user.name} ({b.user.email}) ·{" "}
                      {listingCount}{" "}
                      {listingCount === 1 ? "listing" : "listings"}
                    </p>
                  </div>
                  <BusinessVerificationBadge status={b.verificationStatus} />
                </div>

                {b.description && (
                  <p className="mt-3 text-sm text-deep-600 dark:text-cream-300">
                    {b.description}
                  </p>
                )}

                {(b.registrationNo || b.kraPin || b.website) && (
                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                    {b.registrationNo && (
                      <KV label="Reg. no." value={b.registrationNo} />
                    )}
                    {b.kraPin && <KV label="KRA PIN" value={b.kraPin} />}
                    {b.website && (
                      <KV
                        label="Website"
                        value={
                          <a
                            href={b.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-600 underline underline-offset-2 dark:text-brand-400"
                          >
                            {b.website}
                          </a>
                        }
                      />
                    )}
                  </dl>
                )}

                {b.rejectionReason && (
                  <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                    Rejection reason: {b.rejectionReason}
                  </p>
                )}

                
                 
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
        active
          ? "bg-brand-400 text-deep-800"
          : "text-deep-600 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-800"
      }`}
    >
      {children}
    </Link>
  );
}

function KV({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-deep-500 dark:text-cream-400">{label}:</dt>
      <dd className="text-deep-800 dark:text-cream-100">{value}</dd>
    </div>
  );
}