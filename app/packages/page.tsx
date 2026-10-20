// app/packages/page.tsx
import { prisma } from "@/lib/prisma";
import { HeroBackground } from "@/app/components/hero-background";
import { PackagesGrid } from "./packages-grid";

export const metadata = {
  title: "Packages — NTSP",
  description: "Curated safari and beach packages across Kenya.",
};

export const revalidate = 300;

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ operator?: string }>;
}) {
  const { operator } = await searchParams;

  // If an operator filter is set, resolve the operator by user ID.
  // Fall back to matching by businessName or slug if needed.
  const operatorProfile = operator
    ? await prisma.businessProfile.findFirst({
        where: {
          OR: [
            { userId: operator },
            { id: operator },
            { businessName: { equals: operator, mode: "insensitive" } },
          ],
        },
        select: { userId: true, businessName: true },
      })
    : null;

  const resolvedUserId = operatorProfile?.userId ?? operator ?? null;

  const [packages, destinations] = await Promise.all([
    prisma.tourPackage.findMany({
      where: {
        published: true,
        ...(resolvedUserId ? { businessId: resolvedUserId } : {}),
      },
      include: {
        destination: { select: { name: true, slug: true, county: true } },
      },
      orderBy: [{ featured: "desc" }, { priceKes: "asc" }],
    }),
    prisma.destination.findMany({
      where: { packages: { some: { published: true } } },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  const heading = operator
    ? operatorProfile?.businessName ?? "Operator packages"
    : "Packages";

  return (
    <div>
      <section className="hero-band relative overflow-hidden border-b border-deep-200 dark:border-deep-800">
        <HeroBackground variant="packages" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            {operator ? "Operator Listings" : "Curated trips"}
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            {heading}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            {operator
              ? `Packages and itineraries offered by ${heading}.`
              : "Curated trips — from a quick day safari to a week-long beach retreat."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {packages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-deep-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
            <p className="text-sm text-deep-600 dark:text-cream-400">
              {operator
                ? `${heading} hasn't published any packages yet.`
                : "No packages available at the moment."}
            </p>
            {operator && (
              <a
                href="/packages"
                className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                Browse all packages →
              </a>
            )}
          </div>
        ) : (
          <PackagesGrid packages={packages} destinations={destinations} />
        )}
      </div>
    </div>
  );
}