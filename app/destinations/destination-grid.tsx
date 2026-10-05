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

export function DestinationsGrid({ destinations }: { destinations: Destination[] }) {
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
      {/* Search input */}
      <div className="mb-8">
        <label htmlFor="destination-search" className="sr-only">
          Search destinations
        </label>
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            🔍
          </span>
          <input
            id="destination-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, county, or keyword…"
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

        {/* Result count */}
        <p className="mt-2 text-xs text-gray-500">
          {query
            ? `${filtered.length} of ${destinations.length} destinations`
            : `${destinations.length} destinations`}
        </p>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No destinations match <span className="font-medium">“{query}”</span>.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-3 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
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
              className="group rounded-lg border border-gray-200 p-5 transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:hover:border-brand-500"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {d.name}
                </h2>
                {d.featured && (
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500">
                {d.county} County
              </p>
              <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                {d.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}