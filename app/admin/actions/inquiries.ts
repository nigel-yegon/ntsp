"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type InquiryStatus =
  | "NEW"
  | "IN_REVIEW"
  | "CONTACTED"
  | "CLOSED";

export type InvestorInquiryRow = {
  id: string;
  referenceNo: string;
  status: InquiryStatus;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  investorType: string | null;
  interests: string[];
  scale: string | null;
  message: string;
  reviewedById: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;
  reviewerName: string | null;
  createdAt: Date;
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function listInvestorInquiries(): Promise<InvestorInquiryRow[]> {
  await requireAdmin();
  const rows = await prisma.investorInquiry.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { reviewedBy: { select: { name: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    referenceNo: r.referenceNo,
    status: r.status as InquiryStatus,
    fullName: r.fullName,
    email: r.email,
    phone: r.phone,
    company: r.company,
    country: r.country,
    investorType: r.investorType,
    interests: r.interests,
    scale: r.scale,
    message: r.message,
    reviewedById: r.reviewedById,
    reviewedAt: r.reviewedAt,
    reviewNotes: r.reviewNotes,
    reviewerName: r.reviewedBy?.name ?? null,
    createdAt: r.createdAt,
  }));
}

export async function updateInvestorInquiryStatus(input: {
  id: string;
  status: InquiryStatus;
  reviewNotes?: string;
}): Promise<InvestorInquiryRow> {
  const admin = await requireAdmin();

  const updated = await prisma.investorInquiry.update({
    where: { id: input.id },
    data: {
      status: input.status,
      reviewedById: admin.id,
      reviewedAt: new Date(),
      reviewNotes:
        typeof input.reviewNotes === "string"
          ? input.reviewNotes.trim() || null
          : undefined,
    },
    include: { reviewedBy: { select: { name: true } } },
  });

  revalidatePath("/admin");

  return {
    id: updated.id,
    referenceNo: updated.referenceNo,
    status: updated.status as InquiryStatus,
    fullName: updated.fullName,
    email: updated.email,
    phone: updated.phone,
    company: updated.company,
    country: updated.country,
    investorType: updated.investorType,
    interests: updated.interests,
    scale: updated.scale,
    message: updated.message,
    reviewedById: updated.reviewedById,
    reviewedAt: updated.reviewedAt,
    reviewNotes: updated.reviewNotes,
    reviewerName: updated.reviewedBy?.name ?? null,
    createdAt: updated.createdAt,
  };
}