"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type EventRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;   // ISO date string for easy binding in the client
  endDate: string | null;
  imageUrl: string | null;
  featured: boolean;
  order: number;
  published: boolean;
};

export async function listEvents(): Promise<EventRow[]> {
  const rows = await prisma.event.findMany({
    orderBy: [{ featured: "desc" }, { startDate: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    location: r.location,
    startDate: r.startDate.toISOString().slice(0, 10),
    endDate: r.endDate ? r.endDate.toISOString().slice(0, 10) : null,
    imageUrl: r.imageUrl,
    featured: r.featured,
    order: 0,
    published: true,
  }));
}

export async function createEvent(input?: Partial<EventRow>) {
  const today = new Date().toISOString().slice(0, 10);
  const created = await prisma.event.create({
    data: {
      name: input?.name ?? "New Event",
      slug: input?.slug ?? "new-event-" + Date.now().toString(36),
      description: input?.description ?? "",
      location: input?.location ?? "",
      startDate: input?.startDate ? new Date(input.startDate) : new Date(today),
      endDate: input?.endDate ? new Date(input.endDate) : null,
      imageUrl: input?.imageUrl ?? null,
      featured: input?.featured ?? false,
    },
  });

  revalidatePath("/events");
  revalidatePath("/admin");
  return {
    id: created.id,
    name: created.name,
    slug: created.slug,
    description: created.description,
    location: created.location,
    startDate: created.startDate.toISOString().slice(0, 10),
    endDate: created.endDate ? created.endDate.toISOString().slice(0, 10) : null,
    imageUrl: created.imageUrl,
    featured: created.featured,
    order: 0,
    published: true,
  };
}

export async function updateEvent(id: number, patch: Partial<EventRow>) {
  const updated = await prisma.event.update({
    where: { id },
    data: {
      name: patch.name,
      slug: patch.slug,
      description: patch.description,
      location: patch.location,
      startDate: patch.startDate ? new Date(patch.startDate) : undefined,
      endDate: patch.endDate ? new Date(patch.endDate) : null,
      imageUrl: patch.imageUrl,
      featured: patch.featured,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/events");
  revalidatePath(`/events/${updated.slug}`);
  return {
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    description: updated.description,
    location: updated.location,
    startDate: updated.startDate.toISOString().slice(0, 10),
    endDate: updated.endDate ? updated.endDate.toISOString().slice(0, 10) : null,
    imageUrl: updated.imageUrl,
    featured: updated.featured,
    order: 0,
    published: true,
  };
}

export async function deleteEvent(id: number) {
  const row = await prisma.event.findUnique({ where: { id }, select: { slug: true } });
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/events");
  if (row) revalidatePath(`/events/${row.slug}`);
}