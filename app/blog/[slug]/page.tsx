import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({ where: { slug } });
  return {
    title: post ? `${post.title} — NTSP` : "Post not found — NTSP",
    description: post?.excerpt,
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
  });

  if (!post) notFound();

  const related = await prisma.post.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 2,
  });

  const postTags = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div>
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-16">
          <Link
            href="/blog"
            className="text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            ← All posts
          </Link>

          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            {post.publishedAt?.toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-deep-800 md:text-5xl dark:text-cream-100">
            {post.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-deep-600 dark:text-cream-400">
            {post.excerpt}
          </p>

          {postTags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {postTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-5 text-lg leading-relaxed text-deep-700 dark:text-cream-300">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-deep-200 pt-8 dark:border-deep-800">
            <h2 className="mb-6 text-xl font-semibold text-deep-800 dark:text-cream-100">
              More from the blog
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group relative overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />

                  <p className="text-xs uppercase tracking-wide text-deep-500 dark:text-cream-500">
                    {r.publishedAt?.toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {r.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-deep-600 dark:text-cream-400">
                    {r.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}