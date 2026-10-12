// app/services/applications/pagination.tsx
"use client";
import Link from "next/link";
import { PAGE_SIZES, toQueryString, type ApplicationFilters } from "@/lib/application-filters";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  currentFilters: ApplicationFilters;
};

export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  currentFilters,
}: Props) {
  if (total === 0) return null;

  const buildHref = (overrides: Partial<ApplicationFilters>) => {
    const merged = { ...currentFilters, ...overrides };
    return `/services/applications${toQueryString(merged)}`;
  };

  const pageNumbers = computePageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2 text-sm text-deep-500 dark:text-cream-400">
        <label htmlFor="page-size" className="text-xs">
          Rows per page
        </label>
        <select
          id="page-size"
          defaultValue={String(pageSize)}
          onChange={(e) => {
            const next = e.target.value;
            // Client-side nav via a hidden form is overkill here — use
            // a link-based approach by updating window.location. This
            // keeps the component a server component.
            window.location.href = buildHref({
              pageSize: Number(next) as ApplicationFilters["pageSize"],
              page: 1,
            });
          }}
          className="rounded-md border border-cream-300 bg-cream-50 px-2 py-1 text-xs text-deep-800 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <PageLink
          href={buildHref({ page: Math.max(1, page - 1) })}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ←
        </PageLink>

        {pageNumbers.map((n, i) =>
          n === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-sm text-deep-400 dark:text-cream-500"
            >
              …
            </span>
          ) : (
            <PageLink
              key={n}
              href={buildHref({ page: n })}
              active={n === page}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </PageLink>
          )
        )}

        <PageLink
          href={buildHref({ page: Math.min(totalPages, page + 1) })}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          →
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  children,
  disabled,
  active,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
} & React.AriaAttributes) {
  const base =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition";

  if (disabled) {
    return (
      <span
        className={`${base} cursor-not-allowed text-deep-300 dark:text-cream-600`}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  const tone = active
    ? "bg-brand-400 text-deep-800"
    : "text-deep-700 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-800";

  return (
    <Link
      href={href}
      className={`${base} ${tone} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400`}
      {...rest}
    >
      {children}
    </Link>
  );
}

function computePageNumbers(
  current: number,
  total: number
): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}