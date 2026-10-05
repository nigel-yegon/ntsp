"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type DestinationRow = {
  id: number;
  name: string;
  slug: string;
  county: string;
  description: string;
  imageUrl: string | null;
  featured: boolean;
};

export async function listDestinations(): Promise<DestinationRow[]> {
  return prisma.destination.findMany({
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
}

export async function createDestination(input?: Partial<DestinationRow>) {
  const base = "new-destination-" + Date.now().toString(36);
  const created = await prisma.destination.create({
    data: {
      name: input?.name ?? "New Destination",
      slug: input?.slug ?? base,
      county: input?.county ?? "County",
      description: input?.description ?? "",
      imageUrl: input?.imageUrl ?? null,
      featured: input?.featured ?? false,
    },
  });

  revalidatePath("/destinations");
  revalidatePath("/");
  return created;
}

export async function updateDestination(id: number, patch: Partial<DestinationRow>) {
  const updated = await prisma.destination.update({
    where: { id },
    data: {
      name: patch.name,
      slug: patch.slug,
      county: patch.county,
      description: patch.description,
      imageUrl: patch.imageUrl,
      featured: patch.featured,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/destinations");
  revalidatePath(`/destinations/${updated.slug}`);
  revalidatePath("/");
  return updated;
}

export async function deleteDestination(id: number) {
  const destination = await prisma.destination.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.destination.delete({ where: { id } });

  revalidatePath("/admin");
  revalidatePath("/destinations");
  if (destination) revalidatePath(`/destinations/${destination.slug}`);
  revalidatePath("/");
}