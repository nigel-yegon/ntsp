"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FadeIn from "@/app/components/fade-in";

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
      <div className="mb-10 space-y-4">
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
            placeholder="Search by title, tag, or keyword…"
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
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              />
            );
          })}
        </div>

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
        <div className="space-y-6">
          {filtered.map((post, i) => (
            <FadeIn key={post.id} delay={Math.min(i * 0.06, 0.4)} whenVisible>
              <article>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group relative block overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-6 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />

                  <p className="text-xs uppercase tracking-wide text-deep-500 dark:text-cream-500">
                    {post.publishedAt?.toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                    {post.excerpt}
                  </p>

                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="mt-4 inline-block text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                    Read article →
                  </span>
                </Link>
              </article>
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