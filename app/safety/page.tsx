// app/safety/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/app/components/fade-in";
import { Stagger } from "@/app/components/stagger";

export const metadata: Metadata = {
  title: "Travel Safety — NTSP",
  description:
    "Practical safety guidance for visitors to Kenya — personal safety, transport, safaris, and what to do before you travel.",
};

// ─── Safety sections ─────────────────────────────────────────
// Each section carries its own tone, headline icon, and card list.
// Points are condensed from the Kenya Tourism Board's safety page
// so the wording here is a good summary, not a verbatim copy.
type SafetyPoint = {
  title: string;
  body: string;
  icon: React.ReactNode;
};

type SafetySection = {
  id: string;
  title: string;
  subtitle: string;
  tone: {
    text: string;
    bgSoft: string;
    border: string;
    bar: string;
  };
  icon: React.ReactNode;
  points: SafetyPoint[];
};

const SECTIONS: SafetySection[] = [
  {
    id: "personal",
    title: "Personal safety",
    subtitle:
      "Everyday precautions in cities, markets, and unfamiliar areas.",
    tone: {
      text: "text-rose-700 dark:text-rose-300",
      bgSoft: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-300 dark:border-rose-800",
      bar: "bg-rose-500",
    },
    icon: <ShieldIcon />,
    points: [
      {
        title: "Passport & documents",
        body: "Always carry a copy of your passport and keep the original securely in your hotel safe. Store digital backups of your travel documents.",
        icon: <PassportIcon />,
      },
      {
        title: "Personal items",
        body: "Avoid displaying expensive jewelry, gadgets, or large amounts of cash in public. Use a money belt or discreet bag in crowded areas.",
        icon: <WalletIcon />,
      },
      {
        title: "Public areas",
        body: "Stay aware of your surroundings, especially in crowded places like markets, bus stations, or city centers. Keep phones out of sight where practical.",
        icon: <EyeIcon />,
      },
      {
        title: "Movement at night",
        body: "Avoid walking alone late at night, particularly in unfamiliar or poorly lit areas. Use hotel-arranged transport after dark.",
        icon: <MoonIcon />,
      },
    ],
  },
  {
    id: "getting-around",
    title: "Getting around",
    subtitle: "Choosing transport and accommodation you can rely on.",
    tone: {
      text: "text-indigo-700 dark:text-indigo-300",
      bgSoft: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-300 dark:border-indigo-800",
      bar: "bg-indigo-500",
    },
    icon: <RouteIcon />,
    points: [
      {
        title: "Transport services",
        body: "Use reputable taxi services, hotel transfers, or verified ride-hailing apps (Uber, Bolt) instead of hailing taxis on the street.",
        icon: <CarIcon />,
      },
      {
        title: "Hotels & lodges",
        body: "Choose hotels or lodges with good reviews and a visible security presence. Confirm the property's emergency procedures on arrival.",
        icon: <HotelIcon />,
      },
    ],
  },
  {
    id: "safari",
    title: "Safari & tours",
    subtitle: "Staying safe on game drives, at parks, and when booking trips.",
    tone: {
      text: "text-emerald-700 dark:text-emerald-300",
      bgSoft: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-300 dark:border-emerald-800",
      bar: "bg-emerald-500",
    },
    icon: <TreeIcon />,
    points: [
      {
        title: "Guide instructions",
        body: "Always follow park rangers' and guides' instructions during safaris. They know the terrain, the wildlife, and the safe distances.",
        icon: <CompassIcon />,
      },
      {
        title: "Game drives",
        body: "Stay inside designated vehicles during game drives. Never ask your guide to move off-track for a photo.",
        icon: <BinocularsIcon />,
      },
      {
        title: "Tour guides",
        body: "Be cautious of unsolicited tour guides or overly friendly strangers offering deals. Verify all guides through your accommodation or a licensed operator.",
        icon: <AlertTriangleIcon />,
      },
      {
        title: "Bookings",
        body: "Book tours, safaris, and excursions through accredited companies or through your hotel concierge. Ask for the operator's licence number.",
        icon: <TicketIcon />,
      },
    ],
  },
  {
    id: "before",
    title: "Before you travel",
    subtitle: "Cover in place before you leave home.",
    tone: {
      text: "text-amber-700 dark:text-amber-300",
      bgSoft: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-300 dark:border-amber-800",
      bar: "bg-amber-500",
    },
    icon: <SuitcaseIcon />,
    points: [
      {
        title: "Travel insurance",
        body: "Have travel insurance that covers medical evacuation, especially if visiting remote safari destinations. Confirm coverage before you go.",
        icon: <HeartbeatIcon />,
      },
    ],
  },
];

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-cream-200 dark:bg-deep-950">
      {/* ── Hero band ─────────────────────────────────────── */}
      <section className="hero-band border-b border-cream-300/60 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Travel with confidence
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-deep-900 dark:text-cream-100 sm:text-4xl">
            Travel Safety Visiting Kenya
          </h1>
          <div className="divider-gold mt-5 w-24" />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-deep-600 dark:text-cream-300 sm:text-base">
            To ensure a safe and enjoyable stay, visitors are encouraged to
            familiarize themselves with the following travel safety information
            and practical tips designed to help you navigate Kenya with
            confidence and awareness.
          </p>
        </div>
      </section>

      {/* ── Sections ───────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {SECTIONS.map((section) => (
          <FadeIn key={section.id} whenVisible>
            <section id={section.id} className="scroll-mt-24">
              <header className="mb-6 flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${section.tone.bgSoft} ${section.tone.text}`}
                  aria-hidden
                >
                  {section.icon}
                </span>
                <div>
                  <h2
                    className={`text-xl font-bold ${section.tone.text}`}
                  >
                    {section.title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
                    {section.subtitle}
                  </p>
                </div>
              </header>

              <div className="grid gap-4 sm:grid-cols-2">
                <Stagger delayStart={0.05} delayStep={0.05} maxDelay={0.4}>
                  {section.points.map((point) => (
                    <SafetyCard
                      key={point.title}
                      point={point}
                      tone={section.tone}
                    />
                  ))}
                </Stagger>
              </div>
            </section>
          </FadeIn>
        ))}

        {/* ── Emergency numbers ────────────────────────────── */}
        <FadeIn whenVisible>
          <section className="rounded-2xl border border-red-300 bg-red-50 p-5 dark:border-red-800 dark:bg-red-950/30">
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                aria-hidden
              >
                <SirenIcon />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-red-800 dark:text-red-300">
                  In an emergency
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-red-700 dark:text-red-300">
                  If you need urgent help, contact local emergency services
                  first. Then report the incident through NTSP so the authority
                  can follow up with the operator.
                </p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-lg border border-red-200 bg-white/60 px-3 py-2 dark:border-red-800 dark:bg-red-950/40">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-300">
                      Police
                    </dt>
                    <dd className="mt-0.5 font-mono text-lg font-bold text-red-900 dark:text-red-200">
                      999 / 112
                    </dd>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-white/60 px-3 py-2 dark:border-red-800 dark:bg-red-950/40">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-300">
                      Ambulance
                    </dt>
                    <dd className="mt-0.5 font-mono text-lg font-bold text-red-900 dark:text-red-200">
                      999 / 112
                    </dd>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-white/60 px-3 py-2 dark:border-red-800 dark:bg-red-950/40">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-300">
                      Tourist Police
                    </dt>
                    <dd className="mt-0.5 font-mono text-sm font-bold text-red-900 dark:text-red-200">
                      +254 20 341 4955
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ── Report an incident CTA ───────────────────────── */}
        <FadeIn whenVisible>
          <section className="rounded-2xl border border-brand-300 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-950/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
                  aria-hidden
                >
                  <FlagIcon />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-brand-800 dark:text-brand-200">
                    Seen something unsafe?
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-brand-700 dark:text-brand-300">
                    Report incidents involving licensed operators, guides, or
                    tourism facilities. Submissions can be anonymous, and
                    you&apos;ll receive a reference number to follow up.
                  </p>
                </div>
              </div>
              <Link
                href="/report-an-incident"
                className="shrink-0 rounded-xl bg-brand-400 px-5 py-2.5 text-sm font-semibold text-deep-900 transition hover:bg-brand-500"
              >
                Report an incident
              </Link>
            </div>
          </section>
        </FadeIn>

        {/* ── Source note ──────────────────────────────────── */}
        <p className="text-xs text-deep-500 dark:text-cream-500">
          Safety guidance adapted from the Kenya Tourism Board&apos;s travel
          safety information. Always check your home country&apos;s travel
          advisory before departure.
        </p>
      </div>
    </main>
  );
}

// ─── Card ────────────────────────────────────────────────────

function SafetyCard({
  point,
  tone,
}: {
  point: SafetyPoint;
  tone: SafetySection["tone"];
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border bg-cream-50 p-5 pl-6 dark:bg-deep-900 ${tone.border}`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${tone.bar} opacity-70`}
      />
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone.bgSoft} ${tone.text}`}
          aria-hidden
        >
          {point.icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
            {point.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-deep-600 dark:text-cream-400">
            {point.body}
          </p>
        </div>
      </div>
    </article>
  );
}

// ─── Icons ───────────────────────────────────────────────────

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  className: "h-5 w-5",
};

function ShieldIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
    </svg>
  );
}

function PassportIcon() {
  return (
    <svg {...iconBase}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="11" r="2.5" />
      <path d="M9 17h6" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg {...iconBase}>
      <path d="M3 8a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14" r="1" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg {...iconBase}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg {...iconBase}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h9a3 3 0 0 0 0-6H7a3 3 0 0 1 0-6h9" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg {...iconBase}>
      <path d="M4 13l1.5-4.5A2 2 0 0 1 7.4 7h9.2a2 2 0 0 1 1.9 1.5L20 13" />
      <path d="M4 13h16v5a1 1 0 0 1-1 1h-1v1a1 1 0 0 1-2 0v-1H8v1a1 1 0 0 1-2 0v-1H5a1 1 0 0 1-1-1v-5Z" />
      <circle cx="7.5" cy="15.5" r="0.75" />
      <circle cx="16.5" cy="15.5" r="0.75" />
    </svg>
  );
}

function HotelIcon() {
  return (
    <svg {...iconBase}>
      <path d="M3 21V5a1 1 0 0 1 1-1h9v17" />
      <path d="M13 9h7a1 1 0 0 1 1 1v11" />
      <path d="M7 8h2M7 12h2M7 16h2M17 13h2M17 17h2" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 2L7 10h4l-3 5h8l-3-5h4L12 2Z" />
      <path d="M12 15v7" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

function BinocularsIcon() {
  return (
    <svg {...iconBase}>
      <path d="M6 8V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" />
      <path d="M14 8V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" />
      <circle cx="7" cy="16" r="3" />
      <circle cx="17" cy="16" r="3" />
      <path d="M10 16h4" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 3l9 16H3l9-16Z" />
      <path d="M12 9v5M12 17h.01" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg {...iconBase}>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <path d="M13 6v12" />
    </svg>
  );
}

function SuitcaseIcon() {
  return (
    <svg {...iconBase}>
      <rect x="4" y="7" width="16" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M9 13h6" />
    </svg>
  );
}

function HeartbeatIcon() {
  return (
    <svg {...iconBase}>
      <path d="M3 12h4l2-4 3 8 2-4h7" />
    </svg>
  );
}

function SirenIcon() {
  return (
    <svg {...iconBase}>
      <path d="M5 18h14v-4a7 7 0 1 0-14 0v4Z" />
      <path d="M12 3V2M20 5l-1 1M4 5l1 1" />
      <path d="M3 21h18" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg {...iconBase}>
      <path d="M5 21V3" />
      <path d="M5 4h10l-2 3 2 3H5" />
    </svg>
  );
}