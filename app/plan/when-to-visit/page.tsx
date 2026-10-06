import Link from "next/link";
import {
  ArrowLeft,
  Sun,
  CloudRain,
  Binoculars,
  CloudDrizzle,
  Lightbulb,
} from "lucide-react";

export const metadata = {
  title: "When to Visit — NTSP",
};

const seasons = [
  {
    period: "January – March",
    name: "Hot & Dry",
    Icon: Sun,
    description:
      "Excellent game viewing as wildlife concentrates at water sources. The coast is hot and sunny — ideal for beach holidays. Great time for birdwatchers.",
  },
  {
    period: "April – May",
    name: "Long Rains",
    Icon: CloudRain,
    description:
      "Heaviest rainfall of the year. Many camps close, roads can be impassable, and rates drop sharply. Good for budget travellers who don't mind rain.",
  },
  {
    period: "June – October",
    name: "Peak Safari Season",
    Icon: Binoculars,
    description:
      "The Great Migration enters the Maasai Mara from July through October. Dry, cooler weather. Best wildlife viewing but highest rates and busiest lodges.",
  },
  {
    period: "November – December",
    name: "Short Rains",
    Icon: CloudDrizzle,
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
            className="inline-flex items-center gap-1 text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Plan Your Trip
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
        <div className="space-y-4">
          {seasons.map((s) => {
            const Icon = s.Icon;
            return (
              <div
                key={s.period}
                className="group relative overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <span
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />

                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="text-lg font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
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
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro tip */}
        <div className="mt-10 rounded-lg border border-brand-300 bg-brand-50 p-5 dark:border-brand-800 dark:bg-brand-950/50">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              <Lightbulb className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-800 dark:text-brand-200">
                Pro tip
              </p>
              <p className="mt-1 text-sm leading-relaxed text-deep-700 dark:text-cream-300">
                If you want the migration without peak-season crowds, aim for late
                June or early November — shoulder seasons with good viewing and much
                lower rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}