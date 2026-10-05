"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Package = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  priceKes: number;
  durationDays: number;
  featured: boolean;
  destination: { name: string; slug: string };
};

type Props = {
  packages: Package[];
  destinations: { name: string; slug: string }[];
};

type SortKey = "featured" | "price-asc" | "price-desc" | "duration";

const PRICE_BANDS = [
  { key: "all",      label: "All prices", min: 0,     max: null as number | null },
  { key: "budget",   label: "Under 40K",  min: 0,     max: 40000 },
  { key: "mid",      label: "40K – 70K",  min: 40000, max: 70000 },
  { key: "premium",  label: "Over 70K",   min: 70000, max: null },
] as const;

export function PackagesGrid({ packages, destinations }: Props) {
  const [query, setQuery] = useState("");
  const [activeDestination, setActiveDestination] = useState<string | null>(null);
  const [priceBand, setPriceBand] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const band = PRICE_BANDS.find((b) => b.key === priceBand) ?? PRICE_BANDS[0];

    const list = packages.filter((p) => {
      if (activeDestination && p.destination.slug !== activeDestination) return false;

      if (p.priceKes < band.min) return false;
      if (band.max !== null && p.priceKes >= band.max) return false;

      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.destination.name.toLowerCase().includes(q)
      );
    });

    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.priceKes - b.priceKes);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.priceKes - a.priceKes);
        break;
      case "duration":
        sorted.sort((a, b) => a.durationDays - b.durationDays);
        break;
      case "featured":
      default:
        sorted.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) || a.priceKes - b.priceKes,
        );
    }

    return sorted;
  }, [query, activeDestination, priceBand, sort, packages]);

  const hasFilters =
    query !== "" || activeDestination !== null || priceBand !== "all";

  function reset() {
    setQuery("");
    setActiveDestination(null);
    setPriceBand("all");
  }

  return (
    <>
      {/* ─── Controls ─────────────────────────────────────── */}
      <div className="mb-10 space-y-4">
        {/* Search + Sort row */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor="package-search" className="sr-only">
              Search packages
            </label>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-deep-400 dark:text-cream-500"
            >
              🔍
            </span>
            <input
              id="package-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search packages…"
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

          <div>
            <label htmlFor="package-sort" className="sr-only">
              Sort packages
            </label>
            <select
              id="package-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-full w-full rounded-md border border-deep-200 bg-cream-50 px-3 py-2.5 text-sm text-deep-800 outline-none transition focus:border-brand-500 focus:bg-cream-100 focus:ring-2 focus:ring-brand-500/20 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-100 dark:focus:border-brand-500 sm:w-48"
            >
              <option value="featured">Featured first</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
              <option value="duration">Shortest first</option>
            </select>
          </div>
        </div>

        {/* Destination pills */}
        <div className="flex flex-wrap gap-2">
          <Pill
            label="All destinations"
            active={activeDestination === null}
            onClick={() => setActiveDestination(null)}
          />
          {destinations.map((d) => {
            const count = packages.filter(
              (p) => p.destination.slug === d.slug,
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

        {/* Price pills */}
        <div className="flex flex-wrap gap-2">
          {PRICE_BANDS.map((b) => (
            <Pill
              key={b.key}
              label={b.label}
              active={priceBand === b.key}
              onClick={() => setPriceBand(b.key)}
            />
          ))}
        </div>

        {/* Result count + reset */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-deep-500 dark:text-cream-500">
            {hasFilters
              ? `${filtered.length} of ${packages.length} packages`
              : `${packages.length} packages`}
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
            No packages match your filters.
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
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/packages/${p.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-6 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
            >
              {/* Gold accent strip on hover */}
              <span
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                    {p.destination.name}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {p.title}
                  </h2>
                </div>
                {p.featured && (
                  <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                    Featured
                  </span>
                )}
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                {p.summary}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-deep-200 pt-4 dark:border-deep-800">
                <span className="text-xs text-deep-500 dark:text-cream-500">
                  {p.durationDays} day{p.durationDays > 1 ? "s" : ""}
                </span>
                <span className="font-mono text-sm font-bold text-deep-800 dark:text-cream-100">
                  KES {p.priceKes.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── Pill ──────────────────────────────────────────────────── */
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
          : "border-deep-300 bg-cream-50 text-deep-700 hover:border-brand-400 hover:text-brand-600 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
      }`}
    >
      {label}
    </button>
  );
}