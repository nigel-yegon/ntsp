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
    include: { tags: true } as any,
  });

  // Collect unique tags across all posts, sorted alphabetically
  const tags = Array.from(
    new Set(posts.flatMap((p) => p.tags)),
  ).sort();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
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
        <BlogGrid posts={posts} tags={tags} />
      )}
    </div>
  );
}