import Link from "next/link";
import {
  ArrowLeft,
  Plane,
  Car,
  Key,
  Bus,
  Smartphone,
} from "lucide-react";

export const metadata = {
  title: "Getting Around — NTSP",
};

const sections = [
  {
    title: "Domestic flights",
    Icon: Plane,
    body:
      "The fastest way between regions. Safarilink, AirKenya, and Jambojet operate scheduled flights from Nairobi Wilson Airport to the Mara, Amboseli, Diani, Lamu, and other destinations. Book ahead in peak season — small planes fill up quickly.",
  },
  {
    title: "Safari transfers",
    Icon: Car,
    body:
      "Most lodges offer road transfers from Nairobi or the nearest airstrip. Road trips to the Mara take 5–6 hours; to Amboseli about 4 hours. Expect a mix of tarmac and rough gravel. A 4x4 with a driver-guide is standard for game drives.",
  },
  {
    title: "Self-drive",
    Icon: Key,
    body:
      "Possible for confident drivers, but not recommended for a first safari. You drive on the left, and road conditions outside major highways can be challenging. A local guide adds far more to the experience than the cost of hiring one.",
  },
  {
    title: "Public transport",
    Icon: Bus,
    body:
      "Matatus (minibuses) and long-distance buses connect every major town cheaply. They're part of the culture — but crowded, sometimes slow, and not ideal for a first-time visitor with luggage. Use them for short hops, not for safari logistics.",
  },
  {
    title: "Ride-hailing",
    Icon: Smartphone,
    body:
      "Uber, Bolt, and Little are all available in Nairobi and Mombasa. Useful for airport runs and city trips. For anything outside the cities, arrange a driver through your hotel or tour operator.",
  },
];

export default function GettingAroundPage() {
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
            Plan · Transport
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Getting Around Kenya
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            From light aircraft to matatus — how to move between parks, cities,
            and the coast.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-4 px-4 py-12">
        {sections.map((s) => {
          const Icon = s.Icon;
          return (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-6 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
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
                  <h2 className="text-lg font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400 sm:text-base">
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </article>
    </div>
  );
}