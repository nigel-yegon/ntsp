// app/signup/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignupTabs } from "./signup-tabs";

export const metadata = { title: "Create an account — NTSP" };

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/services");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-cream-200 dark:bg-deep-950">
      {/* Decorative background band */}
      <div className="hero-band absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-200/60 to-cream-200 dark:via-deep-950/60 dark:to-deep-950"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
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
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100 sm:text-3xl">
            Create an account
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-deep-500 dark:text-cream-400">
            Choose the type of account you need. You can always sign up again
            with a different email.
          </p>
        </header>

        {/* Card wrapper */}
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 shadow-sm dark:border-deep-700 dark:bg-deep-900 sm:p-8">
          <SignupTabs />
        </div>

        {/* Footer link */}
        <p className="mt-8 text-center text-sm text-deep-500 dark:text-cream-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-600 underline underline-offset-2 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Sign in
          </Link>
        </p>

        {/* Legal */}
        <p className="mt-4 text-center text-xs text-deep-400 dark:text-cream-600">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-brand-600 dark:hover:text-brand-400">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-brand-600 dark:hover:text-brand-400">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}