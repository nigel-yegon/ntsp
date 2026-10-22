// app/services/profile/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";

export const metadata = { title: "Complete your profile — NTSP" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/services/profile");
  }

  // If the user already has a company, this page isn't for them.
  if (session.user.companyId) {
    redirect("/services");
  }

  // Non-employers can't create a company. They land on their home.
  if (session.user.role !== "EMPLOYER") {
    const roleHome: Record<string, string> = {
      VERIFIER: "/review/perusal",
      COMMITTEE_MEMBER: "/review/committee",
      PERMANENT_SECRETARY: "/review/ps",
      ADMIN: "/admin",
    };
    redirect(roleHome[session.user.role] ?? "/");
  }

  // Pre-fill name/email from the session so the user can confirm them.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-deep-800 dark:text-cream-100">
          Complete your profile
        </h1>
        <p className="mt-2 text-deep-500 dark:text-cream-400">
          Before you can submit work permit applications, we need a few details
          about your company.
        </p>
        <div className="divider-gold mt-6" />
      </header>

      <ProfileForm
        defaultName={user?.name ?? session.user.name}
        defaultEmail={user?.email ?? session.user.email}
      />
    </main>
  );
}