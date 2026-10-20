// app/not-found.tsx
import Link from "next/link";

export const metadata = {
  title: "Page not found — NTSP",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream-200 dark:bg-deep-950">
      {/* Decorative background */}
      <div className="hero-band absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-linear-to-b from-transparent via-cream-200/60 to-cream-200 dark:via-deep-950/60 dark:to-deep-950"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        {/* Brand mark */}
        <Link
          href="/"
          className="mb-10 flex items-center gap-2 text-xl font-bold tracking-tight text-deep-800 dark:text-cream-100"
        >
          <span className="text-2xl">🇰🇪</span>
          <span>
            NTSP<span className="text-brand-600 dark:text-brand-400">.</span>
          </span>
        </Link>

        {/* Big 404 */}
        <div
          className="select-none text-[8rem] font-black leading-none tracking-tighter text-brand-500 sm:text-[10rem]"
          aria-hidden
        >
          404
        </div>

        {/* Heading */}
        <h1 className="-mt-4 text-2xl font-bold text-deep-800 dark:text-cream-100 sm:text-3xl">
          This page has wandered off the map
        </h1>
        <p className="mt-3 max-w-md text-base leading-7 text-deep-600 dark:text-cream-400">
          We couldn&apos;t find what you were looking for. The link may be
          broken, or the page may have been moved or removed.
        </p>

        {/* Primary actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Back to home
          </Link>
          <Link
            href="/explore"
            className="rounded-xl border border-deep-200 bg-cream-50 px-5 py-3 text-sm font-semibold text-deep-700 transition hover:bg-cream-100 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-300 dark:hover:bg-deep-800"
          >
            Explore Kenya
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-12 w-full max-w-md rounded-2xl border border-cream-300 bg-cream-50/70 p-6 backdrop-blur-sm dark:border-deep-700 dark:bg-deep-900/70">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-deep-500 dark:text-cream-500">
            You might be looking for
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            <li>
              <Link
                href="/destinations"
                className="block rounded-lg px-3 py-2 text-sm text-deep-700 transition hover:bg-cream-100 hover:text-brand-600 dark:text-cream-300 dark:hover:bg-deep-800 dark:hover:text-brand-400"
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link
                href="/packages"
                className="block rounded-lg px-3 py-2 text-sm text-deep-700 transition hover:bg-cream-100 hover:text-brand-600 dark:text-cream-300 dark:hover:bg-deep-800 dark:hover:text-brand-400"
              >
                Tour Packages
              </Link>
            </li>
            <li>
              <Link
                href="/stay"
                className="block rounded-lg px-3 py-2 text-sm text-deep-700 transition hover:bg-cream-100 hover:text-brand-600 dark:text-cream-300 dark:hover:bg-deep-800 dark:hover:text-brand-400"
              >
                Stays
              </Link>
            </li>
            <li>
              <Link
                href="/experiences"
                className="block rounded-lg px-3 py-2 text-sm text-deep-700 transition hover:bg-cream-100 hover:text-brand-600 dark:text-cream-300 dark:hover:bg-deep-800 dark:hover:text-brand-400"
              >
                Experiences
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="block rounded-lg px-3 py-2 text-sm text-deep-700 transition hover:bg-cream-100 hover:text-brand-600 dark:text-cream-300 dark:hover:bg-deep-800 dark:hover:text-brand-400"
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block rounded-lg px-3 py-2 text-sm text-deep-700 transition hover:bg-cream-100 hover:text-brand-600 dark:text-cream-300 dark:hover:bg-deep-800 dark:hover:text-brand-400"
              >
                Contact us
              </Link>
            </li>
          </ul>
        </div>

        {/* Help footer */}
        <p className="mt-8 text-xs text-deep-500 dark:text-cream-500">
          If you believe this is a mistake,{" "}
          <Link
            href="/contact"
            className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
          >
            let us know
          </Link>
          .
        </p>
      </div>
    </main>
  );
}