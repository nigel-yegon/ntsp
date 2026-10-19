// app/admin/actions/stats.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

/**
 * Cheap aggregate counts for the overview cards.
 * Runs three `count()` queries in parallel — no rows loaded, no
 * relations included. Called once on dashboard mount alongside the
 * existing list*() calls.
 */
export async function countModuleRows(): Promise<{
  businesses: { total: number; pending: number };
  incidents: { total: number; open: number };
  inquiries: { total: number; new: number };
}> {
  await requireAdmin();

  const [
    businessesTotal,
    businessesPending,
    incidentsTotal,
    incidentsOpen,
    inquiriesTotal,
    inquiriesNew,
  ] = await Promise.all([
    prisma.businessProfile.count(),
    prisma.businessProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.incident.count(),
    prisma.incident.count({ where: { status: "OPEN" } }),
    prisma.investorInquiry.count(),
    prisma.investorInquiry.count({ where: { status: "NEW" } }),
  ]);

  return {
    businesses: { total: businessesTotal, pending: businessesPending },
    incidents: { total: incidentsTotal, open: incidentsOpen },
    inquiries: { total: inquiriesTotal, new: inquiriesNew },
  };
}