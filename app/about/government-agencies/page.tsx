// app/about/government-agencies/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/app/components/fade-in";
import { Stagger } from "@/app/components/stagger";

export const metadata: Metadata = {
  title: "Government Agencies — NTSP",
  description:
    "The state corporations, regulatory bodies, and cultural institutions that make up Kenya's tourism sector.",
};

// ─── Agencies ────────────────────────────────────────────────
// Seventeen agencies from the Ministry of Tourism, Wildlife and
// Heritage portfolio. Grouped into four thematic clusters so the
// page reads as structured content rather than a wall of text.
type Agency = {
  name: string;
  abbr?: string;
  description: string;
  tag?: "Marketing" | "Finance" | "Regulation" | "Training" | "Conservation" | "Culture" | "MICE";
};

type AgencyGroup = {
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
  agencies: Agency[];
};

const GROUPS: AgencyGroup[] = [
  {
    id: "marketing",
    title: "Marketing & brand",
    subtitle: "Promoting Kenya as a destination, domestically and internationally.",
    tone: {
      text: "text-brand-700 dark:text-brand-300",
      bgSoft: "bg-brand-50 dark:bg-brand-950/40",
      border: "border-brand-300 dark:border-brand-800",
      bar: "bg-brand-500",
    },
    icon: <MegaphoneIcon />,
    agencies: [
      {
        name: "Kenya Tourism Board",
        abbr: "KTB",
        description:
          "A State Corporation established under the Tourism Act whose mandate is to market Kenya as a tourist destination locally, regionally, and internationally. KTB's marketing strategy uses digital programs and research-based approaches to inspire the world through the brand Kenya.",
        tag: "Marketing",
      },
      {
        name: "Brand Kenya Board",
        description:
          "Tasked with identifying and refining the key attributes of Kenya that contribute positively to the nation's image and reputation. The Board works to create an authentic, credible brand for the country that establishes its uniqueness in the global arena.",
        tag: "Marketing",
      },
      {
        name: "Tourism Research Institute",
        abbr: "TRI",
        description:
          "A State Corporation established by the Tourism Act 2011 to undertake and coordinate tourism research and data analysis. TRI is the principal reference point for generating data that informs government and private-sector decision making on tourism matters.",
        tag: "Marketing",
      },
    ],
  },
  {
    id: "finance",
    title: "Financing & development",
    subtitle: "Funding tourism enterprises, infrastructure, and premium accommodation.",
    tone: {
      text: "text-indigo-700 dark:text-indigo-300",
      bgSoft: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-300 dark:border-indigo-800",
      bar: "bg-indigo-500",
    },
    icon: <CoinsIcon />,
    agencies: [
      {
        name: "Tourism Fund",
        description:
          "A body corporate established under the Tourism Act 2011, operational since 1 September 2012. The Fund is the legal successor to the Catering and Tourism Development Levy Trustees, providing financing for tourism development.",
        tag: "Finance",
      },
      {
        name: "Tourism Finance Corporation",
        abbr: "TFC",
        description:
          "A specialized Development Financial Institution established by the government of Kenya through the Tourism Act No. 28 of 2011. Its mission is to develop and diversify Kenya's tourism industry by providing financial services to investors in tourism-related enterprises.",
        tag: "Finance",
      },
      {
        name: "Kenya Safari Lodges and Hotels Limited",
        abbr: "KSLH",
        description:
          "A government parastatal mandated with the provision of premium hotel and lodge accommodation, conference and business meeting venues, customized beach and safari experiences, and high-value niche products — aligned with Vision 2030.",
        tag: "Finance",
      },
    ],
  },
  {
    id: "regulation",
    title: "Regulation & training",
    subtitle: "Setting standards for the sector and building its workforce.",
    tone: {
      text: "text-emerald-700 dark:text-emerald-300",
      bgSoft: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-300 dark:border-emerald-800",
      bar: "bg-emerald-500",
    },
    icon: <ScaleIcon />,
    agencies: [
      {
        name: "Tourism Regulatory Authority",
        abbr: "TRA",
        description:
          "A corporate body established under Section 4 of the Tourism Act No. 28 of 2011, mandated to regulate the tourism sector. TRA develops regulations, standards, and guidelines that ensure all-round quality service delivery across the sector.",
        tag: "Regulation",
      },
      {
        name: "Kenya Utalii College",
        abbr: "KUC",
        description:
          "A leading African hospitality and tourism training institution with over 60,000 graduates serving in the local and international industry. Established in 1975 under the Hotels and Restaurants Act (Cap. 494), now governed by the Tourism Act 2011.",
        tag: "Training",
      },
      {
        name: "Ushanga Kenya Initiative",
        description:
          "A national initiative launched in 2017 to create jobs and transform the living standards of pastoralist women through the commercialization of beadwork, turning a traditional activity into a source of economic benefit for communities.",
        tag: "Training",
      },
    ],
  },
  {
    id: "conservation",
    title: "Conservation, culture & MICE",
    subtitle: "Protecting Kenya's natural and cultural heritage, and hosting the world.",
    tone: {
      text: "text-rose-700 dark:text-rose-300",
      bgSoft: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-300 dark:border-rose-800",
      bar: "bg-rose-500",
    },
    icon: <GlobeIcon />,
    agencies: [
      {
        name: "Kenya Wildlife Service",
        abbr: "KWS",
        description:
          "A state corporation established by an Act of Parliament (Cap. 376), now repealed by WCMA (2013), with the mandate to conserve and manage wildlife in Kenya and enforce related laws. KWS works with stakeholders across all protected areas to conserve Kenya's wildlife for the Kenyan people and the world.",
        tag: "Conservation",
      },
      {
        name: "Wildlife Research & Training Institute",
        abbr: "WRTI",
        description:
          "Established under Section 50 of the Wildlife Conservation and Management Act 2013 and operationalized in July 2020, WRTI conducts and coordinates wildlife research and academic training to enhance planning and decision making in wildlife conservation and management.",
        tag: "Conservation",
      },
      {
        name: "National Museums of Kenya",
        abbr: "NMK",
        description:
          "A state corporation established by the Museums and Heritage Act 2006. NMK is a multi-disciplinary institution that collects, preserves, studies, documents, and presents Kenya's past and present cultural and natural heritage for the benefit of Kenya and the world.",
        tag: "Culture",
      },
      {
        name: "Kenya National Archives and Documentation Services",
        abbr: "KNADS",
        description:
          "Located in downtown Nairobi along Moi Avenue, KNADS was established in 1965 by an Act of Parliament and holds over 40,000 volumes. It currently sits under the Office of the Vice-President and State Department for Culture and Heritage.",
        tag: "Culture",
      },
      {
        name: "Bomas of Kenya",
        description:
          "A living showcase of Kenya's cultural diversity — situated 10km from Nairobi city centre and 1km past the main entrance of Nairobi National Park. Bomas offers a miniature Kenya through traditional homesteads, dance, and performance.",
        tag: "Culture",
      },
      {
        name: "National Heroes Council",
        abbr: "NHC",
        description:
          "A state corporation established by the Kenya Heroes Act No. 5 of 2014 in accordance with the State Corporation Act (Cap. 446), under the State Department for Culture and Heritage in the Ministry of Tourism, Wildlife and Heritage.",
        tag: "Culture",
      },
      {
        name: "The Kenyatta International Convention Centre",
        abbr: "KICC",
        description:
          "A state corporation established under the Tourism Act 2011 to promote Meetings, Incentive Travel, Conferences, and Exhibitions (MICE). The facility's main conference room holds over 4,000 delegates.",
        tag: "MICE",
      },
    ],
  },
];

const TAG_TONE: Record<NonNullable<Agency["tag"]>, string> = {
  Marketing: "bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-200",
  Finance: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
  Regulation: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  Training: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  Conservation: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  Culture: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  MICE: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
};

export default function GovernmentAgenciesPage() {
  return (
    <main className="min-h-screen bg-cream-200 dark:bg-deep-950">
      {/* ── Hero band ─────────────────────────────────────── */}
      <section className="hero-band border-b border-cream-300/60 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            About NTSP
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-deep-900 dark:text-cream-100 sm:text-4xl">
            State and Government Agencies
          </h1>
          <div className="divider-gold mt-5 w-24" />
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-deep-600 dark:text-cream-300 sm:text-base">
            Kenya&apos;s tourism sector is supported by a family of state
            corporations, regulatory bodies, and cultural institutions — each
            with a distinct mandate. Together they market the country, fund its
            enterprises, set its standards, and protect its natural and cultural
            heritage.
          </p>
          <nav className="mt-6">
            <Link
              href="/about"
              className="text-xs font-medium text-deep-600 transition hover:text-brand-600 dark:text-cream-300 dark:hover:text-brand-400"
            >
              ← Back to About
            </Link>
          </nav>
        </div>
      </section>

      {/* ── Groups ────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {GROUPS.map((group) => (
          <FadeIn key={group.id} whenVisible>
            <section id={group.id} className="scroll-mt-24">
              <header className="mb-6 flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${group.tone.bgSoft} ${group.tone.text}`}
                  aria-hidden
                >
                  {group.icon}
                </span>
                <div>
                  <h2 className={`text-xl font-bold ${group.tone.text}`}>
                    {group.title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
                    {group.subtitle}
                  </p>
                </div>
              </header>

              <div className="grid gap-3 sm:grid-cols-2">
                <Stagger delayStart={0.05} delayStep={0.04} maxDelay={0.3}>
                  {group.agencies.map((a) => (
                    <AgencyCard key={a.name} agency={a} tone={group.tone} />
                  ))}
                </Stagger>
              </div>
            </section>
          </FadeIn>
        ))}

        {/* ── CTA back to About ────────────────────────────── */}
        <FadeIn whenVisible>
          <div className="rounded-2xl border border-brand-300 bg-brand-50 p-6 text-center dark:border-brand-800 dark:bg-brand-950/50">
            <h2 className="text-lg font-bold text-deep-800 dark:text-cream-100">
              Looking for the Directorate itself?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-deep-700 dark:text-cream-300">
              The State Department of Tourism sets policy and provides
              leadership across this ecosystem. See its mandate and functions.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block rounded-md bg-deep-800 px-5 py-2.5 text-sm font-medium text-cream-100 transition hover:bg-deep-900 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
            >
              About the State Department
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}

function AgencyCard({
  agency,
  tone,
}: {
  agency: Agency;
  tone: AgencyGroup["tone"];
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-xl border bg-cream-50 p-5 pl-6 dark:bg-deep-900 ${tone.border}`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${tone.bar} opacity-70`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
            {agency.name}
            {agency.abbr && (
              <span className={`ml-2 text-xs font-medium ${tone.text}`}>
                {agency.abbr}
              </span>
            )}
          </h3>
          <p className="mt-1.5 text-xs leading-5 text-deep-600 dark:text-cream-400">
            {agency.description}
          </p>
        </div>
        {agency.tag && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TAG_TONE[agency.tag]}`}
          >
            {agency.tag}
          </span>
        )}
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

function MegaphoneIcon() {
  return (
    <svg {...iconBase}>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l7 4V6L6 10H4a1 1 0 0 0-1 1Z" />
      <path d="M16 8a4 4 0 0 1 0 8" />
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

function ScaleIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 3v18M5 21h14" />
      <path d="M5 8h14l-2.5 5a3 3 0 0 1-9 0L5 8Z" />
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