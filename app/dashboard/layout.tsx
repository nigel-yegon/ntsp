// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardTabs } from "@/app/components/dashboard/dashboard-tabs";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Employers and staff roles don't live here. Route them home.
  const role = session.user.role;
  const roleHome: Record<string, string> = {
    EMPLOYER: "/services",
    VERIFIER: "/review/perusal",
    COMMITTEE_MEMBER: "/review/committee",
    PERMANENT_SECRETARY: "/review/ps",
    ADMIN: "/admin",
  };
  if (role !== "CUSTOMER" && role !== "BUSINESS") {
    redirect(roleHome[role] ?? "/");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
          {role === "CUSTOMER" ? "My dashboard" : "Business dashboard"}
        </h1>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          {role === "CUSTOMER"
            ? `Signed in as ${session.user.email}`
            : "Manage your listings, bookings, and messages."}
        </p>
      </header>

      <DashboardTabs role={role} />

      <div className="mt-8">{children}</div>
    </main>
  );
}