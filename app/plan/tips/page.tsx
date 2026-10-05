import Link from "next/link";

export const metadata = {
  title: "Travel Tips — NTSP",
};

const tips = [
  {
    title: "Money",
    body:
      "The Kenyan Shilling (KES) is the local currency. ATMs are widely available in cities and major towns. Carry some cash for smaller shops and tips — M-Pesa (mobile money) is universal but requires a local SIM.",
  },
  {
    title: "SIM cards",
    body:
      "Safaricom has the best coverage. Pick up a prepaid SIM at the airport or any Safaricom shop — you'll need your passport. Data bundles are cheap and work well in most areas.",
  },
  {
    title: "Health",
    body:
      "Drink only bottled or filtered water. Most lodges and hotels provide safe drinking water. Carry basic first aid and any prescription medications — pharmacies are common in cities but limited in remote areas.",
  },
  {
    title: "Safety",
    body:
      "Kenya is generally safe for tourists, but exercise normal precautions in cities. Avoid walking alone at night, keep valuables out of sight, and use hotel-arranged transport after dark. On safari, always follow your guide's instructions.",
  },
  {
    title: "Cultural etiquette",
    body:
      "Greetings matter — a handshake and 'Jambo' or 'Habari' go a long way. Ask before photographing people. When visiting Maasai villages, respect local customs and consider buying crafts directly from artisans.",
  },
  {
    title: "Tipping",
    body:
      "Expected in the tourism industry. Plan for USD 10–20 per day for a safari guide and USD 5–10 for lodge staff. Many lodges have a communal tip box.",
  },
  {
    title: "What to pack",
    body:
      "Neutral-colored clothing for game drives (avoid bright blue and black — tsetse flies are attracted to them). Layers for cool mornings and warm afternoons. A wide-brimmed hat, sunscreen, insect repellent, and binoculars.",
  },
  {
    title: "Photography",
    body:
      "Bring spare batteries and memory cards — you'll use more than you expect. A zoom lens of at least 200mm is useful for wildlife. Ask permission before photographing people.",
  },
];

export default function TipsPage() {
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
            Plan · Practicalities
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Travel Tips
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            The small things that make a trip smooth — money, health, safety, and
            culture.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((t) => (
            <div
              key={t.title}
              className="rounded-lg border border-deep-200 bg-cream-50 p-5 dark:border-deep-800 dark:bg-deep-900"
            >
              <h2 className="font-semibold text-deep-800 dark:text-cream-100">
                {t.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                {t.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-deep-200 pt-6 dark:border-deep-800">
          <p className="text-sm text-deep-600 dark:text-cream-400">
            More questions?{" "}
            <Link
              href="/contact"
              className="font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Contact our team →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}