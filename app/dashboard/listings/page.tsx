// app/dashboard/listings/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BusinessVerificationBadge } from "@/app/components/dashboard/business-verification-badge";
import { UnpublishButton } from "./unpublish-button";

export const dynamic = "force-dynamic";

export default async function BusinessListingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "BUSINESS") return null;

  const [profile, accommodations, packages] = await Promise.all([
    prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
      select: { businessName: true, verificationStatus: true },
    }),
    prisma.accommodation.findMany({
      where: { businessId: session.user.id },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        published: true,
        _count: { select: { bookings: true, threads: true } },
      },
    }),
    prisma.tourPackage.findMany({
      where: { businessId: session.user.id },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        priceKes: true,
        published: true,
        _count: { select: { bookings: true, threads: true } },
      },
    }),
  ]);

  const verification = profile?.verificationStatus ?? "PENDING";
  const isApproved = verification === "APPROVED";

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
            Listings
          </h2>
          <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
            {profile?.businessName ?? "Your business"}'s accommodations and
            packages. Inquiries and bookings route here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BusinessVerificationBadge status={verification} />
          <Link
            href="/dashboard/listings/new"
            className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-medium text-deep-800 transition hover:bg-brand-500"
          >
            Add listing
          </Link>
        </div>
      </header>

      {verification === "PENDING" && (
        <p className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800 dark:border-brand-900 dark:bg-brand-950/30 dark:text-brand-200">
          Your account is awaiting approval. You can create listings now, but
          they stay hidden from the public site until an administrator approves
          your profile. The Publish toggle will have no effect until then.
        </p>
      )}

      {verification === "SUSPENDED" && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          Your account is suspended. Contact the administrator to restore
          access. Listings are hidden from the public site.
        </p>
      )}

      <ListSection
        title="Accommodations"
        emptyMessage="You don't own any accommodations yet."
        items={accommodations.map((a) => ({
          key: `acc-${a.id}`,
          title: a.name,
          subtitle: a.location,
          publicHref: `/stay/${a.slug}`,
          editHref: `/dashboard/listings/acc-${a.id}/edit`,
          published: a.published,
          bookingCount: a._count.bookings,
          threadCount: a._count.threads,
          rawId: a.id,
          rawType: "accommodation" as const,
        }))}
      />

      <ListSection
        title="Tour packages"
        emptyMessage="You don't own any tour packages yet."
        items={packages.map((p) => ({
          key: `pkg-${p.id}`,
          title: p.title,
          subtitle: `KES ${p.priceKes.toLocaleString()}`,
          publicHref: `/packages/${p.slug}`,
          editHref: `/dashboard/listings/pkg-${p.id}/edit`,
          published: p.published,
          bookingCount: p._count.bookings,
          threadCount: p._count.threads,
          rawId: p.id,
          rawType: "package" as const,
        }))}
      />
    </section>
  );
}

type ListingItem = {
  key: string;
  title: string;
  subtitle: string;
  publicHref: string;
  editHref: string;
  published: boolean;
  bookingCount: number;
  threadCount: number;
  rawId: number;
  rawType: "accommodation" | "package";
};

function ListSection({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: ListingItem[];
  emptyMessage: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-cream-300 bg-cream-50 p-4 text-sm text-deep-500 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-400">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.key}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cream-300 bg-cream-50 p-4 dark:border-deep-700 dark:bg-deep-900"
            >
              <div className="min-w-0">
                <p className="font-medium text-deep-800 dark:text-cream-100">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                  {item.subtitle}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-deep-500 dark:text-cream-400">
                  <span>
                    {item.bookingCount}{" "}
                    {item.bookingCount === 1 ? "booking" : "bookings"}
                  </span>
                  <span>
                    {item.threadCount}{" "}
                    {item.threadCount === 1 ? "inquiry" : "inquiries"}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      item.published
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-cream-200 text-deep-600 dark:bg-deep-800 dark:text-cream-400"
                    }`}
                  >
                    {item.published ? "Published" : "Unpublished"}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={item.publicHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-cream-300 px-3 py-1.5 text-xs font-medium text-deep-700 transition hover:bg-cream-100 dark:border-deep-700 dark:text-cream-300 dark:hover:bg-deep-800"
                >
                  View
                </Link>
                <Link
                  href={item.editHref}
                  className="rounded-lg border border-brand-300 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300"
                >
                  Edit
                </Link>
                {item.published && (
                  <UnpublishButton
                    listingId={item.rawId}
                    type={item.rawType}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}