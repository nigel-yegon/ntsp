import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Wallet,
  Smartphone,
  HeartPulse,
  Shield,
  Users,
  Coins,
  Backpack,
  Camera,
} from "lucide-react";

export const metadata = {
  title: "Travel Tips — NTSP",
};

const tips = [
  {
    title: "Money",
    Icon: Wallet,
    body:
      "The Kenyan Shilling (KES) is the local currency. ATMs are widely available in cities and major towns. Carry some cash for smaller shops and tips — M-Pesa (mobile money) is universal but requires a local SIM.",
  },
  {
    title: "SIM cards",
    Icon: Smartphone,
    body:
      "Safaricom has the best coverage. Pick up a prepaid SIM at the airport or any Safaricom shop — you'll need your passport. Data bundles are cheap and work well in most areas.",
  },
  {
    title: "Health",
    Icon: HeartPulse,
    body:
      "Drink only bottled or filtered water. Most lodges and hotels provide safe drinking water. Carry basic first aid and any prescription medications — pharmacies are common in cities but limited in remote areas.",
  },
  {
    title: "Safety",
    Icon: Shield,
    body:
      "Kenya is generally safe for tourists, but exercise normal precautions in cities. Avoid walking alone at night, keep valuables out of sight, and use hotel-arranged transport after dark. On safari, always follow your guide's instructions.",
  },
  {
    title: "Cultural etiquette",
    Icon: Users,
    body:
      "Greetings matter — a handshake and 'Jambo' or 'Habari' go a long way. Ask before photographing people. When visiting Maasai villages, respect local customs and consider buying crafts directly from artisans.",
  },
  {
    title: "Tipping",
    Icon: Coins,
    body:
      "Expected in the tourism industry. Plan for USD 10–20 per day for a safari guide and USD 5–10 for lodge staff. Many lodges have a communal tip box.",
  },
  {
    title: "What to pack",
    Icon: Backpack,
    body:
      "Neutral-colored clothing for game drives (avoid bright blue and black — tsetse flies are attracted to them). Layers for cool mornings and warm afternoons. A wide-brimmed hat, sunscreen, insect repellent, and binoculars.",
  },
  {
    title: "Photography",
    Icon: Camera,
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
            className="inline-flex items-center gap-1 text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Plan Your Trip
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
          {tips.map((t) => {
            const Icon = t.Icon;
            return (
              <div
                key={t.title}
                className="group relative overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <span
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />

                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                      {t.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                      {t.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 border-t border-deep-200 pt-6 dark:border-deep-800">
          <p className="text-sm text-deep-600 dark:text-cream-400">
            More questions?{" "}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Contact our team
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}