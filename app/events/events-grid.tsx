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
  { key: "all",            label: "All dates"       },
  { key: "upcoming",       label: "Upcoming"        },
  { key: "this-month",     label: "This month"      },
  { key: "next-3-months",  label: "Next 3 months"   },
  { key: "past",           label: "Past"            },
];

export function EventsGrid({ events }: { events: Event[] }) {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("upcoming");

  const now = new Date();
  // Compare by day, not timestamp — an event ending today is still "upcoming"
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const threeMonthsOut = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = events.filter((e) => {
      // Date filter
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
          // Overlaps the current calendar month
          if (eventEnd < now || eventStart > monthEnd) return false;
          break;
        case "next-3-months":
          if (eventEnd < now || eventStart > threeMonthsOut) return false;
          break;
        case "all":
        default:
          break;
      }

      // Search filter
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    });

    // Sort: upcoming ascending, past descending
    const sorted = [...list];
    if (dateFilter === "past") {
      sorted.sort(
        (a, b) =>
          (b.endDate ?? b.startDate).getTime() -
          (a.endDate ?? a.startDate).getTime(),
      );
    } else {
      sorted.sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime(),
      );
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
      {/* ─── Controls ──────────────────────────────────────── */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div className="relative">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            🔍
          </span>
          <input
            id="event-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, location, or keyword…"
            className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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
          <p className="text-xs text-gray-500">
            {hasFilters
              ? `${filtered.length} of ${events.length} events`
              : `${events.length} events`}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* ─── Results ───────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No events match your filters.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
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
              className="group flex flex-col rounded-lg border border-gray-200 p-5 transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:hover:border-brand-500 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {e.name}
                  </h3>
                  {e.featured && (
                    <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                  {formatDateRange(e.startDate, e.endDate)} · 📍 {e.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Pill ────────────────────────────────────────────────────
type PillProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function Pill({ label, active, onClick }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Date helper ─────────────────────────────────────────────
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