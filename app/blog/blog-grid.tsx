"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  publishedAt: Date | null;
};

type Props = {
  posts: Post[];
  tags: string[];
};

export function BlogGrid({ posts, tags }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;

      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
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
      {/* ─── Controls ──────────────────────────────────────── */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div className="relative">
          <label htmlFor="blog-search" className="sr-only">
            Search posts
          </label>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            🔍
          </span>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, tag, or keyword…"
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

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2">
          <Pill
            label={`All (${posts.length})`}
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {tags.map((tag) => {
            const count = posts.filter((p) => p.tags.includes(tag)).length;
            return (
              <Pill
                key={tag}
                label={`${tag} (${count})`}
                active={activeTag === tag}
                onClick={() =>
                  setActiveTag(activeTag === tag ? null : tag)
                }
              />
            );
          })}
        </div>

        {/* Result count + reset */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {hasFilters
              ? `${filtered.length} of ${posts.length} posts`
              : `${posts.length} posts`}
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
            No posts match your filters.
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
        <div className="space-y-6">
          {filtered.map((post) => (
            <article key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-lg border border-gray-200 p-6 transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:hover:border-brand-500"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {post.publishedAt?.toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h2 className="mt-2 text-xl font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {post.excerpt}
                </p>

                {/* Tags row */}
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <span className="mt-4 inline-block text-sm font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                  Read article →
                </span>
              </Link>
            </article>
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