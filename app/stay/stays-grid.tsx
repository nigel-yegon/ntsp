"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FadeIn from "@/app/components/fade-in";

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
      <div className="mb-10 space-y-4">
        <div className="relative">
          <label htmlFor="stay-search" className="sr-only">
            Search stays
          </label>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-deep-400 dark:text-cream-500"
          >
            🔍
          </span>
          <input
            id="stay-search"
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
                onClick={() => setActiveType(activeType === type ? null : type)}
              />
            );
          })}
        </div>

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

        <div className="flex items-center justify-between">
          <p className="text-xs text-deep-500 dark:text-cream-500">
            {hasFilters
              ? `${filtered.length} of ${stays.length} stays`
              : `${stays.length} stays`}
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

      {grouped.length === 0 ? (
        <div className="rounded-lg border border-dashed border-deep-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-sm text-deep-600 dark:text-cream-400">
            No stays match your filters.
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
        <div className="space-y-12">
          {grouped.map((g) => (
            <FadeIn key={g.type} whenVisible>
              <section>
                <h2 className="mb-4 text-xl font-semibold text-deep-800 dark:text-cream-100">
                  {g.type}s
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((s, i) => (
                    <FadeIn key={s.id} delay={Math.min(i * 0.06, 0.4)} whenVisible>
                      <Link
                        href={`/stay/${s.slug}`}
                        className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                      >
                        <span
                          className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                          aria-hidden
                        />
                        <span className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                          {s.destination.name}
                        </span>
                        <h3 className="mt-1 font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                          {s.name}
                        </h3>
                        <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
                          📍 {s.location}
                        </p>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                          {s.description}
                        </p>
                        {s.priceRange && (
                          <p className="mt-3 font-mono text-xs font-bold text-deep-800 dark:text-cream-100">
                            {s.priceRange}
                          </p>
                        )}
                        <span className="mt-auto pt-4 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                          View →
                        </span>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              </section>
            </FadeIn>
          ))}
        </div>
      )}
    </>
  );
}

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