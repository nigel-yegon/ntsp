// app/about/page.tsx
import Link from "next/link";
import FadeIn from "@/app/components/fade-in";
import { Stagger } from "@/app/components/stagger";

export const metadata = {
  title: "About — NTSP",
  description:
    "The National Tourism Service Portal brings Kenya's destinations, experiences, and travel planning into one place.",
};

// ─── Functions ───────────────────────────────────────────────
// The 12 functions are grouped into four thematic sections.
// Each function carries its own icon; each group carries a tone
// and a section icon, so the list reads as four scannable
// clusters instead of twelve identical cards.
type FunctionItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type FunctionGroup = {
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
  items: FunctionItem[];
};
// ─── Mandate oversight areas ────────────────────────────────
// The six oversight areas from Executive Order No. 2 of 2013.
// Each is now a card with its own icon so the list reads as
// six scannable obligations, not six bullets.
type MandatePoint = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const MANDATE_POINTS: MandatePoint[] = [
  {
    title: "Policy direction & planning",
    description:
      "Set the strategic direction for tourism development across the country.",
    icon: <CompassPointIcon />,
  },
  {
    title: "Product diversification",
    description:
      "Develop new tourism products and diversify what Kenya offers to visitors.",
    icon: <LayersIcon />,
  },
  {
    title: "Marketing & promotion",
    description:
      "Position Kenya as a leading destination for domestic and international travellers.",
    icon: <MegaphoneIcon />,
  },
  {
    title: "Supply & demand synergy",
    description:
      "Connect operators, communities, and visitors so the sector works as one.",
    icon: <LinkIcon />,
  },
  {
    title: "Competitiveness & investment",
    description:
      "Strengthen Kenya's investment climate and global competitiveness in tourism.",
    icon: <TrendingUpIcon />,
  },
  {
    title: "Monitoring & evaluation",
    description:
      "Track tourism programs and activities to ensure measurable progress.",
    icon: <ActivityIcon />,
  },
];
const FUNCTION_GROUPS: FunctionGroup[] = [
  {
    id: "policy",
    title: "Policy & regulation",
    subtitle: "Setting the legal and strategic direction for tourism.",
    tone: {
      text: "text-brand-700 dark:text-brand-300",
      bgSoft: "bg-brand-50 dark:bg-brand-950/40",
      border: "border-brand-300 dark:border-brand-800",
      bar: "bg-brand-500",
    },
    icon: <ScaleIcon />,
    items: [
      {
        title: "Policy & strategy",
        description:
          "Formulate, implement, and review tourism policy in collaboration with stakeholders across the sector.",
        icon: <DocumentIcon />,
      },
      {
        title: "Regulation",
        description:
          "Establish an enabling legal and regulatory framework for the sustainable development of tourism.",
        icon: <GavelIcon />,
      },
      {
        title: "Codes of practice",
        description:
          "Develop and enforce tourism codes of practice in collaboration with stakeholders.",
        icon: <ClipboardCheckIcon />,
      },
      {
        title: "International agreements",
        description:
          "Initiate negotiations and implementation of bilateral and multilateral tourism-related agreements, protocols, conventions, and treaties.",
        icon: <GlobeIcon />,
      },
    ],
  },
  {
    id: "coordination",
    title: "Coordination & partnerships",
    subtitle: "Connecting government, industry, and international partners.",
    tone: {
      text: "text-indigo-700 dark:text-indigo-300",
      bgSoft: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-300 dark:border-indigo-800",
      bar: "bg-indigo-500",
    },
    icon: <NetworkIcon />,
    items: [
      {
        title: "Coordination",
        description:
          "Coordinate and liaise with international, regional, and local institutions on tourism matters.",
        icon: <HandshakeIcon />,
      },
      {
        title: "Resource mobilisation",
        description:
          "Mobilise resources in consultation with the National Treasury and other development partners.",
        icon: <CoinsIcon />,
      },
    ],
  },
  {
    id: "promotion",
    title: "Promotion & product",
    subtitle: "Growing demand and diversifying what Kenya offers.",
    tone: {
      text: "text-emerald-700 dark:text-emerald-300",
      bgSoft: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-300 dark:border-emerald-800",
      bar: "bg-emerald-500",
    },
    icon: <MegaphoneIcon />,
    items: [
      {
        title: "Marketing & promotion",
        description:
          "Market and promote domestic and international tourism in collaboration with stakeholders.",
        icon: <TargetIcon />,
      },
      {
        title: "Product development",
        description:
          "Develop and diversify viable tourism products, and promote community participation in tourism.",
        icon: <LayersIcon />,
      },
      {
        title: "Innovation & e-Tourism",
        description:
          "Promote innovation, cost-effective uptake of e-Tourism, and appropriate transfer of technologies for tourism development.",
        icon: <CpuIcon />,
      },
    ],
  },
  {
    id: "safety-people",
    title: "Safety & people",
    subtitle: "Protecting visitors and building the sector's workforce.",
    tone: {
      text: "text-rose-700 dark:text-rose-300",
      bgSoft: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-300 dark:border-rose-800",
      bar: "bg-rose-500",
    },
    icon: <ShieldIcon />,
    items: [
      {
        title: "Safety & security",
        description:
          "Facilitate the safety and security of visitors in liaison with security agencies.",
        icon: <ShieldCheckIcon />,
      },
      {
        title: "Human resources",
        description:
          "Coordinate the development of human resource capacity in the tourism sector.",
        icon: <UsersIcon />,
      },
      {
        title: "Vision 2030",
        description:
          "Coordinate and implement tourism programs under the Vision 2030 flagship projects.",
        icon: <FlagIcon />,
      },
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="bg-cream-200 dark:bg-deep-950">
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center md:py-24">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-200">
            About NTSP
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-deep-800 md:text-5xl dark:text-cream-100">
            Kenya&apos;s tourism, in one place
          </h1>
          <div className="divider-gold mt-6 w-24" />
          <p className="mt-6 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            The National Tourism Service Portal is a single window to the
            destinations, experiences, and travel opportunities that make Kenya
            one of the world&apos;s most compelling destinations.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
               {/* ─── MANDATE ───────────────────────────────────────── */}
        <FadeIn whenVisible>
          <section>
            <header className="mb-5 flex items-start gap-3">
              <span
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                aria-hidden
              >
                <MandateIcon />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
                  Our mandate
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
                  Strategic policy direction and leadership in tourism
                  development and management — set out under Executive Order
                  No.&nbsp;2 of 2013.
                </p>
              </div>
            </header>

            <p className="leading-relaxed text-deep-700 dark:text-cream-300">
              The State Department of Tourism is mandated with providing
              strategic policy direction and leadership in tourism development
              and management in Kenya. This mandate places the Ministry at the
              centre of coordinating and overseeing the sector&apos;s growth.
              The NTSP exists to make that mandate tangible for visitors —
              turning policy and strategy into a working window on the
              country&apos;s destinations, experiences, and travel options.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Stagger delayStart={0.05} delayStep={0.05} maxDelay={0.4}>
                {MANDATE_POINTS.map((point) => (
                  <article
                    key={point.title}
                    className="relative overflow-hidden rounded-xl border border-brand-300 bg-cream-50 p-4 pl-5 dark:border-brand-800 dark:bg-deep-900"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-1 bg-brand-500 opacity-70"
                    />
                    <div className="flex items-start gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                        aria-hidden
                      >
                        {point.icon}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
                          {point.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-deep-600 dark:text-cream-400">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </Stagger>
            </div>
          </section>
        </FadeIn>

        {/* ─── HOW TOURISM WORKS ─────────────────────────────── */}
        <FadeIn whenVisible>
          <section>
            <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
              How tourism works in Kenya
            </h2>
            <div className="mt-4 space-y-4 text-deep-700 dark:text-cream-300">
              <p className="leading-relaxed">
                Tourism is unique among sectors. It draws its existence and
                growth from others — transport, accommodation, food and
                beverage, recreation, entertainment — and its products and
                services cut across providers and geographies.
              </p>
              <p className="leading-relaxed">
                A single trip might start at an international airport, continue
                by road through several counties, and end at a leisure
                destination far from where the visitor first arrived. Each leg
                is a different provider, a different county, a different part of
                what a visitor ultimately experiences.
              </p>
              <div className="rounded-xl border border-brand-300 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-950/40">
                <p className="text-sm leading-relaxed text-brand-800 dark:text-brand-200">
                  <span className="font-semibold">The key insight:</span> Tourism
                  packages are circuit-based. Major attractions and ecosystems
                  are shared across counties and regions — which makes
                  coordination not just helpful, but essential.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ─── FUNCTIONS ─────────────────────────────────────── */}
        <section>
          <FadeIn whenVisible>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
                What the Directorate does
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-deep-700 dark:text-cream-300">
                The Directorate of Tourism carries out the day-to-day work of
                the mandate. Its functions shape how tourism is planned,
                promoted, and protected across the country.
              </p>
            </div>
          </FadeIn>

          <div className="space-y-10">
            {FUNCTION_GROUPS.map((group) => (
              <FadeIn key={group.id} whenVisible>
                <section id={group.id} className="scroll-mt-24">
                  <header className="mb-4 flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${group.tone.bgSoft} ${group.tone.text}`}
                      aria-hidden
                    >
                      {group.icon}
                    </span>
                    <div>
                      <h3 className={`text-lg font-bold ${group.tone.text}`}>
                        {group.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-deep-600 dark:text-cream-400">
                        {group.subtitle}
                      </p>
                    </div>
                  </header>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Stagger delayStart={0.05} delayStep={0.04} maxDelay={0.3}>
                      {group.items.map((item) => (
                        <FunctionCard
                          key={item.title}
                          item={item}
                          tone={group.tone}
                        />
                      ))}
                    </Stagger>
                  </div>
                </section>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ─── COORDINATION ──────────────────────────────────── */}
        <FadeIn whenVisible>
          <section className="rounded-2xl border border-deep-200 bg-cream-100 p-8 dark:border-deep-800 dark:bg-deep-900">
            <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
              Coordinating across government
            </h2>
            <div className="mt-4 space-y-4 text-deep-700 dark:text-cream-300">
              <p className="leading-relaxed">
                The nature of tourism — shared attractions, cross-county
                circuits, and multiple service providers — calls for a
                considerable degree of coordination and cooperation between the
                different levels of government and stakeholders.
              </p>
              <p className="leading-relaxed">
                This coordination is provided for under Article 189 of the
                Constitution, which sets out the framework for cooperation
                between national and county governments. It ensures that tourism
                development across the country is harmonised and sustainable —
                that what one county does supports, rather than competes with,
                what its neighbours are building.
              </p>
              <p className="leading-relaxed">
                The NTSP is one small expression of that coordination: a shared
                platform that treats the country&apos;s tourism offering as a
                single, connected experience.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* ─── CTA ───────────────────────────────────────────── */}
        <FadeIn whenVisible>
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
        </FadeIn>
      </div>
    </div>
  );
}

// ─── Function card ───────────────────────────────────────────

function FunctionCard({
  item,
  tone,
}: {
  item: FunctionItem;
  tone: FunctionGroup["tone"];
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-xl border bg-cream-50 p-4 pl-5 dark:bg-deep-900 ${tone.border}`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${tone.bar} opacity-70`}
      />
      <div className="flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.bgSoft} ${tone.text}`}
          aria-hidden
        >
          {item.icon}
        </span>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
            {item.title}
          </h4>
          <p className="mt-1 text-xs leading-5 text-deep-600 dark:text-cream-400">
            {item.description}
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

function ScaleIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 3v18M5 21h14" />
      <path d="M5 8h14l-2.5 5a3 3 0 0 1-9 0L5 8Z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg {...iconBase}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
    </svg>
  );
}

function GavelIcon() {
  return (
    <svg {...iconBase}>
      <path d="m14 3 7 7-3 3-7-7 3-3Z" />
      <path d="m9 8 3 3M3 21l8-8M5 15l4 4" />
    </svg>
  );
}

function ClipboardCheckIcon() {
  return (
    <svg {...iconBase}>
      <rect x="6" y="5" width="12" height="16" rx="2" />
      <path d="M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 13l2 2 4-4" />
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

function NetworkIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="12" cy="12" r="2" />
      <circle cx="4" cy="6" r="2" />
      <circle cx="20" cy="6" r="2" />
      <circle cx="4" cy="18" r="2" />
      <circle cx="20" cy="18" r="2" />
      <path d="M10 10 6 8M14 10l4-2M10 14l-4 2M14 14l4 2" />
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

function CoinsIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="9" cy="9" r="5" />
      <path d="M14.5 5.5a5 5 0 1 1-9 9M15 14h4M17 12v4" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg {...iconBase}>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l7 4V6L6 10H4a1 1 0 0 0-1 1Z" />
      <path d="M16 8a4 4 0 0 1 0 8" />
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

function LayersIcon() {
  return (
    <svg {...iconBase}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5M3 18l9 5 9-5" />
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

function ShieldIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
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

function FlagIcon() {
  return (
    <svg {...iconBase}>
      <path d="M5 21V3" />
      <path d="M5 4h10l-2 3 2 3H5" />
    </svg>
  );
}
function MandateIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12h6M9 15h4" />
    </svg>
  );
}

function CompassPointIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg {...iconBase}>
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07L11 4.93" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07L13 19.07" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg {...iconBase}>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg {...iconBase}>
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  );
}