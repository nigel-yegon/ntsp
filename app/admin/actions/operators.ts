// app/admin/actions/operators.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type OperatorRow = {
  id: string;
  userId: string; // Added to allow filtering packages if needed
  businessName: string;
  contactEmail: string;
  traLicenseNumber: string | null;
  traLicenseDocUrl: string | null;
  katoMember: boolean;
  verificationStatus: string;
  createdAt: Date;
  userEmail: string;
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function listOperators(): Promise<OperatorRow[]> {
  await requireAdmin();
  const rows = await prisma.businessProfile.findMany({
    where: { businessType: "TOUR_OPERATOR" },
    orderBy: [{ verificationStatus: "asc" }, { createdAt: "desc" }],
    include: {
      user: { select: { email: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    businessName: r.businessName,
    contactEmail: r.contactEmail,
    traLicenseNumber: r.traLicenseNumber,
    traLicenseDocUrl: r.traLicenseDocUrl,
    katoMember: r.katoMember,
    verificationStatus: r.verificationStatus,
    createdAt: r.createdAt,
    userEmail: r.user.email,
  }));
}

export async function approveOperator(id: string): Promise<string | null> {
  try {
    const admin = await requireAdmin();
    await prisma.businessProfile.update({
      where: { id },
      data: {
        verificationStatus: "APPROVED",
        approvedAt: new Date(),
        approvedById: admin.id,
        rejectionReason: null,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/operators");
    return null;
  } catch (err) {
    console.error("approveOperator failed:", err);
    return err instanceof Error ? err.message : "Failed to approve operator.";
  }
}

export async function rejectOperator(
  id: string,
  reason: string
): Promise<string | null> {
  try {
    await requireAdmin();
    
    // 1. Reject the profile
    const profile = await prisma.businessProfile.update({
      where: { id },
      data: {
        verificationStatus: "REJECTED",
        rejectionReason: reason.slice(0, 500),
        approvedAt: null,
        approvedById: null,
      },
    });

    // 2. Unpublish their tour packages so they disappear from the public site
    if (profile.userId) {
      await prisma.tourPackage.updateMany({
        where: { businessId: profile.userId },
        data: { published: false },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/operators");
    revalidatePath("/packages");
    return null;
  } catch (err) {
    console.error("rejectOperator failed:", err);
    return err instanceof Error ? err.message : "Failed to reject operator.";
  }
}