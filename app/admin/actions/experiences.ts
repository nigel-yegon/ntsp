"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ExperienceRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  imageUrl: string | null;
  destinationId: number;
  destinationName: string;
  order: number;
  published: boolean;
};

export async function listExperiences(): Promise<ExperienceRow[]> {
  const rows = await prisma.attraction.findMany({
    include: { destination: { select: { name: true } } },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    category: r.category,
    imageUrl: r.imageUrl,
    destinationId: r.destinationId,
    destinationName: r.destination.name,
    order: 0,
    published: true,
  }));
}

export async function createExperience(input?: Partial<ExperienceRow>) {
  // Requires a destination — pick the first one if none provided
  const firstDest = await prisma.destination.findFirst({ orderBy: { name: "asc" } });
  if (!firstDest) throw new Error("Create a destination first.");

  const created = await prisma.attraction.create({
    data: {
      name: input?.name ?? "New Experience",
      slug: input?.slug ?? "new-experience-" + Date.now().toString(36),
      description: input?.description ?? "",
      category: input?.category ?? "Wildlife",
      imageUrl: input?.imageUrl ?? null,
      destinationId: input?.destinationId ?? firstDest.id,
    },
    include: { destination: { select: { name: true } } },
  });

  revalidatePath("/experiences");
  revalidatePath("/admin");
  return { ...created, destinationName: created.destination.name, order: 0, published: true };
}

export async function updateExperience(id: number, patch: Partial<ExperienceRow>) {
  const updated = await prisma.attraction.update({
    where: { id },
    data: {
      name: patch.name,
      slug: patch.slug,
      description: patch.description,
      category: patch.category,
      imageUrl: patch.imageUrl,
      destinationId: patch.destinationId,
    },
    include: { destination: { select: { name: true } } },
  });

  revalidatePath("/admin");
  revalidatePath("/experiences");
  revalidatePath(`/experiences/${updated.slug}`);
  return { ...updated, destinationName: updated.destination.name, order: 0, published: true };
}

export async function deleteExperience(id: number) {
  const row = await prisma.attraction.findUnique({ where: { id }, select: { slug: true } });
  await prisma.attraction.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/experiences");
  if (row) revalidatePath(`/experiences/${row.slug}`);
}