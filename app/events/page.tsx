import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Events — NTSP",
  description: "Festivals, expos, and seasonal highlights across Kenya.",
};

export const revalidate = 300;

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: [{ featured: "desc" }, { startDate: "asc" }],
  });

  const now = new Date();
  const upcoming = events.filter((e) => (e.endDate ?? e.startDate) >= now);
  const past = events.filter((e) => (e.endDate ?? e.startDate) < now);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Festivals, travel expos, and seasonal wildlife spectacles across Kenya.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Upcoming</h2>

        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming events scheduled.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-500">Past Events</h2>
          <div className="grid gap-6 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

type EventCardProps = {
  event: {
    slug: string;
    name: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date | null;
    featured: boolean;
  };
};

function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col rounded-lg border border-gray-200 p-5 transition hover:border-emerald-500 hover:shadow-md dark:border-gray-800 dark:hover:border-emerald-500"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          {event.name}
        </h3>
        {event.featured && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            Featured
          </span>
        )}
      </div>

      <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">
        {formatDateRange(event.startDate, event.endDate)}
      </p>
      <p className="mt-1 text-xs text-gray-500">📍 {event.location}</p>

      <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
        {event.description}
      </p>
    </Link>
  );
}

function formatDateRange(start: Date, end: Date | null) {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const s = start.toLocaleDateString("en-KE", opts);
  if (!end) return s;
  const e = end.toLocaleDateString("en-KE", opts);
  return s === e ? s : `${s} – ${e}`;
}