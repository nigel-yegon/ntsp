"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Attraction = {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  destination: { name: string; slug: string; county: string };
};

type Props = {
  attractions: Attraction[];
  categories: string[];
};

export function ExperiencesGrid({ attractions, categories }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return attractions.filter((a) => {
      // Category filter
      if (activeCategory && a.category !== activeCategory) return false;

      // Search filter (empty query matches everything)
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.destination.name.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory, attractions]);

  // Group filtered results by category, preserving category order
  const grouped = useMemo(() => {
    return categories
      .map((cat) => ({
        category: cat,
        items: filtered.filter((a) => a.category === cat),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered, categories]);

  const hasFilters = query !== "" || activeCategory !== null;

  function reset() {
    setQuery("");
    setActiveCategory(null);
  }

  return (
    <>
      {/* ─── Controls ──────────────────────────────────────── */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="experience-search" className="sr-only">
            Search experiences
          </label>
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
            >
              🔍
            </span>
            <input
              id="experience-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, or destination…"
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
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <CategoryPill
            label="All"
            count={attractions.length}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {categories.map((cat) => {
            const count = attractions.filter((a) => a.category === cat).length;
            return (
              <CategoryPill
                key={cat}
                label={cat}
                count={count}
                active={activeCategory === cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
              />
            );
          })}
        </div>

        {/* Result count + reset */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {hasFilters
              ? `${filtered.length} of ${attractions.length} experiences`
              : `${attractions.length} experiences`}
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
            No experiences match your filters.
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
            <section key={g.category}>
              <h2 className="mb-4 text-xl font-semibold">{g.category}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((a) => (
                  <Link
                    key={a.id}
                    href={`/experiences/${a.slug}`}
                    className="group flex flex-col rounded-lg border border-gray-200 p-5 transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:hover:border-brand-500"
                  >
                    <span className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                      {a.destination.name}
                    </span>
                    <h3 className="mt-1 font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {a.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                      {a.description}
                    </p>
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
  count: number;
  active: boolean;
  onClick: () => void;
};

function CategoryPill({ label, count, active, onClick }: PillProps) {
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
      <span
        className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
          active
            ? "bg-white/20"
            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}