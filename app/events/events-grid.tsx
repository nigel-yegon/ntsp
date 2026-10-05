"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Event = {
  id: number;
  name: string;
  slug: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  featured: boolean;
};

type DateFilter = "all" | "upcoming" | "this-month" | "next-3-months" | "past";

const DATE_FILTERS: { key: DateFilter; label: string }[] = [
  { key: "all",           label: "All dates"      },
  { key: "upcoming",      label: "Upcoming"       },
  { key: "this-month",    label: "This month"     },
  { key: "next-3-months", label: "Next 3 months"  },
  { key: "past",          label: "Past"           },
];

export function EventsGrid({ events }: { events: Event[] }) {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("upcoming");

  const now = new Date();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );
  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );
  const threeMonthsOut = new Date(
    now.getFullYear(),
    now.getMonth() + 3,
    now.getDate(),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = events.filter((e) => {
      const eventEnd = e.endDate ?? e.startDate;
      const eventStart = e.startDate;

      switch (dateFilter) {
        case "upcoming":
          if (eventEnd < now) return false;
          break;
        case "past":
          if (eventEnd >= now) return false;
          break;
        case "this-month":
          if (eventEnd < now || eventStart > monthEnd) return false;
          break;
        case "next-3-months":
          if (eventEnd < now || eventStart > threeMonthsOut) return false;
          break;
        case "all":
        default:
          break;
      }

      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    });

    const sorted = [...list];
    if (dateFilter === "past") {
      sorted.sort(
        (a, b) =>
          (b.endDate ?? b.startDate).getTime() -
          (a.endDate ?? a.startDate).getTime(),
      );
    } else {
      sorted.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }
    return sorted;
  }, [query, dateFilter, events, now, monthEnd, threeMonthsOut]);

  const hasFilters = query !== "" || dateFilter !== "upcoming";

  function reset() {
    setQuery("");
    setDateFilter("upcoming");
  }

  return (
    <>
      {/* ─── Controls ─────────────────────────────────────── */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div className="relative">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-deep-400 dark:text-cream-500"
          >
            🔍
          </span>
          <input
            id="event-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, location, or keyword…"
            className="w-full rounded-md border border-deep-200 bg-cream-50 py-2.5 pl-10 pr-10 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-500 focus:bg-cream-100 focus:ring-2 focus:ring-brand-500/20 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:border-brand-500 dark:focus:bg-deep-900"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-3 flex items-center text-deep-400 transition hover:text-deep-700 dark:text-cream-500 dark:hover:text-cream-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Date pills */}
        <div className="flex flex-wrap gap-2">
          {DATE_FILTERS.map((f) => (
            <Pill
              key={f.key}
              label={f.label}
              active={dateFilter === f.key}
              onClick={() => setDateFilter(f.key)}
            />
          ))}
        </div>

        {/* Result count + reset */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-deep-500 dark:text-cream-500">
            {hasFilters
              ? `${filtered.length} of ${events.length} events`
              : `${events.length} events`}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="text-xs font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* ─── Results ───────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-deep-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-sm text-deep-600 dark:text-cream-400">
            No events match your filters.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500 sm:flex-row sm:items-center sm:justify-between"
            >
              <span
                className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-brand-500 transition-transform duration-300 group-hover:scale-y-100"
                aria-hidden
              />

              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {e.name}
                  </h3>
                  {e.featured && (
                    <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs uppercase tracking-wide text-deep-500 dark:text-cream-500">
                  {formatDateRange(e.startDate, e.endDate)} · 📍 {e.location}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                  {e.description}
                </p>
              </div>

              <span className="mt-3 shrink-0 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400 sm:ml-6 sm:mt-0">
                Details →
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── Pill ──────────────────────────────────────────────────── */
function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-deep-300 bg-cream-50 text-deep-700 hover:border-brand-400 hover:text-brand-600 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
      }`}
    >
      {label}
    </button>
  );
}

/* ─── Date helper ───────────────────────────────────────────── */
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