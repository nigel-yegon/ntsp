// app/blog/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resolveImageUrl } from "@/lib/image-url";
import { BlogGrid } from "./blog-grid";

export const metadata = {
  title: "Blog — NTSP",
  description: "Guides, tips, and travel stories from across Kenya.",
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  if (posts.length === 0) {
    return (
      <div>
        <section className="hero-band border-b border-deep-200 dark:border-deep-800">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
              From the road
            </span>
            <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
              Blog
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
              Guides, tips, and travel stories.
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-deep-500 dark:text-cream-500">
            No posts yet. Run the seed script.
          </p>
        </div>
      </div>
    );
  }

  const [featured, ...rest] = posts;
  const heroImage = resolveImageUrl(featured.coverImage);

  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-deep-200 dark:border-deep-800">
        <div className="hero-band absolute inset-0" aria-hidden />

        {heroImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-cream-200/70 mix-blend-multiply dark:bg-deep-950/75 dark:mix-blend-normal"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-linear-to-r from-cream-100/60 via-transparent to-transparent dark:from-deep-950/50"
              aria-hidden
            />
          </>
        )}

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-300">
            From the road
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-700 dark:text-cream-200">
            Guides, tips, and travel stories from across Kenya.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* ─── FEATURED POST ─────────────────────────────────── */}
        <FeaturedPost post={featured} />

        {/* ─── POST GRID ─────────────────────────────────────── */}
        <div className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
                All stories
              </h2>
              <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
                {rest.length} more {rest.length === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>

          <BlogGrid posts={rest} />
        </div>
      </div>
    </div>
  );
}

/* ─── Featured post — image on the left, text on the right ──── */
function FeaturedPost({
  post,
}: {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string | null;
    tags: string;
    publishedAt: Date | null;
  };
}) {
  const img = resolveImageUrl(post.coverImage);
  const tags = post.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative grid overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 transition hover:border-brand-400 hover:shadow-lg dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500 md:grid-cols-2"
    >
      <span
        className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden
      />

      <div className="relative aspect-4/3 w-full overflow-hidden bg-cream-100 dark:bg-deep-950 md:aspect-auto md:h-full">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-cream-200 via-cream-100 to-brand-100 dark:from-deep-800 dark:via-deep-900 dark:to-deep-950">
            <span className="text-5xl font-bold text-brand-400/40 dark:text-brand-500/20" aria-hidden>
              {post.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between p-6 md:p-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
            Featured story
          </p>
          {post.publishedAt && (
            <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
              {post.publishedAt.toLocaleDateString("en-KE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <h3 className="mt-3 text-2xl font-bold text-deep-800 transition group-hover:text-brand-600 md:text-3xl dark:text-cream-100 dark:group-hover:text-brand-400">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-deep-600 dark:text-cream-400 md:text-base">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-6">
          {tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <span className="text-sm font-medium text-brand-600 group-hover:underline dark:text-brand-400">
            Read the full story →
          </span>
        </div>
      </div>
    </Link>
  );
}