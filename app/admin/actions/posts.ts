"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type PostRow = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
};

export async function listPosts(): Promise<PostRow[]> {
  const rows = await prisma.post.findMany({
    orderBy: [{ publishedAt: "desc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content,
    coverImage: r.coverImage,
    tags: r.tags ?? "",
    published: r.published,
    publishedAt: r.publishedAt ? r.publishedAt.toISOString().slice(0, 10) : null,
  }));
}

export async function createPost(input?: Partial<PostRow>) {
  const created = await prisma.post.create({
    data: {
      title: input?.title ?? "New Post",
      slug: input?.slug ?? "new-post-" + Date.now().toString(36),
      excerpt: input?.excerpt ?? "",
      content: input?.content ?? "",
      coverImage: input?.coverImage ?? null,
      tags: input?.tags ?? [],
      published: input?.published ?? false,
      publishedAt: input?.publishedAt ? new Date(input.publishedAt) : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin");
  return {
    id: created.id,
    title: created.title,
    slug: created.slug,
    excerpt: created.excerpt,
    content: created.content,
    coverImage: created.coverImage,
    tags: created.tags,
    published: created.published,
    publishedAt: created.publishedAt
      ? created.publishedAt.toISOString().slice(0, 10)
      : null,
  };
}

export async function updatePost(id: number, patch: Partial<PostRow>) {
  const updated = await prisma.post.update({
    where: { id },
    data: {
      title: patch.title,
      slug: patch.slug,
      excerpt: patch.excerpt,
      content: patch.content,
      coverImage: patch.coverImage,
      tags: patch.tags,
      published: patch.published,
      publishedAt: patch.publishedAt ? new Date(patch.publishedAt) : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath(`/blog/${updated.slug}`);
  revalidatePath("/");
  return {
    id: updated.id,
    title: updated.title,
    slug: updated.slug,
    excerpt: updated.excerpt,
    content: updated.content,
    coverImage: updated.coverImage,
    tags: updated.tags,
    published: updated.published,
    publishedAt: updated.publishedAt
      ? updated.publishedAt.toISOString().slice(0, 10)
      : null,
  };
}

export async function deletePost(id: number) {
  const row = await prisma.post.findUnique({
    where: { id },
    select: { slug: true },
  });
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/");
  if (row) revalidatePath(`/blog/${row.slug}`);
}