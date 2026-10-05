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

  // Related posts: next two by date, excluding current
  const related = await prisma.post.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 2,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="text-sm text-gray-500 hover:text-brand-600 dark:hover:text-brand-400"
      >
        ← All posts
      </Link>

      <header className="mt-6 mb-8">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {post.publishedAt?.toLocaleDateString("en-KE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          {post.excerpt}
        </p>
      </header>

      {/* Rendered as paragraphs — swap for MDX/markdown later if you want rich content */}
      <div className="space-y-4 text-gray-800 dark:text-gray-200">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i} className="leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-4 text-xl font-semibold">More from the blog</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.slug}`}
                className="group rounded-lg border border-gray-200 p-4 transition hover:border-brand-500 dark:border-gray-800 dark:hover:border-brand-500"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {r.publishedAt?.toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-1 text-sm font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {r.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                  {r.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}