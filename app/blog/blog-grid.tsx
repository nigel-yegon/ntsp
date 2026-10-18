// app/blog/blog-grid.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FadeIn from "@/app/components/fade-in";
import { CardImage } from "@/app/components/card-image";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  tags: string;
  publishedAt: Date | null;
};

type Props = {
  posts: Post[];
};

export function BlogGrid({ posts }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) {
      p.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => set.add(t));
    }
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const tags = p.tags.split(",").map((t) => t.trim());
      if (activeTag && !tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.toLowerCase().includes(q)
      );
    });
  }, [query, activeTag, posts]);

  const hasFilters = query !== "" || activeTag !== null;

  function reset() {
    setQuery("");
    setActiveTag(null);
  }

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="relative">
          <label htmlFor="blog-search" className="sr-only">
            Search posts
          </label>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-deep-400 dark:text-cream-500"
          >
            🔍
          </span>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
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

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Pill
              label="All"
              active={activeTag === null}
              onClick={() => setActiveTag(null)}
            />
            {allTags.map((tag) => (
              <Pill
                key={tag}
                label={tag}
                active={activeTag === tag}
                onClick={() =>
                  setActiveTag(activeTag === tag ? null : tag)
                }
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-deep-500 dark:text-cream-500">
            {hasFilters
              ? `${filtered.length} of ${posts.length} posts`
              : `${posts.length} posts`}
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

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-deep-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-sm text-deep-600 dark:text-cream-400">
            No posts match your filters.
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <FadeIn key={p.id} delay={Math.min(i * 0.06, 0.4)} whenVisible>
              <Link
                href={`/blog/${p.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <span
                  className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />

                <CardImage name={p.title} imageUrl={p.coverImage} aspect="16:9" />

                <div className="flex flex-1 flex-col p-5">
                  {p.publishedAt && (
                    <p className="text-xs uppercase tracking-wide text-deep-500 dark:text-cream-500">
                      {p.publishedAt.toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  <h3 className="mt-2 font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-deep-600 dark:text-cream-400">
                    {p.excerpt}
                  </p>
                  <span className="mt-auto pt-4 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                    Read →
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