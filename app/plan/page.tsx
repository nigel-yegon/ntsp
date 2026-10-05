import Link from "next/link";

export const metadata = {
  title: "Plan Your Trip — NTSP",
  description:
    "Everything you need to plan a trip to Kenya: entry requirements, getting around, best time to visit, and travel tips.",
};

const topics = [
  {
    href: "/plan/visa",
    title: "Visa & Entry",
    description:
      "eTA requirements, passport validity, vaccinations, and what to have ready at the border.",
    icon: "🛂",
  },
  {
    href: "/plan/getting-around",
    title: "Getting Around",
    description:
      "Domestic flights, safari transfers, self-drive, and public transport across Kenya.",
    icon: "✈️",
  },
  {
    href: "/plan/when-to-visit",
    title: "When to Visit",
    description:
      "Season-by-season guide — migration season, green season, and the best months for each region.",
    icon: "🌤️",
  },
  {
    href: "/plan/tips",
    title: "Travel Tips",
    description:
      "Money, SIM cards, health, safety, and cultural etiquette for a smooth trip.",
    icon: "💡",
  },
];

export default function PlanPage() {
  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Before you go
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Plan Your Trip
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            Kenya is easy to visit — once you know the essentials. Start here,
            then dive into the topics that matter for your trip.
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Quick topics */}
        <section className="mb-14">
          <div className="grid gap-5 sm:grid-cols-2">
            {topics.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-6 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <span
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />

                <div className="text-3xl">{t.icon}</div>
                <h2 className="mt-3 text-lg font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                  {t.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                  {t.description}
                </p>
                <span className="mt-4 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* At a glance */}
        <section className="mb-14">
          <h2 className="mb-5 text-xl font-semibold text-deep-800 dark:text-cream-100">
            At a Glance
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <GlanceCard label="Currency" value="Kenyan Shilling (KES)" />
            <GlanceCard label="Language" value="English · Kiswahili" />
            <GlanceCard label="Time Zone" value="EAT (UTC+3)" />
            <GlanceCard label="Voltage" value="240V · Type G plug" />
            <GlanceCard label="Country Code" value="+254" />
            <GlanceCard label="Driving Side" value="Left" />
            <GlanceCard label="Emergency" value="999 / 112" />
            <GlanceCard label="Best Months" value="Jun–Oct · Jan–Mar" />
          </dl>
        </section>

        {/* Sample itineraries */}
        <section className="mb-14">
          <h2 className="mb-5 text-xl font-semibold text-deep-800 dark:text-cream-100">
            Sample Itineraries
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            <ItineraryCard
              title="The Classic"
              days="7 days"
              path="Nairobi → Maasai Mara → Lake Nakuru → Nairobi"
              href="/packages/3-day-maasai-mara"
            />
            <ItineraryCard
              title="Bush & Beach"
              days="10 days"
              path="Nairobi → Amboseli → Diani Beach → Nairobi"
              href="/packages/5-day-diani-retreat"
            />
            <ItineraryCard
              title="The Capital"
              days="3 days"
              path="Nairobi National Park → Giraffe Centre → Maasai Market"
              href="/packages/nairobi-city-safari"
            />
          </div>
        </section>

        {/* CTAs */}
        <section className="hero-band rounded-2xl border border-deep-200 p-8 text-center dark:border-deep-800">
          <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
            Ready to book?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-deep-600 dark:text-cream-400">
            Browse our curated packages or get in touch with the team.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/packages"
              className="rounded-md bg-deep-800 px-5 py-2.5 text-sm font-medium text-cream-100 transition hover:bg-deep-900 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
            >
              Browse packages
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-deep-300 bg-cream-50 px-5 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-cream-100 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100 dark:hover:bg-deep-800"
            >
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─── Small building blocks ────────────────────────────────── */
function GlanceCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-deep-200 bg-cream-50 p-4 dark:border-deep-800 dark:bg-deep-900">
      <dt className="text-xs uppercase tracking-wide text-deep-500 dark:text-cream-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-deep-800 dark:text-cream-100">
        {value}
      </dd>
    </div>
  );
}

type ItineraryCardProps = {
  title: string;
  days: string;
  path: string;
  href: string;
};

function ItineraryCard({ title, days, path, href }: ItineraryCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
    >
      <span
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden
      />

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
          {title}
        </h3>
        <span className="text-xs text-deep-500 dark:text-cream-500">
          {days}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
        {path}
      </p>
      <span className="mt-4 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400">
        See a matching package →
      </span>
    </Link>
  );
}