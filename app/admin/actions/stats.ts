// app/admin/actions/stats.ts
"use server";

import { prisma } from "@/lib/prisma";

// ─── Range ─────────────────────────────────────────────────────────
// Weekly, monthly, or yearly. A single-day bucket is noise for a
// dashboard like this one; yearly covers the practical maximum for
// the current dataset.
export type StatsRange = "week" | "month" | "year";

// ─── Bucket ────────────────────────────────────────────────────────
// One point in the activity series.
//   Week/Month → `date` is `YYYY-MM-DD` (one point per day)
//   Year       → `date` is `YYYY-MM` (one point per month)
export type Bucket = {
  date: string;
  businesses: number;
  operators: number;
  incidents: number;
  inquiries: number;
};

export type DashboardStats = {
  totals: {
    businesses: number;
    operators: number;
    incidents: number;
    inquiries: number;
  };
  inRange: {
    businesses: number;
    operators: number;
    incidents: number;
    inquiries: number;
  };
  series: Bucket[];
  businesses: {
    total: number;
    pending: number;
    approved: number;
    byType: { accommodation: number; tourOperator: number };
  };
  operators: {
    total: number;
    pending: number;
    approved: number;
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
    packages: { total: number; published: number; featured: number };
    stays: { total: number };
    events: { total: number; upcoming: number; featured: number };
    posts: { total: number; published: number };
  };
  activity: {
    recentIncidents: {
      id: string;
      title: string;
      category: string;
      referenceNo: string;
      status: string;
      reportedAt: Date;
    }[];
    recentInquiries: {
      id: string;
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

// ─── Date helpers ──────────────────────────────────────────────────

function startOfDayUTC(d: Date): Date {
  const c = new Date(d);
  c.setUTCHours(0, 0, 0, 0);
  return c;
}

function startOfMonthUTC(d: Date): Date {
  const c = startOfDayUTC(d);
  c.setUTCDate(1);
  return c;
}

function daysAgo(n: number): Date {
  const d = startOfDayUTC(new Date());
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

function monthsAgo(n: number): Date {
  const d = startOfMonthUTC(new Date());
  d.setUTCMonth(d.getUTCMonth() - n);
  return d;
}

/**
 * Determines which rows are included in the range-restricted counts
 * and in the chart's source data.
 */
function rangeToSince(range: StatsRange): Date {
  switch (range) {
    case "week":
      return daysAgo(6);
    case "month":
      return daysAgo(29);
    case "year":
      return monthsAgo(11);
  }
}

// ─── Bucketing ─────────────────────────────────────────────────────

type RawRows = {
  businesses: { createdAt: Date }[];
  operators: { createdAt: Date }[];
  incidents: { reportedAt: Date }[];
  inquiries: { createdAt: Date }[];
};

function bucketByDay(range: "week" | "month", raw: RawRows): Bucket[] {
  const days = range === "week" ? 7 : 30;
  const buckets: Bucket[] = [];
  const byDate: Record<string, Bucket> = {};

  for (let i = days - 1; i >= 0; i--) {
    const key = daysAgo(i).toISOString().slice(0, 10);
    const bucket: Bucket = {
      date: key,
      businesses: 0,
      operators: 0,
      incidents: 0,
      inquiries: 0,
    };
    buckets.push(bucket);
    byDate[key] = bucket;
  }

  const bump = (
    date: Date,
    key: "businesses" | "operators" | "incidents" | "inquiries",
  ) => {
    const iso = startOfDayUTC(date).toISOString().slice(0, 10);
    if (byDate[iso]) byDate[iso][key] += 1;
  };

  for (const b of raw.businesses) bump(b.createdAt, "businesses");
  for (const o of raw.operators) bump(o.createdAt, "operators");
  for (const i of raw.incidents) bump(i.reportedAt, "incidents");
  for (const q of raw.inquiries) bump(q.createdAt, "inquiries");

  return buckets;
}

function bucketByMonth(raw: RawRows): Bucket[] {
  const buckets: Bucket[] = [];
  const byMonth: Record<string, Bucket> = {};

  for (let i = 11; i >= 0; i--) {
    const key = monthsAgo(i).toISOString().slice(0, 7); // YYYY-MM
    const bucket: Bucket = {
      date: key,
      businesses: 0,
      operators: 0,
      incidents: 0,
      inquiries: 0,
    };
    buckets.push(bucket);
    byMonth[key] = bucket;
  }

  const bump = (
    date: Date,
    key: "businesses" | "operators" | "incidents" | "inquiries",
  ) => {
    const iso = startOfMonthUTC(date).toISOString().slice(0, 7);
    if (byMonth[iso]) byMonth[iso][key] += 1;
  };

  for (const b of raw.businesses) bump(b.createdAt, "businesses");
  for (const o of raw.operators) bump(o.createdAt, "operators");
  for (const i of raw.incidents) bump(i.reportedAt, "incidents");
  for (const q of raw.inquiries) bump(q.createdAt, "inquiries");

  return buckets;
}

// ─── Main entry point ──────────────────────────────────────────────

export async function getDashboardStats(
  range: StatsRange = "month",
): Promise<DashboardStats> {
  const since = rangeToSince(range);
  const since7 = daysAgo(6);

  const [
    businessTotal,
    businessPending,
    businessApproved,
    businessByType,
    operatorTotal,
    operatorPending,
    operatorApproved,
    incidentTotal,
    incidentOpen,
    incidentReview,
    incidentEscalated,
    incidentResolved,
    incidentClosed,
    incidentLast7,
    inquiryTotal,
    inquiryNew,
    inquiryInReview,
    inquiryContacted,
    inquiryClosed,
    inquiryLast7,
    businessesInRange,
    operatorsInRange,
    incidentsInRange,
    inquiriesInRange,
    recentIncidents,
    recentInquiries,
    recentSignups,
    destinationTotal,
    destinationFeatured,
    experienceTotal,
    packageTotal,
    packagePublished,
    packageFeatured,
    stayTotal,
    eventTotal,
    eventUpcoming,
    eventFeatured,
    postTotal,
    postPublished,
    rawBusinesses,
    rawOperators,
    rawIncidents,
    rawInquiries,
  ] = await Promise.all([
    prisma.businessProfile.count(),
    prisma.businessProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.businessProfile.count({ where: { verificationStatus: "APPROVED" } }),
    prisma.businessProfile.groupBy({ by: ["businessType"], _count: true }),

    prisma.user.count({ where: { role: "OPERATOR" } }),
    prisma.businessProfile.count({
      where: { user: { role: "OPERATOR" }, verificationStatus: "PENDING" },
    }),
    prisma.businessProfile.count({
      where: { user: { role: "OPERATOR" }, verificationStatus: "APPROVED" },
    }),

    prisma.incident.count(),
    prisma.incident.count({ where: { status: "OPEN" } }),
    prisma.incident.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.incident.count({ where: { status: "ESCALATED" } }),
    prisma.incident.count({ where: { status: "RESOLVED" } }),
    prisma.incident.count({ where: { status: "CLOSED" } }),
    prisma.incident.count({ where: { reportedAt: { gte: since7 } } }),

    prisma.investorInquiry.count(),
    prisma.investorInquiry.count({ where: { status: "NEW" } }),
    prisma.investorInquiry.count({ where: { status: "IN_REVIEW" } }),
    prisma.investorInquiry.count({ where: { status: "CONTACTED" } }),
    prisma.investorInquiry.count({ where: { status: "CLOSED" } }),
    prisma.investorInquiry.count({ where: { createdAt: { gte: since7 } } }),

    prisma.businessProfile.count({ where: { createdAt: { gte: since } } }),
    prisma.user.count({ where: { role: "OPERATOR", createdAt: { gte: since } } }),
    prisma.incident.count({ where: { reportedAt: { gte: since } } }),
    prisma.investorInquiry.count({ where: { createdAt: { gte: since } } }),

    prisma.incident.findMany({
      orderBy: { reportedAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        category: true,
        referenceNo: true,
        status: true,
        reportedAt: true,
      },
    }),
    prisma.investorInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),

    prisma.destination.count(),
    prisma.destination.count({ where: { featured: true } }),
    prisma.attraction.count(),
    prisma.tourPackage.count(),
    prisma.tourPackage.count({ where: { published: true } }),
    prisma.tourPackage.count({ where: { featured: true } }),
    prisma.accommodation.count(),
    prisma.event.count(),
    prisma.event.count({ where: { startDate: { gte: new Date() } } }),
    prisma.event.count({ where: { featured: true } }),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),

    prisma.businessProfile.findMany({
      select: { createdAt: true },
      where: { createdAt: { gte: since } },
    }),
    prisma.user.findMany({
      select: { createdAt: true },
      where: { role: "OPERATOR", createdAt: { gte: since } },
    }),
    prisma.incident.findMany({
      select: { reportedAt: true },
      where: { reportedAt: { gte: since } },
    }),
    prisma.investorInquiry.findMany({
      select: { createdAt: true },
      where: { createdAt: { gte: since } },
    }),
  ]);

  const accommodationCount =
    businessByType.find((b) => b.businessType === "ACCOMMODATION")?._count ?? 0;
  const tourOperatorCount =
    businessByType.find((b) => b.businessType === "TOUR_OPERATOR")?._count ?? 0;

  const raw: RawRows = {
    businesses: rawBusinesses,
    operators: rawOperators,
    incidents: rawIncidents,
    inquiries: rawInquiries,
  };

  const series: Bucket[] =
    range === "year" ? bucketByMonth(raw) : bucketByDay(range, raw);

  return {
    totals: {
      businesses: businessTotal,
      operators: operatorTotal,
      incidents: incidentTotal,
      inquiries: inquiryTotal,
    },
    inRange: {
      businesses: businessesInRange,
      operators: operatorsInRange,
      incidents: incidentsInRange,
      inquiries: inquiriesInRange,
    },
    series,
    businesses: {
      total: businessTotal,
      pending: businessPending,
      approved: businessApproved,
      byType: {
        accommodation: accommodationCount,
        tourOperator: tourOperatorCount,
      },
    },
    operators: {
      total: operatorTotal,
      pending: operatorPending,
      approved: operatorApproved,
    },
    incidents: {
      total: incidentTotal,
      open: incidentOpen,
      underReview: incidentReview,
      escalated: incidentEscalated,
      resolved: incidentResolved,
      closed: incidentClosed,
      last7Days: incidentLast7,
    },
    inquiries: {
      total: inquiryTotal,
      new: inquiryNew,
      inReview: inquiryInReview,
      contacted: inquiryContacted,
      closed: inquiryClosed,
      last7Days: inquiryLast7,
    },
    content: {
      destinations: { total: destinationTotal, featured: destinationFeatured },
      experiences: { total: experienceTotal },
      packages: {
        total: packageTotal,
        published: packagePublished,
        featured: packageFeatured,
      },
      stays: { total: stayTotal },
      events: {
        total: eventTotal,
        upcoming: eventUpcoming,
        featured: eventFeatured,
      },
      posts: { total: postTotal, published: postPublished },
    },
    activity: {
      recentIncidents,
      recentInquiries,
      recentSignups,
    },
  };
}