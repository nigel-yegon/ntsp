// app/dashboard/listings/package-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireBusinessOrOperator() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (session.user.role !== "BUSINESS" && session.user.role !== "OPERATOR") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// Match the shape ListingForm emits for a package
export type PackageListingInput = {
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
};

export type ListingActionResult =
  | { ok: true; id: number }
  | { ok: false; errors: string[] };

export async function createOperatorPackage(
  input: PackageListingInput
): Promise<ListingActionResult> {
  try {
    const user = await requireBusinessOrOperator();

    // Validate
    const errors: string[] = [];
    if (!input.title || input.title.trim().length < 3) {
      errors.push("Title must be at least 3 characters.");
    }
    if (!input.slug || !/^[a-z0-9-]+$/.test(input.slug)) {
      errors.push("Slug must be lowercase letters, numbers, and hyphens only.");
    }
    if (!input.summary || input.summary.trim().length < 10) {
      errors.push("Summary must be at least 10 characters.");
    }
    if (!input.description || input.description.trim().length < 20) {
      errors.push("Description must be at least 20 characters.");
    }
    if (input.priceKes <= 0) {
      errors.push("Price must be greater than zero.");
    }
    if (input.durationDays <= 0) {
      errors.push("Duration must be at least 1 day.");
    }

    if (errors.length > 0) {
      return { ok: false, errors };
    }

    // Check for slug collision (scoped to this user's packages — slugs are global, so check global)
    const existing = await prisma.tourPackage.findUnique({
      where: { slug: input.slug },
      select: { id: true },
    });
    if (existing) {
      return { ok: false, errors: ["A package with this slug already exists."] };
    }

    const created = await prisma.tourPackage.create({
      data: {
        title: input.title.trim(),
        slug: input.slug,
        summary: input.summary.trim(),
        description: input.description.trim(),
        priceKes: input.priceKes,
        durationDays: input.durationDays,
        imageUrl: input.imageUrl,
        destinationId: input.destinationId,
        published: input.published,
        businessId: user.id,
      },
    });

    revalidatePath("/dashboard/listings/packages");
    revalidatePath("/packages");
    revalidatePath(`/packages/${created.slug}`);
    return { ok: true, id: created.id };
  } catch (err) {
    console.error("createOperatorPackage failed:", err);
    return {
      ok: false,
      errors: [
        err instanceof Error ? err.message : "Failed to create package.",
      ],
    };
  }
}