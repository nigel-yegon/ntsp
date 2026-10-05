// app/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "./components/hero-section";

export const revalidate = 300;

export default async function Home() {
  const [destinations, packages, events, experiences, stays, posts] =
    await Promise.all([
      prisma.destination.findMany({
        where: { featured: true },
        take: 3,
        orderBy: { name: "asc" },
      }),
      prisma.tourPackage.findMany({
        where: { featured: true },
        include: { destination: true },
        take: 3,
        orderBy: { priceKes: "asc" },
      }),
      prisma.event.findMany({
        where: { featured: true },
        orderBy: { startDate: "asc" },
        take: 3,
      }),
      prisma.attraction.findMany({
        take: 6,
        include: { destination: true },
        orderBy: { name: "asc" },
      }),
      prisma.accommodation.findMany({
        take: 3,
        include: { destination: true },
        orderBy: { name: "asc" },
      }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    ]);

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <HeroSection
        eyebrow="Magical Kenya, curated"
        title={
          <>
            Discover Kenya
            <span className="block text-brand-600 dark:text-brand-400">
              from safari to sea
            </span>
          </>
        }
        subtitle="From the Great Migration in the Maasai Mara to the white sands of Diani — browse destinations, book packages, and plan your trip."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/destinations"
            className="rounded-md bg-deep-800 px-5 py-2.5 text-sm font-medium text-cream-100 transition hover:bg-deep-900 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
          >
            Explore destinations
          </Link>
          <Link
            href="/packages"
            className="rounded-md border border-deep-300 bg-cream-50 px-5 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-cream-100 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100 dark:hover:bg-deep-800"
          >
            Browse packages
          </Link>
        </div>
      </HeroSection>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16">
        {/* ─── EXPERIENCES ───────────────────────────────────── */}
        <Section
          title="Experiences"
          subtitle="Wildlife, culture, beach, and adventure"
          href="/experiences"
          linkLabel="All experiences"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((a) => (
              <Link
                key={a.id}
                href={`/experiences/${a.slug}`}
                className="group rounded-lg border border-deep-200 bg-cream-50 p-4 transition hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <span className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                  {a.category}
                </span>
                <h3 className="mt-1 font-semibold text-deep-800 group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                  {a.name}
                </h3>
                <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
                  {a.destination.name}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-deep-600 dark:text-cream-400">
                  {a.description}
                </p>
              </Link>
            ))}
          </div>
        </Section>

        {/* ─── DESTINATIONS ──────────────────────────────────── */}
        <Section
          title="Destinations"
          subtitle="Where to go in Kenya"
          href="/destinations"
          linkLabel="All destinations"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <Link
                key={d.id}
                href={`/destinations/${d.slug}`}
                className="group rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-deep-800 group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {d.name}
                  </h3>
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                    Featured
                  </span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-wide text-deep-500 dark:text-cream-500">
                  {d.county} County
                </p>
                <p className="mt-3 line-clamp-3 text-sm text-deep-600 dark:text-cream-400">
                  {d.description}
                </p>
              </Link>
            ))}
          </div>
        </Section>

        {/* ─── EVENTS ────────────────────────────────────────── */}
        <Section
          title="Upcoming Events"
          subtitle="Festivals, expos, and seasonal spectacles"
          href="/events"
          linkLabel="All events"
        >
          <div className="space-y-3">
            {events.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.slug}`}
                className="group flex flex-col rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:border-brand-400 dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-deep-800 group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {e.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-wide text-deep-500 dark:text-cream-500">
                    {formatDateRange(e.startDate, e.endDate)} · 📍 {e.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* ─── FEATURED PACKAGES ─────────────────────────────── */}
        <Section
          title="Featured Packages"
          subtitle="Curated trips, all-inclusive"
          href="/packages"
          linkLabel="All packages"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <Link
                key={p.id}
                href={`/packages/${p.slug}`}
                className="group flex flex-col rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <span className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                  {p.destination.name}
                </span>
                <h3 className="mt-1 font-semibold text-deep-800 group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-deep-600 dark:text-cream-400">
                  {p.summary}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-deep-200 pt-3 dark:border-deep-800">
                  <span className="text-xs text-deep-500 dark:text-cream-500">
                    {p.durationDays} day{p.durationDays > 1 ? "s" : ""}
                  </span>
                  <span className="font-mono text-sm font-bold text-deep-800 dark:text-cream-100">
                    KES {p.priceKes.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* ─── STAY ──────────────────────────────────────────── */}
        <Section
          title="Where to Stay"
          subtitle="Lodges, camps, and beachfront resorts"
          href="/stay"
          linkLabel="All stays"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((s) => (
              <Link
                key={s.id}
                href={`/stay/${s.slug}`}
                className="group rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <span className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                  {s.type}
                </span>
                <h3 className="mt-1 font-semibold text-deep-800 group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                  {s.name}
                </h3>
                <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
                  📍 {s.location}
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-deep-600 dark:text-cream-400">
                  {s.description}
                </p>
                {s.priceRange && (
                  <p className="mt-3 font-mono text-xs font-bold text-deep-800 dark:text-cream-100">
                    {s.priceRange}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </Section>

        {/* ─── BLOG ──────────────────────────────────────────── */}
        <Section
          title="From the Blog"
          subtitle="Guides, tips, and travel stories"
          href="/blog"
          linkLabel="All posts"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <p className="text-xs uppercase tracking-wide text-deep-500 dark:text-cream-500">
                  {post.publishedAt?.toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-2 font-semibold text-deep-800 group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-deep-600 dark:text-cream-400">
                  {post.excerpt}
                </p>
                <span className="mt-4 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                  Read →
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </div>

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
      <section className="border-t border-deep-200 bg-deep-800 dark:border-deep-800 dark:bg-deep-950">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-cream-100">
            Ready to plan your Kenyan adventure?
          </h2>
          <p className="mt-4 max-w-xl text-cream-300">
            From the savannahs of the Mara to the warm waters of the Indian Ocean —
            your journey starts here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/plan"
              className="rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-deep-900 transition hover:bg-brand-400"
            >
              Plan your trip
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-cream-400/40 px-5 py-2.5 text-sm font-medium text-cream-100 transition hover:bg-deep-700"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Section wrapper ──────────────────────────────────────── */
type SectionProps = {
  title: string;
  subtitle?: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
};

function Section({ title, subtitle, href, linkLabel, children }: SectionProps) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
              {subtitle}
            </p>
          )}
        </div>
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          {linkLabel} →
        </Link>
      </div>
      {children}
    </section>
  );
}

/* ─── Date helper ───────────────────────────────────────────── */
function formatDateRange(start: Date, end: Date | null) {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const s = start.toLocaleDateString("en-KE", opts);
  if (!end) return s;
  const e = end.toLocaleDateString("en-KE", opts);
  return s === e ? s : `${s} – ${e}`;
}