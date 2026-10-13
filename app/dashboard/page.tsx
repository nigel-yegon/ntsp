// app/dashboard/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardOverviewPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  if (session.user.role === "BUSINESS") {
    return <BusinessOverview userId={session.user.id} />;
  }

  return <CustomerOverview userId={session.user.id} email={session.user.email} />;
}

async function CustomerOverview({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const [applications, bookings, threads] = await Promise.all([
    prisma.application.count({ where: { applicantEmail: email } }),
    prisma.booking.count({ where: { customerId: userId } }),
    prisma.messageThread.count({ where: { customerId: userId } }),
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Applications"
        count={applications}
        href="/dashboard/applications"
        hint="Work permits filed with your email"
      />
      <StatCard
        label="Bookings"
        count={bookings}
        href="/dashboard/bookings"
        hint="Stay and package requests"
      />
      <StatCard
        label="Messages"
        count={threads}
        href="/dashboard/messages"
        hint="Conversations with businesses"
      />
    </div>
  );
}

function StatCard({
  label,
  count,
  href,
  hint,
}: {
  label: string;
  count: number;
  href: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-cream-300 bg-cream-50 p-5 transition hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-500"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-deep-500 dark:text-cream-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-deep-800 dark:text-cream-100">
        {count}
      </p>
      <p className="mt-1 text-xs text-deep-500 dark:text-cream-400">{hint}</p>
    </Link>
  );
}

async function BusinessOverview({ userId }: { userId: string }) {
  const [profile, listings, pendingBookings, unreadThreads] = await Promise.all([
    prisma.businessProfile.findUnique({
      where: { userId },
      select: { businessName: true, verificationStatus: true },
    }),
    Promise.all([
      prisma.accommodation.count({ where: { businessId: userId } }),
      prisma.tourPackage.count({ where: { businessId: userId } }),
    ]).then(([a, p]) => a + p),
    prisma.booking.count({ where: { businessId: userId, status: "REQUESTED" } }),
    prisma.messageThread.count({
      where: {
        businessId: userId,
        messages: {
          some: { readByBusiness: false, authorId: { not: userId } },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-4">
      {profile?.verificationStatus === "PENDING" && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          Your account is pending administrator review. You can prepare your
          listings, but they won't be publicly visible until approved.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Listings"
          count={listings}
          href="/dashboard/listings"
          hint="Accommodations and packages you own"
        />
        <StatCard
          label="Awaiting response"
          count={pendingBookings}
          href="/dashboard/bookings"
          hint="Booking requests you haven't answered"
        />
        <StatCard
          label="Unread inquiries"
          count={unreadThreads}
          href="/dashboard/messages"
          hint="Threads with new messages"
        />
      </div>
    </div>
  );
}