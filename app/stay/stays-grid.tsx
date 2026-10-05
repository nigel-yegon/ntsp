"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Stay = {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  location: string;
  priceRange: string | null;
  destination: { name: string; slug: string };
};

type Props = {
  stays: Stay[];
  types: string[];
  destinations: { name: string; slug: string }[];
};

export function StaysGrid({ stays, types, destinations }: Props) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeDestination, setActiveDestination] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return stays.filter((s) => {
      if (activeType && s.type !== activeType) return false;
      if (activeDestination && s.destination.slug !== activeDestination) return false;

      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.destination.name.toLowerCase().includes(q)
      );
    });
  }, [query, activeType, activeDestination, stays]);

  // Group filtered results by type, preserving type order from props
  const grouped = useMemo(() => {
    return types
      .map((type) => ({
        type,
        items: filtered.filter((s) => s.type === type),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered, types]);

  const hasFilters =
    query !== "" || activeType !== null || activeDestination !== null;

  function reset() {
    setQuery("");
    setActiveType(null);
    setActiveDestination(null);
  }

  return (
    <>
      {/* ─── Controls ──────────────────────────────────────── */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div className="relative">
          <label htmlFor="stay-search" className="sr-only">
            Search stays
          </label>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            🔍
          </span>
          <input
            id="stay-search"
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

        {/* Type pills */}
        <div className="flex flex-wrap gap-2">
          <Pill
            label="All types"
            active={activeType === null}
            onClick={() => setActiveType(null)}
          />
          {types.map((type) => {
            const count = stays.filter((s) => s.type === type).length;
            return (
              <Pill
                key={type}
                label={`${type} (${count})`}
                active={activeType === type}
                onClick={() =>
                  setActiveType(activeType === type ? null : type)
                }
              />
            );
          })}
        </div>

        {/* Destination pills */}
        <div className="flex flex-wrap gap-2">
          <Pill
            label="All destinations"
            active={activeDestination === null}
            onClick={() => setActiveDestination(null)}
          />
          {destinations.map((d) => {
            const count = stays.filter(
              (s) => s.destination.slug === d.slug,
            ).length;
            return (
              <Pill
                key={d.slug}
                label={`${d.name} (${count})`}
                active={activeDestination === d.slug}
                onClick={() =>
                  setActiveDestination(
                    activeDestination === d.slug ? null : d.slug,
                  )
                }
              />
            );
          })}
        </div>

        {/* Result count + reset */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {hasFilters
              ? `${filtered.length} of ${stays.length} stays`
              : `${stays.length} stays`}
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
      {grouped.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No stays match your filters.
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
        <div className="space-y-12">
          {grouped.map((g) => (
            <section key={g.type}>
              <h2 className="mb-4 text-xl font-semibold">{g.type}s</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((s) => (
                  <Link
                    key={s.id}
                    href={`/stay/${s.slug}`}
                    className="group flex flex-col rounded-lg border border-gray-200 p-5 transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:hover:border-brand-500"
                  >
                    <span className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                      {s.destination.name}
                    </span>
                    <h3 className="mt-1 font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {s.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">📍 {s.location}</p>
                    <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                      {s.description}
                    </p>
                    {s.priceRange && (
                      <p className="mt-3 font-mono text-xs font-bold">
                        {s.priceRange}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
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