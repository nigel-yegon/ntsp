import Link from "next/link";

export const metadata = {
  title: "Getting Around — NTSP",
};

export default function GettingAroundPage() {
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
            Plan · Transport
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Getting Around Kenya
          </h1>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-10 px-4 py-12 text-deep-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
            Domestic flights
          </h2>
          <p className="mt-3 leading-relaxed">
            The fastest way between regions. Safarilink, AirKenya, and Jambojet
            operate scheduled flights from Nairobi Wilson Airport to the Mara,
            Amboseli, Diani, Lamu, and other destinations. Book ahead in peak
            season — small planes fill up quickly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
            Safari transfers
          </h2>
          <p className="mt-3 leading-relaxed">
            Most lodges offer road transfers from Nairobi or the nearest airstrip.
            Road trips to the Mara take 5–6 hours; to Amboseli about 4 hours. Expect
            a mix of tarmac and rough gravel. A 4x4 with a driver-guide is standard
            for game drives.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
            Self-drive
          </h2>
          <p className="mt-3 leading-relaxed">
            Possible for confident drivers, but not recommended for a first safari.
            You drive on the left, and road conditions outside major highways can be
            challenging. A local guide adds far more to the experience than the cost
            of hiring one.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
            Public transport
          </h2>
          <p className="mt-3 leading-relaxed">
            Matatus (minibuses) and long-distance buses connect every major town
            cheaply. They&apos;re part of the culture — but crowded, sometimes slow, and
            not ideal for a first-time visitor with luggage. Use them for short hops,
            not for safari logistics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
            Ride-hailing
          </h2>
          <p className="mt-3 leading-relaxed">
            Uber, Bolt, and Little are all available in Nairobi and Mombasa. Useful
            for airport runs and city trips. For anything outside the cities, arrange
            a driver through your hotel or tour operator.
          </p>
        </section>
      </article>
    </div>
  );
}