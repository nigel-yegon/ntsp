import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const event = await prisma.event.findFirst({ where: { slug } });
  return { title: event ? `${event.name} — NTSP` : "Event not found — NTSP" };
}

export default async function EventPage({ params }: { params: Params }) {
  const { slug } = await params;

  const event = await prisma.event.findFirst({ where: { slug } });
  if (!event) notFound();

  const isPast = (event.endDate ?? event.startDate) < new Date();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/events"
        className="text-sm text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        ← All events
      </Link>

      <header className="mt-6 mb-8">
        {event.featured && (
          <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            Featured
          </span>
        )}
        <h1 className="mt-3 text-3xl font-bold">{event.name}</h1>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">Dates</dt>
            <dd className="mt-0.5 font-medium">
              {formatDateRange(event.startDate, event.endDate)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">Location</dt>
            <dd className="mt-0.5 font-medium">{event.location}</dd>
          </div>
        </dl>

        {isPast && (
          <p className="mt-4 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            This event has already taken place.
          </p>
        )}
      </header>

      <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        {event.description}
      </p>

      <div className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-800">
        <Link
          href="/events"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Browse more events →
        </Link>
      </div>
    </article>
  );
}

function formatDateRange(start: Date, end: Date | null) {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const s = start.toLocaleDateString("en-KE", opts);
  if (!end) return s;
  const e = end.toLocaleDateString("en-KE", opts);
  return s === e ? s : `${s} – ${e}`;
}