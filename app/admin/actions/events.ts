// app/admin/actions/events.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type EventRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  order: number;
  published: boolean;
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

type PrismaEvent = {
  id: number;
  name: string;
  slug: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  order: number;
  published: boolean;
};

function toRow(e: PrismaEvent): EventRow {
  return {
    id: e.id,
    name: e.name,
    slug: e.slug,
    description: e.description,
    location: e.location,
    startDate: e.startDate.toISOString().slice(0, 10),
    endDate: e.endDate ? e.endDate.toISOString().slice(0, 10) : null,
    imageUrl: e.imageUrl,
    latitude: e.latitude,
    longitude: e.longitude,
    featured: e.featured,
    order: e.order,
    published: e.published,
  };
}

function revalidateEvent(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/events");
  if (slug) revalidatePath(`/events/${slug}`);
}

// ─────────────────────────────────────────────────────────────
// Read
// ─────────────────────────────────────────────────────────────

export async function listEvents(): Promise<EventRow[]> {
  const rows = await prisma.event.findMany({
    orderBy: [{ featured: "desc" }, { startDate: "asc" }],
  });
  return rows.map(toRow);
}

// ─────────────────────────────────────────────────────────────
// Create
// ─────────────────────────────────────────────────────────────

export async function createEvent(input?: Partial<EventRow>): Promise<EventRow> {
  const today = new Date().toISOString().slice(0, 10);
  const created = await prisma.event.create({
    data: {
      name: input?.name ?? "New Event",
      slug: input?.slug ?? `new-event-${Date.now().toString(36)}`,
      description: input?.description ?? "",
      location: input?.location ?? "",
      startDate: input?.startDate ? new Date(input.startDate) : new Date(today),
      endDate: input?.endDate ? new Date(input.endDate) : null,
      imageUrl: input?.imageUrl ?? null,
      latitude: input?.latitude ?? null,
      longitude: input?.longitude ?? null,
      featured: input?.featured ?? false,
    },
  });
  revalidateEvent(created.slug);
  return toRow(created);
}

// ─────────────────────────────────────────────────────────────
// Update
// ─────────────────────────────────────────────────────────────

export async function updateEvent(
  id: number,
  patch: Partial<EventRow>
): Promise<EventRow> {
  const data: Record<string, unknown> = {};

  // Only include fields that were actually supplied. This keeps a
  // patch like { featured: true } from nulling out other columns.
  if (patch.name !== undefined) data.name = patch.name;
  if (patch.slug !== undefined) data.slug = patch.slug;
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.location !== undefined) data.location = patch.location;
  if (patch.startDate !== undefined) data.startDate = new Date(patch.startDate);
  if (patch.endDate !== undefined) {
    data.endDate = patch.endDate ? new Date(patch.endDate) : null;
  }
  if (patch.imageUrl !== undefined) data.imageUrl = patch.imageUrl;
  if (patch.latitude !== undefined) data.latitude = patch.latitude;
  if (patch.longitude !== undefined) data.longitude = patch.longitude;
  if (patch.featured !== undefined) data.featured = patch.featured;
  if (patch.order !== undefined) data.order = patch.order;
  if (patch.published !== undefined) data.published = patch.published;

  const updated = await prisma.event.update({ where: { id }, data });
  revalidateEvent(updated.slug);
  return toRow(updated);
}

// ─────────────────────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────────────────────

export async function deleteEvent(id: number): Promise<void> {
  const row = await prisma.event.findUnique({
    where: { id },
    select: { slug: true },
  });
  await prisma.event.delete({ where: { id } });
  if (row) {
    revalidateEvent(row.slug);
  } else {
    revalidateEvent();
  }
}