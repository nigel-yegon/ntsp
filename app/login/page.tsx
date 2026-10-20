// app/login/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in — NTSP" };

const ROLE_HOME: Record<string, string> = {
  EMPLOYER: "/services",
  VERIFIER: "/review/perusal",
  COMMITTEE_MEMBER: "/review/committee",
  PERMANENT_SECRETARY: "/review/ps",
  ADMIN: "/admin",
  BUSINESS: "/dashboard",
  OPERATOR: "/dashboard",
  CUSTOMER: "/dashboard",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect(
      searchParams.callbackUrl ?? ROLE_HOME[session.user.role] ?? "/dashboard"
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-cream-200 dark:bg-deep-950">
      {/* Decorative background band */}
      <div className="hero-band absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-linear-to-b from-transparent via-cream-200/60 to-cream-200 dark:via-deep-950/60 dark:to-deep-950"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        {/* Brand mark */}
        <Link
          href="/"
          className="mx-auto mb-8 flex items-center gap-2 text-xl font-bold tracking-tight text-deep-800 dark:text-cream-100"
        >
          <span className="text-2xl">🇰🇪</span>
          <span>
            NTSP<span className="text-brand-600 dark:text-brand-400">.</span>
          </span>
        </Link>

        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100 sm:text-3xl">
            Welcome back
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-deep-500 dark:text-cream-400">
            Sign in to access the National Tourism Service Portal.
          </p>
        </header>

        {/* Error banner */}
        {searchParams.error && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
          >
            {searchParams.error === "CredentialsSignin"
              ? "Invalid email or password."
              : "Sign-in failed. Please try again."}
          </p>
        )}

        {/* Card wrapper */}
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 shadow-sm dark:border-deep-700 dark:bg-deep-900 sm:p-8">
          <LoginForm callbackUrl={searchParams.callbackUrl} />
        </div>

        {/* Footer link */}
        <p className="mt-8 text-center text-sm text-deep-500 dark:text-cream-400">
          New to NTSP?{" "}
          <Link
            href="/signup"
            className="font-medium text-brand-600 underline underline-offset-2 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Create an account
          </Link>
        </p>

        {/* Help links */}
        <p className="mt-4 text-center text-xs text-deep-400 dark:text-cream-600">
          <Link
            href="/contact"
            className="underline underline-offset-2 hover:text-brand-600 dark:hover:text-brand-400"
          >
            Contact support
          </Link>{" "}
          ·{" "}
          <Link
            href="/about"
            className="underline underline-offset-2 hover:text-brand-600 dark:hover:text-brand-400"
          >
            About NTSP
          </Link>
        </p>
      </div>
    </main>
  );
}