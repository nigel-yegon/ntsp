// app/blog/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveImageUrl } from "@/lib/image-url";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  return {
    title: post ? `${post.title} — NTSP` : "Post not found — NTSP",
    description: post?.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const heroImage = resolveImageUrl(post.coverImage);
  const tags = post.tags.split(",").map((t) => t.trim()).filter(Boolean);

  // Two more recent posts, for the "keep reading" section
  const related = await prisma.post.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 2,
  });

  return (
    <div>
      {/* ─── HERO BAND — image-backed ──────────────────────── */}
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
              className="absolute inset-0 bg-cream-200/75 mix-blend-multiply dark:bg-deep-950/80 dark:mix-blend-normal"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-linear-to-r from-cream-100/70 via-transparent to-transparent dark:from-deep-950/60"
              aria-hidden
            />
          </>
        )}

        <div className="relative mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Link
            href="/blog"
            className="text-xs font-medium text-deep-600 transition hover:text-brand-600 dark:text-cream-300 dark:hover:text-brand-400"
          >
            ← All posts
          </Link>

          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
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

          <h1 className="mt-4 text-4xl font-bold leading-tight text-deep-800 md:text-5xl dark:text-cream-100">
            {post.title}
          </h1>

          <p className="mt-4 text-sm text-deep-600 dark:text-cream-300">
            {post.publishedAt?.toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <article className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-lg font-medium leading-relaxed text-deep-700 dark:text-cream-300">
          {post.excerpt}
        </p>

        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-wrap text-deep-700 dark:prose-invert dark:text-cream-200">
          {post.content}
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-deep-200 pt-8 dark:border-deep-800">
            <h2 className="mb-6 text-xl font-semibold text-deep-800 dark:text-cream-100">
              Keep reading
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group block h-full rounded-lg border border-deep-200 bg-cream-50 p-4 transition hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                  >
                    <h3 className="font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                      {r.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-deep-600 dark:text-cream-400">
                      {r.excerpt}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 border-t border-deep-200 pt-6 dark:border-deep-800">
          <Link
            href="/blog"
            className="text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            ← Back to all posts
          </Link>
        </div>
      </article>
    </div>
  );
}