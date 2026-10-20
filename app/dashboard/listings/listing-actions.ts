// app/dashboard/listings/listing-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ListingType = "accommodation" | "package";

type AccommodationInput = {
  type: "accommodation";
  name: string;
  slug: string;
  accommodationType: string;
  description: string;
  location: string;
  priceRange: string | null;
  imageUrl: string | null;
  destinationId: number;
  published: boolean;
};

type PackageInput = {
  type: "package";
  title: string;
  slug: string;
  summary: string;
  description: string;
  priceKes: number;
  durationDays: number;
  imageUrl: string | null;
  destinationId: number;
  published: boolean;
  itinerary?: { title: string; description: string }[];
};

export type ListingInput = AccommodationInput | PackageInput;

export type ListingActionResult =
  | { ok: true; id: number; type: ListingType }
  | { ok: false; errors: string[] };

// ─── Auth ───────────────────────────────────────────────────────────

type AuthedUser = {
  userId: string;
  role: "BUSINESS" | "OPERATOR";
  verificationStatus: string;
};

async function requireLister(): Promise<AuthedUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const role = session.user.role;
  if (role !== "BUSINESS" && role !== "OPERATOR") {
    throw new Error("Forbidden");
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
    select: { verificationStatus: true },
  });
  if (!profile) throw new Error("Business profile not found");

  return {
    userId: session.user.id,
    role,
    verificationStatus: profile.verificationStatus,
  };
}

// ─── Validation helpers ────────────────────────────────────────────

function validateBaseInput(input: ListingInput): string[] {
  const errors: string[] = [];

  if (input.type === "accommodation") {
    if (!input.name.trim()) errors.push("Name is required");
    if (!input.location.trim()) errors.push("Location is required");
    if (!input.accommodationType.trim()) errors.push("Type is required");
  } else {
    if (!input.title.trim()) errors.push("Title is required");
    if (!input.summary.trim()) errors.push("Summary is required");
    if (!input.priceKes || input.priceKes <= 0) {
      errors.push("Price must be greater than zero");
    }
    if (!input.durationDays || input.durationDays <= 0) {
      errors.push("Duration must be at least 1 day");
    }
  }

  if (!input.slug.trim()) errors.push("Slug is required");
  if (!/^[a-z0-9-]+$/.test(input.slug)) {
    errors.push("Slug may only contain lowercase letters, numbers, and hyphens");
  }
  if (!input.description.trim()) errors.push("Description is required");
  if (!input.destinationId) errors.push("Destination is required");

  return errors;
}

async function checkSlug(
  slug: string,
  type: ListingType,
  excludeId?: number
): Promise<boolean> {
  if (type === "accommodation") {
    const existing = await prisma.accommodation.findUnique({
      where: { slug },
      select: { id: true },
    });
    return !existing || existing.id === excludeId;
  } else {
    const existing = await prisma.tourPackage.findUnique({
      where: { slug },
      select: { id: true },
    });
    return !existing || existing.id === excludeId;
  }
}

async function checkDestination(destinationId: number): Promise<boolean> {
  const dest = await prisma.destination.findUnique({
    where: { id: destinationId },
    select: { id: true },
  });
  return !!dest;
}

// ─── Authorization: can this user create/edit this listing type? ───

function canCreateType(role: AuthedUser["role"], type: ListingType): boolean {
  // OPERATOR can only create packages.
  if (role === "OPERATOR") return type === "package";
  // BUSINESS can create either — hotels can also sell packages.
  return true;
}

// ─── Create ─────────────────────────────────────────────────────────

export async function createListing(
  input: ListingInput
): Promise<ListingActionResult> {
  let user: AuthedUser;
  try {
    user = await requireLister();
  } catch (e) {
    return { ok: false, errors: [e instanceof Error ? e.message : "Unauthorized"] };
  }

  if (!canCreateType(user.role, input.type)) {
    return {
      ok: false,
      errors: ["Your account cannot create this type of listing."],
    };
  }

  const errors = validateBaseInput(input);
  if (errors.length) return { ok: false, errors };

  if (!(await checkSlug(input.slug, input.type))) {
    return { ok: false, errors: ["That slug is already taken"] };
  }
  if (!(await checkDestination(input.destinationId))) {
    return { ok: false, errors: ["Destination not found"] };
  }

  // Pending users can create listings but can't publish them.
  const published = user.verificationStatus === "APPROVED" && input.published;

  try {
    if (input.type === "accommodation") {
      const created = await prisma.accommodation.create({
        data: {
          name: input.name.trim(),
          slug: input.slug.trim(),
          type: input.accommodationType,
          description: input.description.trim(),
          location: input.location.trim(),
          priceRange: input.priceRange?.trim() || null,
          imageUrl: input.imageUrl?.trim() || null,
          destinationId: input.destinationId,
          businessId: user.userId,
          published,
        },
      });
      revalidatePath("/dashboard/listings");
      revalidatePath("/stay");
      return { ok: true, id: created.id, type: "accommodation" };
    } else {
      const created = await prisma.tourPackage.create({
        data: {
          title: input.title.trim(),
          slug: input.slug.trim(),
          summary: input.summary.trim(),
          description: input.description.trim(),
          priceKes: Math.floor(input.priceKes),
          durationDays: Math.floor(input.durationDays),
          imageUrl: input.imageUrl?.trim() || null,
          destinationId: input.destinationId,
          businessId: user.userId,
          published,
          featured: false,
          itinerary: input.itinerary ?? [],
        },
      });
      revalidatePath("/dashboard/listings");
      revalidatePath("/dashboard/listings/packages");
      revalidatePath("/packages");
      return { ok: true, id: created.id, type: "package" };
    }
  } catch (e) {
    return {
      ok: false,
      errors: [e instanceof Error ? e.message : "Failed to create listing"],
    };
  }
}

// ─── Update ─────────────────────────────────────────────────────────

export async function updateListing(
  id: number,
  type: ListingType,
  input: ListingInput
): Promise<ListingActionResult> {
  let user: AuthedUser;
  try {
    user = await requireLister();
  } catch (e) {
    return { ok: false, errors: [e instanceof Error ? e.message : "Unauthorized"] };
  }

  if (!canCreateType(user.role, type)) {
    return {
      ok: false,
      errors: ["Your account cannot edit this type of listing."],
    };
  }

  const errors = validateBaseInput(input);
  if (errors.length) return { ok: false, errors };

  // Ownership check — the listing must belong to this user.
  if (type === "accommodation") {
    const existing = await prisma.accommodation.findUnique({
      where: { id },
      select: { businessId: true },
    });
    if (!existing) return { ok: false, errors: ["Listing not found"] };
    if (existing.businessId !== user.userId) {
      return { ok: false, errors: ["You don't own this listing"] };
    }
  } else {
    const existing = await prisma.tourPackage.findUnique({
      where: { id },
      select: { businessId: true },
    });
    if (!existing) return { ok: false, errors: ["Listing not found"] };
    if (existing.businessId !== user.userId) {
      return { ok: false, errors: ["You don't own this listing"] };
    }
  }

  if (!(await checkSlug(input.slug, type, id))) {
    return { ok: false, errors: ["That slug is already taken"] };
  }
  if (!(await checkDestination(input.destinationId))) {
    return { ok: false, errors: ["Destination not found"] };
  }

  // Pending users can't flip a listing to published.
  const published = user.verificationStatus === "APPROVED" && input.published;

  try {
    if (input.type === "accommodation" && type === "accommodation") {
      await prisma.accommodation.update({
        where: { id },
        data: {
          name: input.name.trim(),
          slug: input.slug.trim(),
          type: input.accommodationType,
          description: input.description.trim(),
          location: input.location.trim(),
          priceRange: input.priceRange?.trim() || null,
          imageUrl: input.imageUrl?.trim() || null,
          destinationId: input.destinationId,
          published,
        },
      });
    } else if (input.type === "package" && type === "package") {
      await prisma.tourPackage.update({
        where: { id },
        data: {
          title: input.title.trim(),
          slug: input.slug.trim(),
          summary: input.summary.trim(),
          description: input.description.trim(),
          priceKes: Math.floor(input.priceKes),
          durationDays: Math.floor(input.durationDays),
          imageUrl: input.imageUrl?.trim() || null,
          destinationId: input.destinationId,
          published,
          itinerary: input.itinerary ?? [],
        },
      });
    } else {
      return { ok: false, errors: ["Type mismatch"] };
    }

    revalidatePath("/dashboard/listings");
    revalidatePath("/dashboard/listings/packages");
    revalidatePath("/stay");
    revalidatePath("/packages");
    return { ok: true, id, type };
  } catch (e) {
    return {
      ok: false,
      errors: [e instanceof Error ? e.message : "Failed to update listing"],
    };
  }
}

// ─── Unpublish (soft delete) ───────────────────────────────────────

export async function unpublishListing(
  id: number,
  type: ListingType
): Promise<{ ok: true } | { ok: false; error: string }> {
  let user: AuthedUser;
  try {
    user = await requireLister();
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unauthorized",
    };
  }

  if (type === "accommodation") {
    const existing = await prisma.accommodation.findUnique({
      where: { id },
      select: { businessId: true },
    });
    if (!existing) return { ok: false, error: "Listing not found" };
    if (existing.businessId !== user.userId) {
      return { ok: false, error: "You don't own this listing" };
    }
    await prisma.accommodation.update({
      where: { id },
      data: { published: false },
    });
  } else {
    const existing = await prisma.tourPackage.findUnique({
      where: { id },
      select: { businessId: true },
    });
    if (!existing) return { ok: false, error: "Listing not found" };
    if (existing.businessId !== user.userId) {
      return { ok: false, error: "You don't own this listing" };
    }
    await prisma.tourPackage.update({
      where: { id },
      data: { published: false },
    });
  }

  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard/listings/packages");
  revalidatePath("/stay");
  revalidatePath("/packages");
  return { ok: true };
}