// import { DashboardClient } from "./dashboard-client";

// export const metadata = {
//   title: "Admin — NTSP",
// };

// export const dynamic = "force-dynamic";

// export default function AdminPage() {
//   return <DashboardClient />;
// }

// app/admin/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [pending, approved, suspended, customerCount, businessCount] =
    await Promise.all([
      prisma.businessProfile.count({ where: { verificationStatus: "PENDING" } }),
      prisma.businessProfile.count({ where: { verificationStatus: "APPROVED" } }),
      prisma.businessProfile.count({ where: { verificationStatus: "SUSPENDED" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.user.count({ where: { role: "BUSINESS" } }),
    ]);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Pending businesses"
        count={pending}
        href="/admin/businesses?status=PENDING"
        hint="Awaiting your review"
        highlight={pending > 0}
      />
      <StatCard
        label="Approved businesses"
        count={approved}
        href="/admin/businesses?status=APPROVED"
        hint="Publicly visible"
      />
      <StatCard
        label="Suspended"
        count={suspended}
        href="/admin/businesses?status=SUSPENDED"
        hint="Hidden from public site"
      />
      <StatCard
        label="Business users"
        count={businessCount}
        href="/admin/businesses"
        hint="Total accounts"
      />
      <StatCard
        label="Travellers"
        count={customerCount}
        href="#"
        hint="Customer accounts"
      />
    </div>
  );
}

function StatCard({
  label,
  count,
  href,
  hint,
  highlight,
}: {
  label: string;
  count: number;
  href: string;
  hint: string;
  highlight?: boolean;
}) {
  const base =
    "rounded-2xl border bg-cream-50 p-5 transition dark:bg-deep-900";
  const tone = highlight
    ? "border-brand-400 dark:border-brand-500"
    : "border-cream-300 hover:border-brand-400 dark:border-deep-700 dark:hover:border-brand-500";

  return (
    <Link href={href} className={`${base} ${tone}`}>
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