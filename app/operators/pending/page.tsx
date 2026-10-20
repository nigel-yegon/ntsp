// app/operators/pending/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PendingVerificationPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
  });

  // If they don't have a profile or are already approved, kick them to the dashboard
  if (!profile || profile.verificationStatus === "APPROVED") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-brand-200 bg-cream-50 p-8 text-center shadow-sm dark:border-brand-900/50 dark:bg-deep-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-950">
          <span className="text-2xl">⏳</span>
        </div>
        
        <h1 className="mt-6 text-2xl font-bold text-deep-800 dark:text-cream-100">
          Verification Pending
        </h1>
        
        <p className="mt-3 text-sm text-deep-600 dark:text-cream-400">
          Thank you for registering, <strong>{profile.businessName}</strong>.
        </p>
        
        <p className="mt-2 text-sm text-deep-600 dark:text-cream-400">
          {profile.verificationStatus === "PENDING_TRA_CHECK" 
            ? "We are currently running an automated check on your TRA License."
            : "We are currently manually verifying your TRA License against the Tourism Regulatory Authority registry."}
        </p>
        <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
          License: <span className="font-mono">{profile.traLicenseNumber}</span>
        </p>

        <div className="mt-6 rounded-lg bg-cream-200 p-4 text-left text-xs text-deep-700 dark:bg-deep-950 dark:text-cream-300">
          <p className="font-semibold mb-2">What happens next?</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Verification usually takes 1-2 business days.</li>
            <li>We will email you once your account is activated.</li>
            <li>You cannot publish packages or receive bookings until approved.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link 
            href="/" 
            className="rounded-xl border border-deep-200 px-4 py-2.5 text-sm font-semibold text-deep-700 transition hover:bg-cream-100 dark:border-deep-800 dark:text-cream-300 dark:hover:bg-deep-800"
          >
            Return to Home
          </Link>
          <a 
            href="/contact" 
            className="text-xs text-brand-600 hover:underline dark:text-brand-400"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}