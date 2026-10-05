"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Destination = {
  id: number;
  name: string;
  slug: string;
  county: string;
  description: string;
  featured: boolean;
};

export function DestinationsGrid({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.county.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q),
    );
  }, [query, destinations]);

  return (
    <>
      {/* Search */}
      <div className="mb-8">
        <label htmlFor="destination-search" className="sr-only">
          Search destinations
        </label>
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-deep-400 dark:text-cream-500"
          >
            🔍
          </span>
          <input
            id="destination-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, county, or keyword…"
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
        <p className="mt-2 text-xs text-deep-500 dark:text-cream-500">
          {query
            ? `${filtered.length} of ${destinations.length} destinations`
            : `${destinations.length} destinations`}
        </p>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-deep-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-sm text-deep-600 dark:text-cream-400">
            No destinations match{" "}
            <span className="font-medium text-deep-800 dark:text-cream-100">
              &ldquo;{query}&rdquo;
            </span>
            .
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-3 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <Link
              key={d.id}
              href={`/destinations/${d.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
            >
              {/* Gold accent strip on hover */}
              <span
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />

              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                  {d.name}
                </h2>
                {d.featured && (
                  <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                    Featured
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs uppercase tracking-wide text-deep-500 dark:text-cream-500">
                {d.county} County
              </p>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                {d.description}
              </p>

              <span className="mt-4 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}