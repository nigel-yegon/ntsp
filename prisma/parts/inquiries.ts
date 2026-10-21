// prisma/parts/inquiries.ts
import type { SeedContext } from "./types";

type InquiryStatus = "NEW" | "IN_REVIEW" | "CONTACTED" | "CLOSED";
type InvestorType = "INDIVIDUAL" | "COMPANY" | "FUND" | "FAMILY_OFFICE" | "OTHER";
type Interest = "LODGE_RESORT" | "COASTAL" | "ECO_TOURISM" | "MICE" | "CULTURAL_HERITAGE" | "INFRASTRUCTURE" | "DOMESTIC_LEISURE" | "TECHNOLOGY" | "OTHER";
type Scale = "UNDER_10M" | "FROM_10M_50M" | "FROM_50M_100M" | "FROM_100M_500M" | "ABOVE_500M" | "PREFER_NOT_TO_SAY";

type InquirySeed = {
  referenceNo: string;
  status: InquiryStatus;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  investorType: InvestorType;
  interests: Interest[];
  scale: Scale | null;
  message: string;
  createdDaysAgo: number;
  reviewedDaysAgo: number | null;
  reviewNotes: string | null;
};

const INQUIRIES: InquirySeed[] = [
  {
    referenceNo: "INV/2026/0001",
    status: "NEW",
    fullName: "Jonathan Mwangi",
    email: "j.mwangi@serenainvest.example",
    phone: "+254 722 500 100",
    company: "Serena Capital Partners",
    country: "Kenya",
    investorType: "INDIVIDUAL",
    interests: ["LODGE_RESORT", "ECO_TOURISM"],
    scale: "FROM_10M_50M",
    message: "I am exploring a luxury tented-camp development near the Mara Triangle. I have identified a 40-acre parcel adjacent to a conservancy and would like to discuss the licensing pathway, incentives for conservation-linked lodges, and any PPP frameworks the authority supports.",
    createdDaysAgo: 2,
    reviewedDaysAgo: null,
    reviewNotes: null,
  },
  {
    referenceNo: "INV/2026/0002",
    status: "NEW",
    fullName: "Erik Lindqvist",
    email: "erik@nordicimpact.example",
    phone: "+46 70 555 0123",
    company: "Nordic Impact Capital",
    country: "Sweden",
    investorType: "FUND",
    interests: ["ECO_TOURISM", "TECHNOLOGY"],
    scale: "FROM_100M_500M",
    message: "Nordic Impact Capital manages a USD 350M fund focused on sustainable tourism and climate-resilient infrastructure in Sub-Saharan Africa. We would like to understand the pipeline of carbon-neutral resort projects and the digital-booking platforms that have received Tourism Fund support.",
    createdDaysAgo: 1,
    reviewedDaysAgo: null,
    reviewNotes: null,
  },
  {
    referenceNo: "INV/2026/0003",
    status: "IN_REVIEW",
    fullName: "Amina Yusuf",
    email: "a.yusuf@eastafricatrust.example",
    phone: "+254 711 200 300",
    company: "East Africa Conservation Trust",
    country: "Kenya",
    investorType: "FAMILY_OFFICE",
    interests: ["ECO_TOURISM", "CULTURAL_HERITAGE"],
    scale: "FROM_10M_50M",
    message: "Our foundation is exploring an eco-lodge and Maasai cultural-immersion project on community land adjacent to Amboseli. We want to structure this as a conservation-linked tourism venture that generates both returns and direct community benefit.",
    createdDaysAgo: 4,
    reviewedDaysAgo: 2,
    reviewNotes: "High conservation alignment. Referred to the Community Tourism team for a follow-up meeting.",
  },
  {
    referenceNo: "INV/2026/0004",
    status: "IN_REVIEW",
    fullName: "Peter Chen",
    email: "peter.chen@voyagerhotels.example",
    phone: "+65 9123 4567",
    company: "Voyager Hotels Group",
    country: "Singapore",
    investorType: "COMPANY",
    interests: ["DOMESTIC_LEISURE", "COASTAL"],
    scale: "FROM_10M_50M",
    message: "We operate mid-scale business and leisure hotels across Southeast Asia and are looking at 2–3 properties in Nairobi and Mombasa. We would appreciate a briefing on the domestic-tourism growth data, typical occupancy curves, and licensing timelines for a coastal SEZ hotel.",
    createdDaysAgo: 5,
    reviewedDaysAgo: 3,
    reviewNotes: "Requested occupancy benchmarks from KTB research team. Initial call scheduled.",
  },
  {
    referenceNo: "INV/2026/0005",
    status: "CONTACTED",
    fullName: "Fatima Al-Rashid",
    email: "f.alrashid@gulfheritage.example",
    phone: "+971 50 555 0100",
    company: "Gulf Heritage Holdings",
    country: "United Arab Emirates",
    investorType: "FAMILY_OFFICE",
    interests: ["LODGE_RESORT", "COASTAL", "CULTURAL_HERITAGE"],
    scale: "ABOVE_500M",
    message: "Our family office is evaluating 3–4 heritage-listed properties along the Lamu and Malindi coastlines. We are particularly interested in conservation-easement frameworks for historic Swahili architecture and would welcome introductions to the National Museums of Kenya.",
    createdDaysAgo: 8,
    reviewedDaysAgo: 5,
    reviewNotes: "High-value opportunity. Met with investor delegation in Nairobi. Introductions to NMK and the Lamu County government arranged.",
  },
  {
    referenceNo: "INV/2026/0006",
    status: "CONTACTED",
    fullName: "Marco Rossi",
    email: "marco.rossi@adriatico-hospitality.example",
    phone: "+39 340 555 7788",
    company: "Adriatico Hospitality",
    country: "Italy",
    investorType: "COMPANY",
    interests: ["COASTAL", "LODGE_RESORT"],
    scale: "FROM_100M_500M",
    message: "Adriatico Hospitality operates boutique coastal properties in Puglia and Sardinia. We are looking at the Kenyan coast — specifically Diani and Watamu — for our first Sub-Saharan African acquisition. Interested in beachfront land acquisition, foreign ownership rules, and heritage-restoration incentives.",
    createdDaysAgo: 10,
    reviewedDaysAgo: 3,
    reviewNotes: "Follow-up scheduled for next week. Sent the coastal tourism investment dossier and current SEZ incentive summary.",
  },
  {
    referenceNo: "INV/2026/0007",
    status: "CLOSED",
    fullName: "Ahmed Hassan",
    email: "ahmed.hassan@redseacapital.example",
    phone: "+20 100 555 0200",
    company: "Red Sea Capital",
    country: "Egypt",
    investorType: "FUND",
    interests: ["MICE", "INFRASTRUCTURE"],
    scale: "FROM_50M_100M",
    message: "We are scoping MICE infrastructure investment in East Africa and are considering a 3,000-seat conference facility in Nairobi. Interested in the current pipeline, tender process, and typical ROI.",
    createdDaysAgo: 20,
    reviewedDaysAgo: 15,
    reviewNotes: "Declined — the fund's focus on government-tendered convention centres does not match the PPP framework currently available. Referred to KICC for future tender engagement.",
  },
  {
    referenceNo: "INV/2026/0008",
    status: "CLOSED",
    fullName: "David Kimani",
    email: "d.kimani@nairobi-spa.example",
    phone: "+254 734 555 999",
    company: "Nairobi Wellness Ventures",
    country: "Kenya",
    investorType: "INDIVIDUAL",
    interests: ["LODGE_RESORT", "TECHNOLOGY"],
    scale: "UNDER_10M",
    message: "Exploring a wellness-focused eco-lodge in Laikipia. Would like to know about land tenure rules for conservancies and any grants available for sustainable tourism innovation.",
    createdDaysAgo: 25,
    reviewedDaysAgo: 20,
    reviewNotes: "Closed — capital raised through alternative sources. Investor declined to proceed. Follow-up potential in 2027.",
  },
];

export async function seedInquiries(ctx: SeedContext) {
  const adminId = ctx.users.admin?.id;
  if (!adminId) {
    console.warn("⚠ Skipping inquiries — no admin user");
    return;
  }

  const daysAgo = (n: number) => new Date(Date.now() - n * 864e5);
  let created = 0;
  let updated = 0;

  for (const s of INQUIRIES) {
    const reviewedAt = s.reviewedDaysAgo !== null ? daysAgo(s.reviewedDaysAgo) : null;
    const createdAt = daysAgo(s.createdDaysAgo);

    const existing = await ctx.prisma.investorInquiry.findUnique({
      where: { referenceNo: s.referenceNo },
      select: { id: true },
    });

    const payload = {
      status: s.status,
      fullName: s.fullName,
      email: s.email,
      phone: s.phone,
      company: s.company,
      country: s.country,
      investorType: s.investorType,
      interests: s.interests as any,
      scale: s.scale,
      message: s.message,
      reviewedById: reviewedAt ? adminId : null,
      reviewedAt,
      reviewNotes: s.reviewNotes,
    };

    if (existing) {
      await ctx.prisma.investorInquiry.update({ where: { id: existing.id }, data: payload });
      updated++;
    } else {
      await ctx.prisma.investorInquiry.create({
        data: { referenceNo: s.referenceNo, ...payload, createdAt },
      });
      created++;
    }
  }

  console.log(`✔ Inquiries: ${INQUIRIES.length} (${created} created, ${updated} updated, reviewer = admin)`);
}