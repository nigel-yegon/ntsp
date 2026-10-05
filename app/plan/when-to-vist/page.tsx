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
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/plan"
        className="text-sm text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        ← Back to Plan Your Trip
      </Link>

      <h1 className="mt-6 text-3xl font-bold">When to Visit Kenya</h1>
      <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
        Kenya is a year-round destination, but each season offers a different
        experience. The right time depends on what you want to see.
      </p>

      <div className="mt-8 space-y-5">
        {seasons.map((s) => (
          <div
            key={s.period}
            className="rounded-lg border border-gray-200 p-5 dark:border-gray-800"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <span className="text-sm text-gray-500">{s.period}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {s.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950">
        <p className="text-sm font-medium">Pro tip</p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          If you want the migration without peak-season crowds, aim for late June
          or early November — shoulder seasons with good viewing and much lower
          rates.
        </p>
      </div>
    </article>
  );
}