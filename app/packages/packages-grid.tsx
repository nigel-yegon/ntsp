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

// Price bands (inclusive min, exclusive max — null means unbounded)
const PRICE_BANDS = [
  { key: "all",      label: "All prices", min: 0,     max: null },
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
      // Destination filter
      if (activeDestination && p.destination.slug !== activeDestination) return false;

      // Price filter
      if (p.priceKes < band.min) return false;
      if (band.max !== null && p.priceKes >= band.max) return false;

      // Search filter
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.destination.name.toLowerCase().includes(q)
      );
    });

    // Sort
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
      {/* ─── Controls ──────────────────────────────────────── */}
      <div className="mb-10 space-y-4">
        {/* Search + Sort row */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor="package-search" className="sr-only">
              Search packages
            </label>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
            >
              🔍
            </span>
            <input
              id="package-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search packages…"
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

          <div>
            <label htmlFor="package-sort" className="sr-only">
              Sort packages
            </label>
            <select
              id="package-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-full w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-500 sm:w-48"
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
          <p className="text-xs text-gray-500">
            {hasFilters
              ? `${filtered.length} of ${packages.length} packages`
              : `${packages.length} packages`}
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
            No packages match your filters.
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
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/packages/${p.slug}`}
              className="group flex flex-col rounded-lg border border-gray-200 p-6 transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:hover:border-brand-500"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                    {p.destination.name}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {p.title}
                  </h2>
                </div>
                {p.featured && (
                  <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                    Featured
                  </span>
                )}
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                {p.summary}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <span className="text-xs text-gray-500">
                  {p.durationDays} day{p.durationDays > 1 ? "s" : ""}
                </span>
                <span className="font-mono text-sm font-bold">
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