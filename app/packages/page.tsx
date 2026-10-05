import { prisma } from "@/lib/prisma";
import { PackagesGrid } from "./packages-grid";

export const metadata = {
  title: "Packages — NTSP",
  description: "Curated safari and beach packages across Kenya.",
};

export const revalidate = 300;

export default async function PackagesPage() {
  const [packages, destinations] = await Promise.all([
    prisma.tourPackage.findMany({
      include: { destination: true },
      orderBy: [{ featured: "desc" }, { priceKes: "asc" }],
    }),
    prisma.destination.findMany({
      where: { packages: { some: {} } },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Curated trips
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Packages
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            Curated trips — from a quick day safari to a week-long beach retreat.
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {packages.length === 0 ? (
          <p className="text-deep-500 dark:text-cream-500">
            No packages yet. Run the seed script.
          </p>
        ) : (
          <PackagesGrid packages={packages} destinations={destinations} />
        )}
      </div>
    </div>
  );
}