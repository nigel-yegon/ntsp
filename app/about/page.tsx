import Link from "next/link";

export const metadata = {
  title: "About — NTSP",
  description:
    "The National Tourism Service Portal brings Kenya's destinations, experiences, and travel planning into one place.",
};

const functions = [
  {
    title: "Policy & strategy",
    description:
      "Formulate, implement, and review tourism policy in collaboration with stakeholders across the sector.",
  },
  {
    title: "Coordination",
    description:
      "Coordinate and liaise with international, regional, and local institutions on tourism matters.",
  },
  {
    title: "Regulation",
    description:
      "Establish an enabling legal and regulatory framework for the sustainable development of tourism.",
  },
  {
    title: "Safety & security",
    description:
      "Facilitate the safety and security of visitors in liaison with security agencies.",
  },
  {
    title: "Marketing & promotion",
    description:
      "Market and promote domestic and international tourism in collaboration with stakeholders.",
  },
  {
    title: "Product development",
    description:
      "Develop and diversify viable tourism products, and promote community participation in tourism.",
  },
  {
    title: "Human resources",
    description:
      "Coordinate the development of human resource capacity in the tourism sector.",
  },
  {
    title: "Vision 2030",
    description:
      "Coordinate and implement tourism programs under the Vision 2030 flagship projects.",
  },
  {
    title: "International agreements",
    description:
      "Initiate negotiations and implementation of bilateral and multilateral tourism-related agreements, protocols, conventions, and treaties.",
  },
  {
    title: "Innovation & e-Tourism",
    description:
      "Promote innovation, cost-effective uptake of e-Tourism, and appropriate transfer of technologies for tourism development.",
  },
  {
    title: "Resource mobilisation",
    description:
      "Mobilise resources in consultation with the National Treasury and other development partners.",
  },
  {
    title: "Codes of practice",
    description:
      "Develop and enforce tourism codes of practice in collaboration with stakeholders.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center md:py-24">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-200">
            About NTSP
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-deep-800 md:text-5xl dark:text-cream-100">
            Kenya&apos;s tourism, in one place
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            The National Tourism Service Portal is a single window to the
            destinations, experiences, and travel opportunities that make Kenya
            one of the world&apos;s most compelling destinations.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-16 px-4 py-16">
        {/* ─── MANDATE ───────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
            Our mandate
          </h2>
          <div className="mt-4 space-y-4 text-deep-700 dark:text-cream-300">
            <p className="leading-relaxed">
              The State Department of Tourism is mandated with providing strategic
              policy direction and leadership in tourism development and management
              in Kenya. This mandate — set out under Executive Order No. 2 of 2013
              — places the Ministry at the centre of coordinating and overseeing:
            </p>
            <ul className="ml-6 list-disc space-y-2 leading-relaxed marker:text-brand-500">
              <li>Policy direction and planning</li>
              <li>Product diversification and experience development</li>
              <li>Tourism marketing and promotion</li>
              <li>Synergy building between supply and demand</li>
              <li>Competitiveness and investment potential</li>
              <li>Monitoring and evaluation of tourism programs and activities</li>
            </ul>
            <p className="leading-relaxed">
              The NTSP exists to make that mandate tangible for visitors — turning
              policy and strategy into a working window on the country&apos;s
              destinations, experiences, and travel options.
            </p>
          </div>
        </section>

        {/* ─── HOW TOURISM WORKS ─────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
            How tourism works in Kenya
          </h2>
          <div className="mt-4 space-y-4 text-deep-700 dark:text-cream-300">
            <p className="leading-relaxed">
              Tourism is unique among sectors. It draws its existence and growth
              from others — transport, accommodation, food and beverage,
              recreation, entertainment — and its products and services cut
              across providers and geographies.
            </p>
            <p className="leading-relaxed">
              A single trip might start at an international airport, continue by
              road through several counties, and end at a leisure destination far
              from where the visitor first arrived. Each leg is a different
              provider, a different county, a different part of what a visitor
              ultimately experiences.
            </p>
            <p className="leading-relaxed">
              Tourism packages are typically circuit-based: major attractions and
              ecosystems are shared across counties and regions. That makes
              coordination not just helpful, but essential.
            </p>
          </div>
        </section>

        {/* ─── FUNCTIONS ─────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
            What the Directorate does
          </h2>
          <p className="mt-3 max-w-2xl text-deep-700 dark:text-cream-300">
            The Directorate of Tourism carries out the day-to-day work of the
            mandate. Its functions shape how tourism is planned, promoted, and
            protected across the country.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {functions.map((f, i) => (
              <div
                key={f.title}
                className="rounded-lg border border-deep-200 bg-cream-50 p-5 dark:border-deep-800 dark:bg-deep-900"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-xs text-brand-600 dark:text-brand-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold text-deep-800 dark:text-cream-100">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                      {f.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── COORDINATION ──────────────────────────────────── */}
        <section className="rounded-2xl border border-deep-200 bg-cream-100 p-8 dark:border-deep-800 dark:bg-deep-900">
          <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
            Coordinating across government
          </h2>
          <div className="mt-4 space-y-4 text-deep-700 dark:text-cream-300">
            <p className="leading-relaxed">
              The nature of tourism — shared attractions, cross-county circuits,
              and multiple service providers — calls for a considerable degree
              of coordination and cooperation between the different levels of
              government and stakeholders.
            </p>
            <p className="leading-relaxed">
              This coordination is provided for under Article 189 of the
              Constitution, which sets out the framework for cooperation between
              national and county governments. It ensures that tourism
              development across the country is harmonised and sustainable — that
              what one county does supports, rather than competes with, what its
              neighbours are building.
            </p>
            <p className="leading-relaxed">
              The NTSP is one small expression of that coordination: a shared
              platform that treats the country&apos;s tourism offering as a
              single, connected experience.
            </p>
          </div>
        </section>

        {/* ─── CTA ───────────────────────────────────────────── */}
        <section className="rounded-2xl border border-brand-300 bg-brand-50 p-8 text-center dark:border-brand-800 dark:bg-brand-950/50">
          <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
            Start exploring
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-deep-700 dark:text-cream-300">
            From the Maasai Mara to Diani Beach, from Nairobi&apos;s cultural
            scene to the shores of Lake Nakuru — see what Kenya has to offer.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
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
        </section>
      </div>
    </div>
  );
}