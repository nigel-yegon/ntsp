// app/review/page.tsx
import { redirect } from "next/navigation";
import { requireRole } from "@/app/components/review/require-role";

const ROLE_DESTINATION: Record<string, string> = {
  VERIFIER: "/review/perusal",
  COMMITTEE_MEMBER: "/review/committee",
  PERMANENT_SECRETARY: "/review/ps",
  ADMIN: "/review/perusal", // admins default to the first stage
};

export default async function ReviewLandingPage() {
  const user = await requireRole([
    "VERIFIER",
    "COMMITTEE_MEMBER",
    "PERMANENT_SECRETARY",
    "ADMIN",
  ]);

  const dest = ROLE_DESTINATION[user.role];
  if (dest) redirect(dest);

  // Should be unreachable given requireRole's whitelist, but defensive.
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
        Review queue
      </h1>
      <p className="mt-2 text-sm text-deep-500 dark:text-cream-400">
        Your account does not have a review destination configured. Contact an
        administrator.
      </p>
    </main>
  );
}