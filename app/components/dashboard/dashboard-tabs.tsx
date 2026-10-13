// app/components/dashboard/dashboard-tabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CUSTOMER_TABS = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/applications", label: "Applications" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/messages", label: "Messages" },
];

const BUSINESS_TABS = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/listings", label: "Listings" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/messages", label: "Messages" },
];

export function DashboardTabs({ role }: { role: string }) {
  const pathname = usePathname();
  const tabs = role === "BUSINESS" ? BUSINESS_TABS : CUSTOMER_TABS;

  return (
    <nav
      aria-label="Dashboard"
      className="flex flex-wrap gap-1 rounded-xl border border-cream-300 bg-cream-100 p-1 dark:border-deep-700 dark:bg-deep-900"
    >
      {tabs.map((t) => {
        const active = t.exact
          ? pathname === t.href
          : pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-brand-400 text-deep-800"
                : "text-deep-700 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-800"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}