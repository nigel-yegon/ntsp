// prisma/parts/incidents.ts
import type { SeedContext } from "./types";

type IncidentStatus = "OPEN" | "UNDER_REVIEW" | "ESCALATED" | "RESOLVED" | "CLOSED";
type IncidentCategory = "WILDLIFE" | "SAFETY" | "OPERATOR" | "FACILITY" | "GUIDES" | "OTHER";

type IncidentSeed = {
  referenceNo: string;
  status: IncidentStatus;
  category: IncidentCategory;
  title: string;
  description: string;
  location: string | null;
  reporterName: string | null;
  reporterEmail: string | null;
  reporterPhone: string | null;
  occurredDaysAgo: number | null;
  reportedDaysAgo: number;
  reviewedDaysAgo: number | null;
  reviewNotes: string | null;
  escalatedTo: string | null;
  escalatedDaysAgo: number | null;
  attachments: { fileName: string; mimeType: string; sizeBytes: number }[];
};

const INCIDENTS: IncidentSeed[] = [
  {
    referenceNo: "INC/2026/0001",
    status: "OPEN",
    category: "WILDLIFE",
    title: "Injured elephant calf near Talek River",
    description: "A juvenile elephant with an apparent snare wound on its front left leg was observed near the Talek River crossing. The herd appeared protective but the calf was visibly struggling. Please dispatch a KWS veterinary team with urgent priority.",
    location: "Talek River, Maasai Mara",
    reporterName: "Daniel Kiprop",
    reporterEmail: "d.kiprop@example.com",
    reporterPhone: "+254 722 111 222",
    occurredDaysAgo: 1,
    reportedDaysAgo: 1,
    reviewedDaysAgo: null,
    reviewNotes: null,
    escalatedTo: null,
    escalatedDaysAgo: null,
    attachments: [{ fileName: "injured-calf-01.jpg", mimeType: "image/jpeg", sizeBytes: 1_842_113 }],
  },
  {
    referenceNo: "INC/2026/0002",
    status: "OPEN",
    category: "SAFETY",
    title: "Missing lifejackets on dhow cruise",
    description: "The dhow operating from Diani Beach near the Kongo River mouth had no visible lifejackets for passengers during a sunset cruise. At least 12 tourists on board. Operator could not produce a safety certificate.",
    location: "Kongo River mouth, Diani",
    reporterName: null,
    reporterEmail: null,
    reporterPhone: null,
    occurredDaysAgo: 2,
    reportedDaysAgo: 2,
    reviewedDaysAgo: null,
    reviewNotes: null,
    escalatedTo: null,
    escalatedDaysAgo: null,
    attachments: [],
  },
  {
    referenceNo: "INC/2026/0003",
    status: "OPEN",
    category: "OPERATOR",
    title: "Operator driving off-road in Nairobi National Park",
    description: "Safari vehicle registration KDD 442A was observed driving off designated tracks near the Athi Basin to approach a lion pride.",
    location: "Nairobi National Park, Athi Basin",
    reporterName: "Mercy Wambui",
    reporterEmail: "mercy.w@example.com",
    reporterPhone: "+254 733 444 555",
    occurredDaysAgo: 3,
    reportedDaysAgo: 3,
    reviewedDaysAgo: null,
    reviewNotes: null,
    escalatedTo: null,
    escalatedDaysAgo: null,
    attachments: [{ fileName: "vehicle-plate.jpg", mimeType: "image/jpeg", sizeBytes: 982_114 }],
  },
  {
    referenceNo: "INC/2026/0004",
    status: "OPEN",
    category: "GUIDES",
    title: "Unlicensed guide at Hell's Gate",
    description: "A guide offering cycling tours could not produce a valid KPSGA guiding licence.",
    location: "Hell's Gate National Park",
    reporterName: "Peter Njenga",
    reporterEmail: "pnjenga@example.com",
    reporterPhone: null,
    occurredDaysAgo: 4,
    reportedDaysAgo: 3,
    reviewedDaysAgo: null,
    reviewNotes: null,
    escalatedTo: null,
    escalatedDaysAgo: null,
    attachments: [],
  },
  {
    referenceNo: "INC/2026/0005",
    status: "UNDER_REVIEW",
    category: "FACILITY",
    title: "Unsafe staircase at Lake Nakuru lodge",
    description: "The wooden staircase leading to the dining terrace has two missing planks and a loose handrail.",
    location: "Lake Nakuru NP",
    reporterName: "Grace Otieno",
    reporterEmail: "grace.otieno@example.com",
    reporterPhone: "+254 711 888 999",
    occurredDaysAgo: 6,
    reportedDaysAgo: 5,
    reviewedDaysAgo: 3,
    reviewNotes: "Confirmed lodge's public liability documents are current. Reached out for a fix timeline.",
    escalatedTo: null,
    escalatedDaysAgo: null,
    attachments: [{ fileName: "staircase.jpg", mimeType: "image/jpeg", sizeBytes: 1_344_221 }],
  },
  {
    referenceNo: "INC/2026/0006",
    status: "UNDER_REVIEW",
    category: "WILDLIFE",
    title: "Turtle nest disturbance at Watamu",
    description: "Local tour operators are repeatedly walking over a marked turtle nest, likely disturbing hatchlings. Nest markers were found flattened twice this week.",
    location: "Watamu Marine NP",
    reporterName: null,
    reporterEmail: "turtle-watch@example.org",
    reporterPhone: null,
    occurredDaysAgo: 8,
    reportedDaysAgo: 7,
    reviewedDaysAgo: 4,
    reviewNotes: "Assigned to coast region for site visit. Requested nesting location map from Watamu Turtle Watch.",
    escalatedTo: null,
    escalatedDaysAgo: null,
    attachments: [{ fileName: "flattened-nest.jpg", mimeType: "image/jpeg", sizeBytes: 2_010_441 }],
  },
  {
    referenceNo: "INC/2026/0007",
    status: "ESCALATED",
    category: "SAFETY",
    title: "Suspected wildlife poisoning",
    description: "Three dead vultures and one dead jackal were found around a waterhole. Suspected carbamate poisoning.",
    location: "Amboseli ecosystem",
    reporterName: "Big Life Foundation field officer",
    reporterEmail: "field@example.org",
    reporterPhone: "+254 720 100 200",
    occurredDaysAgo: 12,
    reportedDaysAgo: 11,
    reviewedDaysAgo: 10,
    reviewNotes: "Site sealed by conservancy. Carcass samples collected. Escalating to KWS forensics.",
    escalatedTo: "Kenya Wildlife Service",
    escalatedDaysAgo: 9,
    attachments: [{ fileName: "vultures.jpg", mimeType: "image/jpeg", sizeBytes: 3_104_998 }],
  },
  {
    referenceNo: "INC/2026/0008",
    status: "RESOLVED",
    category: "OPERATOR",
    title: "Abandoned safari vehicle blocking park road",
    description: "Vehicle KBN 771Y abandoned near the Mara Serena junction, blocking one lane.",
    location: "Maasai Mara",
    reporterName: "John Kamau",
    reporterEmail: null,
    reporterPhone: "+254 714 555 444",
    occurredDaysAgo: 18,
    reportedDaysAgo: 18,
    reviewedDaysAgo: 17,
    reviewNotes: "Operator contacted. Vehicle recovered. Written warning issued.",
    escalatedTo: null,
    escalatedDaysAgo: null,
    attachments: [{ fileName: "blocked-road.jpg", mimeType: "image/jpeg", sizeBytes: 1_540_221 }],
  },
  {
    referenceNo: "INC/2026/0009",
    status: "RESOLVED",
    category: "FACILITY",
    title: "Broken viewing platform at Nyahururu Falls",
    description: "A section of the lower viewing platform had rotted through. Site has since been fenced off.",
    location: "Nyahururu Falls",
    reporterName: "Sarah Mwangi",
    reporterEmail: "s.mwangi@example.com",
    reporterPhone: null,
    occurredDaysAgo: 24,
    reportedDaysAgo: 22,
    reviewedDaysAgo: 20,
    reviewNotes: "Fenced off by county works. No injuries reported.",
    escalatedTo: null,
    escalatedDaysAgo: null,
    attachments: [],
  },
  {
    referenceNo: "INC/2026/0010",
    status: "CLOSED",
    category: "OTHER",
    title: "Duplicate report — broken platform at Nyahururu Falls",
    description: "Duplicate of INC/2026/0009. Submitter was unaware the issue had already been reported.",
    location: "Nyahururu Falls",
    reporterName: null,
    reporterEmail: null,
    reporterPhone: null,
    occurredDaysAgo: null,
    reportedDaysAgo: 20,
    reviewedDaysAgo: 19,
    reviewNotes: "Duplicate of INC/2026/0009. Closed.",
    escalatedTo: null,
    escalatedDaysAgo: null,
    attachments: [],
  },
];

export async function seedIncidents(ctx: SeedContext) {
  const adminId = ctx.users.admin?.id;
  if (!adminId) {
    console.warn("⚠ Skipping incidents — no admin user");
    return;
  }

  const daysAgo = (n: number) => new Date(Date.now() - n * 864e5);
  let created = 0;
  let updated = 0;

  for (const s of INCIDENTS) {
    const reportedAt = daysAgo(s.reportedDaysAgo);
    const occurredAt = s.occurredDaysAgo !== null ? daysAgo(s.occurredDaysAgo) : null;
    const reviewedAt = s.reviewedDaysAgo !== null ? daysAgo(s.reviewedDaysAgo) : null;
    const escalatedAt = s.escalatedDaysAgo !== null ? daysAgo(s.escalatedDaysAgo) : null;

    const existing = await ctx.prisma.incident.findUnique({
      where: { referenceNo: s.referenceNo },
      select: { id: true },
    });

    const payload = {
      status: s.status,
      category: s.category,
      title: s.title,
      description: s.description,
      location: s.location,
      reporterName: s.reporterName,
      reporterEmail: s.reporterEmail,
      reporterPhone: s.reporterPhone,
      occurredAt,
      reportedAt,
      reviewedById: reviewedAt ? adminId : null,
      reviewedAt,
      reviewNotes: s.reviewNotes,
      escalatedTo: s.escalatedTo,
      escalatedAt,
      escalatedById: escalatedAt ? adminId : null,
    };

    if (existing) {
      await ctx.prisma.incident.update({ where: { id: existing.id }, data: payload });
      updated++;
    } else {
      await ctx.prisma.incident.create({
        data: {
          referenceNo: s.referenceNo,
          ...payload,
          attachments: {
            create: s.attachments.map((a) => ({
              fileName: a.fileName,
              mimeType: a.mimeType,
              sizeBytes: a.sizeBytes,
              storageKey: `seed/incidents/${s.referenceNo}/${a.fileName}`,
            })),
          },
        },
      });
      created++;
    }
  }

  console.log(`✔ Incidents: ${INCIDENTS.length} (${created} created, ${updated} updated, reviewer = admin)`);
}