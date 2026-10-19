// app/investment/opportunities/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/app/components/fade-in";
import { Stagger } from "@/app/components/stagger";

export const metadata: Metadata = {
  title: "Tourism Investment Opportunities — NTSP",
  description:
    "Kenya's tourism investment landscape — why invest, key opportunities across sectors, and how to get started.",
};

// ─── Stats ───────────────────────────────────────────────────
const STATS = [
  { value: "KShs 500B", label: "Tourism revenue (2025)" },
  { value: "2.7M", label: "International visitors" },
  { value: "5.2M", label: "Domestic visitors" },
  { value: "7.9M", label: "Total arrivals" },
] as const;

// ─── Why invest ──────────────────────────────────────────────
type Reason = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const REASONS: Reason[] = [
  {
    title: "Strategic location & regional hub",
    description:
      "Kenya is the gateway to East and Central Africa, with advanced air links through Jomo Kenyatta International Airport and a major seaport at Mombasa. Under EAC and AfCFTA, it's both a destination and a springboard into regional markets.",
    icon: <GlobeIcon />,
  },
  {
    title: "Stable macro-economic & policy environment",
    description:
      "Tourism is a pillar of Kenya's growth agenda, backed by infrastructure investment (roads, airports, power, digital) and targeted reforms. Tax holidays, VAT exemptions, and duty waivers in SEZs and EPZs enhance returns.",
    icon: <ScaleIcon />,
  },
  {
    title: "Growing consumer market",
    description:
      "An expanding middle class and urbanisation are fuelling domestic demand for leisure, hospitality, and lifestyle tourism. Over 50 million people offer both an outbound and inbound consumer base.",
    icon: <UsersIcon />,
  },
  {
    title: "Unmatched natural & cultural capital",
    description:
      "Few destinations combine world-class wildlife, coastlines, mountains, and heritage in one package. That diversity creates opportunities across multiple product lines — reducing reliance on a single segment.",
    icon: <MountainIcon />,
  },
  {
    title: "Innovation & technology ecosystem",
    description:
      "Branded the 'Silicon Savannah', Kenya hosts Africa's most dynamic tech ecosystem — underpinning e-booking, mobile payments (M-Pesa), smart marketing, and virtual-reality experiences.",
    icon: <CpuIcon />,
  },
  {
    title: "Government support & partnerships",
    description:
      "Through the Tourism Fund, Tourism Finance Corporation (TFC), and Kenya Tourism Board (KTB), investors access co-financing, PPP frameworks, and destination marketing support aligned with the SDGs.",
    icon: <HandshakeIcon />,
  },
  {
    title: "Skilled, youthful workforce",
    description:
      "Over 70% of the population is under 35. Training institutions like Kenya Utalii College produce skilled hospitality professionals, with competitive labour costs.",
    icon: <GraduationIcon />,
  },
];

// ─── Investment opportunities ────────────────────────────────
type Opportunity = {
  sector: string;
  specific: string;
  attraction: string;
  icon: React.ReactNode;
};

const OPPORTUNITIES: Opportunity[] = [
  {
    sector: "High-end lodges & resorts",
    specific: "Luxury tented camps near Maasai Mara, Laikipia conservancies",
    attraction:
      "High global demand for premium safari experiences; strong returns with conservation tie-ins.",
    icon: <TentIcon />,
  },
  {
    sector: "Coastal tourism",
    specific: "Beachfront resorts, boutique hotels, holiday villas in Diani, Malindi, Watamu",
    attraction:
      "Top tourist draw; strong occupancy potential and real-estate appreciation.",
    icon: <WaveIcon />,
  },
  {
    sector: "Eco-tourism",
    specific: "Conservation lodges, carbon-neutral resorts, rewilding projects",
    attraction:
      "Rising international demand for sustainable travel; aligns with Kenya's green agenda.",
    icon: <LeafIcon />,
  },
  {
    sector: "MICE facilities",
    specific: "Conference centres and exhibition halls in Nairobi and secondary cities",
    attraction:
      "Kenya is a regional business hub; strong corporate and international demand.",
    icon: <BuildingIcon />,
  },
  {
    sector: "Cultural & heritage tourism",
    specific: "Heritage hotels, museums, cultural villages, themed experiences",
    attraction:
      "Growing appetite for authentic, immersive cultural travel.",
    icon: <LandmarkIcon />,
  },
  {
    sector: "Tourism infrastructure",
    specific: "Roads, airports, utilities, cable cars, cruise terminals",
    attraction:
      "Improves accessibility; investors benefit from long-term service revenues.",
    icon: <RouteIcon />,
  },
  {
    sector: "Domestic leisure",
    specific: "Affordable resorts, water parks, adventure parks",
    attraction:
      "Rising middle class driving local tourism demand.",
    icon: <FerrisWheelIcon />,
  },
  {
    sector: "Technology in tourism",
    specific: "Booking platforms, smart hotels, VR wildlife tours",
    attraction:
      "Leverages Kenya's innovation ecosystem to enhance the tourism experience.",
    icon: <MonitorIcon />,
  },
];

export default function InvestmentOpportunitiesPage() {
  return (
    <main className="min-h-screen bg-cream-200 dark:bg-deep-950">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-band border-b border-cream-300/60 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Investment
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-deep-900 dark:text-cream-100 sm:text-4xl">
            Tourism investment opportunities in Kenya
          </h1>
          <div className="divider-gold mt-5 w-24" />
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-deep-600 dark:text-cream-300 sm:text-base">
            Kenya is one of Africa&apos;s most celebrated and diversified
            tourism destinations — blending natural wonders, cultural richness,
            and modern hospitality. In 2025, the sector achieved record
            performance and continues to attract world-class investment across
            multiple product lines.
          </p>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-brand-300 bg-cream-50 px-4 py-3 dark:border-brand-800 dark:bg-deep-900"
              >
                <p className="text-lg font-bold text-brand-700 dark:text-brand-300 sm:text-xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-deep-600 dark:text-cream-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* ── Why invest ─────────────────────────────────── */}
        <section>
          <FadeIn whenVisible>
            <header className="mb-6 flex items-start gap-3">
              <span
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                aria-hidden
              >
                <SparkIcon />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
                  Why invest in Kenya&apos;s tourism
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
                  A unique convergence of natural beauty, economic stability,
                  and investor-friendly policies.
                </p>
              </div>
            </header>
          </FadeIn>

          <div className="grid gap-3 sm:grid-cols-2">
            <Stagger delayStart={0.05} delayStep={0.04} maxDelay={0.3}>
              {REASONS.map((reason) => (
                <article
                  key={reason.title}
                  className="relative overflow-hidden rounded-xl border border-brand-300 bg-cream-50 p-5 pl-6 dark:border-brand-800 dark:bg-deep-900"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1 bg-brand-500 opacity-70"
                  />
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                      aria-hidden
                    >
                      {reason.icon}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
                        {reason.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-deep-600 dark:text-cream-400">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── Opportunities ──────────────────────────────── */}
        <section>
          <FadeIn whenVisible>
            <header className="mb-6 flex items-start gap-3">
              <span
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                aria-hidden
              >
                <TargetIcon />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
                  Key investment opportunities
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
                  Eight sectors with strong demand, existing infrastructure, and
                  clear pathways to returns.
                </p>
              </div>
            </header>
          </FadeIn>

          <div className="grid gap-3 sm:grid-cols-2">
            <Stagger delayStart={0.05} delayStep={0.04} maxDelay={0.4}>
              {OPPORTUNITIES.map((opp) => (
                <article
                  key={opp.sector}
                  className="relative overflow-hidden rounded-xl border border-emerald-300 bg-cream-50 p-5 pl-6 dark:border-emerald-800 dark:bg-deep-900"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1 bg-emerald-500 opacity-70"
                  />
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      aria-hidden
                    >
                      {opp.icon}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
                        {opp.sector}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-deep-700 dark:text-cream-300">
                        {opp.specific}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-emerald-800 dark:text-emerald-300">
                        <span className="font-semibold">Why it works:</span>{" "}
                        {opp.attraction}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── Closing + CTA ──────────────────────────────── */}
        <FadeIn whenVisible>
          <section className="rounded-2xl border border-brand-300 bg-brand-50 p-8 text-center dark:border-brand-800 dark:bg-brand-950/50">
            <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
              A multi-faceted tourism hub
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-deep-700 dark:text-cream-300">
              Kenya is more than a safari destination — it&apos;s a
              multi-faceted tourism hub with unmatched natural assets, a
              supportive investment climate, and growing demand from both
              international and domestic markets. For investors, the opportunity
              lies in developing world-class, sustainable tourism products that
              serve today&apos;s discerning travellers while securing attractive
              long-term returns.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/investment/inquiry"
                className="rounded-md bg-deep-800 px-5 py-2.5 text-sm font-medium text-cream-100 transition hover:bg-deep-900 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
              >
                Start an investor inquiry
              </Link>
              <Link
                href="/services"
                className="rounded-md border border-deep-300 bg-cream-50 px-5 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-cream-100 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100 dark:hover:bg-deep-800"
              >
                Explore services
              </Link>
            </div>
            <p className="mx-auto mt-5 max-w-xl text-xs text-deep-500 dark:text-cream-500">
              For investment requirements, licensing, and incentives, contact the
              Tourism Finance Corporation or the Kenya Tourism Board directly.
            </p>
          </section>
        </FadeIn>
      </div>
    </main>
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

function SparkIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 3v18M5 21h14" />
      <path d="M5 8h14l-2.5 5a3 3 0 0 1-9 0L5 8Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="9" cy="9" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M17 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.66" />
    </svg>
  );
}

function MountainIcon() {
  return (
    <svg {...iconBase}>
      <path d="m3 20 7-11 4 6 3-4 4 9H3Z" />
      <path d="m8.5 12.5 1.5 1 1.5-1" />
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg {...iconBase}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg {...iconBase}>
      <path d="m11 17-2 2a2 2 0 0 1-3-3l4-4" />
      <path d="m14 13 4-4a2 2 0 0 1 3 3l-4 4" />
      <path d="m8 12-2-2a2 2 0 0 1 3-3l3 3M16 12l2-2a2 2 0 0 0-3-3l-3 3" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg {...iconBase}>
      <path d="m12 3 10 5-10 5L2 8l10-5Z" />
      <path d="M6 10v5a6 6 0 0 0 12 0v-5M22 8v6" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

function TentIcon() {
  return (
    <svg {...iconBase}>
      <path d="m3 20 9-15 9 15H3Z" />
      <path d="M12 5v15M9 20l3-6 3 6" />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg {...iconBase}>
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" />
      <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg {...iconBase}>
      <path d="M21 3C11 3 5 8 5 15c0 3 2 5 5 5 7 0 11-6 11-17Z" />
      <path d="M9 20c1-5 4-9 8-11" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg {...iconBase}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 21v-4h6v4M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
    </svg>
  );
}

function LandmarkIcon() {
  return (
    <svg {...iconBase}>
      <path d="m3 10 9-6 9 6" />
      <path d="M5 10v8M19 10v8M9 10v8M15 10v8M3 21h18" />
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

function FerrisWheelIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="12" cy="10" r="6" />
      <path d="M12 4v12M6 10h12M4 20h16M8 20l4-10M16 20l-4-10" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg {...iconBase}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}