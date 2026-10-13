// app/admin/actions/businesses.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type BusinessRow = {
  id: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
  registrationNo: string | null;
  kraPin: string | null;
  website: string | null;
  description: string | null;
  verificationStatus: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
  approvedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  ownerName: string;
  ownerEmail: string;
  listingCount: number;
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function listBusinesses(): Promise<BusinessRow[]> {
  await requireAdmin();

  const rows = await prisma.businessProfile.findMany({
    orderBy: [{ verificationStatus: "asc" }, { createdAt: "desc" }],
    include: {
      user: {
        select: {
          name: true,
          email: true,
          _count: {
            select: {
              ownedAccommodations: true,
              ownedTourPackages: true,
            },
          },
        },
      },
    },
  });

  return rows.map((b) => ({
    id: b.id,
    businessName: b.businessName,
    contactEmail: b.contactEmail,
    contactPhone: b.contactPhone,
    registrationNo: b.registrationNo,
    kraPin: b.kraPin,
    website: b.website,
    description: b.description,
    verificationStatus: b.verificationStatus,
    approvedAt: b.approvedAt,
    rejectionReason: b.rejectionReason,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    ownerName: b.user.name,
    ownerEmail: b.user.email,
    listingCount:
      b.user._count.ownedAccommodations + b.user._count.ownedTourPackages,
  }));
}

export async function setBusinessStatus(
  id: string,
  status: "APPROVED" | "REJECTED" | "SUSPENDED" | "PENDING",
  reason?: string
) {
  const admin = await requireAdmin();

  const profile = await prisma.businessProfile.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!profile) throw new Error("Business not found");

  await prisma.businessProfile.update({
    where: { id },
    data: {
      verificationStatus: status,
      approvedAt: status === "APPROVED" ? new Date() : null,
      approvedById: status === "APPROVED" ? admin.id : null,
      rejectionReason:
        status === "REJECTED" ? reason?.trim() || null : null,
    },
  });

  revalidatePath("/admin");
}