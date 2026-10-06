import { prisma } from "@/lib/prisma";
import { BlogGrid } from "./blog-grid";

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

  // Flatten comma-separated tags across all posts into a unique list
  const tags = Array.from(
    new Set(
      posts.flatMap((p) =>
        p.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      ),
    ),
  ).sort();

  return (
    <div>
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Stories &amp; guides
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            From the Blog
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            Travel guides, seasonal tips, and stories from around Kenya.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {posts.length === 0 ? (
          <p className="text-deep-500 dark:text-cream-500">
            No posts yet. Run the seed script to add sample posts.
          </p>
        ) : (
          <BlogGrid posts={posts} tags={tags} />
        )}
      </div>
    </div>
  );
}