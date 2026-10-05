"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type PackageRow = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  priceKes: number;
  durationDays: number;
  imageUrl: string | null;
  featured: boolean;
  destinationId: number;
  destinationName: string;
  order: number;
  published: boolean;
};

export async function listPackages(): Promise<PackageRow[]> {
  const rows = await prisma.tourPackage.findMany({
    include: { destination: { select: { name: true } } },
    orderBy: [{ featured: "desc" }, { priceKes: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    summary: r.summary,
    description: r.description,
    priceKes: r.priceKes,
    durationDays: r.durationDays,
    imageUrl: r.imageUrl,
    featured: r.featured,
    destinationId: r.destinationId,
    destinationName: r.destination.name,
    order: 0,
    published: true,
  }));
}

export async function createPackage(input?: Partial<PackageRow>) {
  const firstDest = await prisma.destination.findFirst({ orderBy: { name: "asc" } });
  if (!firstDest) throw new Error("Create a destination first.");

  const created = await prisma.tourPackage.create({
    data: {
      title: input?.title ?? "New Package",
      slug: input?.slug ?? "new-package-" + Date.now().toString(36),
      summary: input?.summary ?? "",
      description: input?.description ?? "",
      priceKes: input?.priceKes ?? 0,
      durationDays: input?.durationDays ?? 1,
      imageUrl: input?.imageUrl ?? null,
      featured: input?.featured ?? false,
      destinationId: input?.destinationId ?? firstDest.id,
    },
    include: { destination: { select: { name: true } } },
  });

  revalidatePath("/packages");
  revalidatePath("/admin");
  return { ...created, destinationName: created.destination.name, order: 0, published: true };
}

export async function updatePackage(id: number, patch: Partial<PackageRow>) {
  const updated = await prisma.tourPackage.update({
    where: { id },
    data: {
      title: patch.title,
      slug: patch.slug,
      summary: patch.summary,
      description: patch.description,
      priceKes: patch.priceKes,
      durationDays: patch.durationDays,
      imageUrl: patch.imageUrl,
      featured: patch.featured,
      destinationId: patch.destinationId,
    },
    include: { destination: { select: { name: true } } },
  });

  revalidatePath("/admin");
  revalidatePath("/packages");
  revalidatePath(`/packages/${updated.slug}`);
  return { ...updated, destinationName: updated.destination.name, order: 0, published: true };
}

export async function deletePackage(id: number) {
  const row = await prisma.tourPackage.findUnique({ where: { id }, select: { slug: true } });
  await prisma.tourPackage.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/packages");
  if (row) revalidatePath(`/packages/${row.slug}`);
}