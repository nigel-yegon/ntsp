import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Blog — NTSP",
  description: "Guides, tips, and travel stories from across Kenya.",
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">From the Blog</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Travel guides, seasonal tips, and stories from around Kenya.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-500">
          No posts yet. Run the seed script to add sample posts.
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
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
                <span className="mt-4 inline-block text-sm font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                  Read article →
                </span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}