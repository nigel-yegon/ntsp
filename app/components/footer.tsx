// app/components/footer.tsx
import Link from "next/link";

const explore = [
  { href: "/explore", label: "Explore Map" },
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences", label: "Experiences" },
  { href: "/stay", label: "Stays" },
  { href: "/packages", label: "Packages" },
];

const plan = [
  { href: "/plan/when-to-visit", label: "When to Visit" },
  { href: "/plan/visa", label: "Visa & Entry" },
  { href: "/plan/getting-around", label: "Getting Around" },
  { href: "/plan/tips", label: "Travel Tips" },
  { href: "/blog", label: "Our Travel Blog" },
];

const business = [
  { href: "/login", label: "Sign In" },
  { href: "/signup", label: "Create Account" },
  
  
  { href: "/investment", label: "Investment" },
  { href: "/operators", label: "Tour Operators" },
  { href: "/dashboard", label: "Business Dashboard" },
];

const about = [
  { href: "/about", label: "About NTSP" },
  { href: "/about/resources", label: "Resources" },
  { href: "/report-an-incident", label: "Report Incident" },
  { href: "/safety", label: "Safety" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="border-t border-deep-800 bg-deep-900 text-cream-200">
      {/* ── Top: 5 columns, top-aligned ── */}
      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-5">
        {/* Column 1 — Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 font-bold text-cream-100">
            <span className="text-xl">🇰🇪</span>
            <span>
              NTSP<span className="text-brand-400">.</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-cream-300/80">
            Discover the magic of Kenya — wildlife, beaches, and culture.
          </p>
        </div>

        {/* Column 2 — Explore */}
        <FooterColumn title="Explore" links={explore} />

        {/* Column 3 — Plan */}
        <FooterColumn title="Plan" links={plan} />

        {/* Column 4 — Business */}
        <FooterColumn title="Business" links={business} />

        {/* Column 5 — About */}
        <FooterColumn title="About" links={about} />
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-deep-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-cream-500 md:flex-row">
          <p>© {new Date().getFullYear()} NTSP. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="transition hover:text-brand-400">
              About
            </Link>
            <Link href="/contact" className="transition hover:text-brand-400">
              Contact
            </Link>
            <Link href="/privacy" className="transition hover:text-brand-400">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-brand-400">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="lg:col-span-1">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-400">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
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
  );
}