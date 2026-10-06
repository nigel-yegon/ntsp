"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  Search,
  X,
  MapPin,
  PawPrint,
  Route,
  Bed,
  Calendar,
  Pen,
  Loader2,
} from "lucide-react";
import { globalSearch, type SearchResult } from "@/app/actions/global-search";

const TYPE_ICONS = {
  destination: MapPin,
  experience: PawPrint,
  package: Route,
  stay: Bed,
  event: Calendar,
  post: Pen,
} as const;

const TYPE_LABELS = {
  destination: "Destination",
  experience: "Experience",
  package: "Package",
  stay: "Stay",
  event: "Event",
  post: "Blog",
} as const;

type TypeFilter = SearchResult["type"] | "all";

const FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all",         label: "All"          },
  { value: "destination", label: "Destinations" },
  { value: "experience",  label: "Experiences"  },
  { value: "package",     label: "Packages"     },
  { value: "stay",        label: "Stay"         },
  { value: "event",       label: "Events"       },
  { value: "post",        label: "Blog"         },
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<TypeFilter>("all");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();
    if (!q) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const r = await globalSearch(q);
        setResults(r);
        setOpen(true);
      });
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Escape closes the dropdown
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const filtered =
    activeFilter === "all"
      ? results
      : results.filter((r) => r.type === activeFilter);

  // Counts per type for the filter pills
  const counts = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {});

  const hasQuery = query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Search input */}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-deep-400 dark:text-cream-500">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => hasQuery && setOpen(true)}
          placeholder="Search destinations, experiences, packages, where to stay, events, blogs…"
          className="w-full rounded-xl border border-deep-200 bg-cream-100 py-3.5 pl-11 pr-11 text-sm font-medium text-deep-900 shadow-sm caret-brand-500 outline-none transition placeholder:font-normal placeholder:text-deep-400 focus:border-brand-500 focus:bg-cream-50 focus:text-deep-950 focus:shadow-md focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-800 dark:text-cream-50 dark:placeholder:font-normal dark:placeholder:text-cream-500 dark:focus:border-brand-500 dark:focus:bg-transparent dark:focus:text-white dark:focus:shadow-none dark:focus:ring-brand-500/25"
          />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            aria-label="Clear search"
            className="absolute inset-y-0 right-4 flex items-center text-deep-400 transition hover:text-deep-700 dark:text-cream-500 dark:hover:text-cream-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results panel */}
      {open && hasQuery && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[70vh] overflow-hidden rounded-xl border border-deep-200 bg-cream-50 shadow-2xl dark:border-deep-800 dark:bg-deep-900">
          {/* Filter pills */}
          {results.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-b border-deep-200 p-3 dark:border-deep-800">
              {FILTERS.map((f) => {
                const count = f.value === "all" ? results.length : (counts[f.value] ?? 0);
                const disabled = f.value !== "all" && count === 0;
                const active = activeFilter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => setActiveFilter(f.value)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      active
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-deep-300 bg-cream-50 text-deep-700 hover:border-brand-400 hover:text-brand-600 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
                    }`}
                  >
                    {f.label}
                    {count > 0 && (
                      <span
                        className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                          active
                            ? "bg-white/20"
                            : "bg-cream-200 text-deep-500 dark:bg-deep-800 dark:text-cream-400"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Results list */}
          <div className="max-h-[52vh] overflow-y-auto p-2">
            {results.length === 0 && !pending && (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-deep-600 dark:text-cream-400">
                  No results for{" "}
                  <span className="font-medium text-deep-800 dark:text-cream-100">
                    &ldquo;{query}&rdquo;
                  </span>
                </p>
                <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
                  Try a different search term.
                </p>
              </div>
            )}

            {results.length > 0 && filtered.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-deep-600 dark:text-cream-400">
                  No {FILTERS.find((f) => f.value === activeFilter)?.label.toLowerCase()}{" "}
                  match &ldquo;{query}&rdquo;
                </p>
              </div>
            )}

            {filtered.map((r) => {
              const Icon = TYPE_ICONS[r.type];
              return (
                <Link
                  key={r.id}
                  href={r.href}
                  onClick={() => {
                    setQuery("");
                    setOpen(false);
                  }}
                  className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition hover:bg-cream-100 dark:hover:bg-deep-800"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="truncate text-sm font-medium text-deep-800 group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                        {r.title}
                      </p>
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-deep-500 dark:text-cream-500">
                        {TYPE_LABELS[r.type]}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-deep-500 dark:text-cream-500">
                      {r.subtitle}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-deep-600 dark:text-cream-400">
                      {r.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="border-t border-deep-200 px-4 py-2 text-[11px] text-deep-500 dark:border-deep-800 dark:text-cream-500">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
              {activeFilter !== "all" && ` · filtered by ${activeFilter}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}