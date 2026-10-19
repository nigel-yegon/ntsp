// app/login/login-form.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


const ROLE_HOME: Record<string, string> = {
  EMPLOYER: "/services",
  VERIFIER: "/review/perusal",
  COMMITTEE_MEMBER: "/review/committee",
  PERMANENT_SECRETARY: "/review/ps",
  ADMIN: "/admin",
};

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [oauthPending, setOauthPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setError("Invalid email or password.");
      setSubmitting(false);
      return;
    }

    const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
    const session = await sessionRes.json();
    const role = session?.user?.role as string | undefined;

    const dest = callbackUrl ?? (role ? ROLE_HOME[role] ?? "/" : "/admin");
    router.push(dest);
    router.refresh();
  }

  const oauthSignIn = (provider: "google" | "facebook") => {
    setOauthPending(provider);
    setError(null);
    signIn(provider, { callbackUrl: callbackUrl ?? "/services" });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => oauthSignIn("google")}
          disabled={oauthPending !== null || submitting}
          className="
            flex w-full items-center justify-center gap-2
            rounded-lg border border-cream-300 bg-cream-50
            px-4 py-2.5 text-sm font-medium text-deep-800
            transition hover:bg-cream-100
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-400 focus-visible:ring-offset-2
            disabled:opacity-60
            dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100
            dark:hover:bg-deep-800 dark:focus-visible:ring-offset-deep-950
          "
        >
          <GoogleIcon />
          {oauthPending === "google"
            ? "Redirecting to Google…"
            : "Continue with Google"}
        </button>

        <button
          type="button"
          onClick={() => oauthSignIn("facebook")}
          disabled={oauthPending !== null || submitting}
          className="
            flex w-full items-center justify-center gap-2
            rounded-lg border border-cream-300 bg-cream-50
            px-4 py-2.5 text-sm font-medium text-deep-800
            transition hover:bg-cream-100
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-400 focus-visible:ring-offset-2
            disabled:opacity-60
            dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100
            dark:hover:bg-deep-800 dark:focus-visible:ring-offset-deep-950
          "
        >
          <FacebookIcon />
          {oauthPending === "facebook"
            ? "Redirecting to Facebook…"
            : "Continue with Facebook"}
        </button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cream-300 dark:border-deep-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-cream-100 px-3 text-deep-500 dark:bg-deep-950 dark:text-cream-400">
            Or sign in with email
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-deep-800 dark:text-cream-100">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={oauthPending !== null}
            className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 disabled:opacity-60 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-deep-800 dark:text-cream-100">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            disabled={oauthPending !== null}
            className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 disabled:opacity-60 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || oauthPending !== null}
          className="w-full rounded-lg bg-brand-400 px-4 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-60 dark:focus-visible:ring-offset-deep-950"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.9 6.9 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="#1877F2"
    >
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.7 2.7 1.2 3.4.9.1-.7.4-1.2.7-1.5-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
    </svg>
  );
}