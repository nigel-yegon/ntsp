import Link from "next/link";

export const metadata = {
  title: "When to Visit — NTSP",
};

const seasons = [
  {
    period: "January – March",
    name: "Hot & Dry",
    description:
      "Excellent game viewing as wildlife concentrates at water sources. The coast is hot and sunny — ideal for beach holidays. Great time for birdwatchers.",
  },
  {
    period: "April – May",
    name: "Long Rains",
    description:
      "Heaviest rainfall of the year. Many camps close, roads can be impassable, and rates drop sharply. Good for budget travellers who don't mind rain.",
  },
  {
    period: "June – October",
    name: "Peak Safari Season",
    description:
      "The Great Migration enters the Maasai Mara from July through October. Dry, cooler weather. Best wildlife viewing but highest rates and busiest lodges.",
  },
  {
    period: "November – December",
    name: "Short Rains",
    description:
      "Brief afternoon showers, mostly clear mornings. Good value, fewer crowds, and lush green landscapes. Wildlife is dispersed but still visible.",
  },
];

export default function WhenToVisitPage() {
  return (
    <div>
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-16">
          <Link
            href="/plan"
            className="text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            ← Back to Plan Your Trip
          </Link>
          <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Plan · Seasons
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            When to Visit Kenya
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            Kenya is a year-round destination, but each season offers a different
            experience. The right time depends on what you want to see.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-5">
          {seasons.map((s) => (
            <div
              key={s.period}
              className="rounded-lg border border-deep-200 bg-cream-50 p-5 dark:border-deep-800 dark:bg-deep-900"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
                  {s.name}
                </h2>
                <span className="shrink-0 text-sm text-deep-500 dark:text-cream-500">
                  {s.period}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-brand-300 bg-brand-50 p-5 dark:border-brand-800 dark:bg-brand-950/50">
          <p className="text-sm font-semibold text-brand-800 dark:text-brand-200">
            Pro tip
          </p>
          <p className="mt-1 text-sm leading-relaxed text-deep-700 dark:text-cream-300">
            If you want the migration without peak-season crowds, aim for late June
            or early November — shoulder seasons with good viewing and much lower
            rates.
          </p>
        </div>
      </div>
    </div>
  );
}