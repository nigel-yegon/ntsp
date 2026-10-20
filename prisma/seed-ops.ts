// prisma/seed-ops.ts
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/* ─────────────────────────────────────────────────────────────────
   BUSINESS & OPERATOR SEEDS (11 total)

   Role mapping:
   - BUSINESS  → pure hotelier (accommodations only)
   - BUSINESS  → mixed (accommodations + packages, e.g. lodges that sell safari itineraries)
   - OPERATOR  → tour operator (packages only)
   ───────────────────────────────────────────────────────────────── */

const BUSINESS_SEEDS = [
  // ── Pure accommodation businesses (4) ──
  {
    email: "diani@business.local",
    name: "Diani Resorts Manager",
    businessName: "Diani Beach Resorts",
    contactEmail: "reservations@diani-resorts.example",
    contactPhone: "+254 700 200 200",
    description:
      "A collection of beachfront resorts and villas on Kenya's award-winning Diani Beach, with snorkeling and dhow cruise add-ons.",
    verificationStatus: "APPROVED" as const,
    businessType: "ACCOMMODATION",
    traLicenseNumber: "TRA1/47/C02/2055",
    katoMember: false,
    role: "BUSINESS" as const,
    accommodationSlugs: [
      "diani-sea-resort",
      "almanara-villas",
      "sands-nomad",
    ],
    packageSlugs: [],
  },
  {
    email: "mara@business.local",
    name: "Mara Serena Manager",
    businessName: "Mara Serena Safari Lodges",
    contactEmail: "bookings@mara-serena.example",
    contactPhone: "+254 700 100 100",
    description:
      "Safari lodges and camps in the Maasai Mara, also running in-house game drive packages.",
    verificationStatus: "APPROVED" as const,
    businessType: "ACCOMMODATION",
    traLicenseNumber: "TRA1/47/C02/1024",
    katoMember: true,
    role: "BUSINESS" as const,
    accommodationSlugs: ["mara-serena", "mara-sopa", "governors-camp"],
    // Mixed business: also owns a few packages
    packageSlugs: [
      "maasai-mara-classic-safari",
      "maasai-mara-lake-naivasha-safari",
    ],
  },
  {
    email: "amboseli-lodge@business.local",
    name: "Amboseli Serena Manager",
    businessName: "Amboseli Serena Safari Lodge",
    contactEmail: "stay@amboseli-serena.example",
    contactPhone: "+254 700 400 400",
    description:
      "Lodge nestled in a grove of acacia trees with uninterrupted views of Mount Kilimanjaro.",
    verificationStatus: "APPROVED" as const,
    businessType: "ACCOMMODATION",
    traLicenseNumber: "TRA1/47/C02/3072",
    katoMember: false,
    role: "BUSINESS" as const,
    accommodationSlugs: ["amboseli-serena"],
    packageSlugs: [],
  },
  {
    email: "lamu@business.local",
    name: "Lamu Resorts Manager",
    businessName: "Lamu Island Resorts",
    contactEmail: "bookings@lamu-resorts.example",
    contactPhone: "+254 700 600 600",
    description:
      "Boutique hotels and villas in the Lamu archipelago, offering dhow trips and cultural tours.",
    verificationStatus: "PENDING" as const,
    businessType: "ACCOMMODATION",
    traLicenseNumber: "TRA1/47/C02/4410",
    katoMember: false,
    role: "BUSINESS" as const,
    accommodationSlugs: ["majlis-lamu", "peponi-hotel"],
    packageSlugs: [],
  },

  // ── Tour operators (6) ──
  {
    email: "savannah@business.local",
    name: "Savannah Tours Operator",
    businessName: "Savannah Tours Ltd",
    contactEmail: "info@savannah-tours.example",
    contactPhone: "+254 700 300 300",
    description:
      "A safari tour operator running scheduled and custom itineraries across Kenya's national parks and reserves.",
    verificationStatus: "APPROVED" as const,
    businessType: "TOUR_OPERATOR",
    traLicenseNumber: "TRA1/47/C01/2057",
    katoMember: true,
    role: "OPERATOR" as const,
    accommodationSlugs: [],
    packageSlugs: [
      "kenya-explorer-safari",
      "samburu-wildlife-safari",
      "tsavo-east-tsavo-west-safari",
      "maasai-mara-classic-safari", // shared? no — leave to Mara
    ],
  },
  {
    email: "wildtrail@business.local",
    name: "Wild Trail Safaris",
    businessName: "Wild Trail Safaris",
    contactEmail: "hello@wildtrail.example",
    contactPhone: "+254 700 500 500",
    description:
      "Small-group and private safari operators focused on walking safaris and conservation-led trips.",
    verificationStatus: "APPROVED" as const,
    businessType: "TOUR_OPERATOR",
    traLicenseNumber: "TRA1/47/C01/4471",
    katoMember: true,
    role: "OPERATOR" as const,
    accommodationSlugs: [],
    packageSlugs: [
      "diani-beach-getaway",
      "naivasha-day-escape",
      "ol-pejeta-conservancy-day-safari",
    ],
  },
  {
    email: "summit@business.local",
    name: "Summit Trekking Co.",
    businessName: "Summit Trekking Co.",
    contactEmail: "climb@summit-trekking.example",
    contactPhone: "+254 700 700 700",
    description:
      "Specialists in Mount Kenya and Mount Kilimanjaro treks, with licensed mountain guides and full gear rental.",
    verificationStatus: "APPROVED" as const,
    businessType: "TOUR_OPERATOR",
    traLicenseNumber: "TRA1/47/C01/5918",
    katoMember: true,
    role: "OPERATOR" as const,
    accommodationSlugs: [],
    packageSlugs: ["mount-kenya-adventure", "kenya-explorer-safari"],
  },
  {
    email: "coastal@business.local",
    name: "Coastal Day Trips",
    businessName: "Coastal Day Trips Ltd",
    contactEmail: "trips@coastal-daytrips.example",
    contactPhone: "+254 700 800 800",
    description:
      "Day tours from Mombasa and Diani, including marine park snorkeling, Gedi ruins, and dhow cruises.",
    verificationStatus: "APPROVED" as const,
    businessType: "TOUR_OPERATOR",
    traLicenseNumber: "TRA1/47/C01/6320",
    katoMember: false,
    role: "OPERATOR" as const,
    accommodationSlugs: [],
    packageSlugs: ["diani-beach-getaway", "naivasha-day-escape"],
  },
  {
    email: "citysafari@business.local",
    name: "Nairobi City Safaris",
    businessName: "Nairobi City Safaris",
    contactEmail: "info@nairobi-city-safaris.example",
    contactPhone: "+254 700 900 900",
    description:
      "Half-day and full-day Nairobi experiences, from Nairobi National Park to the Giraffe Centre.",
    verificationStatus: "PENDING" as const,
    businessType: "TOUR_OPERATOR",
    traLicenseNumber: "TRA1/47/C01/7104",
    katoMember: false,
    role: "OPERATOR" as const,
    accommodationSlugs: [],
    packageSlugs: [
      "nairobi-city-wildlife-tour",
      "nairobi-national-park-day-safari",
      "giraffe-centre-nairobi-nature-escape",
    ],
  },
  {
    email: "pendingop@business.local",
    name: "TRA Verification Pending",
    businessName: "TRA Verification Pending Ltd",
    contactEmail: "ops@pending-op.example",
    contactPhone: "+254 700 000 001",
    description:
      "Newly registered tour operator awaiting TRA license verification.",
    verificationStatus: "PENDING" as const,
    businessType: "TOUR_OPERATOR",
    traLicenseNumber: "TRA1/47/C01/0001",
    katoMember: false,
    role: "OPERATOR" as const,
    accommodationSlugs: [],
    packageSlugs: [],
  },
  {
    email: "rejectedop@business.local",
    name: "Rejected Operator",
    businessName: "Rejected Safari Co.",
    contactEmail: "info@rejected-safari.example",
    contactPhone: "+254 700 000 002",
    description:
      "A tour operator whose TRA license could not be verified — kept in the database for audit purposes.",
    verificationStatus: "REJECTED" as const,
    businessType: "TOUR_OPERATOR",
    traLicenseNumber: "TRA1/47/C01/9999",
    katoMember: false,
    role: "OPERATOR" as const,
    accommodationSlugs: [],
    packageSlugs: [],
  },
];

/* ─────────────────────────────────────────────────────────────────
   INCIDENTS (12 across all statuses and categories)
   ───────────────────────────────────────────────────────────────── */

const INCIDENT_SEEDS = [
  {
    referenceNo: "INC/2026/1001",
    status: "OPEN" as const,
    category: "WILDLIFE" as const,
    title: "Injured elephant calf near Talek River",
    description:
      "A juvenile elephant with an apparent snare wound on its front left leg was observed near the Talek River crossing. The herd appeared to be protecting it but it was visibly struggling. Please dispatch a KWS veterinary team with urgent priority.",
    location: "Talek River, Maasai Mara",
    reporterName: "Daniel Kiprop",
    reporterEmail: "d.kiprop@example.com",
    reporterPhone: "+254 722 111 222",
    occurredDaysAgo: 1,
    reportedDaysAgo: 1,
  },
  {
    referenceNo: "INC/2026/1002",
    status: "OPEN" as const,
    category: "SAFETY" as const,
    title: "Missing lifejackets on dhow cruise",
    description:
      "The dhow that operates from Diani Beach near the Kongo River mouth had no visible lifejackets for passengers during a sunset cruise. At least 12 tourists on board, none wearing or shown a lifejacket. Operator could not produce a safety certificate.",
    location: "Kongo River mouth, Diani Beach",
    reporterName: null,
    reporterEmail: null,
    reporterPhone: null,
    occurredDaysAgo: 2,
    reportedDaysAgo: 2,
  },
  {
    referenceNo: "INC/2026/1003",
    status: "OPEN" as const,
    category: "OPERATOR" as const,
    title: "Operator driving off-road in Nairobi National Park",
    description:
      "Safari vehicle registration KDD 442A was observed driving off designated tracks near the Athi Basin to approach a lion pride. Guide refused to return to the track when asked by other visitors.",
    location: "Nairobi National Park, Athi Basin",
    reporterName: "Mercy Wambui",
    reporterEmail: "mercy.w@example.com",
    reporterPhone: "+254 733 444 555",
    occurredDaysAgo: 3,
    reportedDaysAgo: 3,
  },
  {
    referenceNo: "INC/2026/1004",
    status: "OPEN" as const,
    category: "GUIDES" as const,
    title: "Unlicensed guide at Hell's Gate",
    description:
      "A guide offering cycling tours from the main gate could not produce a valid KPSGA guiding licence. Was soliciting tourists at the entrance and quoting below standard rates.",
    location: "Hell's Gate National Park",
    reporterName: "Peter Njenga",
    reporterEmail: "pnjenga@example.com",
    reporterPhone: null,
    occurredDaysAgo: 4,
    reportedDaysAgo: 3,
  },
  {
    referenceNo: "INC/2026/1005",
    status: "UNDER_REVIEW" as const,
    category: "FACILITY" as const,
    title: "Unsafe staircase at Lake Nakuru lodge",
    description:
      "The wooden staircase leading to the dining terrace at a lodge inside Lake Nakuru NP has two missing planks and a loose handrail. A guest tripped and bruised a knee.",
    location: "Lake Nakuru National Park",
    reporterName: "Grace Otieno",
    reporterEmail: "grace.otieno@example.com",
    reporterPhone: "+254 711 888 999",
    occurredDaysAgo: 6,
    reportedDaysAgo: 5,
    reviewNotes:
      "Confirmed lodge's public liability documents are current. Reached out to lodge management for a fix timeline. Requested KWS facility inspection report.",
  },
  {
    referenceNo: "INC/2026/1006",
    status: "UNDER_REVIEW" as const,
    category: "WILDLIFE" as const,
    title: "Repeated turtle nest disturbance at Watamu",
    description:
      "Local tour operators are repeatedly walking over a marked turtle nest near the Marine Park at night, likely disturbing hatchlings. Nest markers were found flattened on two separate occasions this week.",
    location: "Watamu Marine National Park",
    reporterName: null,
    reporterEmail: "turtle-watch@example.org",
    reporterPhone: null,
    occurredDaysAgo: 8,
    reportedDaysAgo: 7,
    reviewNotes:
      "Assigned to coast region for site visit. Requested nesting location map from Watamu Turtle Watch. Considering escalation to KWS coastal enforcement.",
  },
  {
    referenceNo: "INC/2026/1007",
    status: "ESCALATED" as const,
    category: "SAFETY" as const,
    title: "Suspected poisoning of wildlife at a waterhole",
    description:
      "Three dead vultures and one dead jackal were found around a waterhole in the Amboseli ecosystem. No visible wounds; suspected carbamate poisoning. Local conservancy has cordoned the waterhole.",
    location: "Amboseli ecosystem",
    reporterName: "Big Life Foundation field officer",
    reporterEmail: "field@example.org",
    reporterPhone: "+254 720 100 200",
    occurredDaysAgo: 12,
    reportedDaysAgo: 11,
    reviewNotes:
      "Site sealed by conservancy. Carcass samples collected. Escalating to KWS wildlife forensics and the national wildlife poisoning response taskforce.",
    escalatedTo: "Kenya Wildlife Service",
    escalatedDaysAgo: 9,
  },
  {
    referenceNo: "INC/2026/1008",
    status: "ESCALATED" as const,
    category: "OPERATOR" as const,
    title: "Unlicenced tour operator at Maasai Mara gate",
    description:
      "A tour operator without a visible TRA license was offering game drive packages at the Sekenani gate, soliciting tourists directly and undercutting licensed operators by 40 percent.",
    location: "Sekenani Gate, Maasai Mara",
    reporterName: "Mara Conservation Rangers",
    reporterEmail: "rangers@mara-conservation.example",
    reporterPhone: "+254 720 555 100",
    occurredDaysAgo: 10,
    reportedDaysAgo: 9,
    reviewNotes:
      "Referral to TRA and KATO for enforcement. Escalated to KWS tourism compliance unit for joint inspection.",
    escalatedTo: "Tourism Regulatory Authority",
    escalatedDaysAgo: 7,
  },
  {
    referenceNo: "INC/2026/1009",
    status: "RESOLVED" as const,
    category: "OPERATOR" as const,
    title: "Abandoned safari vehicle blocking park road",
    description:
      "A safari vehicle (KBN 771Y) was abandoned near the Mara Serena junction after an apparent breakdown, blocking one lane for several hours. Park rangers were contacted and a recovery arranged.",
    location: "Maasai Mara, Mara Serena junction",
    reporterName: "John Kamau",
    reporterEmail: null,
    reporterPhone: "+254 714 555 444",
    occurredDaysAgo: 18,
    reportedDaysAgo: 18,
    reviewNotes:
      "Operator contacted. Vehicle recovered. Operator issued a written warning and confirmed road-safety protocol refresh for its guides.",
  },
  {
    referenceNo: "INC/2026/1010",
    status: "RESOLVED" as const,
    category: "FACILITY" as const,
    title: "Broken viewing platform at Nyahururu Falls",
    description:
      "A section of the lower viewing platform at Thomson's Falls had rotted through, creating a fall hazard. County works department was notified via the tourism office. Site has since been fenced off pending repair.",
    location: "Nyahururu Falls, Laikipia",
    reporterName: "Sarah Mwangi",
    reporterEmail: "s.mwangi@example.com",
    reporterPhone: null,
    occurredDaysAgo: 24,
    reportedDaysAgo: 22,
    reviewNotes:
      "Platform closed and fenced by county works. Repair timeline confirmed for next quarter. No injuries reported.",
  },
  {
    referenceNo: "INC/2026/1011",
    status: "CLOSED" as const,
    category: "OTHER" as const,
    title: "Duplicate report — broken platform at Nyahururu Falls",
    description:
      "Duplicate of an earlier report about the same damaged viewing platform at Thomson's Falls. Submitter was unaware the issue had already been reported.",
    location: "Nyahururu Falls, Laikipia",
    reporterName: null,
    reporterEmail: null,
    reporterPhone: null,
    occurredDaysAgo: null,
    reportedDaysAgo: 20,
    reviewNotes:
      "Duplicate of INC/2026/1010. Closed. Reporter notified via the reference-number page that the issue is already being addressed.",
  },
  {
    referenceNo: "INC/2026/1012",
    status: "OPEN" as const,
    category: "WILDLIFE" as const,
    title: "Lion pride disturbance by self-drive visitors",
    description:
      "Self-drive visitors in a private vehicle were observed playing loud music and approaching a lion pride near the Mara River. The lions appeared agitated. Visitors left before rangers arrived.",
    location: "Mara River, Maasai Mara",
    reporterName: "Big Cat Monitoring Group",
    reporterEmail: "bigcats@example.org",
    reporterPhone: null,
    occurredDaysAgo: 1,
    reportedDaysAgo: 1,
  },
];

/* ─────────────────────────────────────────────────────────────────
   INVESTOR INQUIRIES (10 across all statuses)
   ───────────────────────────────────────────────────────────────── */

const INQUIRY_SEEDS = [
  {
    referenceNo: "INV/2026/2001",
    status: "NEW" as const,
    fullName: "Jonathan Mwangi",
    email: "j.mwangi@serenainvest.example",
    phone: "+254 722 500 100",
    company: "Serena Capital Partners",
    country: "Kenya",
    investorType: "INDIVIDUAL" as const,
    interests: ["LODGE_RESORT", "ECO_TOURISM"] as const,
    scale: "FROM_10M_50M" as const,
    message:
      "I am exploring a luxury tented-camp development near the Mara Triangle. I have identified a 40-acre parcel adjacent to a conservancy and would like to discuss the licensing pathway, incentives available for conservation-linked lodges, and any PPP frameworks the authority supports.",
    createdDaysAgo: 2,
  },
  {
    referenceNo: "INV/2026/2002",
    status: "NEW" as const,
    fullName: "Erik Lindqvist",
    email: "erik@nordicimpact.example",
    phone: "+46 70 555 0123",
    company: "Nordic Impact Capital",
    country: "Sweden",
    investorType: "FUND" as const,
    interests: ["ECO_TOURISM", "TECHNOLOGY"] as const,
    scale: "FROM_100M_500M" as const,
    message:
      "Nordic Impact Capital manages a USD 350M fund focused on sustainable tourism and climate-resilient infrastructure in Sub-Saharan Africa. We would like to understand the pipeline of carbon-neutral resort projects and the digital-booking platforms that have received Tourism Fund support.",
    createdDaysAgo: 1,
  },
  {
    referenceNo: "INV/2026/2003",
    status: "NEW" as const,
    fullName: "Amina Yusuf",
    email: "a.yusuf@eastafricatrust.example",
    phone: "+254 711 200 300",
    company: "East Africa Conservation Trust",
    country: "Kenya",
    investorType: "FAMILY_OFFICE" as const,
    interests: ["ECO_TOURISM", "CULTURAL_HERITAGE"] as const,
    scale: "FROM_10M_50M" as const,
    message:
      "Our foundation is exploring an eco-lodge and Maasai cultural-immersion project on community land adjacent to Amboseli. We want to structure this as a conservation-linked tourism venture that generates both returns and direct community benefit.",
    createdDaysAgo: 4,
  },
  {
    referenceNo: "INV/2026/2004",
    status: "IN_REVIEW" as const,
    fullName: "Sarah Otieno",
    email: "s.otieno@lakevictoriaagri.example",
    phone: "+254 733 800 400",
    company: "Lake Victoria Agri-Tourism Ltd",
    country: "Kenya",
    investorType: "COMPANY" as const,
    interests: ["DOMESTIC_LEISURE", "CULTURAL_HERITAGE"] as const,
    scale: "UNDER_10M" as const,
    message:
      "We run an agricultural operation near Kisumu and are interested in developing a farm-stay and cultural-experience product targeting the domestic market. The audience is Nairobi and Kisumu families seeking affordable weekend getaways.",
    createdDaysAgo: 5,
    reviewedDaysAgo: 3,
    reviewNotes:
      "Domestic-leisure opportunity in the western circuit. Referred to the domestic tourism team at KTB.",
  },
  {
    referenceNo: "INV/2026/2005",
    status: "IN_REVIEW" as const,
    fullName: "Peter Chen",
    email: "peter.chen@voyagerhotels.example",
    phone: "+65 9123 4567",
    company: "Voyager Hotels Group",
    country: "Singapore",
    investorType: "COMPANY" as const,
    interests: ["DOMESTIC_LEISURE", "COASTAL"] as const,
    scale: "FROM_10M_50M" as const,
    message:
      "We operate mid-scale business and leisure hotels across Southeast Asia and are looking at 2-3 properties in Nairobi and Mombasa. We would appreciate a briefing on the domestic-tourism growth data, the typical occupancy curve for new hotels, and the licensing timelines for a hotel in a coastal Special Economic Zone.",
    createdDaysAgo: 6,
    reviewedDaysAgo: 2,
    reviewNotes:
      "Requested occupancy benchmarks from KTB research team. Initial call scheduled.",
  },
  {
    referenceNo: "INV/2026/2006",
    status: "CONTACTED" as const,
    fullName: "Fatima Al-Rashid",
    email: "f.alrashid@gulfheritage.example",
    phone: "+971 50 555 0100",
    company: "Gulf Heritage Holdings",
    country: "United Arab Emirates",
    investorType: "FAMILY_OFFICE" as const,
    interests: ["LODGE_RESORT", "COASTAL", "CULTURAL_HERITAGE"] as const,
    scale: "ABOVE_500M" as const,
    message:
      "Our family office is evaluating a portfolio of 3 to 4 heritage-listed properties along the Lamu and Malindi coastlines. We are particularly interested in the conservation-easement frameworks available for historic Swahili architecture and would welcome introductions to the National Museums of Kenya.",
    createdDaysAgo: 8,
    reviewedDaysAgo: 5,
    reviewNotes:
      "High-value opportunity. Met with investor delegation in Nairobi. Introductions to NMK and the Lamu County government arranged.",
  },
  {
    referenceNo: "INV/2026/2007",
    status: "CONTACTED" as const,
    fullName: "Marco Rossi",
    email: "marco.rossi@adriatico-hospitality.example",
    phone: "+39 340 555 7788",
    company: "Adriatico Hospitality",
    country: "Italy",
    investorType: "COMPANY" as const,
    interests: ["COASTAL", "LODGE_RESORT"] as const,
    scale: "FROM_100M_500M" as const,
    message:
      "Adriatico Hospitality operates boutique coastal properties in Puglia and Sardinia. We are looking at the Kenyan coast — specifically Diani and Watamu — for our first Sub-Saharan African acquisition. Interested in discussing beachfront land acquisition, foreign ownership rules, and heritage-restoration incentives.",
    createdDaysAgo: 10,
    reviewedDaysAgo: 3,
    reviewNotes:
      "Follow-up scheduled for next week. Sent the coastal tourism investment dossier and the current incentive summary for SEZs.",
  },
  {
    referenceNo: "INV/2026/2008",
    status: "CONTACTED" as const,
    fullName: "Patricia Osei",
    email: "p.osei@accra-hospitality.example",
    phone: "+233 24 555 7890",
    company: "Accra Hospitality Group",
    country: "Ghana",
    investorType: "COMPANY" as const,
    interests: ["MICE", "DOMESTIC_LEISURE"] as const,
    scale: "FROM_50M_100M" as const,
    message:
      "We are considering a 300-room conference hotel in Nairobi. Would like to discuss the MICE market size, government support for conference facilities, and typical construction timelines.",
    createdDaysAgo: 12,
    reviewedDaysAgo: 7,
    reviewNotes:
      "Site visit arranged for Nairobi. Met with KICC leadership.",
  },
  {
    referenceNo: "INV/2026/2009",
    status: "CLOSED" as const,
    fullName: "Ahmed Hassan",
    email: "ahmed.hassan@redseacapital.example",
    phone: "+20 100 555 0200",
    company: "Red Sea Capital",
    country: "Egypt",
    investorType: "FUND" as const,
    interests: ["MICE", "INFRASTRUCTURE"] as const,
    scale: "FROM_50M_100M" as const,
    message:
      "We are scoping MICE infrastructure investment in East Africa and are considering a 3,000-seat conference facility in Nairobi. Interested in the current pipeline, the tender process for government-linked convention centres, and the typical ROI.",
    createdDaysAgo: 20,
    reviewedDaysAgo: 15,
    reviewNotes:
      "Declined — the fund's focus on government-tendered convention centres does not match the PPP framework currently available. Referred to KICC for direct engagement on future tenders.",
  },
  {
    referenceNo: "INV/2026/2010",
    status: "CLOSED" as const,
    fullName: "David Kimani",
    email: "d.kimani@nairobi-spa.example",
    phone: "+254 734 555 999",
    company: "Nairobi Wellness Ventures",
    country: "Kenya",
    investorType: "INDIVIDUAL" as const,
    interests: ["LODGE_RESORT", "TECHNOLOGY"] as const,
    scale: "UNDER_10M" as const,
    message:
      "Exploring a wellness-focused eco-lodge in Laikipia. Would like to know about land tenure rules for conservancies and any grants available for sustainable tourism innovation.",
    createdDaysAgo: 25,
    reviewedDaysAgo: 20,
    reviewNotes:
      "Closed — capital raised through alternative sources. Investor declined to proceed. Follow-up potential in 2027.",
  },
];

/* ─────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────── */

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function randomHexId(prefix: string): string {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`;
}

/* ─────────────────────────────────────────────────────────────────
   RUN
   ───────────────────────────────────────────────────────────────── */

async function seedBusinessesAndOperators() {
  console.log(`🌱 Seeding ${BUSINESS_SEEDS.length} businesses / operators...`);
  const passwordHash = await bcrypt.hash("password123", 10);

  for (const b of BUSINESS_SEEDS) {
    const user = await prisma.user.upsert({
      where: { email: b.email },
      update: { role: b.role },
      create: {
        email: b.email,
        name: b.name,
        role: b.role,
        passwordHash,
      },
    });

    await prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName: b.businessName,
        contactEmail: b.contactEmail,
        contactPhone: b.contactPhone,
        description: b.description,
        verificationStatus: b.verificationStatus,
        businessType: b.businessType,
        traLicenseNumber: b.traLicenseNumber,
        katoMember: b.katoMember,
      },
      create: {
        userId: user.id,
        businessName: b.businessName,
        contactEmail: b.contactEmail,
        contactPhone: b.contactPhone,
        description: b.description,
        verificationStatus: b.verificationStatus,
        businessType: b.businessType,
        traLicenseNumber: b.traLicenseNumber,
        katoMember: b.katoMember,
        approvedAt: b.verificationStatus === "APPROVED" ? daysAgo(30) : null,
      },
    });

    // Attribution
    for (const slug of b.accommodationSlugs) {
      const res = await prisma.accommodation.updateMany({
        where: { slug },
        data: { businessId: user.id },
      });
      if (res.count === 0) {
        console.warn(`  ⚠ Accommodation not found: ${slug} (owner: ${b.email})`);
      }
    }
    for (const slug of b.packageSlugs) {
      const res = await prisma.tourPackage.updateMany({
        where: { slug },
        data: { businessId: user.id },
      });
      if (res.count === 0) {
        console.warn(`  ⚠ Package not found: ${slug} (owner: ${b.email})`);
      }
    }

    console.log(`  ✔ ${b.businessName} (${b.role}, ${b.verificationStatus})`);
  }
}

async function seedIncidents() {
  console.log(`🌱 Seeding ${INCIDENT_SEEDS.length} incidents...`);
  const admin = await prisma.user.findUnique({
    where: { email: "admin@test.local" },
    select: { id: true },
  });

  for (const s of INCIDENT_SEEDS) {
    const reportedAt = daysAgo(s.reportedDaysAgo);
    const occurredAt =
      s.occurredDaysAgo !== null ? daysAgo(s.occurredDaysAgo) : null;
    const reviewedAt =
      "reviewNotes" in s && s.reviewNotes ? daysAgo(s.reportedDaysAgo - 2) : null;
    const escalatedAt =
      s.status === "ESCALATED" && "escalatedDaysAgo" in s && s.escalatedDaysAgo
        ? daysAgo(s.escalatedDaysAgo)
        : null;

    const data = {
      referenceNo: s.referenceNo,
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
      reviewedById: reviewedAt ? admin?.id ?? null : null,
      reviewedAt,
      reviewNotes: "reviewNotes" in s ? s.reviewNotes ?? null : null,
      escalatedTo: "escalatedTo" in s ? s.escalatedTo ?? null : null,
      escalatedAt,
      escalatedById: escalatedAt ? admin?.id ?? null : null,
    };

    await prisma.incident.upsert({
      where: { referenceNo: s.referenceNo },
      update: data,
      create: data,
    });

    console.log(`  ✔ ${s.referenceNo} (${s.status})`);
  }
}

async function seedInquiries() {
  console.log(`🌱 Seeding ${INQUIRY_SEEDS.length} investor inquiries...`);
  const admin = await prisma.user.findUnique({
    where: { email: "admin@test.local" },
    select: { id: true },
  });

  for (const s of INQUIRY_SEEDS) {
    const createdAt = daysAgo(s.createdDaysAgo);
    const reviewedAt =
      "reviewedDaysAgo" in s && s.reviewedDaysAgo
        ? daysAgo(s.reviewedDaysAgo)
        : null;

    const data = {
      referenceNo: s.referenceNo,
      status: s.status,
      fullName: s.fullName,
      email: s.email,
      phone: s.phone,
      company: s.company,
      country: s.country,
      investorType: s.investorType,
      interests: [...s.interests],
      scale: s.scale,
      message: s.message,
      reviewedById: reviewedAt ? admin?.id ?? null : null,
      reviewedAt,
      reviewNotes: "reviewNotes" in s ? s.reviewNotes ?? null : null,
      createdAt,
    };

    await prisma.investorInquiry.upsert({
      where: { referenceNo: s.referenceNo },
      update: data,
      create: data,
    });

    console.log(`  ✔ ${s.referenceNo} (${s.status})`);
  }
}

async function main() {
  console.log("🚀 Seeding businesses, operators, incidents, and inquiries...\n");
  await seedBusinessesAndOperators();
  console.log();
  await seedIncidents();
  console.log();
  await seedInquiries();
  console.log("\n✅ Seed complete.");
  console.log("   All test accounts use password: password123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });