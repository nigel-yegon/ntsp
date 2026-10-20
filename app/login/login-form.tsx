// app/login/login-form.tsx
"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

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

/* Prevent open-redirect: only allow same-origin relative paths. */
function safeCallback(raw: string | null | undefined): string | null {
  if (!raw) return null;
  // Must start with "/" and not "//" (protocol-relative).
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [submitting, setSubmitting] = useState(false);
  const [oauthPending, setOauthPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Prefer the prop, then ?callbackUrl=, then null.
  const redirectTo = useMemo(
    () => safeCallback(callbackUrl ?? searchParams.get("callbackUrl")),
    [callbackUrl, searchParams]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password) {
      setError("Email and password are required.");
      setSubmitting(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        // Pass the destination through to NextAuth — it resolves the final URL
        callbackUrl: redirectTo ?? "/dashboard",
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        setSubmitting(false);
        return;
      }

      // NextAuth returns the fully-resolved URL in `result.url`.
      // If it's missing, fall back to our own resolution:
      //   1. explicit callbackUrl
      //   2. role-based home (read from the session via /api/auth/session ONLY if needed)
      //   3. /dashboard
      if (result.url) {
        router.push(result.url);
      } else if (redirectTo) {
        router.push(redirectTo);
      } else {
        // Rare: no URL from NextAuth and no callback. Fetch role to choose home.
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await res.json();
        const role = session?.user?.role as string | undefined;
        router.push(role ? ROLE_HOME[role] ?? "/dashboard" : "/dashboard");
      }

      router.refresh();
    } catch (err) {
      console.error("Sign-in failed:", err);
      setError("Sign-in failed. Please try again.");
      setSubmitting(false);
    }
  }

  function oauthSignIn(provider: "google" | "facebook") {
    setOauthPending(provider);
    setError(null);
    signIn(provider, { callbackUrl: redirectTo ?? "/dashboard" });
  }

  const inputClass =
    "w-full rounded-xl border border-deep-200 bg-cream-100 px-3.5 py-3 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-500 focus:bg-cream-50 focus:ring-2 focus:ring-brand-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:border-brand-500 dark:focus:bg-deep-950";

  const disabled = oauthPending !== null || submitting;

  return (
    <div className="space-y-5">
      {/* ── OAuth buttons ── */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => oauthSignIn("google")}
          disabled={disabled}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-deep-200 bg-cream-100 px-4 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-cream-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100 dark:hover:bg-deep-900"
        >
          <GoogleIcon />
          {oauthPending === "google"
            ? "Redirecting to Google…"
            : "Continue with Google"}
        </button>

        <button
          type="button"
          onClick={() => oauthSignIn("facebook")}
          disabled={disabled}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-deep-200 bg-cream-100 px-4 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-cream-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100 dark:hover:bg-deep-900"
        >
          <FacebookIcon />
          {oauthPending === "facebook"
            ? "Redirecting to Facebook…"
            : "Continue with Facebook"}
        </button>
      </div>

      {/* ── Divider ── */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cream-300 dark:border-deep-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-cream-50 px-3 text-deep-500 dark:bg-deep-900 dark:text-cream-500">
            Or sign in with email
          </span>
        </div>
      </div>

      {/* ── Email + password ── */}
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">
            Email address
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={disabled}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">
            Password
          </span>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={disabled}
              className={`${inputClass} pr-14`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-deep-500 transition hover:text-deep-700 dark:text-cream-500 dark:hover:text-cream-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

/* ─── Icons ─────────────────────────────────────────────────────── */

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
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}