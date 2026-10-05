import { prisma } from "@/lib/prisma";
import { DestinationsGrid } from "../destinations/destination-grid";

export const metadata = {
  title: "Destinations — NTSP",
  description: "Explore Kenya's counties, parks, and cities.",
};

export const revalidate = 300;

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Explore Kenya
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Destinations
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            From the Maasai Mara to Diani Beach — discover where to go in Kenya.
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {destinations.length === 0 ? (
          <p className="text-deep-500 dark:text-cream-500">
            No destinations yet. Run the seed script.
          </p>
        ) : (
          <DestinationsGrid destinations={destinations} />
        )}
      </div>
    </div>
  );
}