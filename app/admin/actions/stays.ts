"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type StayRow = {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  location: string;
  priceRange: string | null;
  imageUrl: string | null;
  destinationId: number;
  destinationName: string;
  order: number;
  published: boolean;
};

export async function listStays(): Promise<StayRow[]> {
  const rows = await prisma.accommodation.findMany({
    include: { destination: { select: { name: true } } },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    type: r.type,
    description: r.description,
    location: r.location,
    priceRange: r.priceRange,
    imageUrl: r.imageUrl,
    destinationId: r.destinationId,
    destinationName: r.destination.name,
    order: 0,
    published: true,
  }));
}

export async function createStay(input?: Partial<StayRow>) {
  const firstDest = await prisma.destination.findFirst({ orderBy: { name: "asc" } });
  if (!firstDest) throw new Error("Create a destination first.");

  const created = await prisma.accommodation.create({
    data: {
      name: input?.name ?? "New Stay",
      slug: input?.slug ?? "new-stay-" + Date.now().toString(36),
      type: input?.type ?? "Lodge",
      description: input?.description ?? "",
      location: input?.location ?? "",
      priceRange: input?.priceRange ?? null,
      imageUrl: input?.imageUrl ?? null,
      destinationId: input?.destinationId ?? firstDest.id,
    },
    include: { destination: { select: { name: true } } },
  });

  revalidatePath("/stay");
  revalidatePath("/admin");
  return { ...created, destinationName: created.destination.name, order: 0, published: true };
}

export async function updateStay(id: number, patch: Partial<StayRow>) {
  const updated = await prisma.accommodation.update({
    where: { id },
    data: {
      name: patch.name,
      slug: patch.slug,
      type: patch.type,
      description: patch.description,
      location: patch.location,
      priceRange: patch.priceRange,
      imageUrl: patch.imageUrl,
      destinationId: patch.destinationId,
    },
    include: { destination: { select: { name: true } } },
  });

  revalidatePath("/admin");
  revalidatePath("/stay");
  revalidatePath(`/stay/${updated.slug}`);
  return { ...updated, destinationName: updated.destination.name, order: 0, published: true };
}

export async function deleteStay(id: number) {
  const row = await prisma.accommodation.findUnique({ where: { id }, select: { slug: true } });
  await prisma.accommodation.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/stay");
  if (row) revalidatePath(`/stay/${row.slug}`);
}