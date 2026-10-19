// app/events/page.tsx
import { prisma } from "@/lib/prisma";
import { EventsGrid } from "./events-grid";

export default async function EventsPage() {
  // 1. Ensure lat/lng are included in the SELECT
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      location: true,
      startDate: true,
      endDate: true,
      featured: true,
      latitude: true,  // <--- CRITICAL
      longitude: true, // <--- CRITICAL
      imageUrl: true,
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-deep-800 dark:text-cream-100">
          Events in Kenya
        </h1>
        <p className="mt-2 text-lg text-deep-600 dark:text-cream-400">
          Discover festivals, expos, and cultural gatherings across the country.
        </p>
      </div>

      <EventsGrid events={events} />
    </div>
  );
}