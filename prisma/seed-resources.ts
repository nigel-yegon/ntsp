// prisma/seed-resources.ts
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/* ─────────────────────────────────────────────────────────────────
   RESOURCE SEEDS

   Sourced from publicly available Kenyan government documents
   (tourism.go.ke, tra.go.ke, knbs.or.ke, tri.go.ke).

   The `storageKey` field points at a predictable path so that when
   the actual PDFs are uploaded to storage, they land at the same
   path and download links start working without a DB update.
   ───────────────────────────────────────────────────────────────── */

type ResourceSeed = {
  title: string;
  description: string;
  category: "POLICY" | "RESEARCH" | "INNOVATION" | "GUIDELINES" | "REPORTS" | "OTHER";
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  published: boolean;
  order: number;
  uploaderName: string | null;
  sourceUrl: string;
};

const RESOURCE_SEEDS: ResourceSeed[] = [
  // ── POLICY (4) ──
  {
    title: "Draft National Tourism Policy (January 2025)",
    description:
      "The draft National Tourism Policy provides a comprehensive framework for transforming Kenya's tourism sector. It traces the policy journey from Sessional Paper No. 8 of 1969 through to the present, outlines the legal and institutional framework under the Tourism Act (Cap 381), and sets out strategic direction for sustainable tourism development, product diversification, and destination competitiveness.",
    category: "POLICY",
    fileName: "draft-national-tourism-policy-january-2025.pdf",
    mimeType: "application/pdf",
    sizeBytes: 4_820_000,
    published: true,
    order: 1,
    uploaderName: "Ministry of Tourism",
    sourceUrl:
      "https://www.tourism.go.ke/wp-content/uploads/2025/01/DRAFT-NATIONAL-TOURISM-POLICY-JANUARY-2025.pdf",
  },
  {
    title: "Draft National Tourism Policy (June 2025)",
    description:
      "An updated draft of the National Tourism Policy incorporating stakeholder feedback. Covers tourism trends including technology integration, remote work and digital nomadism, the sharing economy, and climate change. Reviews the legal and institutional framework and proposes restructuring of tourism institutions to improve service delivery and efficiency.",
    category: "POLICY",
    fileName: "draft-national-tourism-policy-june-2025.pdf",
    mimeType: "application/pdf",
    sizeBytes: 5_140_000,
    published: true,
    order: 2,
    uploaderName: "Ministry of Tourism",
    sourceUrl:
      "https://www.tourism.go.ke/wp-content/uploads/2025/07/DRAFT-NATIONAL-TOURISM-POLICY-JUNE-2025-.docx",
  },
  {
    title: "TRA Strategic Plan 2023–2027",
    description:
      "The Tourism Regulatory Authority's five-year strategic plan. Sets out the Authority's vision, strategic objectives, and planned interventions across regulation, quality assurance, and stakeholder engagement. Includes a situation analysis of strengths, weaknesses, opportunities, and threats affecting tourism regulation in Kenya.",
    category: "POLICY",
    fileName: "tra-strategic-plan-2023-2027.pdf",
    mimeType: "application/pdf",
    sizeBytes: 3_260_000,
    published: true,
    order: 3,
    uploaderName: "Tourism Regulatory Authority",
    sourceUrl:
      "https://tra.go.ke/wp-content/uploads/2024/07/TRA-APPROVED-STRATEGIC-PLAN-2023-2027.pdf",
  },
  {
    title: "State Department for Tourism Strategic Plan 2023–2027",
    description:
      "The State Department for Tourism's strategic plan for the 2023–2027 period. Defines Key Result Areas including policy and legislation, product development, marketing and promotion, tourism research, technology and innovation, financing and investment, and climate change. Sets out strategic objectives and choices for each KRA.",
    category: "POLICY",
    fileName: "sdt-strategic-plan-2023-2027.pdf",
    mimeType: "application/pdf",
    sizeBytes: 2_890_000,
    published: true,
    order: 4,
    uploaderName: "State Department for Tourism",
    sourceUrl:
      "https://www.tourism.go.ke/wp-content/uploads/2024/12/SDT-Strategic-Plan-2023-27-Abridged-Version-Final.pdf",
  },

  // ── RESEARCH (3) ──
  {
    title: "Inbound and Outbound Tourism Expenditure Survey Report 2025",
    description:
      "A joint survey by the Kenya National Bureau of Statistics and tourism sector stakeholders estimating the expenditure of international visitors in Kenya and Kenyan residents travelling abroad. Findings include average daily spend of KSh 19,306 per inbound tourist and KSh 12,501 per outbound tourist, with average stays of 9 and 10 nights respectively. Provides inputs for the Tourism Satellite Account and balance of payments.",
    category: "RESEARCH",
    fileName: "knbs-tourism-expenditure-survey-2025.pdf",
    mimeType: "application/pdf",
    sizeBytes: 6_780_000,
    published: true,
    order: 5,
    uploaderName: "Kenya National Bureau of Statistics",
    sourceUrl:
      "https://www.knbs.or.ke/wp-content/uploads/2026/10/2025-Inbound-and-Outbound-Tourism-Expenditure-Survey-Report.pdf",
  },
  {
    title: "Annual Tourism Sector Performance Report 2024",
    description:
      "The Tourism Research Institute's seventh annual performance report. Kenya welcomed 2,394,376 international visitors in 2024, a 14.6% increase over 2023, with inbound tourism earnings rising to KSh 452.20 billion. The report covers arrivals by source market and purpose, cruise tourism, bed occupancy, MICE performance, and wage employment.",
    category: "RESEARCH",
    fileName: "tri-tourism-sector-performance-report-2024.pdf",
    mimeType: "application/pdf",
    sizeBytes: 5_920_000,
    published: true,
    order: 6,
    uploaderName: "Tourism Research Institute",
    sourceUrl:
      "https://tri.go.ke/wp-content/uploads/2025/02/TRI-Tourism-Sector-Performance-Report-2024.pdf",
  },
  {
    title: "Kenya Tourism Rebranding and Repositioning Task Force Recommendations",
    description:
      "Recommendations from the government task force on tourism rebranding and repositioning, referenced in the Ministry of Tourism's AI-first strategy announced in 2026. The task force's work underpins the shift toward data-driven destination management and digital marketing.",
    category: "RESEARCH",
    fileName: "tourism-rebranding-taskforce-recommendations.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1_840_000,
    published: true,
    order: 7,
    uploaderName: "Ministry of Tourism",
    sourceUrl: "https://www.tourism.go.ke",
  },

  // ── INNOVATION (2) ──
  {
    title: "Kenya AI-First Tourism Strategy (2026)",
    description:
      "A strategic partnership between the Ministry of Tourism and Google Kenya to establish Kenya as Africa's first AI-first tourism marketing destination. Includes the Tourism Pulse Data Hub (real-time search and sentiment analytics on Google Cloud), an AI-curated trip planner powered by Gemini, digital skills training for youth and tourism SMEs, and precision marketing across priority source markets.",
    category: "INNOVATION",
    fileName: "kenya-ai-first-tourism-strategy-2026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 3_410_000,
    published: true,
    order: 8,
    uploaderName: "Ministry of Tourism",
    sourceUrl:
      "https://www.kenyanews.go.ke/ministry-of-tourism-and-google-kenya-collaborate-on-ai-powered-tourism-strategy/",
  },
  {
    title: "National Tourism Strategy (Draft, June 2025)",
    description:
      "A draft national tourism strategy covering brand architecture, niche product development (culinary trails, wellness tourism, indigenous heritage, film tourism), smart tourism and digital engagement, and targeted market-specific promotion. Proposes a Smart Tourism Portal, an integrated tourism super app, free Wi-Fi hotspots in key tourism towns, and interactive digital screens at parks and airports.",
    category: "INNOVATION",
    fileName: "draft-national-tourism-strategy-june-2025.pdf",
    mimeType: "application/pdf",
    sizeBytes: 7_150_000,
    published: true,
    order: 9,
    uploaderName: "Ministry of Tourism",
    sourceUrl:
      "https://www.tourism.go.ke/wp-content/uploads/2025/07/DRAFT-NATIONAL-TOURISM-STRATEGY-DRAFT-June-2025-4.pdf",
  },

  // ── GUIDELINES (2) ──
  {
    title: "Guidelines for Tourism Enterprises on Safety and Hygiene Standards",
    description:
      "Operational guidelines for regulated tourism enterprises covering safety, hygiene, and quality standards. Referenced in the TRA Strategic Plan as a response to changing consumer preferences and the greater emphasis on safety and hygiene in the post-pandemic travel market.",
    category: "GUIDELINES",
    fileName: "tra-safety-hygiene-guidelines.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1_960_000,
    published: true,
    order: 10,
    uploaderName: "Tourism Regulatory Authority",
    sourceUrl: "https://tra.go.ke",
  },
  {
    title: "KATO Code of Conduct and Best Practices for Tour Operators",
    description:
      "The Kenya Association of Tour Operators' code of conduct for member operators, covering ethical wildlife viewing, safety protocols, community engagement, and environmental responsibility. Referenced as the industry standard for responsible safari operations.",
    category: "GUIDELINES",
    fileName: "kato-code-of-conduct.pdf",
    mimeType: "application/pdf",
    sizeBytes: 980_000,
    published: true,
    order: 11,
    uploaderName: "Kenya Association of Tour Operators",
    sourceUrl: "https://katokenya.org",
  },

  // ── REPORTS (2) ──
  {
    title: "Kenya Tourism Satellite Account: Methodological Notes",
    description:
      "Technical documentation on the compilation of Kenya's Tourism Satellite Account (TSA), outlining data sources, methodology, and the contribution of tourism to GDP and employment. Referenced as an input to the KNBS expenditure survey and national accounts.",
    category: "REPORTS",
    fileName: "kenya-tsa-methodological-notes.pdf",
    mimeType: "application/pdf",
    sizeBytes: 2_340_000,
    published: true,
    order: 12,
    uploaderName: "Kenya National Bureau of Statistics",
    sourceUrl: "https://www.knbs.or.ke",
  },
  {
    title: "Tourism Fund Annual Report 2024",
    description:
      "The Tourism Fund's annual report covering levy collection, disbursements to tourism institutions, and the revolving fund for hospitality training scholarships. The Fund supports capacity development through the Kenya Utalii College and other training institutions.",
    category: "REPORTS",
    fileName: "tourism-fund-annual-report-2024.pdf",
    mimeType: "application/pdf",
    sizeBytes: 3_670_000,
    published: true,
    order: 13,
    uploaderName: "Tourism Fund",
    sourceUrl: "https://tourismfund.go.ke",
  },

  // ── OTHER (1) ──
  {
    title: "Tourism Act (Cap 381) — Consolidated Text",
    description:
      "The consolidated text of the Tourism Act (Cap 381), enacted in 2011, which provides for the development, management, marketing, and regulation of sustainable tourism in Kenya. Establishes the Tourism Regulatory Authority, Kenya Tourism Board, Tourism Research Institute, Tourism Fund, Kenya Utalii College, Kenyatta International Convention Centre, Tourism Finance Corporation, and the Tourism Tribunal.",
    category: "OTHER",
    fileName: "tourism-act-cap-381.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1_120_000,
    published: true,
    order: 14,
    uploaderName: "Republic of Kenya",
    sourceUrl: "https://www.tourism.go.ke",
  },
];

/* ─────────────────────────────────────────────────────────────────
   Storage key helper

   Every resource lives under `resources/<category>/<filename>`.
   The public route /api/files/[...key] serves files from this path.
   Upload actual PDFs to the same key to make download links work
   without touching the DB.
   ───────────────────────────────────────────────────────────────── */
function storageKeyFor(category: string, fileName: string): string {
  return `resources/${category.toLowerCase()}/${fileName}`;
}

async function main() {
  console.log(`🌱 Seeding ${RESOURCE_SEEDS.length} resources...`);

  // Attribute to admin if available
  const admin = await prisma.user.findUnique({
    where: { email: "admin@test.local" },
    select: { id: true, name: true },
  });

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const r of RESOURCE_SEEDS) {
    const { sourceUrl: _src, ...data } = r;
    const storageKey = storageKeyFor(r.category, r.fileName);

    const existing = await prisma.resource.findFirst({
      where: { title: r.title },
      select: { id: true },
    });

    const payload = {
      ...data,
      storageKey,
      uploadedById: admin?.id ?? null,
      uploaderName: r.uploaderName ?? admin?.name ?? null,
    };

    try {
      if (existing) {
        await prisma.resource.update({
          where: { id: existing.id },
          data: payload,
        });
        updated++;
        console.log(`  ♻ ${r.title} → ${storageKey}`);
      } else {
        await prisma.resource.create({ data: payload });
        created++;
        console.log(`  ✔ ${r.title} → ${storageKey}`);
      }
    } catch (err) {
      failed++;
      console.error(`  ✖ ${r.title}`);
      console.error(`    ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(
    `\n✅ Done: ${created} created, ${updated} updated, ${failed} failed.`
  );

  if (failed > 0) {
    console.log(
      "\n⚠ Some rows failed. Check the errors above — likely missing required fields or a schema mismatch."
    );
  }
}

main()
  .catch((error) => {
    console.error("Resource seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });