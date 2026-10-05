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
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/plan"
        className="text-sm text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        ← Back to Plan Your Trip
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Travel Tips</h1>
      <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
        The small things that make a trip smooth — money, health, safety, and
        culture.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {tips.map((t) => (
          <div
            key={t.title}
            className="rounded-lg border border-gray-200 p-5 dark:border-gray-800"
          >
            <h2 className="font-semibold">{t.title}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          More questions?{" "}
          <Link
            href="/contact"
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Contact our team →
          </Link>
        </p>
      </div>
    </article>
  );
}