// app/dashboard/listings/package-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireBusinessUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "BUSINESS") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export type PackageFormData = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  priceKes: number;
  durationDays: number;
  destinationId: number;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  published: boolean;
};

export async function createOperatorPackage(data: PackageFormData) {
  const user = await requireBusinessUser();

  // Enforce unique slug at DB level
  const existing = await prisma.tourPackage.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    return { error: "A package with this slug already exists." };
  }

  const created = await prisma.tourPackage.create({
    data: {
      ...data,
      businessId: user.id,
    },
  });

  revalidatePath("/dashboard/listings/packages");
  revalidatePath("/packages");
  revalidatePath(`/packages/${created.slug}`);
  return { success: true, id: created.id };
}

export async function updateOperatorPackage(
  id: number,
  data: Partial<PackageFormData>
) {
  const user = await requireBusinessUser();

  // Verify ownership
  const existing = await prisma.tourPackage.findUnique({
    where: { id },
    select: { businessId: true, slug: true },
  });
  if (!existing) return { error: "Package not found." };
  if (existing.businessId !== user.id) {
    return { error: "You do not have permission to edit this package." };
  }

  await prisma.tourPackage.update({
    where: { id },
    data,
  });

  revalidatePath("/dashboard/listings/packages");
  revalidatePath("/packages");
  revalidatePath(`/packages/${data.slug ?? existing.slug}`);
  return { success: true };
}

export async function deleteOperatorPackage(id: number) {
  const user = await requireBusinessUser();

  const existing = await prisma.tourPackage.findUnique({
    where: { id },
    select: { businessId: true, slug: true },
  });
  if (!existing) return { error: "Package not found." };
  if (existing.businessId !== user.id) {
    return { error: "You do not have permission to delete this package." };
  }

  // Prevent deleting if there are active bookings
  const activeBookings = await prisma.booking.count({
    where: {
      tourPackageId: id,
      status: { in: ["REQUESTED", "CONFIRMED"] },
    },
  });
  if (activeBookings > 0) {
    return {
      error: `Cannot delete — this package has ${activeBookings} active booking(s).`,
    };
  }

  await prisma.tourPackage.delete({ where: { id } });

  revalidatePath("/dashboard/listings/packages");
  revalidatePath("/packages");
  revalidatePath(`/packages/${existing.slug}`);
  return { success: true };
}

export async function togglePackagePublish(id: number) {
  const user = await requireBusinessUser();

  const pkg = await prisma.tourPackage.findUnique({
    where: { id },
    select: { businessId: true, published: true, slug: true },
  });
  if (!pkg) return { error: "Package not found." };
  if (pkg.businessId !== user.id) return { error: "Forbidden." };

  await prisma.tourPackage.update({
    where: { id },
    data: { published: !pkg.published },
  });

  revalidatePath("/dashboard/listings/packages");
  revalidatePath("/packages");
  revalidatePath(`/packages/${pkg.slug}`);
  return { success: true };
}