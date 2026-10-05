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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Festivals, travel expos, and seasonal wildlife spectacles across Kenya.
        </p>
      </header>

      {events.length === 0 ? (
        <p className="text-gray-500">No events yet. Run the seed script.</p>
      ) : (
        <EventsGrid events={events} />
      )}
    </div>
  );
}
