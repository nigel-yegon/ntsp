// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardTabs } from "@/app/components/dashboard/dashboard-tabs";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const role = session.user.role;

  const roleHome: Record<string, string> = {
    EMPLOYER: "/services",
    VERIFIER: "/review/perusal",
    COMMITTEE_MEMBER: "/review/committee",
    PERMANENT_SECRETARY: "/review/ps",
    ADMIN: "/admin",
  };

  if (role !== "CUSTOMER" && role !== "BUSINESS" && role !== "OPERATOR") {
    redirect(roleHome[role] ?? "/");
  }

  // Verification gate
  if (role === "BUSINESS" || role === "OPERATOR") {
    const profile = await prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
      select: { verificationStatus: true, businessType: true },
    });

    const isTourOperator = profile?.businessType === "TOUR_OPERATOR" || role === "OPERATOR";
    if (isTourOperator && profile?.verificationStatus !== "APPROVED") {
      redirect("/operators/pending");
    }
  }

  const isOperator = role === "OPERATOR";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
          {role === "CUSTOMER"
            ? "My dashboard"
            : isOperator
              ? "Operator dashboard"
              : "Business dashboard"}
        </h1>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          {role === "CUSTOMER"
            ? `Signed in as ${session.user.email}`
            : isOperator
              ? "Manage your tour packages, bookings, and messages."
              : "Manage your listings, bookings, and messages."}
        </p>
      </header>

      <DashboardTabs role={role} />

      <div className="mt-8">{children}</div>
    </main>
  );
}