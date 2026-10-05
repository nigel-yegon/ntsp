import { prisma } from "@/lib/prisma";
import { EventsGrid } from "./events-grid";

export const metadata = {
  title: "Events — NTSP",
  description: "Festivals, expos, and seasonal highlights across Kenya.",
};

export const revalidate = 300;

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: [{ featured: "desc" }, { startDate: "asc" }],
  });

  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            What&apos;s on
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Events
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            Festivals, travel expos, and seasonal wildlife spectacles across Kenya.
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {events.length === 0 ? (
          <p className="text-deep-500 dark:text-cream-500">
            No events yet. Run the seed script.
          </p>
        ) : (
          <EventsGrid events={events} />
        )}
      </div>
    </div>
  );
}