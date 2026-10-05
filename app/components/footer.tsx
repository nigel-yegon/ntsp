import Link from "next/link";

const explore = [
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences",  label: "Experiences"  },
  { href: "/packages",     label: "Packages"     },
  { href: "/events",       label: "Events"       },
];

const plan = [
  { href: "/plan/tips",           label: "Travel Tips"    },
  { href: "/plan/visa",           label: "Visa & Entry"   },
  { href: "/plan/getting-around", label: "Getting Around" },
  { href: "/contact",             label: "Contact Us"     },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="text-xl">🇰🇪</span>
            <span>NTSP</span>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Discover the magic of Kenya — wildlife, beaches, culture, and beyond.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100">
            Explore
          </h3>
          <ul className="mt-3 space-y-2">
            {explore.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100">
            Plan
          </h3>
          <ul className="mt-3 space-y-2">
            {plan.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100">
            Newsletter
          </h3>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Get safari deals and travel tips in your inbox.
          </p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <button className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-gray-500 md:flex-row dark:text-gray-500">
          <p>© {new Date().getFullYear()} NTSP. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-brand-600 dark:hover:text-brand-400">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}