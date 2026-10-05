import Link from "next/link";

const explore = [
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences",  label: "Experiences"  },
  { href: "/packages",     label: "Packages"     },
  { href: "/events",       label: "Events"       },
  { href: "/admin",         label: "Dashboard"   },
];

const plan = [
  { href: "/plan/tips",           label: "Travel Tips"    },
  { href: "/plan/visa",           label: "Visa & Entry"   },
  { href: "/plan/getting-around", label: "Getting Around" },
  { href: "/about",               label: "About Us"       },
  { href: "/contact",             label: "Contact Us"     },
];

export function Footer() {
  return (
    <footer className="border-t border-deep-800 bg-deep-900 text-cream-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-cream-100">
            <span className="text-xl">🇰🇪</span>
            <span>NTSP</span>
          </div>
          <p className="mt-3 text-sm text-cream-300/80">
            Discover the magic of Kenya — wildlife, beaches, culture, and beyond.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-400">
            Explore
          </h3>
          <ul className="mt-3 space-y-2">
            {explore.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-cream-300/80 transition hover:text-brand-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-400">
            Plan
          </h3>
          <ul className="mt-3 space-y-2">
            {plan.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-cream-300/80 transition hover:text-brand-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-400">
            Newsletter
          </h3>
          <p className="mt-3 text-sm text-cream-300/80">
            Get safari deals and travel tips in your inbox.
          </p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-deep-700 bg-deep-950 px-3 py-1.5 text-sm text-cream-100 placeholder:text-cream-500 focus:border-brand-500 focus:outline-none"
            />
            <button className="rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-deep-900 hover:bg-brand-400">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-deep-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-cream-500 md:flex-row">
          <p>© {new Date().getFullYear()} NTSP. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition hover:text-brand-400">Privacy</Link>
            <Link href="/terms" className="transition hover:text-brand-400">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}