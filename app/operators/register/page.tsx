// app/operators/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerTourOperator } from "@/app/admin/actions/register-tour-operator";
import Link from "next/link";

export default function RegisterTourOperatorPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerTourOperator(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/operators/pending");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-deep-800 dark:text-cream-100">
          Partner with NTSP
        </h1>
        <p className="mt-2 text-deep-600 dark:text-cream-400">
          Register your tour operation. We validate all operators against the Tourism Regulatory Authority (TRA) registry.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-deep-200 bg-cream-50 p-6 shadow-sm dark:border-deep-800 dark:bg-deep-900">
        {/* Business & Email row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-deep-700 dark:text-cream-300">
              Business / Company Name *
            </label>
            <input
              name="businessName"
              required
              placeholder="e.g. Savannah Tours Ltd"
              className="mt-1 w-full rounded-md border border-deep-200 bg-cream-100 px-3 py-2 text-deep-900 focus:border-brand-500 focus:outline-none dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-700 dark:text-cream-300">
              Contact Email *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="info@yoursafari.com"
              className="mt-1 w-full rounded-md border border-deep-200 bg-cream-100 px-3 py-2 text-deep-900 focus:border-brand-500 focus:outline-none dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100"
            />
          </div>
        </div>

        {/* Password row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-deep-700 dark:text-cream-300">
              Password *
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-md border border-deep-200 bg-cream-100 px-3 py-2 text-deep-900 focus:border-brand-500 focus:outline-none dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100"
            />
            <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
              Minimum 8 characters. You'll use this to sign in.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-700 dark:text-cream-300">
              Confirm Password *
            </label>
            <input
              type="password"
              name="passwordConfirm"
              required
              minLength={8}
              className="mt-1 w-full rounded-md border border-deep-200 bg-cream-100 px-3 py-2 text-deep-900 focus:border-brand-500 focus:outline-none dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100"
            />
          </div>
        </div>

        {/* TRA Verification */}
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-900 dark:bg-brand-950/30">
          <h3 className="text-sm font-semibold text-brand-800 dark:text-brand-300">
            TRA Verification
          </h3>
          <p className="mt-1 mb-4 text-xs text-brand-700 dark:text-brand-400">
            Enter your Class C license number and upload a clear copy of the certificate.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-deep-700 dark:text-cream-300">
                TRA License Number *
              </label>
              <input
                name="traLicense"
                required
                placeholder="e.g. TRA1/47/C01/2057"
                className="mt-1 w-full rounded-md border border-deep-200 bg-cream-100 px-3 py-2 font-mono text-sm text-deep-900 focus:border-brand-500 focus:outline-none dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-700 dark:text-cream-300">
                Upload Certificate (PDF or Image) *
              </label>
              <input
                type="file"
                name="licenseDoc"
                accept=".pdf,.jpg,.jpeg,.png"
                required
                className="mt-1 block w-full text-sm text-deep-600 file:mr-4 file:rounded-md file:border-0 file:bg-brand-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-200 dark:text-cream-400 dark:file:bg-brand-900 dark:file:text-brand-300"
              />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="katoMember"
            className="h-4 w-4 rounded border-deep-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-deep-700 dark:text-cream-300">
            I am a member of the Kenya Association of Tour Operators (KATO)
          </span>
        </label>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <Link
            href="/login"
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Already registered? Sign in
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-600 px-6 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </div>
      </form>
    </div>
  );
}