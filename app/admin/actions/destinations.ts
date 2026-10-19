// app/admin/actions/destinations.ts
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
  latitude: number | null;
  longitude: number | null;
};

// ── Coordinate normaliser ────────────────────────────────────
// Guards against NaN and out-of-range values slipping into the
// DB when the admin types something odd into the picker. We
// prefer null over a bad coordinate — the public page's
// `<MapEmbed>` treats null as "don't render", which is safer
// than rendering at (0, 0) or off the edge of the world.
function normaliseCoord(
  value: number | null | undefined,
  min: number,
  max: number
): number | null {
  if (value == null || typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  if (value < min || value > max) return null;
  return value;
}

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
      latitude: normaliseCoord(input?.latitude, -90, 90),
      longitude: normaliseCoord(input?.longitude, -180, 180),
    },
  });

  revalidatePath("/destinations");
  revalidatePath("/");
  return created;
}

export async function updateDestination(
  id: number,
  patch: Partial<DestinationRow>
) {
  const updated = await prisma.destination.update({
    where: { id },
    data: {
      name: patch.name,
      slug: patch.slug,
      county: patch.county,
      description: patch.description,
      imageUrl: patch.imageUrl,
      featured: patch.featured,
      // Only touch coordinates when the caller actually sent
      // them. `undefined` (omitted from the patch) leaves the
      // existing value intact; `null` explicitly clears it.
      ...(patch.latitude !== undefined
        ? { latitude: normaliseCoord(patch.latitude, -90, 90) }
        : {}),
      ...(patch.longitude !== undefined
        ? { longitude: normaliseCoord(patch.longitude, -180, 180) }
        : {}),
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