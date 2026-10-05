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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Plan Your Trip</h1>
        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
          Kenya is easy to visit — once you know the essentials. Start here, then
          dive into the topics that matter for your trip.
        </p>
      </header>

      {/* ─── Quick topics ─────────────────────────────────────── */}
      <section className="mb-14">
        <div className="grid gap-5 sm:grid-cols-2">
          {topics.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-lg border border-gray-200 p-6 transition hover:border-emerald-500 hover:shadow-md dark:border-gray-800 dark:hover:border-emerald-500"
            >
              <div className="text-3xl">{t.icon}</div>
              <h2 className="mt-3 text-lg font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-emerald-600 group-hover:underline dark:text-emerald-400">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── At a glance ──────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="mb-5 text-xl font-semibold">At a Glance</h2>
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* ─── Quick itineraries ───────────────────────────────── */}
      <section className="mb-14">
        <h2 className="mb-5 text-xl font-semibold">Sample Itineraries</h2>
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

      {/* ─── CTAs ─────────────────────────────────────────────── */}
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-xl font-semibold">Ready to book?</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Browse our curated packages or get in touch with the team.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/packages"
            className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Browse packages
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-800"
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─── Small building blocks ──────────────────────────────────
function GlanceCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
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
      className="group rounded-lg border border-gray-200 p-5 transition hover:border-emerald-500 hover:shadow-md dark:border-gray-800 dark:hover:border-emerald-500"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          {title}
        </h3>
        <span className="text-xs text-gray-500">{days}</span>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{path}</p>
      <span className="mt-4 inline-block text-xs font-medium text-emerald-600 group-hover:underline dark:text-emerald-400">
        See a matching package →
      </span>
    </Link>
  );
}