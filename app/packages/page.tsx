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

  const [packages, destinations, operatorProfile] = await Promise.all([
    prisma.tourPackage.findMany({
      where: {
        published: true,
        ...(operator ? { businessId: operator } : {}),
      },
      include: { destination: true },
      orderBy: [{ featured: "desc" }, { priceKes: "asc" }],
    }),
    prisma.destination.findMany({
      where: { packages: { some: {} } },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
    operator
      ? prisma.businessProfile.findUnique({
          where: { userId: operator },
          select: { businessName: true },
        })
      : Promise.resolve(null),
  ]);

  return (
    <div>
      <section className="hero-band relative overflow-hidden border-b border-deep-200 dark:border-deep-800">
        <HeroBackground variant="packages" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            {operator ? "Operator Listings" : "Curated trips"}
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            {operatorProfile?.businessName ?? "Packages"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            {operator
              ? `Packages and itineraries offered by ${operatorProfile?.businessName ?? "this operator"}.`
              : "Curated trips — from a quick day safari to a week-long beach retreat."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {packages.length === 0 ? (
          <p className="text-deep-500 dark:text-cream-500">
            {operator
              ? "This operator hasn't published any packages yet."
              : "No packages yet. Run the seed script."}
          </p>
        ) : (
          <PackagesGrid packages={packages} destinations={destinations} />
        )}
      </div>
    </div>
  );
}