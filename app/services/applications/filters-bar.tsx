// app/services/applications/filters-bar.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Props = {
  filters: {
    q: string;
    status: string;
    permitClass: string;
    applicationType: string;
    from: string;
    to: string;
  };
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_PERUSAL", label: "Under perusal" },
  { value: "UNDER_VERIFICATION", label: "Under verification" },
  { value: "AWAITING_COMMITTEE", label: "Awaiting committee" },
  { value: "COMMITTEE_APPROVED", label: "Committee approved" },
  { value: "COMMITTEE_DECLINED", label: "Committee declined" },
  { value: "AWAITING_PS_APPROVAL", label: "Awaiting PS approval" },
  { value: "PS_APPROVED", label: "PS approved" },
  { value: "PS_DECLINED", label: "PS declined" },
  { value: "FORWARDED_TO_INTERIOR", label: "Forwarded to Interior" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

const PERMIT_OPTIONS = [
  { value: "", label: "All permit classes" },
  { value: "CLASS_G", label: "Class G — Investor" },
  { value: "CLASS_D", label: "Class D — Employee" },
  { value: "SPECIAL_PASS", label: "Special Pass" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "FIRST_APPLICATION", label: "First application" },
  { value: "RENEWAL", label: "Renewal" },
];

export function ApplicationFiltersBar({ filters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState(filters.q);

  // Debounced search input
  useEffect(() => {
    const t = setTimeout(() => {
      if (q === filters.q) return;
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      params.delete("page"); // reset to page 1 on new search
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [q, filters.q, pathname, router, searchParams]);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters =
    filters.q ||
    filters.status ||
    filters.permitClass ||
    filters.applicationType ||
    filters.from ||
    filters.to;

  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-deep-700 dark:bg-deep-900">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
            Search
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Reference, applicant, passport, email"
            className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
          />
        </label>

        <Select
          label="Status"
          value={filters.status}
          onChange={(v) => setParam("status", v)}
          options={STATUS_OPTIONS}
        />
        <Select
          label="Permit class"
          value={filters.permitClass}
          onChange={(v) => setParam("permitClass", v)}
          options={PERMIT_OPTIONS}
        />
        <Select
          label="Application type"
          value={filters.applicationType}
          onChange={(v) => setParam("applicationType", v)}
          options={TYPE_OPTIONS}
        />
        <label className="block">
          <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
            Submitted from
          </span>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setParam("from", e.target.value)}
            className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
            Submitted to
          </span>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setParam("to", e.target.value)}
            className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
          />
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className="text-xs text-deep-500 dark:text-cream-400"
          aria-live="polite"
        >
          {pending ? "Updating…" : hasFilters ? "Filters applied" : ""}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-deep-700 dark:text-cream-300">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}