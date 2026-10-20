// app/operators/operators-grid.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import FadeIn from "@/app/components/fade-in";

// We extend the type to include the count of packages
type Operator = {
  id: string;
  businessName: string;
  description: string | null;
  katoMember: boolean;
  contactEmail: string;
  packageCount: number;
};

type LayoutType = "grid" | "list";
type FilterType = "all" | "kato" | "has_packages";

export function OperatorsGrid({ operators }: { operators: Operator[] }) {
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<LayoutType>("grid");
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    return operators.filter((op) => {
      // 1. Apply Filter
      if (filter === "kato" && !op.katoMember) return false;
      if (filter === "has_packages" && op.packageCount === 0) return false;

      // 2. Apply Search
      if (!q) return true;
      return (
        op.businessName.toLowerCase().includes(q) ||
        (op.description || "").toLowerCase().includes(q)
      );
    });
  }, [operators, query, filter]);

  const hasFilters = query !== "" || filter !== "all";

  return (
    <>
      {/* ── Filters Bar ── */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <label htmlFor="operator-search" className="sr-only">Search operators</label>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-deep-400 dark:text-cream-500">
              🔍
            </span>
            <input
              id="operator-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or keyword..."
              className="w-full rounded-lg border border-deep-200 bg-cream-50 py-2.5 pl-10 pr-4 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-100"
            />
          </div>

          {/* Layout Toggle */}
          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-deep-200 bg-cream-50 p-1 dark:border-deep-800 dark:bg-deep-900">
            <button
              type="button"
              onClick={() => setLayout("grid")}
              className={`rounded-md p-2 transition ${layout === "grid" ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300" : "text-deep-500 hover:text-deep-800 dark:text-cream-400"}`}
              aria-label="Grid view"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setLayout("list")}
              className={`rounded-md p-2 transition ${layout === "list" ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300" : "text-deep-500 hover:text-deep-800 dark:text-cream-400"}`}
              aria-label="List view"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <Pill label="All Operators" active={filter === "all"} onClick={() => setFilter("all")} />
          <Pill label="KATO Members" active={filter === "kato"} onClick={() => setFilter("kato")} />
          <Pill label="Has Active Packages" active={filter === "has_packages"} onClick={() => setFilter("has_packages")} />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-deep-500 dark:text-cream-500">
            {hasFilters ? `${filtered.length} of ${operators.length} operators` : `${operators.length} operators`}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setQuery(""); setFilter("all"); }}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* ── Empty State ── */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-deep-300 bg-cream-50 p-12 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-deep-600 dark:text-cream-400">No operators match your current search.</p>
          <button
            onClick={() => { setQuery(""); setFilter("all"); }}
            className="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ── Grid View ── */}
      {layout === "grid" && filtered.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((op) => (
            <FadeIn key={op.id}>
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 p-6 transition hover:-translate-y-1 hover:border-brand-400 hover:shadow-lg dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold text-deep-800 group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                      {op.businessName}
                    </h2>
                    {op.katoMember && (
                      <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                        KATO
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                    {op.description || "A verified tour operator in Kenya."}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-deep-100 pt-4 dark:border-deep-800">
                  <span className="text-xs font-medium text-deep-500 dark:text-cream-500">
                    {op.packageCount} {op.packageCount === 1 ? 'Package' : 'Packages'}
                  </span>
                  <Link
                    href={`/packages?operator=${op.id}`}
                    className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    View Listings →
                  </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      {/* ── List View ── */}
      {layout === "list" && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((op) => (
            <FadeIn key={op.id}>
              <Link
                href={`/packages?operator=${op.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-deep-200 bg-cream-50 p-5 transition hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-deep-800 group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                      {op.businessName}
                    </h2>
                    {op.katoMember && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                        KATO Member
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                    {op.description || "A verified tour operator in Kenya."}
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 items-center gap-6 border-t border-deep-100 pt-4 dark:border-deep-800 sm:mt-0 sm:border-0 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="block text-xs text-deep-500 dark:text-cream-500">Active Listings</span>
                    <span className="block text-sm font-semibold text-deep-800 dark:text-cream-200">
                      {op.packageCount} {op.packageCount === 1 ? 'Package' : 'Packages'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                    View →
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      )}
    </>
  );
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
        active
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-deep-300 bg-cream-50 text-deep-700 hover:border-brand-400 hover:text-brand-600 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300"
      }`}
    >
      {label}
    </button>
  );
}