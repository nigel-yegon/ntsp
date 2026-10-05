import { prisma } from "@/lib/prisma";
import { ExperiencesGrid } from "./experiences-grid";

export const metadata = {
  title: "Experiences — NTSP",
  description: "Wildlife, culture, beach, and adventure experiences across Kenya.",
};

export const revalidate = 300;

export default async function ExperiencesPage() {
  const attractions = await prisma.attraction.findMany({
    include: { destination: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  // Unique categories, alphabetically sorted
  const categories = Array.from(
    new Set(attractions.map((a) => a.category)),
  ).sort();

  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Things to see &amp; do
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Experiences
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            From the Great Migration to coral reef snorkeling — find what you came for.
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {attractions.length === 0 ? (
          <p className="text-deep-500 dark:text-cream-500">
            No experiences yet. Run the seed script.
          </p>
        ) : (
          <ExperiencesGrid attractions={attractions} categories={categories} />
        )}
      </div>
    </div>
  );
}