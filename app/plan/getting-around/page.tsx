import Link from "next/link";

export const metadata = {
  title: "Getting Around — NTSP",
};

export default function GettingAroundPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/plan"
        className="text-sm text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        ← Back to Plan Your Trip
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Getting Around Kenya</h1>

      <div className="mt-8 space-y-8 text-gray-800 dark:text-gray-200">
        <section>
          <h2 className="text-xl font-semibold">Domestic flights</h2>
          <p className="mt-3 leading-relaxed">
            The fastest way between regions. Safarilink, AirKenya, and Jambojet
            operate scheduled flights from Nairobi Wilson Airport to the Mara,
            Amboseli, Diani, Lamu, and other destinations. Book ahead in peak
            season — small planes fill up quickly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Safari transfers</h2>
          <p className="mt-3 leading-relaxed">
            Most lodges offer road transfers from Nairobi or the nearest airstrip.
            Road trips to the Mara take 5–6 hours; to Amboseli about 4 hours. Expect
            a mix of tarmac and rough gravel. A 4x4 with a driver-guide is standard
            for game drives.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Self-drive</h2>
          <p className="mt-3 leading-relaxed">
            Possible for confident drivers, but not recommended for a first safari.
            You drive on the left, and road conditions outside major highways can be
            challenging. A local guide adds far more to the experience than the cost
            of hiring one.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Public transport</h2>
          <p className="mt-3 leading-relaxed">
            Matatus (minibuses) and long-distance buses connect every major town
            cheaply. They're part of the culture — but crowded, sometimes slow, and
            not ideal for a first-time visitor with luggage. Use them for short hops,
            not for safari logistics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Ride-hailing</h2>
          <p className="mt-3 leading-relaxed">
            Uber, Bolt, and Little are all available in Nairobi and Mombasa. Useful
            for airport runs and city trips. For anything outside the cities, arrange
            a driver through your hotel or tour operator.
          </p>
        </section>
      </div>
    </article>
  );
}