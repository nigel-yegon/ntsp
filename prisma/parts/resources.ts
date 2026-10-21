// prisma/parts/resources.ts
import type { SeedContext } from "./types";

type ResourceSeed = {
  title: string;
  description: string;
  category: "POLICY" | "RESEARCH" | "INNOVATION" | "GUIDELINES" | "REPORTS" | "OTHER";
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  order: number;
  uploaderName: string;
};

const RESOURCES: ResourceSeed[] = [
  {
    title: "Draft National Tourism Policy (January 2025)",
    description: "Comprehensive framework for transforming Kenya's tourism sector, tracing policy from Sessional Paper No. 8 of 1969 to present. Outlines strategic direction for sustainable tourism, product diversification, and destination competitiveness.",
    category: "POLICY",
    fileName: "draft-national-tourism-policy-january-2025.pdf",
    mimeType: "application/pdf",
    sizeBytes: 4_820_000,
    order: 1,
    uploaderName: "Ministry of Tourism",
  },
  {
    title: "Draft National Tourism Policy (June 2025)",
    description: "Updated draft incorporating stakeholder feedback. Covers technology integration, remote work and digital nomadism, the sharing economy, and climate change. Proposes restructuring of tourism institutions.",
    category: "POLICY",
    fileName: "draft-national-tourism-policy-june-2025.pdf",
    mimeType: "application/pdf",
    sizeBytes: 5_140_000,
    order: 2,
    uploaderName: "Ministry of Tourism",
  },
  {
    title: "TRA Strategic Plan 2023–2027",
    description: "Tourism Regulatory Authority's five-year strategic plan covering regulation, quality assurance, and stakeholder engagement.",
    category: "POLICY",
    fileName: "tra-strategic-plan-2023-2027.pdf",
    mimeType: "application/pdf",
    sizeBytes: 3_260_000,
    order: 3,
    uploaderName: "Tourism Regulatory Authority",
  },
  {
    title: "State Department for Tourism Strategic Plan 2023–2027",
    description: "Strategic plan defining Key Result Areas for policy, product development, marketing, research, technology, financing, and climate change.",
    category: "POLICY",
    fileName: "sdt-strategic-plan-2023-2027.pdf",
    mimeType: "application/pdf",
    sizeBytes: 2_890_000,
    order: 4,
    uploaderName: "State Department for Tourism",
  },
  {
    title: "Inbound and Outbound Tourism Expenditure Survey Report 2025",
    description: "Joint KNBS survey estimating international visitor expenditure in Kenya and Kenyan residents travelling abroad. Reports average daily spend of KSh 19,306 per inbound tourist and KSh 12,501 per outbound.",
    category: "RESEARCH",
    fileName: "knbs-tourism-expenditure-survey-2025.pdf",
    mimeType: "application/pdf",
    sizeBytes: 6_780_000,
    order: 5,
    uploaderName: "Kenya National Bureau of Statistics",
  },
  {
    title: "Annual Tourism Sector Performance Report 2024",
    description: "Tourism Research Institute's seventh annual report. Kenya welcomed 2,394,376 international visitors in 2024 (+14.6%), with inbound earnings of KSh 452.20 billion.",
    category: "RESEARCH",
    fileName: "tri-tourism-sector-performance-report-2024.pdf",
    mimeType: "application/pdf",
    sizeBytes: 5_920_000,
    order: 6,
    uploaderName: "Tourism Research Institute",
  },
  {
    title: "Kenya Tourism Rebranding and Repositioning Task Force Recommendations",
    description: "Recommendations from the government task force on tourism rebranding, referenced in the AI-first strategy announced in 2026.",
    category: "RESEARCH",
    fileName: "tourism-rebranding-taskforce-recommendations.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1_840_000,
    order: 7,
    uploaderName: "Ministry of Tourism",
  },
  {
    title: "Kenya AI-First Tourism Strategy (2026)",
    description: "Partnership between the Ministry of Tourism and Google Kenya to establish Kenya as Africa's first AI-first tourism marketing destination. Includes Tourism Pulse Data Hub, AI trip planner, and precision marketing.",
    category: "INNOVATION",
    fileName: "kenya-ai-first-tourism-strategy-2026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 3_410_000,
    order: 8,
    uploaderName: "Ministry of Tourism",
  },
  {
    title: "National Tourism Strategy (Draft, June 2025)",
    description: "Draft covering brand architecture, niche product development, smart tourism, and targeted promotion. Proposes a Smart Tourism Portal and integrated tourism super app.",
    category: "INNOVATION",
    fileName: "draft-national-tourism-strategy-june-2025.pdf",
    mimeType: "application/pdf",
    sizeBytes: 7_150_000,
    order: 9,
    uploaderName: "Ministry of Tourism",
  },
  {
    title: "Guidelines for Tourism Enterprises on Safety and Hygiene Standards",
    description: "Operational guidelines for regulated tourism enterprises covering safety, hygiene, and quality standards.",
    category: "GUIDELINES",
    fileName: "tra-safety-hygiene-guidelines.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1_960_000,
    order: 10,
    uploaderName: "Tourism Regulatory Authority",
  },
  {
    title: "KATO Code of Conduct and Best Practices for Tour Operators",
    description: "Kenya Association of Tour Operators' code of conduct covering ethical wildlife viewing, safety protocols, community engagement, and environmental responsibility.",
    category: "GUIDELINES",
    fileName: "kato-code-of-conduct.pdf",
    mimeType: "application/pdf",
    sizeBytes: 980_000,
    order: 11,
    uploaderName: "Kenya Association of Tour Operators",
  },
  {
    title: "Kenya Tourism Satellite Account: Methodological Notes",
    description: "Technical documentation on the compilation of Kenya's TSA, outlining data sources and methodology for measuring tourism's contribution to GDP and employment.",
    category: "REPORTS",
    fileName: "kenya-tsa-methodological-notes.pdf",
    mimeType: "application/pdf",
    sizeBytes: 2_340_000,
    order: 12,
    uploaderName: "Kenya National Bureau of Statistics",
  },
  {
    title: "Tourism Fund Annual Report 2024",
    description: "Covers levy collection, disbursements to tourism institutions, and the revolving fund for hospitality training scholarships.",
    category: "REPORTS",
    fileName: "tourism-fund-annual-report-2024.pdf",
    mimeType: "application/pdf",
    sizeBytes: 3_670_000,
    order: 13,
    uploaderName: "Tourism Fund",
  },
  {
    title: "Tourism Act (Cap 381) — Consolidated Text",
    description: "Consolidated text of the Tourism Act (Cap 381), enacted in 2011. Establishes TRA, KTB, TRI, Tourism Fund, Kenya Utalii College, KICC, TFC, and the Tourism Tribunal.",
    category: "OTHER",
    fileName: "tourism-act-cap-381.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1_120_000,
    order: 14,
    uploaderName: "Republic of Kenya",
  },
];

function storageKeyFor(category: string, fileName: string): string {
  return `resources/${category.toLowerCase()}/${fileName}`;
}

export async function seedResources(ctx: SeedContext) {
  const adminId = ctx.users.admin?.id ?? null;
  let created = 0;
  let updated = 0;

  for (const r of RESOURCES) {
    const storageKey = storageKeyFor(r.category, r.fileName);

    const existing = await ctx.prisma.resource.findFirst({
      where: { title: r.title },
      select: { id: true },
    });

    const payload = {
      title: r.title,
      description: r.description,
      category: r.category,
      fileName: r.fileName,
      mimeType: r.mimeType,
      sizeBytes: r.sizeBytes,
      storageKey,
      published: true,
      order: r.order,
      uploadedById: adminId,
      uploaderName: r.uploaderName,
    };

    if (existing) {
      await ctx.prisma.resource.update({
        where: { id: existing.id },
        data: payload,
      });
      updated++;
    } else {
      await ctx.prisma.resource.create({ data: payload });
      created++;
    }
  }

  console.log(`✔ Resources: ${RESOURCES.length} (${created} created, ${updated} updated)`);
}