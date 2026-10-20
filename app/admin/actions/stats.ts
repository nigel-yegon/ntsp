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

export type DashboardStats = {
  businesses: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byType: { accommodation: number; tourOperator: number };
  };
  operators: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  incidents: {
    total: number;
    open: number;
    underReview: number;
    escalated: number;
    resolved: number;
    closed: number;
    last7Days: number;
  };
  inquiries: {
    total: number;
    new: number;
    inReview: number;
    contacted: number;
    closed: number;
    last7Days: number;
  };
  content: {
    destinations: { total: number; featured: number };
    experiences: { total: number };
    packages: { total: number; featured: number; published: number };
    stays: { total: number };
    events: { total: number; featured: number; upcoming: number };
    posts: { total: number; published: number };
  };
  activity: {
    recentIncidents: {
      id: string;
      referenceNo: string;
      title: string;
      status: string;
      category: string;
      reportedAt: Date;
    }[];
    recentInquiries: {
      id: string;
      referenceNo: string;
      fullName: string;
      email: string;
      status: string;
      createdAt: Date;
    }[];
    recentSignups: {
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: Date;
    }[];
  };
};

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    businessesTotal,
    businessesPending,
    businessesApproved,
    businessesRejected,
    businessTypeGroups,
    operatorsTotal,
    operatorsPending,
    operatorsApproved,
    operatorsRejected,
    incidentsTotal,
    incidentsOpen,
    incidentsUnderReview,
    incidentsEscalated,
    incidentsResolved,
    incidentsClosed,
    incidentsLast7Days,
    inquiriesTotal,
    inquiriesNew,
    inquiriesInReview,
    inquiriesContacted,
    inquiriesClosed,
    inquiriesLast7Days,
    destinationsTotal,
    destinationsFeatured,
    experiencesTotal,
    packagesTotal,
    packagesFeatured,
    packagesPublished,
    staysTotal,
    eventsTotal,
    eventsFeatured,
    eventsUpcoming,
    postsTotal,
    postsPublished,
    recentIncidents,
    recentInquiries,
    recentSignups,
  ] = await Promise.all([
    // Businesses
    prisma.businessProfile.count(),
    prisma.businessProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.businessProfile.count({ where: { verificationStatus: "APPROVED" } }),
    prisma.businessProfile.count({ where: { verificationStatus: "REJECTED" } }),
    prisma.businessProfile.groupBy({
      by: ["businessType"],
      _count: { _all: true },
    }),
    // Operators
    prisma.businessProfile.count({ where: { businessType: "TOUR_OPERATOR" } }),
    prisma.businessProfile.count({
      where: { businessType: "TOUR_OPERATOR", verificationStatus: "PENDING" },
    }),
    prisma.businessProfile.count({
      where: { businessType: "TOUR_OPERATOR", verificationStatus: "APPROVED" },
    }),
    prisma.businessProfile.count({
      where: { businessType: "TOUR_OPERATOR", verificationStatus: "REJECTED" },
    }),
    // Incidents
    prisma.incident.count(),
    prisma.incident.count({ where: { status: "OPEN" } }),
    prisma.incident.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.incident.count({ where: { status: "ESCALATED" } }),
    prisma.incident.count({ where: { status: "RESOLVED" } }),
    prisma.incident.count({ where: { status: "CLOSED" } }),
    prisma.incident.count({ where: { reportedAt: { gte: sevenDaysAgo } } }),
    // Inquiries
    prisma.investorInquiry.count(),
    prisma.investorInquiry.count({ where: { status: "NEW" } }),
    prisma.investorInquiry.count({ where: { status: "IN_REVIEW" } }),
    prisma.investorInquiry.count({ where: { status: "CONTACTED" } }),
    prisma.investorInquiry.count({ where: { status: "CLOSED" } }),
    prisma.investorInquiry.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    // Content
    prisma.destination.count(),
    prisma.destination.count({ where: { featured: true } }),
    prisma.attraction.count(),
    prisma.tourPackage.count(),
    prisma.tourPackage.count({ where: { featured: true } }),
    prisma.tourPackage.count({ where: { published: true } }),
    prisma.accommodation.count(),
    prisma.event.count(),
    prisma.event.count({ where: { featured: true } }),
    prisma.event.count({ where: { startDate: { gte: now } } }),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    // Activity
    prisma.incident.findMany({
      orderBy: { reportedAt: "desc" },
      take: 5,
      select: {
        id: true,
        referenceNo: true,
        title: true,
        status: true,
        category: true,
        reportedAt: true,
      },
    }),
    prisma.investorInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        referenceNo: true,
        fullName: true,
        email: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  const accommodationCount =
    businessTypeGroups.find((g) => g.businessType === "ACCOMMODATION")?._count
      ._all ?? 0;
  const tourOperatorCount =
    businessTypeGroups.find((g) => g.businessType === "TOUR_OPERATOR")?._count
      ._all ?? 0;

  return {
    businesses: {
      total: businessesTotal,
      pending: businessesPending,
      approved: businessesApproved,
      rejected: businessesRejected,
      byType: {
        accommodation: accommodationCount,
        tourOperator: tourOperatorCount,
      },
    },
    operators: {
      total: operatorsTotal,
      pending: operatorsPending,
      approved: operatorsApproved,
      rejected: operatorsRejected,
    },
    incidents: {
      total: incidentsTotal,
      open: incidentsOpen,
      underReview: incidentsUnderReview,
      escalated: incidentsEscalated,
      resolved: incidentsResolved,
      closed: incidentsClosed,
      last7Days: incidentsLast7Days,
    },
    inquiries: {
      total: inquiriesTotal,
      new: inquiriesNew,
      inReview: inquiriesInReview,
      contacted: inquiriesContacted,
      closed: inquiriesClosed,
      last7Days: inquiriesLast7Days,
    },
    content: {
      destinations: { total: destinationsTotal, featured: destinationsFeatured },
      experiences: { total: experiencesTotal },
      packages: {
        total: packagesTotal,
        featured: packagesFeatured,
        published: packagesPublished,
      },
      stays: { total: staysTotal },
      events: {
        total: eventsTotal,
        featured: eventsFeatured,
        upcoming: eventsUpcoming,
      },
      posts: { total: postsTotal, published: postsPublished },
    },
    activity: {
      recentIncidents,
      recentInquiries,
      recentSignups,
    },
  };
}