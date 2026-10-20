// app/components/dashboard/dashboard-tabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardTabs({ role }: { role: string }) {
  const pathname = usePathname();

  const customerTabs = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/bookings", label: "My Bookings" },
    { href: "/dashboard/messages", label: "Messages" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  const businessTabs = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/bookings", label: "Bookings" },
    { href: "/dashboard/messages", label: "Messages" },
    { href: "/dashboard/listings", label: "My Listings" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  const operatorTabs = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/bookings", label: "Bookings" },
    { href: "/dashboard/messages", label: "Messages" },
    { href: "/dashboard/listings/packages", label: "My Packages" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  let tabs = customerTabs;
  if (role === "BUSINESS") tabs = businessTabs;
  if (role === "OPERATOR") tabs = operatorTabs;

  return (
    <nav className="flex space-x-1 border-b border-cream-200 dark:border-deep-800">
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.href !== "/dashboard" && pathname.startsWith(tab.href));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "border-brand-500 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-deep-500 hover:border-deep-300 hover:text-deep-700 dark:text-cream-400 dark:hover:border-deep-700 dark:hover:text-cream-200"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}