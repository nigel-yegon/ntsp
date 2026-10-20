// app/admin/actions/businesses.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { BusinessVerification } from "@/lib/generated/prisma/enums";

export type BusinessRow = {
  id: string;
  userId: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
  registrationNo: string | null;
  kraPin: string | null;
  website: string | null;
  description: string | null;
  logoUrl: string | null;
  businessType: string | null;
  traLicenseNumber: string | null;
  traLicenseDocUrl: string | null;
  katoMember: boolean;
  ktbRegistered: boolean;
  verificationStatus: BusinessVerification;
  approvedAt: Date | null;
  approvedById: string | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string;
  userName: string;
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

  const businesses = await prisma.businessProfile.findMany({
    orderBy: [{ verificationStatus: "asc" }, { createdAt: "desc" }],
    include: {
      user: {
        select: {
          email: true,
          name: true,
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

  return businesses.map((b) => ({
    id: b.id,
    userId: b.userId,
    businessName: b.businessName,
    contactEmail: b.contactEmail,
    contactPhone: b.contactPhone,
    registrationNo: b.registrationNo,
    kraPin: b.kraPin,
    website: b.website,
    description: b.description,
    logoUrl: b.logoUrl,
    businessType: b.businessType,
    traLicenseNumber: b.traLicenseNumber,
    traLicenseDocUrl: b.traLicenseDocUrl,
    katoMember: b.katoMember,
    ktbRegistered: b.ktbRegistered,
    verificationStatus: b.verificationStatus,
    approvedAt: b.approvedAt,
    approvedById: b.approvedById,
    rejectionReason: b.rejectionReason,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    userEmail: b.user.email,
    userName: b.user.name,
    listingCount:
      b.user._count.ownedAccommodations + b.user._count.ownedTourPackages,
  }));
}

export async function setBusinessStatus(
  id: string,
  status: BusinessVerification,
  reason?: string
): Promise<string | null> {
  try {
    const admin = await requireAdmin();
    await prisma.businessProfile.update({
      where: { id },
      data: {
        verificationStatus: status,
        approvedAt: status === "APPROVED" ? new Date() : null,
        approvedById: status === "APPROVED" ? admin.id : null,
        rejectionReason: status === "REJECTED" ? reason?.slice(0, 500) : null,
      },
    });
    revalidatePath("/admin");
    return null;
  } catch (err) {
    console.error("setBusinessStatus failed:", err);
    return err instanceof Error ? err.message : "Failed to update status.";
  }
}

export async function approveBusiness(id: string): Promise<string | null> {
  return setBusinessStatus(id, "APPROVED");
}

export async function rejectBusiness(
  id: string,
  reason: string
): Promise<string | null> {
  return setBusinessStatus(id, "REJECTED", reason);
}