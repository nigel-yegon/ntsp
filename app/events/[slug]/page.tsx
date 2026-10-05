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
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-16">
          <Link
            href="/events"
            className="text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            ← All events
          </Link>

          <div className="mt-6 flex items-center gap-3">
            {event.featured && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                Featured
              </span>
            )}
            {isPast && (
              <span className="rounded-full bg-deep-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-deep-700 dark:bg-deep-800 dark:text-cream-300">
                Past event
              </span>
            )}
          </div>

          <h1 className="mt-3 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            {event.name}
          </h1>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
                Dates
              </dt>
              <dd className="mt-1 font-medium text-deep-800 dark:text-cream-100">
                {formatDateRange(event.startDate, event.endDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
                Location
              </dt>
              <dd className="mt-1 font-medium text-deep-800 dark:text-cream-100">
                {event.location}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <article className="mx-auto max-w-4xl px-4 py-12">
        {isPast && (
          <div className="mb-8 rounded-lg border border-deep-200 bg-cream-100 p-4 text-sm text-deep-600 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-400">
            This event has already taken place.
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-deep-700 dark:text-cream-300">
            {event.description}
          </p>
        </div>

        <div className="mt-12 border-t border-deep-200 pt-6 dark:border-deep-800">
          <Link
            href="/events"
            className="text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Browse more events →
          </Link>
        </div>
      </article>
    </div>
  );
}

/* ─── Date helper ───────────────────────────────────────────── */
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