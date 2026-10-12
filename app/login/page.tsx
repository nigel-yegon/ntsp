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
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect(
      searchParams.callbackUrl ?? ROLE_HOME[session.user.role] ?? "/services"
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          Access the National Tourism Service Portal.
        </p>
      </header>

      {searchParams.error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
        >
          {searchParams.error === "CredentialsSignin"
            ? "Invalid email or password."
            : "Sign-in failed. Please try again."}
        </p>
      )}

      <LoginForm callbackUrl={searchParams.callbackUrl} />

      <p className="mt-6 text-center text-sm text-deep-500 dark:text-cream-400">
        New employer?{" "}
        <Link
          href="/signup"
          className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
        >
          Create an account
        </Link>
      </p>
    </main>
  );
}