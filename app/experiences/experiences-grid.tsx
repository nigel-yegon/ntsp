"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FadeIn from "@/app/components/fade-in";

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
      if (activeCategory && a.category !== activeCategory) return false;

      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.destination.name.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory, attractions]);

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
      {/* Controls */}
      <div className="mb-10 space-y-4">
        <div>
          <label htmlFor="experience-search" className="sr-only">
            Search experiences
          </label>
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-deep-400 dark:text-cream-500"
            >
              🔍
            </span>
            <input
              id="experience-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, or destination…"
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
        </div>

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

        <div className="flex items-center justify-between">
          <p className="text-xs text-deep-500 dark:text-cream-500">
            {hasFilters
              ? `${filtered.length} of ${attractions.length} experiences`
              : `${attractions.length} experiences`}
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
            No experiences match your filters.
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
            <FadeIn key={g.category} whenVisible>
              <section>
                <h2 className="mb-4 text-xl font-semibold text-deep-800 dark:text-cream-100">
                  {g.category}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((a, i) => (
                    <FadeIn key={a.id} delay={Math.min(i * 0.06, 0.4)} whenVisible>
                      <Link
                        href={`/experiences/${a.slug}`}
                        className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                      >
                        <span
                          className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                          aria-hidden
                        />
                        <span className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                          {a.destination.name}
                        </span>
                        <h3 className="mt-1 font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                          {a.name}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                          {a.description}
                        </p>
                        <span className="mt-auto pt-4 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                          Explore →
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

/* ─── Pill ──────────────────────────────────────────────────── */
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
          : "border-deep-300 bg-cream-50 text-deep-700 hover:border-brand-400 hover:text-brand-600 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
      }`}
    >
      {label}
      <span
        className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
          active
            ? "bg-white/20"
            : "bg-cream-200 text-deep-500 dark:bg-deep-800 dark:text-cream-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}