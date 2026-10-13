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
    // Already signed in — nothing to do here.
    redirect("/services");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
          Create an account
        </h1>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          Choose the type of account you need. You can always sign up again
          with a different email.
        </p>
      </header>

      <SignupTabs />

      <p className="mt-6 text-center text-sm text-deep-500 dark:text-cream-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}