// app/dashboard/profile/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CustomerProfileForm } from "./customer-profile-form";
import { BusinessProfileForm } from "./business-profile-form";
import { PasswordChangeForm } from "./password-change-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/profile");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      businessProfile: true,
    },
  });
  if (!user) redirect("/login");

  // Other roles don't have a profile page here — send them home.
  const roleHome: Record<string, string> = {
    EMPLOYER: "/services",
    VERIFIER: "/review/perusal",
    COMMITTEE_MEMBER: "/review/committee",
    PERMANENT_SECRETARY: "/review/ps",
    ADMIN: "/admin",
  };
  if (user.role !== "CUSTOMER" && user.role !== "BUSINESS") {
    redirect(roleHome[user.role] ?? "/");
  }

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
          Profile
        </h2>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          Manage your account details and password.
        </p>
      </header>

      {user.role === "CUSTOMER" && (
        <CustomerProfileForm
          defaultName={user.name}
          defaultPhone={user.phone ?? ""}
          email={user.email}
        />
      )}

      {user.role === "BUSINESS" && user.businessProfile && (
        <BusinessProfileForm
          defaultName={user.name}
          defaultPhone={user.phone ?? ""}
          email={user.email}
          profile={{
            businessName: user.businessProfile.businessName,
            contactEmail: user.businessProfile.contactEmail,
            contactPhone: user.businessProfile.contactPhone ?? "",
            registrationNo: user.businessProfile.registrationNo ?? "",
            kraPin: user.businessProfile.kraPin ?? "",
            website: user.businessProfile.website ?? "",
            description: user.businessProfile.description ?? "",
            logoUrl: user.businessProfile.logoUrl ?? "",
            verificationStatus: user.businessProfile.verificationStatus,
          }}
        />
      )}

      <PasswordChangeForm />
    </section>
  );
}