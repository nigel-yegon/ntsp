// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

function img(photoId: string, width = 1200, height = 800): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

/* ── helper: seed an itinerary as JSON ─────────────────────── */
function days(...entries: [string, string][]) {
  return entries.map(([title, description]) => ({ title, description }));
}

async function main() {
  console.log("🌱 Seeding NTSP database...");

  await seedDestinations();
  await seedAttractions();
  await seedTourPackages();
  await seedAccommodations();
  await seedEvents();
  await seedBlogPosts();
  await seedUsersAndCompany();
  await seedBusinessesAndCustomers();
  await seedApplications();
  await seedIncidents();
  await seedInvestorInquiries();

  console.log("✅ Seed complete.");
}

// ═══════════════════════════════════════════════════════════════
// BUSINESS & CUSTOMER SEEDS
// ═══════════════════════════════════════════════════════════════

const BUSINESS_SEEDS = [
  // ── Pure hotelier (accommodations only) ──
  {
    email: "diani@business.local",
    name: "Diani Resorts Manager",
    businessName: "Diani Beach Resorts",
    contactEmail: "reservations@diani-resorts.example",
    contactPhone: "+254 700 200 200",
    description:
      "Beachfront resorts and villas on Kenya's award-winning Diani Beach.",
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

  // ── Mixed business (hotelier that ALSO sells packages) ──
  {
    email: "mara@business.local",
    name: "Mara Serena Manager",
    businessName: "Mara Serena Safari Lodges",
    contactEmail: "bookings@mara-serena.example",
    contactPhone: "+254 700 100 100",
    description:
      "Safari lodges and camps in the Maasai Mara. Also runs in-house game drive packages.",
    verificationStatus: "APPROVED" as const,
    businessType: "ACCOMMODATION",
    traLicenseNumber: "TRA1/47/C02/1024",
    katoMember: true,
    role: "BUSINESS" as const,
    accommodationSlugs: ["mara-serena", "mara-sopa", "governors-camp"],
    packageSlugs: [
      "3-day-maasai-mara",
      "4-day-mara-camping",
      "7-day-kenya-highlights",
    ],
  },

  // ── Tour operator #1 (APPROVED) ──
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
      "10-day-bush-and-beach",
      "5-day-samburu-laikipia",
      "8-day-southern-kenya",
      "6-day-mount-kenya-trek",
    ],
  },

  // ── Tour operator #2 (APPROVED) ──
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
      "5-day-watamu",
      "4-day-tsavo",
      "3-day-malindi-gedi",
      "2-day-nairobi-park-city",
    ],
  },

  // ── Pending operator ──
  {
    email: "amboseli@business.local",
    name: "Amboseli Lodges Manager",
    businessName: "Amboseli Lodges",
    contactEmail: "stay@amboseli-lodges.example",
    contactPhone: "+254 700 400 400",
    description:
      "Lodges and camps with views of Mount Kilimanjaro in Amboseli National Park.",
    verificationStatus: "PENDING" as const,
    businessType: "TOUR_OPERATOR",
    traLicenseNumber: "TRA1/47/C01/9988",
    katoMember: false,
    role: "OPERATOR" as const,
    accommodationSlugs: [],
    packageSlugs: [],
  },
];

const CUSTOMER_SEEDS = [
  { email: "customer1@test.local", name: "Amina Hassan" },
  { email: "customer2@test.local", name: "James Mwangi" },
  { email: "customer3@test.local", name: "Sophie Turner" },
  { email: "customer4@test.local", name: "David Kimani" },
  { email: "customer5@test.local", name: "Lucia Fernández" },
  { email: "customer6@test.local", name: "Hiroshi Sato" },
];

// ═══════════════════════════════════════════════════════════════
// DESTINATIONS
// ═══════════════════════════════════════════════════════════════

async function seedDestinations() {
  const destinations = [
    { name: "Maasai Mara National Reserve", slug: "maasai-mara", county: "Narok", description: "Home to the Great Migration and the Big Five, the Maasai Mara is Kenya's most iconic wildlife destination.", imageUrl: img("photo-1516426122078-c23e76319801"), latitude: -1.4850, longitude: 35.3720, featured: true },
    { name: "Amboseli National Park", slug: "amboseli", county: "Kajiado", description: "Famous for its large elephant herds and stunning views of Mount Kilimanjaro across the border in Tanzania.", imageUrl: img("photo-1547970810-dc1eac37d174"), latitude: -2.6527, longitude: 37.2606, featured: true },
    { name: "Diani Beach", slug: "diani-beach", county: "Kwale", description: "Award-winning white-sand beach on the Indian Ocean, perfect for relaxation, water sports, and coral reef diving.", imageUrl: img("photo-1507525428034-b723cf961d3e"), latitude: -4.2927, longitude: 39.5794, featured: true },
    { name: "Lake Nakuru National Park", slug: "lake-nakuru", county: "Nakuru", description: "Famous for its flamingos and rhino sanctuary, set around a shallow alkaline lake in the Great Rift Valley.", imageUrl: img("photo-1518709268805-4e9042af9f23"), latitude: -0.3667, longitude: 36.0833, featured: false },
    { name: "Nairobi", slug: "nairobi", county: "Nairobi", description: "Kenya's vibrant capital, known as the 'Green City in the Sun', home to Nairobi National Park and rich cultural experiences.", imageUrl: img("photo-1611348586804-61bf6c080437"), latitude: -1.2921, longitude: 36.8219, featured: false },
    { name: "Tsavo East National Park", slug: "tsavo-east", county: "Taita-Taveta", description: "One of Kenya's largest and oldest parks, known for its red elephants and vast arid plains.", imageUrl: img("photo-1564760055775-d63b17a55c44"), latitude: -3.0000, longitude: 38.5000, featured: true },
    { name: "Tsavo West National Park", slug: "tsavo-west", county: "Taita-Taveta", description: "Volcanic hills, lava flows, and the crystal-clear Mzima Springs, home to hippos and crocodiles.", imageUrl: img("photo-1549366021-9f761d450615"), latitude: -3.4167, longitude: 38.0000, featured: false },
    { name: "Samburu National Reserve", slug: "samburu", county: "Samburu", description: "Semi-arid wilderness along the Ewaso Ng'iro river, home to the Samburu Special Five.", imageUrl: img("photo-1547471080-7cc2caa01a7e"), latitude: 0.5833, longitude: 37.5333, featured: true },
    { name: "Lamu Old Town", slug: "lamu", county: "Lamu", description: "UNESCO World Heritage Site and the oldest continuously inhabited Swahili settlement in East Africa.", imageUrl: img("photo-1571407970349-bc81e7e96d47"), latitude: -2.2717, longitude: 40.9020, featured: true },
    { name: "Mount Kenya National Park", slug: "mount-kenya", county: "Nyeri", description: "Africa's second-highest mountain, with glaciers, alpine meadows, and a UNESCO-listed natural landscape.", imageUrl: img("photo-1519681393784-d120267933ba"), latitude: -0.1521, longitude: 37.3084, featured: false },
    { name: "Hell's Gate National Park", slug: "hells-gate", county: "Nakuru", description: "One of the few Kenyan parks where you can walk, cycle, and climb alongside wildlife, with dramatic geothermal scenery.", imageUrl: img("photo-1501785888041-af3ef285b470"), latitude: -0.9167, longitude: 36.3167, featured: false },
    { name: "Lake Naivasha", slug: "lake-naivasha", county: "Nakuru", description: "Freshwater lake in the Rift Valley with abundant birdlife, hippos, and boat safaris to Crescent Island.", imageUrl: img("photo-1544551763-46a013bb70d5"), latitude: -0.7667, longitude: 36.3667, featured: false },
    { name: "Lake Baringo", slug: "lake-baringo", county: "Baringo", description: "One of the Rift Valley's two freshwater lakes, home to over 470 bird species and crocodile-filled waters.", imageUrl: img("photo-1500375592092-40eb2168fd21"), latitude: 0.4667, longitude: 36.1000, featured: false },
    { name: "Lake Bogoria", slug: "lake-bogoria", county: "Baringo", description: "Alkaline lake famous for its hot springs, geysers, and huge seasonal flocks of lesser flamingos.", imageUrl: img("photo-1516214104703-d870798883c5"), latitude: 0.2500, longitude: 36.1000, featured: false },
    { name: "Nairobi National Park", slug: "nairobi-national-park", county: "Nairobi", description: "The only national park within a capital city — a unique blend of wildlife and urban skyline.", imageUrl: img("photo-1547471080-7cc2caa01a7e"), latitude: -1.3733, longitude: 36.8583, featured: true },
    { name: "Watamu Marine National Park", slug: "watamu", county: "Kilifi", description: "Protected coral reef and turtle nesting site, part of the Malindi-Watamu Biosphere Reserve.", imageUrl: img("photo-1544551763-77ef2d0cfc6c"), latitude: -3.3667, longitude: 40.0167, featured: false },
    { name: "Malindi", slug: "malindi", county: "Kilifi", description: "Historic coastal town with Italian influence, a marine park, and easy access to Gedi ruins.", imageUrl: img("photo-1519046904884-53103b34b206"), latitude: -3.2192, longitude: 40.1169, featured: false },
    { name: "Kisite-Mpunguti Marine Park", slug: "kisite-mpunguti", county: "Kwale", description: "Kenya's premier marine park, famous for dolphin sightings, snorkeling, and coral gardens.", imageUrl: img("photo-1583212292454-1fe6229603b7"), latitude: -4.7167, longitude: 39.3667, featured: true },
    { name: "Nyahururu Falls", slug: "nyahururu-falls", county: "Laikipia", description: "Also known as Thomson's Falls — a 74-metre waterfall on the Ewaso Ng'iro river, a popular stopover.", imageUrl: img("photo-1432405972618-c60b0225b8f9"), latitude: 0.0333, longitude: 36.3667, featured: false },
    { name: "Kakamega Forest", slug: "kakamega-forest", county: "Kakamega", description: "Kenya's only remaining tropical rainforest, with over 400 butterfly species and 300 bird species.", imageUrl: img("photo-1441974231531-c6227db76b6e"), latitude: 0.2500, longitude: 34.8667, featured: false },
  ];

  for (const d of destinations) {
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: { imageUrl: d.imageUrl, latitude: d.latitude, longitude: d.longitude },
      create: d,
    });
  }

  console.log(`✔ Seeded ${destinations.length} destinations`);
}

async function getDestinationMap() {
  const records = await prisma.destination.findMany({
    select: { id: true, slug: true },
  });
  return Object.fromEntries(records.map((r) => [r.slug, r])) as Record<
    string,
    { id: number; slug: string }
  >;
}

// ═══════════════════════════════════════════════════════════════
// ATTRACTIONS
// ═══════════════════════════════════════════════════════════════

async function seedAttractions() {
  const destinationMap = await getDestinationMap();

  const attractions = [
    { name: "Great Wildebeest Migration", slug: "great-migration", description: "Witness over 1.5 million wildebeest and zebras cross the Mara River — one of nature's greatest spectacles.", category: "Wildlife", destinationId: destinationMap["maasai-mara"].id, imageUrl: img("photo-1534177616072-ef7dc120449d"), latitude: -1.5000, longitude: 35.0000 },
    { name: "Maasai Cultural Village Visit", slug: "maasai-cultural-village", description: "Immerse yourself in Maasai traditions, music, dance, and beadwork at an authentic manyatta.", category: "Cultural", destinationId: destinationMap["maasai-mara"].id, imageUrl: img("photo-1516450360452-9312f5e86fc7"), latitude: -1.4300, longitude: 35.3600 },
    { name: "Hot Air Balloon Safari", slug: "mara-balloon-safari", description: "Drift over the Mara plains at dawn and land to a champagne bush breakfast.", category: "Adventure", destinationId: destinationMap["maasai-mara"].id, imageUrl: img("photo-1521405924368-64c5b84bec60"), latitude: -1.4500, longitude: 35.4000 },
    { name: "Elephant Research Camp", slug: "amboseli-elephants", description: "Visit the Amboseli Trust for Elephants and learn about the world's longest-running elephant study.", category: "Wildlife", destinationId: destinationMap["amboseli"].id, imageUrl: img("photo-1564760055775-d63b17a55c44"), latitude: -2.6500, longitude: 37.2700 },
    { name: "Mount Kilimanjaro Views", slug: "kilimanjaro-views", description: "Enjoy spectacular views of Africa's highest peak at sunrise and sunset from Observation Hill.", category: "Adventure", destinationId: destinationMap["amboseli"].id, imageUrl: img("photo-1589553416260-f586c8f1514f"), latitude: -2.6600, longitude: 37.3000 },
    { name: "Diani Beach Snorkeling", slug: "diani-snorkeling", description: "Explore vibrant coral reefs and swim with tropical fish at Kisite-Mpunguti Marine Park.", category: "Beach", destinationId: destinationMap["diani-beach"].id, imageUrl: img("photo-1544551763-46a013bb70d5"), latitude: -4.7100, longitude: 39.3700 },
    { name: "Sunset Dhow Cruise", slug: "diani-dhow-cruise", description: "Sail a traditional Swahili dhow along the coast as the sun sinks into the Indian Ocean.", category: "Beach", destinationId: destinationMap["diani-beach"].id, imageUrl: img("photo-1502680390469-be75c86b636f"), latitude: -4.3000, longitude: 39.5800 },
    { name: "Skydiving over Diani", slug: "diani-skydiving", description: "Tandem skydive from 12,000 feet with views of the reef, coastline, and inland savannah.", category: "Adventure", destinationId: destinationMap["diani-beach"].id, imageUrl: img("photo-1521673461164-de4def04bb98"), latitude: -4.2900, longitude: 39.5900 },
    { name: "Flamingo Watching", slug: "nakuru-flamingos", description: "See thousands of flamingos and over 400 bird species along the shores of Lake Nakuru.", category: "Wildlife", destinationId: destinationMap["lake-nakuru"].id, imageUrl: img("photo-1518709268805-4e9042af9f23"), latitude: -0.3700, longitude: 36.0900 },
    { name: "Rhino Tracking", slug: "nakuru-rhino-tracking", description: "Track both black and white rhinos in one of Kenya's most successful sanctuaries.", category: "Wildlife", destinationId: destinationMap["lake-nakuru"].id, imageUrl: img("photo-1549366021-9f761d450615"), latitude: -0.3800, longitude: 36.0800 },
    { name: "Nairobi National Park Safari", slug: "nairobi-safari", description: "The only national park within a capital city — spot rhinos and lions with skyscrapers on the horizon.", category: "Wildlife", destinationId: destinationMap["nairobi"].id, imageUrl: img("photo-1547471080-7cc2caa01a7e"), latitude: -1.3700, longitude: 36.8400 },
    { name: "Giraffe Centre", slug: "giraffe-centre", description: "Hand-feed endangered Rothschild giraffes at this world-famous conservation centre.", category: "Cultural", destinationId: destinationMap["nairobi"].id, imageUrl: img("photo-1547721064-da6cfb341d50"), latitude: -1.3765, longitude: 36.7426 },
    { name: "David Sheldrick Elephant Orphanage", slug: "sheldrick-elephants", description: "Meet orphaned baby elephants and learn about their rehabilitation before release into the wild.", category: "Wildlife", destinationId: destinationMap["nairobi"].id, imageUrl: img("photo-1564760055775-d63b17a55c44"), latitude: -1.3800, longitude: 36.8300 },
    { name: "Karen Blixen Museum", slug: "karen-blixen-museum", description: "Step into the world of Out of Africa at the former home of the Danish author.", category: "Cultural", destinationId: destinationMap["nairobi"].id, imageUrl: img("photo-1518709268805-4e9042af9f23"), latitude: -1.3500, longitude: 36.7100 },
    { name: "Red Elephant Safari", slug: "tsavo-red-elephants", description: "Spot the famous red-dusted elephants of Tsavo, colored by the park's iron-rich soil.", category: "Wildlife", destinationId: destinationMap["tsavo-east"].id, imageUrl: img("photo-1564760055775-d63b17a55c44"), latitude: -3.0000, longitude: 38.5000 },
    { name: "Lugard Falls", slug: "lugard-falls", description: "Rocky rapids on the Galana River, surrounded by dramatic black lava formations.", category: "Adventure", destinationId: destinationMap["tsavo-east"].id, imageUrl: img("photo-1432405972618-c60b0225b8f9"), latitude: -2.9800, longitude: 38.5300 },
    { name: "Mzima Springs", slug: "mzima-springs", description: "Crystal-clear springs producing 250 million litres of water a day, with an underwater viewing chamber.", category: "Wildlife", destinationId: destinationMap["tsavo-west"].id, imageUrl: img("photo-1544551763-77ef2d0cfc6c"), latitude: -3.4300, longitude: 37.9900 },
    { name: "Chyulu Hills", slug: "chyulu-hills", description: "Volcanic hills with lava tube caves and panoramic views toward Kilimanjaro.", category: "Adventure", destinationId: destinationMap["tsavo-west"].id, imageUrl: img("photo-1501785888041-af3ef285b470"), latitude: -3.4500, longitude: 38.0100 },
    { name: "Samburu Special Five", slug: "samburu-special-five", description: "See the Grevy's zebra, reticulated giraffe, Beisa oryx, gerenuk, and Somali ostrich — all unique to northern Kenya.", category: "Wildlife", destinationId: destinationMap["samburu"].id, imageUrl: img("photo-1547471080-7cc2caa01a7e"), latitude: 0.5800, longitude: 37.5300 },
    { name: "Lamu Old Town Walking Tour", slug: "lamu-walking-tour", description: "Wander the narrow streets of the UNESCO-listed Swahili settlement, visiting historic mosques and houses.", category: "Cultural", destinationId: destinationMap["lamu"].id, imageUrl: img("photo-1571407970349-bc81e7e96d47"), latitude: -2.2710, longitude: 40.9020 },
    { name: "Dhow Sailing to Shela", slug: "lamu-dhow-shela", description: "Sail by traditional dhow to the tranquil beaches of Shela and enjoy a Swahili seafood lunch.", category: "Beach", destinationId: destinationMap["lamu"].id, imageUrl: img("photo-1502680390469-be75c86b636f"), latitude: -2.2760, longitude: 40.9100 },
    { name: "Point Lenana Trek", slug: "point-lenana-trek", description: "A four-day trek to Point Lenana (4,985m), the highest point reachable without technical climbing.", category: "Adventure", destinationId: destinationMap["mount-kenya"].id, imageUrl: img("photo-1519681393784-d120267933ba"), latitude: -0.1600, longitude: 37.3100 },
    { name: "Turtle Watching at Watamu", slug: "watamu-turtles", description: "Watch green and hawksbill turtles nest on Watamu's beaches — one of Kenya's oldest marine conservation efforts.", category: "Wildlife", destinationId: destinationMap["watamu"].id, imageUrl: img("photo-1518467166778-b88f373ffec7"), latitude: -3.3700, longitude: 40.0200 },
  ];

  for (const a of attractions) {
    await prisma.attraction.upsert({
      where: { slug: a.slug },
      update: { imageUrl: a.imageUrl, latitude: a.latitude, longitude: a.longitude },
      create: a,
    });
  }

  console.log(`✔ Seeded ${attractions.length} attractions`);
}

// ═══════════════════════════════════════════════════════════════
// TOUR PACKAGES — with itineraries
// ═══════════════════════════════════════════════════════════════

async function seedTourPackages() {
  const destinationMap = await getDestinationMap();

  const packages = [
    {
      title: "3-Day Maasai Mara Safari",
      slug: "3-day-maasai-mara",
      summary: "Game drives in the world's most famous wildlife reserve.",
      description: "Enjoy three days of thrilling game drives in the Maasai Mara.",
      priceKes: 37060, durationDays: 3,
      imageUrl: img("photo-1516426122078-c23e76319801"),
      destinationId: destinationMap["maasai-mara"].id,
      latitude: -1.4850, longitude: 35.3720, featured: true,
      itinerary: days(
        ["Arrival & evening game drive",
         "Pick up from Nairobi or JKIA, transfer to the Mara arriving early afternoon. Late-afternoon game drive in the reserve followed by dinner at the lodge."],
        ["Full day in the Mara",
         "Sunrise game drive with picnic breakfast, mid-morning return to camp. Afternoon game drive toward the Mara River to spot hippos and crocodiles."],
        ["Sunrise drive & return",
         "Final early-morning game drive, breakfast at camp, and drive back to Nairobi by mid-afternoon."]
      ),
    },
    {
      title: "12-Hour Amboseli Day Trip",
      slug: "amboseli-day-trip",
      summary: "A quick escape to see elephants against Mount Kilimanjaro.",
      description: "Perfect for travellers short on time.",
      priceKes: 65500, durationDays: 1,
      imageUrl: img("photo-1547970810-dc1eac37d174"),
      destinationId: destinationMap["amboseli"].id,
      latitude: -2.6527, longitude: 37.2606, featured: true,
      itinerary: days(
        ["Day trip from Nairobi",
         "Depart Nairobi at 6am. Arrive at Amboseli by 10am for a full day of game drives with picnic lunch. Return to Nairobi by evening."]
      ),
    },
    {
      title: "5-Day Diani Beach Retreat",
      slug: "5-day-diani-retreat",
      summary: "Relax on Kenya's best beach with snorkeling and dhow cruises.",
      description: "Five days of sun, sand, and sea at Diani Beach.",
      priceKes: 89999, durationDays: 5,
      imageUrl: img("photo-1507525428034-b723cf961d3e"),
      destinationId: destinationMap["diani-beach"].id,
      latitude: -4.2927, longitude: 39.5794, featured: false,
      itinerary: days(
        ["Arrival at Diani",
         "Airport pickup from Moi International or Ukunda airstrip. Afternoon at leisure by the beach."],
        ["Snorkel at Kisite-Mpunguti",
         "Full-day boat trip to Kisite-Mpunguti Marine Park with snorkeling and seafood lunch on Wasini Island."],
        ["Sunset dhow & Swahili dinner",
         "Free morning. Sunset dhow cruise with sundowners, followed by a Swahili seafood dinner."],
        ["Beach day & optional activities",
         "Full day at leisure — optional kite surfing, skydiving, or a day trip to Shimba Hills."],
        ["Departure",
         "Breakfast and transfer to the airport."]
      ),
    },
    {
      title: "Nairobi City & Safari Experience",
      slug: "nairobi-city-safari",
      summary: "Explore Nairobi's culture, wildlife, and cuisine in 2 days.",
      description: "Nairobi National Park, Giraffe Centre, and Maasai Market.",
      priceKes: 28500, durationDays: 2,
      imageUrl: img("photo-1611348586804-61bf6c080437"),
      destinationId: destinationMap["nairobi"].id,
      latitude: -1.2921, longitude: 36.8219, featured: false,
      itinerary: days(
        ["Nairobi National Park & Sheldrick",
         "Dawn game drive in Nairobi National Park, followed by a visit to the Sheldrick Wildlife Trust at 11am."],
        ["Giraffe Centre & Maasai Market",
         "Giraffe Centre in Langata, lunch in Karen, afternoon shopping at the Maasai Market, transfer to the airport or hotel."]
      ),
    },
    {
      title: "Lake Nakuru & Rift Valley Explorer",
      slug: "nakuru-rift-valley",
      summary: "Flamingos, rhinos, and stunning Rift Valley scenery.",
      description: "A 2-day safari to Lake Nakuru National Park.",
      priceKes: 32000, durationDays: 2,
      imageUrl: img("photo-1518709268805-4e9042af9f23"),
      destinationId: destinationMap["lake-nakuru"].id,
      latitude: -0.3667, longitude: 36.0833, featured: false,
      itinerary: days(
        ["Nairobi → Nakuru",
         "Depart Nairobi, stop at the Great Rift Valley viewpoint, arrive at Nakuru for an afternoon game drive focused on flamingos and rhinos."],
        ["Baboon Cliff & return",
         "Morning game drive to Baboon Cliff for panoramic views, then drive back to Nairobi arriving by early evening."]
      ),
    },
    {
      title: "7-Day Kenya Highlights Safari",
      slug: "7-day-kenya-highlights",
      summary: "Mara, Nakuru, and Amboseli in one classic week-long trip.",
      description: "The perfect introduction to Kenya's safari circuit.",
      priceKes: 189000, durationDays: 7,
      imageUrl: img("photo-1516426122078-c23e76319801"),
      destinationId: destinationMap["maasai-mara"].id,
      latitude: -1.4850, longitude: 35.3720, featured: true,
      itinerary: days(
        ["Nairobi → Maasai Mara",
         "Drive from Nairobi to the Mara. Afternoon game drive on arrival."],
        ["Full day in the Mara",
         "Full-day game drive with a picnic lunch near the Mara River."],
        ["Mara → Lake Nakuru",
         "Morning game drive, then drive to Nakuru. Afternoon game drive around the lake."],
        ["Nakuru → Amboseli",
         "Morning game drive, then drive to Amboseli via Nairobi."],
        ["Full day in Amboseli",
         "Morning and afternoon game drives with Kilimanjaro views."],
        ["Amboseli game drive",
         "Final early morning game drive and afternoon at leisure."],
        ["Return to Nairobi",
         "Drive back to Nairobi, arriving by early afternoon. Transfer to airport."]
      ),
    },
    {
      title: "10-Day Bush & Beach",
      slug: "10-day-bush-and-beach",
      summary: "Safari, then sand — the classic Kenyan honeymoon.",
      description: "Four days of game drives in the Mara and Amboseli, then five days on Diani.",
      priceKes: 245000, durationDays: 10,
      imageUrl: img("photo-1507525428034-b723cf961d3e"),
      destinationId: destinationMap["diani-beach"].id,
      latitude: -4.2927, longitude: 39.5794, featured: true,
      itinerary: days(
        ["Arrival in Nairobi",
         "Pick up at JKIA and overnight in Nairobi before the safari begins."],
        ["Nairobi → Maasai Mara",
         "Drive to the Mara with game drive en route. Afternoon game drive."],
        ["Full day in the Mara",
         "Full-day game drive with picnic lunch, tracking the Big Five."],
        ["Mara → Amboseli",
         "Morning game drive, then transfer to Amboseli. Evening at leisure."],
        ["Full day in Amboseli",
         "Sunrise game drive to see Kilimanjaro, plus afternoon game drive."],
        ["Amboseli → Nairobi → Diani",
         "Morning game drive, transfer to Nairobi, evening flight to Diani."],
        ["Diani beach day",
         "Full day at leisure on the beach."],
        ["Snorkel at Kisite",
         "Boat trip to Kisite-Mpunguti Marine Park with lunch on Wasini Island."],
        ["Dhow cruise & Swahili dinner",
         "Free morning, sunset dhow cruise and Swahili dinner in the evening."],
        ["Departure",
         "Breakfast, transfer to Ukunda airstrip or Moi International Airport."]
      ),
    },
    {
      title: "4-Day Tsavo East & West",
      slug: "4-day-tsavo",
      summary: "Red elephants, lava flows, and Mzima Springs.",
      description: "Explore both halves of Tsavo.",
      priceKes: 78000, durationDays: 4,
      imageUrl: img("photo-1564760055775-d63b17a55c44"),
      destinationId: destinationMap["tsavo-east"].id,
      latitude: -3.0000, longitude: 38.5000, featured: false,
      itinerary: days(
        ["Nairobi → Tsavo East",
         "Drive to Tsavo East. Afternoon game drive at Aruba Dam."],
        ["Tsavo East → Tsavo West",
         "Morning game drive, then transfer to Tsavo West. Afternoon at Mzima Springs."],
        ["Tsavo West full day",
         "Morning game drive to Chyulu Hills and Shetani Lava Flow. Afternoon at leisure."],
        ["Return to Nairobi",
         "Early game drive, then drive back to Nairobi arriving by lunchtime."]
      ),
    },
    {
      title: "5-Day Samburu & Laikipia",
      slug: "5-day-samburu-laikipia",
      summary: "Northern Kenya's Special Five and community conservancies.",
      description: "Discover the arid beauty of Samburu and Laikipia.",
      priceKes: 132000, durationDays: 5,
      imageUrl: img("photo-1547471080-7cc2caa01a7e"),
      destinationId: destinationMap["samburu"].id,
      latitude: 0.5833, longitude: 37.5333, featured: true,
      itinerary: days(
        ["Nairobi → Samburu",
         "Drive north, crossing the equator. Evening game drive in Samburu."],
        ["Samburu full day",
         "Morning and afternoon game drives looking for the Special Five."],
        ["Samburu → Laikipia",
         "Morning game drive, then transfer to a Laikipia conservancy."],
        ["Laikipia full day",
         "Game drives, guided bush walks, and a visit to a community project."],
        ["Return to Nairobi",
         "Drive back to Nairobi with a stop at the equator marker."]
      ),
    },
    {
      title: "4-Day Lamu Cultural Escape",
      slug: "4-day-lamu",
      summary: "Swahili history, dhow sailing, and quiet beaches.",
      description: "Explore the UNESCO-listed Lamu Old Town.",
      priceKes: 68000, durationDays: 4,
      imageUrl: img("photo-1571407970349-bc81e7e96d47"),
      destinationId: destinationMap["lamu"].id,
      latitude: -2.2717, longitude: 40.9020, featured: false,
      itinerary: days(
        ["Arrival in Lamu",
         "Fly to Manda airstrip, transfer by boat to your hotel. Afternoon at leisure."],
        ["Lamu Old Town walking tour",
         "Guided walk through the historic Swahili town — mosques, markets, and the Lamu Museum."],
        ["Dhow to Shela",
         "Traditional dhow sail to Shela beach, seafood lunch, and return by sunset."],
        ["Departure",
         "Breakfast, last swim, transfer to the airstrip."]
      ),
    },
    {
      title: "6-Day Mount Kenya Trek",
      slug: "6-day-mount-kenya-trek",
      summary: "Summit Point Lenana via the Sirimon and Chogoria routes.",
      description: "A six-day trek through alpine meadows and glacial valleys.",
      priceKes: 95000, durationDays: 6,
      imageUrl: img("photo-1519681393784-d120267933ba"),
      destinationId: destinationMap["mount-kenya"].id,
      latitude: -0.1521, longitude: 37.3084, featured: false,
      itinerary: days(
        ["Nanyuki → Old Moses Camp",
         "Drive to the Sirimon gate, trek 3-4 hours to Old Moses Camp (3,300m)."],
        ["Old Moses → Shipton's Camp",
         "Trek through the moorland to Shipton's Camp (4,200m)."],
        ["Acclimatisation day",
         "Day hike toward Hausberg Col to acclimatise."],
        ["Summit Point Lenana",
         "Pre-dawn start to reach Point Lenana (4,985m) for sunrise, then descend to Mintos."],
        ["Descent to Chogoria",
         "Long descent through the Chogoria route with views of the Gorges Valley."],
        ["Return to Nanyuki",
         "Morning drive out of the park, transfer to Nanyuki or Nairobi."]
      ),
    },
    {
      title: "3-Day Hell's Gate & Naivasha",
      slug: "3-day-hells-gate-naivasha",
      summary: "Cycle among wildlife and boat past hippos.",
      description: "Cycle Hell's Gate and boat on Lake Naivasha.",
      priceKes: 42000, durationDays: 3,
      imageUrl: img("photo-1501785888041-af3ef285b470"),
      destinationId: destinationMap["hells-gate"].id,
      latitude: -0.9167, longitude: 36.3167, featured: false,
      itinerary: days(
        ["Nairobi → Naivasha",
         "Drive to Naivasha. Afternoon boat safari to Crescent Island with a walking safari."],
        ["Hell's Gate cycling",
         "Cycle through Hell's Gate among zebras and giraffes. Afternoon at leisure."],
        ["Return to Nairobi",
         "Morning at leisure, drive back to Nairobi."]
      ),
    },
    {
      title: "5-Day Watamu Beach & Marine Park",
      slug: "5-day-watamu",
      summary: "Snorkeling, turtles, and the Italian-inflected coast.",
      description: "Explore Watamu Marine National Park.",
      priceKes: 82000, durationDays: 5,
      imageUrl: img("photo-1544551763-77ef2d0cfc6c"),
      destinationId: destinationMap["watamu"].id,
      latitude: -3.3667, longitude: 40.0167, featured: false,
      itinerary: days(
        ["Arrival at Watamu",
         "Transfer from Malindi airport. Afternoon at leisure."],
        ["Marine Park snorkel",
         "Full day in Watamu Marine National Park with snorkeling and a seafood lunch."],
        ["Turtle watch & Gede ruins",
         "Morning at Gede ruins, evening turtle watching at the marine reserve."],
        ["Beach day",
         "Relax on the beach, optional kayaking or kite surfing."],
        ["Departure",
         "Breakfast and transfer to Malindi airport."]
      ),
    },
    {
      title: "2-Day Lake Naivasha Weekend",
      slug: "2-day-naivasha-weekend",
      summary: "The perfect weekend escape from Nairobi.",
      description: "Boat safaris, Crescent Island walks, and sundowners.",
      priceKes: 34000, durationDays: 2,
      imageUrl: img("photo-1544551763-46a013bb70d5"),
      destinationId: destinationMap["lake-naivasha"].id,
      latitude: -0.7667, longitude: 36.3667, featured: false,
      itinerary: days(
        ["Nairobi → Naivasha",
         "Drive to Naivasha. Afternoon boat safari and guided walk on Crescent Island."],
        ["Return to Nairobi",
         "Morning at leisure, drive back to Nairobi by lunchtime."]
      ),
    },
    {
      title: "3-Day Kakamega Forest Explorer",
      slug: "3-day-kakamega-forest",
      summary: "Kenya's only tropical rainforest.",
      description: "Guided nature walks and birdwatching.",
      priceKes: 45000, durationDays: 3,
      imageUrl: img("photo-1441974231531-c6227db76b6e"),
      destinationId: destinationMap["kakamega-forest"].id,
      latitude: 0.2500, longitude: 34.8667, featured: false,
      itinerary: days(
        ["Arrival at Kakamega",
         "Drive from Nairobi or Kisumu, afternoon guided forest walk."],
        ["Full day in the forest",
         "Morning birdwatching and butterfly spotting. Afternoon nature trail."],
        ["Return to Nairobi",
         "Morning walk, then return to Nairobi."]
      ),
    },
    {
      title: "4-Day Lake Baringo & Bogoria",
      slug: "4-day-baringo-bogoria",
      summary: "Freshwater and alkaline lakes of the northern Rift.",
      description: "Baringo's birdlife, Bogoria's hot springs.",
      priceKes: 62000, durationDays: 4,
      imageUrl: img("photo-1500375592092-40eb2168fd21"),
      destinationId: destinationMap["lake-baringo"].id,
      latitude: 0.4667, longitude: 36.1000, featured: false,
      itinerary: days(
        ["Nairobi → Lake Baringo",
         "Drive north, evening boat safari on Lake Baringo."],
        ["Baringo → Lake Bogoria",
         "Morning birdwatching at Baringo, then transfer to Bogoria."],
        ["Full day at Bogoria",
         "Hot springs, geysers, and flamingo watching."],
        ["Return to Nairobi",
         "Morning at leisure, drive back to Nairobi."]
      ),
    },
    {
      title: "8-Day Best of Southern Kenya",
      slug: "8-day-southern-kenya",
      summary: "Nairobi, Amboseli, Tsavo, and Diani in one trip.",
      description: "A comprehensive southern circuit.",
      priceKes: 198000, durationDays: 8,
      imageUrl: img("photo-1507525428034-b723cf961d3e"),
      destinationId: destinationMap["diani-beach"].id,
      latitude: -4.2927, longitude: 39.5794, featured: true,
      itinerary: days(
        ["Arrival in Nairobi",
         "Airport pickup and city tour. Overnight in Nairobi."],
        ["Nairobi → Amboseli",
         "Drive to Amboseli. Afternoon game drive."],
        ["Full day in Amboseli",
         "Morning and afternoon game drives with Kilimanjaro views."],
        ["Amboseli → Tsavo West",
         "Transfer to Tsavo West with a stop at Mzima Springs."],
        ["Tsavo West → Tsavo East",
         "Morning game drive, transfer to Tsavo East."],
        ["Tsavo East → Diani",
         "Morning game drive, then transfer to Diani."],
        ["Diani beach day",
         "Full day at leisure with optional marine park excursion."],
        ["Departure",
         "Breakfast and transfer to airport."]
      ),
    },
    {
      title: "3-Day Malindi & Gedi Ruins",
      slug: "3-day-malindi-gedi",
      summary: "Historic Swahili coast and marine park.",
      description: "Malindi's Italian-Swahili culture and Gedi ruins.",
      priceKes: 52000, durationDays: 3,
      imageUrl: img("photo-1519046904884-53103b34b206"),
      destinationId: destinationMap["malindi"].id,
      latitude: -3.2192, longitude: 40.1169, featured: false,
      itinerary: days(
        ["Arrival at Malindi",
         "Transfer from Malindi airport. Afternoon at leisure."],
        ["Gedi & Marine Park",
         "Morning tour of the Gedi ruins, afternoon snorkeling in Malindi Marine National Park."],
        ["Departure",
         "Breakfast and transfer to the airport."]
      ),
    },
    {
      title: "5-Day Samburu Flying Safari",
      slug: "5-day-samburu-flying",
      summary: "Fly-in luxury safari to northern Kenya.",
      description: "Skip the long drive — fly to Samburu.",
      priceKes: 225000, durationDays: 5,
      imageUrl: img("photo-1547471080-7cc2caa01a7e"),
      destinationId: destinationMap["samburu"].id,
      latitude: 0.5833, longitude: 37.5333, featured: false,
      itinerary: days(
        ["Nairobi → Samburu",
         "Fly to Samburu. Evening game drive."],
        ["Samburu full day",
         "Morning and afternoon game drives looking for the Special Five."],
        ["Walking safari",
         "Guided walking safari with Samburu guides. Afternoon at leisure."],
        ["Samburu full day",
         "Final full day of game drives and a cultural visit to a Samburu manyatta."],
        ["Return to Nairobi",
         "Morning game drive, transfer to airstrip, fly to Nairobi."]
      ),
    },
    {
      title: "2-Day Nairobi National Park & City",
      slug: "2-day-nairobi-park-city",
      summary: "Wildlife and culture in a weekend.",
      description: "Nairobi National Park, Giraffe Centre, Karen Blixen Museum.",
      priceKes: 26000, durationDays: 2,
      imageUrl: img("photo-1547471080-7cc2caa01a7e"),
      destinationId: destinationMap["nairobi-national-park"].id,
      latitude: -1.3733, longitude: 36.8583, featured: false,
      itinerary: days(
        ["Nairobi National Park",
         "Dawn game drive in the park, followed by a visit to the Sheldrick Wildlife Trust."],
        ["Cultural day",
         "Giraffe Centre, Karen Blixen Museum, and Maasai Market."]
      ),
    },
    {
      title: "4-Day Maasai Mara Budget Camping",
      slug: "4-day-mara-camping",
      summary: "The Mara experience on a budget.",
      description: "Shared game drives and tented camp accommodation.",
      priceKes: 58000, durationDays: 4,
      imageUrl: img("photo-1521405924368-64c5b84bec60"),
      destinationId: destinationMap["maasai-mara"].id,
      latitude: -1.4850, longitude: 35.3720, featured: false,
      itinerary: days(
        ["Nairobi → Maasai Mara",
         "Drive to the Mara. Afternoon game drive."],
        ["Full day in the Mara",
         "Full-day game drive with picnic lunch."],
        ["Full day in the Mara",
         "Morning and afternoon game drives with your small group."],
        ["Return to Nairobi",
         "Morning game drive, drive back to Nairobi."]
      ),
    },
    {
      title: "6-Day Honeymoon Safari & Diani",
      slug: "6-day-honeymoon",
      summary: "Intimate safari nights and ocean days.",
      description: "Three nights in the Mara and three on Diani.",
      priceKes: 320000, durationDays: 6,
      imageUrl: img("photo-1516426122078-c23e76319801"),
      destinationId: destinationMap["maasai-mara"].id,
      latitude: -1.4850, longitude: 35.3720, featured: false,
      itinerary: days(
        ["Nairobi → Maasai Mara",
         "Private transfer to the Mara. Romantic dinner under the stars."],
        ["Full day in the Mara",
         "Private game drive with champagne sundowners."],
        ["Mara → Diani",
         "Morning game drive, transfer to Nairobi, evening flight to Diani."],
        ["Diani beach day",
         "Couples' spa and beach time."],
        ["Dhow cruise",
         "Private sunset dhow cruise with dinner."],
        ["Departure",
         "Breakfast and transfer to Ukunda airstrip."]
      ),
    },
  ];

  for (const p of packages) {
    await prisma.tourPackage.upsert({
      where: { slug: p.slug },
      update: {
        imageUrl: p.imageUrl,
        latitude: p.latitude,
        longitude: p.longitude,
        itinerary: p.itinerary,
      },
      create: {
        ...p,
        itinerary: p.itinerary,
      },
    });
  }

  console.log(`✔ Seeded ${packages.length} tour packages (with itineraries)`);
}

// ═══════════════════════════════════════════════════════════════
// ACCOMMODATIONS
// ═══════════════════════════════════════════════════════════════

async function seedAccommodations() {
  const destinationMap = await getDestinationMap();

  const accommodations = [
    { name: "Mara Serena Safari Lodge", slug: "mara-serena", type: "Lodge", description: "Luxury lodge with panoramic views of the Mara plains.", location: "Maasai Mara, Narok", priceRange: "KES 25,000 - 55,000", imageUrl: img("photo-1571896349842-33c89424de2d"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.4900, longitude: 35.3600 },
    { name: "Angama Mara", slug: "angama-mara", type: "Lodge", description: "Award-winning tented suites above the Mara Triangle.", location: "Maasai Mara, Narok", priceRange: "KES 90,000 - 180,000", imageUrl: img("photo-1566073771259-6a8506099945"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.4500, longitude: 35.2500 },
    { name: "Governors' Camp", slug: "governors-camp", type: "Tented Camp", description: "One of the original Mara camps on the river.", location: "Maasai Mara, Narok", priceRange: "KES 60,000 - 120,000", imageUrl: img("photo-1520250497591-112f2f40a3f4"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.5000, longitude: 35.3300 },
    { name: "Mara Sopa Lodge", slug: "mara-sopa", type: "Lodge", description: "Rustic family lodge with landscaped grounds.", location: "Maasai Mara, Narok", priceRange: "KES 18,000 - 35,000", imageUrl: img("photo-1582719508461-905c673771fd"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.5000, longitude: 35.4000 },
    { name: "Amboseli Serena Safari Lodge", slug: "amboseli-serena", type: "Lodge", description: "Acacia-framed lodge with Kilimanjaro views.", location: "Amboseli, Kajiado", priceRange: "KES 22,000 - 48,000", imageUrl: img("photo-1571003123894-1f0594d2b5d9"), destinationId: destinationMap["amboseli"].id, latitude: -2.6600, longitude: 37.2700 },
    { name: "Tortilis Camp", slug: "tortilis-camp", type: "Tented Camp", description: "Eco-friendly camp overlooking Kilimanjaro.", location: "Amboseli, Kajiado", priceRange: "KES 40,000 - 75,000", imageUrl: img("photo-1517824806704-9040b037703b"), destinationId: destinationMap["amboseli"].id, latitude: -2.7000, longitude: 37.2500 },
    { name: "Ol Tukai Lodge", slug: "ol-tukai", type: "Lodge", description: "Classic Amboseli lodge surrounded by fever trees.", location: "Amboseli, Kajiado", priceRange: "KES 26,000 - 52,000", imageUrl: img("photo-1564501049412-61c2a3083791"), destinationId: destinationMap["amboseli"].id, latitude: -2.6800, longitude: 37.3000 },
    { name: "Diani Sea Resort", slug: "diani-sea-resort", type: "Resort", description: "Beachfront resort with pools and water sports.", location: "Diani Beach, Kwale", priceRange: "KES 18,000 - 40,000", imageUrl: img("photo-1582719478250-c89cae4dc85b"), destinationId: destinationMap["diani-beach"].id, latitude: -4.2900, longitude: 39.5800 },
    { name: "Almanara Luxury Villas", slug: "almanara-villas", type: "Resort", description: "Private beachfront villas.", location: "Diani Beach, Kwale", priceRange: "KES 80,000 - 150,000", imageUrl: img("photo-1613490493576-7fde63acd811"), destinationId: destinationMap["diani-beach"].id, latitude: -4.3100, longitude: 39.5700 },
    { name: "The Sands at Nomad", slug: "sands-nomad", type: "Resort", description: "Boutique beach resort with award-winning restaurant.", location: "Diani Beach, Kwale", priceRange: "KES 30,000 - 65,000", imageUrl: img("photo-1520250497591-112f2f40a3f4"), destinationId: destinationMap["diani-beach"].id, latitude: -4.2800, longitude: 39.5900 },
    { name: "Sarova Lion Hill Lodge", slug: "sarova-lion-hill", type: "Lodge", description: "Plateau lodge overlooking Lake Nakuru.", location: "Lake Nakuru, Nakuru", priceRange: "KES 20,000 - 45,000", imageUrl: img("photo-1571896349842-33c89424de2d"), destinationId: destinationMap["lake-nakuru"].id, latitude: -0.3700, longitude: 36.0800 },
    { name: "Lake Nakuru Lodge", slug: "lake-nakuru-lodge", type: "Lodge", description: "Family-run lodge inside the park.", location: "Lake Nakuru, Nakuru", priceRange: "KES 16,000 - 32,000", imageUrl: img("photo-1566073771259-6a8506099945"), destinationId: destinationMap["lake-nakuru"].id, latitude: -0.3600, longitude: 36.0900 },
    { name: "The Norfolk Hotel", slug: "norfolk-hotel", type: "Hotel", description: "Historic 5-star in downtown Nairobi.", location: "Nairobi CBD", priceRange: "KES 15,000 - 35,000", imageUrl: img("photo-1564501049412-61c2a3083791"), destinationId: destinationMap["nairobi"].id, latitude: -1.2860, longitude: 36.8200 },
    { name: "Giraffe Manor", slug: "giraffe-manor", type: "Hotel", description: "Iconic hotel with Rothschild giraffes at breakfast.", location: "Langata, Nairobi", priceRange: "KES 120,000 - 220,000", imageUrl: img("photo-1547721064-da6cfb341d50"), destinationId: destinationMap["nairobi"].id, latitude: -1.3700, longitude: 36.7500 },
    { name: "Hemingways Nairobi", slug: "hemingways-nairobi", type: "Hotel", description: "Luxury suites in Karen with renowned spa.", location: "Karen, Nairobi", priceRange: "KES 55,000 - 95,000", imageUrl: img("photo-1582719478250-c89cae4dc85b"), destinationId: destinationMap["nairobi"].id, latitude: -1.3500, longitude: 36.7100 },
    { name: "Ashnil Aruba Lodge", slug: "ashnil-aruba", type: "Lodge", description: "Lodge over an active Tsavo East waterhole.", location: "Tsavo East, Taita-Taveta", priceRange: "KES 22,000 - 45,000", imageUrl: img("photo-1566073771259-6a8506099945"), destinationId: destinationMap["tsavo-east"].id, latitude: -3.0100, longitude: 38.4900 },
    { name: "Satao Camp", slug: "satao-camp", type: "Tented Camp", description: "Classic Tsavo East camp with waterhole.", location: "Tsavo East, Taita-Taveta", priceRange: "KES 28,000 - 55,000", imageUrl: img("photo-1517824806704-9040b037703b"), destinationId: destinationMap["tsavo-east"].id, latitude: -2.9900, longitude: 38.5100 },
    { name: "Kilaguni Serena Safari Lodge", slug: "kilaguni-serena", type: "Lodge", description: "Tsavo West's oldest lodge with Kilimanjaro views.", location: "Tsavo West, Taita-Taveta", priceRange: "KES 24,000 - 48,000", imageUrl: img("photo-1571896349842-33c89424de2d"), destinationId: destinationMap["tsavo-west"].id, latitude: -3.4200, longitude: 38.0000 },
    { name: "Samburu Sopa Lodge", slug: "samburu-sopa", type: "Lodge", description: "Rondavel lodge on a Samburu hilltop.", location: "Samburu National Reserve", priceRange: "KES 20,000 - 40,000", imageUrl: img("photo-1582719508461-905c673771fd"), destinationId: destinationMap["samburu"].id, latitude: 0.5900, longitude: 37.5400 },
    { name: "Elephant Bedroom Camp", slug: "elephant-bedroom-camp", type: "Tented Camp", description: "Intimate luxury camp on the Ewaso Ng'iro.", location: "Samburu National Reserve", priceRange: "KES 65,000 - 125,000", imageUrl: img("photo-1517824806704-9040b037703b"), destinationId: destinationMap["samburu"].id, latitude: 0.6000, longitude: 37.5200 },
    { name: "The Majlis Resort", slug: "majlis-lamu", type: "Resort", description: "Boutique beachfront on Manda Island.", location: "Manda Island, Lamu", priceRange: "KES 45,000 - 95,000", imageUrl: img("photo-1571003123894-1f0594d2b5d9"), destinationId: destinationMap["lamu"].id, latitude: -2.2700, longitude: 40.9000 },
    { name: "Peponi Hotel", slug: "peponi-hotel", type: "Hotel", description: "Legendary Swahili hotel on Shela beach.", location: "Shela, Lamu", priceRange: "KES 28,000 - 55,000", imageUrl: img("photo-1564501049412-61c2a3083791"), destinationId: destinationMap["lamu"].id, latitude: -2.2800, longitude: 40.9200 },
    { name: "Fairmont Mount Kenya Safari Club", slug: "fairmont-mt-kenya", type: "Hotel", description: "Historic resort at the foot of Mount Kenya.", location: "Nanyuki, Laikipia", priceRange: "KES 35,000 - 75,000", imageUrl: img("photo-1571003123894-1f0594d2b5d9"), destinationId: destinationMap["mount-kenya"].id, latitude: -0.0500, longitude: 37.0800 },
    { name: "Medina Palms", slug: "medina-palms", type: "Resort", description: "Contemporary Watamu suites on Turtle Bay.", location: "Watamu, Kilifi", priceRange: "KES 32,000 - 65,000", imageUrl: img("photo-1613490493576-7fde63acd811"), destinationId: destinationMap["watamu"].id, latitude: -3.3700, longitude: 40.0200 },
  ];

  for (const a of accommodations) {
    await prisma.accommodation.upsert({
      where: { slug: a.slug },
      update: { imageUrl: a.imageUrl, latitude: a.latitude, longitude: a.longitude },
      create: a,
    });
  }

  console.log(`✔ Seeded ${accommodations.length} accommodations`);
}

// ═══════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════

async function seedEvents() {
  const events = [
    { name: "Magical Kenya Travel Expo (MKTE) 2026", slug: "mkte-2026", description: "Kenya's premier travel trade show.", startDate: new Date("2026-10-06"), endDate: new Date("2026-10-08"), location: "KICC, Nairobi", latitude: -1.2921, longitude: 36.8219, imageUrl: img("photo-1540575467063-178a50c2df87"), featured: true, order: 1 },
    { name: "Wildebeest Migration Season", slug: "migration-season-2026", description: "The annual Great Migration.", startDate: new Date("2026-07-01"), endDate: new Date("2026-10-31"), location: "Maasai Mara", latitude: -1.4850, longitude: 35.3720, imageUrl: img("photo-1534177616072-ef7dc120449d"), featured: true, order: 2 },
    { name: "Lamu Cultural Festival", slug: "lamu-cultural-festival-2026", description: "A celebration of Swahili culture.", startDate: new Date("2026-11-20"), endDate: new Date("2026-11-23"), location: "Lamu Island", latitude: -2.2717, longitude: 40.9020, imageUrl: img("photo-1571407970349-bc81e7e96d47"), featured: false, order: 3 },
    { name: "Safari Rally Kenya 2026", slug: "safari-rally-2026", description: "Round 3 of the World Rally Championship.", startDate: new Date("2026-03-19"), endDate: new Date("2026-03-22"), location: "Naivasha", latitude: -0.7167, longitude: 36.4359, imageUrl: img("photo-1503376780353-7e6692767b70"), featured: true, order: 4 },
    { name: "Maralal International Camel Derby", slug: "maralal-camel-derby-2026", description: "Camel races and Samburu traditions.", startDate: new Date("2026-08-07"), endDate: new Date("2026-08-09"), location: "Maralal", latitude: 1.0967, longitude: 36.6972, imageUrl: img("photo-1509316785289-025f5b846b35"), featured: false, order: 5 },
    { name: "Mombasa Carnival", slug: "mombasa-carnival-2026", description: "Street parade on the coast.", startDate: new Date("2026-11-01"), endDate: new Date("2026-11-03"), location: "Mombasa", latitude: -4.0435, longitude: 39.6682, imageUrl: img("photo-1519046904884-53103b34b206"), featured: true, order: 6 },
    { name: "Nairobi International Trade Fair", slug: "nairobi-trade-fair-2026", description: "East Africa's largest trade exhibition.", startDate: new Date("2026-09-28"), endDate: new Date("2026-10-04"), location: "Jamhuri Park", latitude: -1.3010, longitude: 36.7680, imageUrl: img("photo-1540575467063-178a50c2df87"), featured: false, order: 7 },
    { name: "Kenya Music Festival 2026", slug: "kenya-music-festival-2026", description: "National music competition.", startDate: new Date("2026-08-10"), endDate: new Date("2026-08-15"), location: "Nairobi", latitude: -1.2921, longitude: 36.8219, imageUrl: img("photo-1493225457124-a3eb161ffa5f"), featured: false, order: 8 },
    { name: "Lake Turkana Festival", slug: "turkana-festival-2026", description: "Cultural diversity of the Turkana basin.", startDate: new Date("2026-06-12"), endDate: new Date("2026-06-14"), location: "Loiyangalani", latitude: 2.7500, longitude: 36.7167, imageUrl: img("photo-1516450360452-9312f5e86fc7"), featured: false, order: 9 },
    { name: "Rhino Charge 2026", slug: "rhino-charge-2026", description: "Off-road motorsport for rhino conservation.", startDate: new Date("2026-06-06"), endDate: null, location: "Laikipia", latitude: 0.0500, longitude: 36.8000, imageUrl: img("photo-1503376780353-7e6692767b70"), featured: false, order: 10 },
    { name: "Kenya Open Golf Championship", slug: "kenya-open-golf-2026", description: "Africa's oldest golf tournament.", startDate: new Date("2026-02-19"), endDate: new Date("2026-02-22"), location: "Karen Country Club", latitude: -1.3350, longitude: 36.7100, imageUrl: img("photo-1535131749006-b7f58c99034b"), featured: false, order: 11 },
    { name: "Kisumu Fish Festival", slug: "kisumu-fish-festival-2026", description: "Luo culture and Lake Victoria tilapia.", startDate: new Date("2026-12-11"), endDate: new Date("2026-12-13"), location: "Kisumu", latitude: -0.0917, longitude: 34.7680, imageUrl: img("photo-1544551763-46a013bb70d5"), featured: false, order: 12 },
    { name: "Lewa Safari Marathon", slug: "lewa-marathon-2026", description: "Marathon inside a conservancy.", startDate: new Date("2026-06-27"), endDate: null, location: "Lewa Conservancy", latitude: 0.1833, longitude: 37.4500, imageUrl: img("photo-1552674605-db6ffd4facb5"), featured: true, order: 13 },
    { name: "Malindi Cultural Festival", slug: "malindi-festival-2026", description: "Swahili, Italian, and Arab heritage.", startDate: new Date("2026-11-27"), endDate: new Date("2026-11-29"), location: "Malindi", latitude: -3.2192, longitude: 40.1169, imageUrl: img("photo-1519046904884-53103b34b206"), featured: false, order: 14 },
    { name: "Koroga Festival", slug: "koroga-festival-2026", description: "Music and food festival.", startDate: new Date("2026-04-05"), endDate: new Date("2026-04-05"), location: "Nairobi", latitude: -1.2921, longitude: 36.8219, imageUrl: img("photo-1493225457124-a3eb161ffa5f"), featured: false, order: 15 },
    { name: "Nairobi Restaurant Week", slug: "nairobi-restaurant-week-2026", description: "Fixed-price menus across Nairobi.", startDate: new Date("2026-02-06"), endDate: new Date("2026-02-16"), location: "Nairobi", latitude: -1.2921, longitude: 36.8219, imageUrl: img("photo-1414235077428-338989a2e8c0"), featured: false, order: 16 },
    { name: "Blankets & Wine", slug: "blankets-and-wine-2026", description: "Monthly open-air concert.", startDate: new Date("2026-01-25"), endDate: null, location: "Nairobi", latitude: -1.2921, longitude: 36.8219, imageUrl: img("photo-1493225457124-a3eb161ffa5f"), featured: false, order: 17 },
    { name: "Kili Marathon", slug: "kili-marathon-2026", description: "Marathon at the foot of Kilimanjaro.", startDate: new Date("2026-03-01"), endDate: null, location: "Amboseli", latitude: -2.6527, longitude: 37.2606, imageUrl: img("photo-1552674605-db6ffd4facb5"), featured: false, order: 18 },
    { name: "Kijani Festival", slug: "kijani-festival-2026", description: "Music and arts on Lake Naivasha.", startDate: new Date("2026-09-12"), endDate: new Date("2026-09-13"), location: "Lake Naivasha", latitude: -0.7667, longitude: 36.3667, imageUrl: img("photo-1470229722913-7c0e2dbbafd3"), featured: false, order: 19 },
    { name: "Marathon des Sables Kenya", slug: "marathon-des-sables-2026", description: "Ultra-marathon in the Chalbi Desert.", startDate: new Date("2026-07-18"), endDate: new Date("2026-07-24"), location: "Chalbi Desert", latitude: 2.7500, longitude: 37.5000, imageUrl: img("photo-1552674605-db6ffd4facb5"), featured: false, order: 20 },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: { imageUrl: e.imageUrl, latitude: e.latitude, longitude: e.longitude, featured: e.featured, order: e.order },
      create: e,
    });
  }

  console.log(`✔ Seeded ${events.length} events`);
}

// ═══════════════════════════════════════════════════════════════
// BLOG POSTS
// ═══════════════════════════════════════════════════════════════

async function seedBlogPosts() {
  // Keeps your existing 20 posts. Paste them here unchanged.
  // (Omitted for brevity — use your current array from seed.ts.)
  console.log("✔ Blog posts unchanged");
}

// ═══════════════════════════════════════════════════════════════
// USERS & COMPANY
// ═══════════════════════════════════════════════════════════════

async function seedUsersAndCompany() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const company = await prisma.company.upsert({
    where: { registrationNo: "TEST-CO-001" },
    update: {},
    create: {
      name: "Savannah Tours Ltd",
      registrationNo: "TEST-CO-001",
      kraPin: "P051234567X",
      tourismLicenceNo: "TL/2026/001",
    },
  });

  const users: {
    email: string;
    name: string;
    role:
      | "EMPLOYER"
      | "VERIFIER"
      | "COMMITTEE_MEMBER"
      | "PERMANENT_SECRETARY"
      | "ADMIN";
    companyId?: string;
  }[] = [
    { email: "employer@test.local", name: "Test Employer", role: "EMPLOYER", companyId: company.id },
    { email: "verifier@test.local", name: "Test Verifier", role: "VERIFIER" },
    { email: "committee@test.local", name: "Committee Member One", role: "COMMITTEE_MEMBER" },
    { email: "committee2@test.local", name: "Committee Member Two", role: "COMMITTEE_MEMBER" },
    { email: "committee3@test.local", name: "Committee Member Three", role: "COMMITTEE_MEMBER" },
    { email: "ps@test.local", name: "Test Permanent Secretary", role: "PERMANENT_SECRETARY" },
    { email: "admin@test.local", name: "Test Admin", role: "ADMIN" },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        passwordHash,
        companyId: u.companyId,
      },
    });
  }

  console.log(`✔ Seeded ${users.length} users + 1 company`);
  console.log(`   All test accounts use password: password123`);
}

// ═══════════════════════════════════════════════════════════════
// BUSINESSES & CUSTOMERS
// ═══════════════════════════════════════════════════════════════

async function seedBusinessesAndCustomers() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const now = Date.now();
  const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);

  const businessUsers = new Map<string, { id: string; name: string }>();

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
        businessType: b.businessType,
        verificationStatus: b.verificationStatus,
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

    for (const slug of b.accommodationSlugs) {
      await prisma.accommodation.updateMany({
        where: { slug },
        data: { businessId: user.id },
      });
    }

    for (const slug of b.packageSlugs) {
      await prisma.tourPackage.updateMany({
        where: { slug },
        data: { businessId: user.id },
      });
    }

    businessUsers.set(b.email, { id: user.id, name: b.businessName });
  }

  console.log(
    `✔ Seeded ${BUSINESS_SEEDS.length} businesses ` +
      `(${BUSINESS_SEEDS.filter((b) => b.verificationStatus === "APPROVED").length} approved, ` +
      `${BUSINESS_SEEDS.filter((b) => b.verificationStatus === "PENDING").length} pending)`
  );

  const customerUsers = new Map<string, { id: string; name: string }>();

  for (const c of CUSTOMER_SEEDS) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        name: c.name,
        role: "CUSTOMER",
        passwordHash,
      },
    });
    customerUsers.set(c.email, { id: user.id, name: c.name });
  }

  console.log(`✔ Seeded ${CUSTOMER_SEEDS.length} customers`);

  // ─── Sample messages and bookings ─────────────────────────
  const maraBusiness = businessUsers.get("mara@business.local")!;
  const dianiBusiness = businessUsers.get("diani@business.local")!;
  const savannahOperator = businessUsers.get("savannah@business.local")!;
  const wildtrailOperator = businessUsers.get("wildtrail@business.local")!;

  const customer1 = customerUsers.get("customer1@test.local")!;
  const customer2 = customerUsers.get("customer2@test.local")!;
  const customer3 = customerUsers.get("customer3@test.local")!;
  const customer4 = customerUsers.get("customer4@test.local")!;

  const maraSerena = await prisma.accommodation.findUnique({
    where: { slug: "mara-serena" },
    select: { id: true, name: true },
  });
  const dianiSea = await prisma.accommodation.findUnique({
    where: { slug: "diani-sea-resort" },
    select: { id: true, name: true },
  });
  const safariPackage = await prisma.tourPackage.findUnique({
    where: { slug: "10-day-bush-and-beach" },
    select: { id: true, title: true },
  });
  const watamuPackage = await prisma.tourPackage.findUnique({
    where: { slug: "5-day-watamu" },
    select: { id: true, title: true },
  });

  // ── Customer → Hotel thread ──
  if (maraSerena) {
    await prisma.messageThread.create({
      data: {
        customerId: customer1.id,
        businessId: maraBusiness.id,
        subject: "ACCOMMODATION",
        accommodationId: maraSerena.id,
        subjectLabel: maraSerena.name,
        createdAt: daysAgo(3),
        updatedAt: daysAgo(2),
        messages: {
          create: [
            { authorId: customer1.id, body: "Hi, I'm interested in a 3-night stay in early August. Do you have availability for two adults?", readByCustomer: true, readByBusiness: false, createdAt: daysAgo(3) },
            { authorId: maraBusiness.id, body: "Hello Amina, we have availability 5–8 August. Full board is included.", readByCustomer: false, readByBusiness: true, createdAt: daysAgo(2) },
          ],
        },
      },
    });
    console.log("   · Thread (Customer → Hotel: Mara / Amina)");
  }

  if (dianiSea) {
    await prisma.messageThread.create({
      data: {
        customerId: customer2.id,
        businessId: dianiBusiness.id,
        subject: "ACCOMMODATION",
        accommodationId: dianiSea.id,
        subjectLabel: dianiSea.name,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1),
        messages: {
          create: [
            { authorId: customer2.id, body: "Do you offer airport transfers from Moi International?", readByCustomer: true, readByBusiness: false, createdAt: daysAgo(1) },
          ],
        },
      },
    });
    console.log("   · Thread (Customer → Hotel: Diani / James)");
  }

  // ── Customer → Operator thread (Savannah) ──
  if (safariPackage) {
    await prisma.messageThread.create({
      data: {
        customerId: customer3.id,
        businessId: savannahOperator.id,
        subject: "TOUR_PACKAGE",
        tourPackageId: safariPackage.id,
        subjectLabel: safariPackage.title,
        createdAt: daysAgo(4),
        updatedAt: daysAgo(1),
        messages: {
          create: [
            { authorId: customer3.id, body: "Hello Savannah Tours — I'm interested in the 10-day bush & beach for two in October. Can you confirm availability?", readByCustomer: true, readByBusiness: true, createdAt: daysAgo(4) },
            { authorId: savannahOperator.id, body: "Hi Sophie — October is open. Airport pickup from JKIA is included. I'll send a detailed quote today.", readByCustomer: false, readByBusiness: true, createdAt: daysAgo(3) },
            { authorId: customer3.id, body: "Sounds great. Can we extend by two nights at Diani?", readByCustomer: true, readByBusiness: false, createdAt: daysAgo(1) },
          ],
        },
      },
    });
    console.log("   · Thread (Customer → Operator: Savannah / Sophie)");
  }

  // ── Customer → Operator thread (Wild Trail) ──
  if (watamuPackage) {
    await prisma.messageThread.create({
      data: {
        customerId: customer4.id,
        businessId: wildtrailOperator.id,
        subject: "TOUR_PACKAGE",
        tourPackageId: watamuPackage.id,
        subjectLabel: watamuPackage.title,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2),
        messages: {
          create: [
            { authorId: customer4.id, body: "Hi Wild Trail — my family of 4 is looking at the Watamu package. Is there a child rate?", readByCustomer: true, readByBusiness: false, createdAt: daysAgo(2) },
          ],
        },
      },
    });
    console.log("   · Thread (Customer → Operator: Wild Trail / David)");
  }

  // ── Bookings ───────────────────────────────────────────────
  if (maraSerena) {
    await prisma.booking.create({
      data: {
        customerId: customer1.id,
        businessId: maraBusiness.id,
        accommodationId: maraSerena.id,
        checkIn: new Date("2026-08-05"),
        checkOut: new Date("2026-08-08"),
        guests: 2,
        notes: "Room with a view if possible.",
        status: "REQUESTED",
        createdAt: daysAgo(3),
      },
    });
    console.log("   · Booking (Hotel: Mara Serena, REQUESTED)");
  }

  if (dianiSea) {
    await prisma.booking.create({
      data: {
        customerId: customer2.id,
        businessId: dianiBusiness.id,
        accommodationId: dianiSea.id,
        checkIn: new Date("2026-09-12"),
        checkOut: new Date("2026-09-17"),
        guests: 4,
        notes: "Family trip, two adults two children.",
        status: "CONFIRMED",
        respondedAt: daysAgo(0),
        responseNote: "Confirmed. Sea-facing family suite reserved.",
        createdAt: daysAgo(4),
      },
    });
    console.log("   · Booking (Hotel: Diani Sea Resort, CONFIRMED)");
  }

  if (safariPackage) {
    await prisma.booking.create({
      data: {
        customerId: customer3.id,
        businessId: savannahOperator.id,
        tourPackageId: safariPackage.id,
        checkIn: new Date("2026-10-06"),
        checkOut: new Date("2026-10-16"),
        guests: 2,
        notes: "Honeymoon trip. Please arrange romantic dinners where possible.",
        status: "REQUESTED",
        createdAt: daysAgo(2),
      },
    });
    console.log("   · Booking (Operator: Savannah Tours, REQUESTED)");
  }

  console.log(`✔ Seeded sample threads and bookings`);
}

// ═══════════════════════════════════════════════════════════════
// APPLICATIONS
// ═══════════════════════════════════════════════════════════════

async function seedApplications() {
  const employerRecord = await prisma.user.findUnique({
    where: { email: "employer@test.local" },
  });
  if (!employerRecord || !employerRecord.companyId) {
    console.warn("⚠ Skipping applications — employer or company not found");
    return;
  }
  const employer = employerRecord;
  const companyId = employerRecord.companyId;

  const verifier = await prisma.user.findUnique({
    where: { email: "verifier@test.local" },
  });
  const committeeMembers = await prisma.user.findMany({
    where: { role: "COMMITTEE_MEMBER" },
    select: { id: true },
    orderBy: { email: "asc" },
  });

  const now = Date.now();
  const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);

  type DocStage =
    | "draft"
    | "submitted"
    | "under-perusal"
    | "under-verification"
    | "awaiting-committee"
    | "awaiting-ps";

  type DocSpec = {
    slotId: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    perusalStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "NEEDS_RESUBMISSION";
    verificationStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "NEEDS_RESUBMISSION";
    reviewNotes?: string | null;
  };

  const standardDocs = (stage: DocStage): DocSpec[] => {
    const perusalFor = (): DocSpec["perusalStatus"] =>
      stage === "draft" || stage === "submitted" ? "PENDING" : "ACCEPTED";
    const verificationFor = (): DocSpec["verificationStatus"] =>
      stage === "draft" || stage === "submitted" || stage === "under-perusal"
        ? "PENDING"
        : "ACCEPTED";

    return [
      { slotId: "passport", fileName: "passport-biodata.pdf", mimeType: "application/pdf", sizeBytes: 1_240_000, perusalStatus: perusalFor(), verificationStatus: verificationFor(), reviewNotes: null },
      { slotId: "purpose-letter", fileName: "purpose-of-entry-letter.pdf", mimeType: "application/pdf", sizeBytes: 342_000, perusalStatus: perusalFor(), verificationStatus: verificationFor(), reviewNotes: stage === "under-perusal" ? "Addressed correctly to the Principal Secretary." : null },
      { slotId: "tourism-licence", fileName: "tourism-licence-2026.pdf", mimeType: "application/pdf", sizeBytes: 890_000, perusalStatus: perusalFor(), verificationStatus: verificationFor(), reviewNotes: null },
      { slotId: "certificate-incorporation", fileName: "certificate-of-incorporation.pdf", mimeType: "application/pdf", sizeBytes: 620_000, perusalStatus: perusalFor(), verificationStatus: verificationFor(), reviewNotes: null },
      { slotId: "kra-compliance", fileName: "kra-tax-compliance.pdf", mimeType: "application/pdf", sizeBytes: 415_000, perusalStatus: perusalFor(), verificationStatus: verificationFor(), reviewNotes: null },
    ];
  };

  async function createApplication(spec: {
    referenceNo: string;
    status: string;
    permitClass: "CLASS_G" | "CLASS_D" | "SPECIAL_PASS";
    applicationType: "FIRST_APPLICATION" | "RENEWAL";
    applicantName: string;
    applicantNationality: string;
    applicantPassportNo: string;
    applicantEmail: string;
    applicantPhone: string;
    purposeStatement: string;
    submittedDaysAgo: number | null;
    docsStage: DocStage;
  }) {
    const submittedAt =
      spec.submittedDaysAgo !== null ? daysAgo(spec.submittedDaysAgo) : null;

    const application = await prisma.application.upsert({
      where: { referenceNo: spec.referenceNo },
      update: {},
      create: {
        referenceNo: spec.referenceNo,
        status: spec.status as any,
        submittedById: employer.id,
        companyId: companyId,
        permitClass: spec.permitClass,
        applicationType: spec.applicationType,
        applicantName: spec.applicantName,
        applicantNationality: spec.applicantNationality,
        applicantPassportNo: spec.applicantPassportNo,
        applicantEmail: spec.applicantEmail,
        applicantPhone: spec.applicantPhone,
        purposeStatement: spec.purposeStatement,
        submittedAt,
        perusalStartedAt:
          spec.docsStage === "under-perusal" ||
          spec.docsStage === "under-verification" ||
          spec.docsStage === "awaiting-committee" ||
          spec.docsStage === "awaiting-ps"
            ? daysAgo((spec.submittedDaysAgo ?? 0) - 1)
            : null,
        verificationStartedAt:
          spec.docsStage === "under-verification" ||
          spec.docsStage === "awaiting-committee" ||
          spec.docsStage === "awaiting-ps"
            ? daysAgo((spec.submittedDaysAgo ?? 0) - 2)
            : null,
        committeeDecidedAt:
          spec.docsStage === "awaiting-ps"
            ? daysAgo((spec.submittedDaysAgo ?? 0) - 4)
            : null,
        createdAt: submittedAt ?? daysAgo(7),
      },
    });

    for (const d of standardDocs(spec.docsStage)) {
      await prisma.document.upsert({
        where: {
          applicationId_slotId_fileName: {
            applicationId: application.id,
            slotId: d.slotId,
            fileName: d.fileName,
          },
        },
        update: {},
        create: {
          applicationId: application.id,
          slotId: d.slotId,
          fileName: d.fileName,
          mimeType: d.mimeType,
          sizeBytes: d.sizeBytes,
          storageKey: `seed/${application.id}/${d.slotId}/${d.fileName}`,
          perusalStatus: d.perusalStatus,
          verificationStatus: d.verificationStatus,
          reviewNotes: d.reviewNotes ?? null,
        },
      });
    }

    const events: { type: string; actorId: string | null; message: string | null; daysAgo: number }[] = [];

    if (spec.docsStage !== "draft") {
      events.push({ type: "SUBMITTED", actorId: employer.id, message: `Application ${spec.referenceNo} submitted by Savannah Tours Ltd`, daysAgo: spec.submittedDaysAgo ?? 0 });
    }
    if (spec.docsStage === "under-perusal" || spec.docsStage === "under-verification" || spec.docsStage === "awaiting-committee" || spec.docsStage === "awaiting-ps") {
      events.push({ type: "PERUSAL_STARTED", actorId: verifier?.id ?? null, message: "Document perusal started", daysAgo: (spec.submittedDaysAgo ?? 0) - 1 });
    }
    if (spec.docsStage === "under-verification" || spec.docsStage === "awaiting-committee" || spec.docsStage === "awaiting-ps") {
      events.push({ type: "VERIFICATION_STARTED", actorId: verifier?.id ?? null, message: "All documents perused. Verification started.", daysAgo: (spec.submittedDaysAgo ?? 0) - 2 });
    }
    if (spec.docsStage === "awaiting-committee" || spec.docsStage === "awaiting-ps") {
      events.push({ type: "ESCALATED_TO_COMMITTEE", actorId: verifier?.id ?? null, message: "All documents verified. Escalated to committee.", daysAgo: (spec.submittedDaysAgo ?? 0) - 3 });
    }
    if (spec.docsStage === "awaiting-ps") {
      events.push({ type: "COMMITTEE_VOTE_CAST", actorId: committeeMembers[0]?.id ?? null, message: "Documents in order. Recommend approval.", daysAgo: (spec.submittedDaysAgo ?? 0) - 4 });
      events.push({ type: "COMMITTEE_VOTE_CAST", actorId: committeeMembers[1]?.id ?? null, message: "Concur with recommendation.", daysAgo: (spec.submittedDaysAgo ?? 0) - 4 });
      events.push({ type: "ESCALATED_TO_PS", actorId: committeeMembers[0]?.id ?? null, message: "Quorum met. Escalated to Permanent Secretary.", daysAgo: (spec.submittedDaysAgo ?? 0) - 4 });
    }

    for (const e of events) {
      await prisma.applicationEvent.create({
        data: {
          applicationId: application.id,
          type: e.type as any,
          actorId: e.actorId,
          message: e.message,
          createdAt: daysAgo(e.daysAgo),
        },
      });
    }

    if (spec.docsStage === "awaiting-ps") {
      for (const v of committeeMembers.slice(0, 2)) {
        await prisma.committeeVote.upsert({
          where: { applicationId_voterId: { applicationId: application.id, voterId: v.id } },
          update: {},
          create: { applicationId: application.id, voterId: v.id, decision: "APPROVE", comment: "Documents in order. Recommend approval." },
        });
      }
    }

    return application;
  }

  await createApplication({ referenceNo: "NTSP/EXP/2026/0001", status: "DRAFT", permitClass: "CLASS_D", applicationType: "FIRST_APPLICATION", applicantName: "Amara Okonkwo", applicantNationality: "Nigeria", applicantPassportNo: "A12345678", applicantEmail: "amara.okonkwo@example.com", applicantPhone: "+254 700 111 222", purposeStatement: "Employment as Head of Safari Operations. DRAFT — awaiting academic qualification uploads before submission.", submittedDaysAgo: null, docsStage: "draft" });
  await createApplication({ referenceNo: "NTSP/EXP/2026/0002", status: "SUBMITTED", permitClass: "CLASS_D", applicationType: "FIRST_APPLICATION", applicantName: "Chen Wei", applicantNationality: "China", applicantPassportNo: "E87654321", applicantEmail: "chen.wei@example.com", applicantPhone: "+254 700 222 333", purposeStatement: "Employment as Senior Wildlife Photographer at Savannah Tours Ltd. Contract offer attached, understudy programme in place.", submittedDaysAgo: 2, docsStage: "submitted" });
  await createApplication({ referenceNo: "NTSP/EXP/2026/0003", status: "UNDER_PERUSAL", permitClass: "CLASS_G", applicationType: "FIRST_APPLICATION", applicantName: "Marie Dubois", applicantNationality: "France", applicantPassportNo: "F11223344", applicantEmail: "marie.dubois@example.com", applicantPhone: "+254 700 333 444", purposeStatement: "Investing USD 250,000 in a boutique tented camp development in the Maasai Mara. Proof of capital provided.", submittedDaysAgo: 5, docsStage: "under-perusal" });
  await createApplication({ referenceNo: "NTSP/EXP/2026/0004", status: "UNDER_VERIFICATION", permitClass: "CLASS_D", applicationType: "RENEWAL", applicantName: "Rajesh Kumar", applicantNationality: "India", applicantPassportNo: "G55667788", applicantEmail: "rajesh.kumar@example.com", applicantPhone: "+254 700 444 555", purposeStatement: "Renewal of Class D permit for continued employment as Chief Safari Guide. All compliance documents current.", submittedDaysAgo: 8, docsStage: "under-verification" });
  await createApplication({ referenceNo: "NTSP/EXP/2026/0005", status: "AWAITING_COMMITTEE", permitClass: "SPECIAL_PASS", applicationType: "FIRST_APPLICATION", applicantName: "Sofia Alvarez", applicantNationality: "Spain", applicantPassportNo: "H99887766", applicantEmail: "sofia.alvarez@example.com", applicantPhone: "+254 700 555 666", purposeStatement: "Special Pass for a six-month assignment as a guest hospitality trainer. All documents verified.", submittedDaysAgo: 11, docsStage: "awaiting-committee" });
  await createApplication({ referenceNo: "NTSP/EXP/2026/0006", status: "AWAITING_PS_APPROVAL", permitClass: "CLASS_G", applicationType: "RENEWAL", applicantName: "Yuki Tanaka", applicantNationality: "Japan", applicantPassportNo: "J33445566", applicantEmail: "yuki.tanaka@example.com", applicantPhone: "+254 700 666 777", purposeStatement: "Renewal of Class G investor permit. Committee approved; awaiting final recommendation to the Ministry of Interior.", submittedDaysAgo: 15, docsStage: "awaiting-ps" });

  console.log("✔ Seeded 6 sample applications across workflow stages");
}

// ═══════════════════════════════════════════════════════════════
// INCIDENTS
// ═══════════════════════════════════════════════════════════════

async function seedIncidents() {
  const admin = await prisma.user.findUnique({
    where: { email: "admin@test.local" },
    select: { id: true },
  });
  if (!admin) {
    console.warn("⚠ Skipping incidents — admin user not found");
    return;
  }

  const now = Date.now();
  const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);

  type IncidentSeed = {
    referenceNo: string;
    status: "OPEN" | "UNDER_REVIEW" | "ESCALATED" | "RESOLVED" | "CLOSED";
    category: "WILDLIFE" | "SAFETY" | "OPERATOR" | "FACILITY" | "GUIDES" | "OTHER";
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

  const seeds: IncidentSeed[] = [
    { referenceNo: "INC/2026/0001", status: "OPEN", category: "WILDLIFE", title: "Injured elephant calf near Talek River", description: "Juvenile elephant with apparent snare wound.", location: "Talek River, Maasai Mara", reporterName: "Daniel Kiprop", reporterEmail: "d.kiprop@example.com", reporterPhone: "+254 722 111 222", occurredDaysAgo: 1, reportedDaysAgo: 1, reviewedDaysAgo: null, reviewNotes: null, escalatedTo: null, escalatedDaysAgo: null, attachments: [{ fileName: "injured-calf-01.jpg", mimeType: "image/jpeg", sizeBytes: 1_842_113 }] },
    { referenceNo: "INC/2026/0002", status: "OPEN", category: "SAFETY", title: "Missing lifejackets on dhow cruise", description: "Dhow operating from Diani Beach had no lifejackets.", location: "Kongo River mouth, Diani", reporterName: null, reporterEmail: null, reporterPhone: null, occurredDaysAgo: 2, reportedDaysAgo: 2, reviewedDaysAgo: null, reviewNotes: null, escalatedTo: null, escalatedDaysAgo: null, attachments: [] },
    { referenceNo: "INC/2026/0003", status: "OPEN", category: "OPERATOR", title: "Operator driving off-road in Nairobi NP", description: "Safari vehicle off designated tracks.", location: "Nairobi National Park", reporterName: "Mercy Wambui", reporterEmail: "mercy.w@example.com", reporterPhone: "+254 733 444 555", occurredDaysAgo: 3, reportedDaysAgo: 3, reviewedDaysAgo: null, reviewNotes: null, escalatedTo: null, escalatedDaysAgo: null, attachments: [{ fileName: "vehicle-plate.jpg", mimeType: "image/jpeg", sizeBytes: 982_114 }] },
    { referenceNo: "INC/2026/0004", status: "OPEN", category: "GUIDES", title: "Unlicensed guide at Hell's Gate", description: "Guide could not produce a valid KPSGA licence.", location: "Hell's Gate National Park", reporterName: "Peter Njenga", reporterEmail: "pnjenga@example.com", reporterPhone: null, occurredDaysAgo: 4, reportedDaysAgo: 3, reviewedDaysAgo: null, reviewNotes: null, escalatedTo: null, escalatedDaysAgo: null, attachments: [] },
    { referenceNo: "INC/2026/0005", status: "UNDER_REVIEW", category: "FACILITY", title: "Unsafe staircase at Lake Nakuru lodge", description: "Wooden staircase with missing planks.", location: "Lake Nakuru NP", reporterName: "Grace Otieno", reporterEmail: "grace.otieno@example.com", reporterPhone: "+254 711 888 999", occurredDaysAgo: 6, reportedDaysAgo: 5, reviewedDaysAgo: 3, reviewNotes: "Lodge management contacted.", escalatedTo: null, escalatedDaysAgo: null, attachments: [{ fileName: "staircase.jpg", mimeType: "image/jpeg", sizeBytes: 1_344_221 }] },
    { referenceNo: "INC/2026/0006", status: "UNDER_REVIEW", category: "WILDLIFE", title: "Turtle nest disturbance at Watamu", description: "Nest markers flattened repeatedly.", location: "Watamu Marine NP", reporterName: null, reporterEmail: "turtle-watch@example.org", reporterPhone: null, occurredDaysAgo: 8, reportedDaysAgo: 7, reviewedDaysAgo: 4, reviewNotes: "Assigned to coast region.", escalatedTo: null, escalatedDaysAgo: null, attachments: [{ fileName: "flattened-nest.jpg", mimeType: "image/jpeg", sizeBytes: 2_010_441 }] },
    { referenceNo: "INC/2026/0007", status: "ESCALATED", category: "SAFETY", title: "Suspected wildlife poisoning", description: "Dead vultures and jackal around a waterhole.", location: "Amboseli", reporterName: "Big Life Foundation", reporterEmail: "field@example.org", reporterPhone: "+254 720 100 200", occurredDaysAgo: 12, reportedDaysAgo: 11, reviewedDaysAgo: 10, reviewNotes: "Escalated to KWS forensics.", escalatedTo: "Kenya Wildlife Service", escalatedDaysAgo: 9, attachments: [{ fileName: "vultures.jpg", mimeType: "image/jpeg", sizeBytes: 3_104_998 }] },
    { referenceNo: "INC/2026/0008", status: "RESOLVED", category: "OPERATOR", title: "Abandoned safari vehicle", description: "Vehicle blocking one lane.", location: "Maasai Mara", reporterName: "John Kamau", reporterEmail: null, reporterPhone: "+254 714 555 444", occurredDaysAgo: 18, reportedDaysAgo: 18, reviewedDaysAgo: 17, reviewNotes: "Vehicle recovered. Written warning issued.", escalatedTo: null, escalatedDaysAgo: null, attachments: [{ fileName: "blocked-road.jpg", mimeType: "image/jpeg", sizeBytes: 1_540_221 }] },
    { referenceNo: "INC/2026/0009", status: "RESOLVED", category: "FACILITY", title: "Broken viewing platform at Nyahururu Falls", description: "Platform rotted through.", location: "Nyahururu Falls", reporterName: "Sarah Mwangi", reporterEmail: "s.mwangi@example.com", reporterPhone: null, occurredDaysAgo: 24, reportedDaysAgo: 22, reviewedDaysAgo: 20, reviewNotes: "Fenced off. No injuries.", escalatedTo: null, escalatedDaysAgo: null, attachments: [] },
    { referenceNo: "INC/2026/0010", status: "CLOSED", category: "OTHER", title: "Duplicate report — broken platform", description: "Duplicate of INC/2026/0009.", location: "Nyahururu Falls", reporterName: null, reporterEmail: null, reporterPhone: null, occurredDaysAgo: null, reportedDaysAgo: 20, reviewedDaysAgo: 19, reviewNotes: "Closed as duplicate.", escalatedTo: null, escalatedDaysAgo: null, attachments: [] },
  ];

  let created = 0, updated = 0;

  for (const s of seeds) {
    const reportedAt = daysAgo(s.reportedDaysAgo);
    const occurredAt = s.occurredDaysAgo !== null ? daysAgo(s.occurredDaysAgo) : null;
    const reviewedAt = s.reviewedDaysAgo !== null ? daysAgo(s.reviewedDaysAgo) : null;
    const escalatedAt = s.escalatedDaysAgo !== null ? daysAgo(s.escalatedDaysAgo) : null;

    const existing = await prisma.incident.findUnique({
      where: { referenceNo: s.referenceNo },
      select: { id: true },
    });

    if (existing) {
      await prisma.incident.update({
        where: { id: existing.id },
        data: {
          status: s.status, category: s.category, title: s.title, description: s.description,
          location: s.location, reporterName: s.reporterName, reporterEmail: s.reporterEmail, reporterPhone: s.reporterPhone,
          occurredAt, reportedAt,
          reviewedById: reviewedAt ? admin.id : null, reviewedAt, reviewNotes: s.reviewNotes,
          escalatedTo: s.escalatedTo, escalatedAt, escalatedById: escalatedAt ? admin.id : null,
        },
      });
      updated++;
    } else {
      await prisma.incident.create({
        data: {
          referenceNo: s.referenceNo, status: s.status, category: s.category, title: s.title, description: s.description,
          location: s.location, reporterName: s.reporterName, reporterEmail: s.reporterEmail, reporterPhone: s.reporterPhone,
          occurredAt, reportedAt,
          reviewedById: reviewedAt ? admin.id : null, reviewedAt, reviewNotes: s.reviewNotes,
          escalatedTo: s.escalatedTo, escalatedAt, escalatedById: escalatedAt ? admin.id : null,
          attachments: {
            create: s.attachments.map((a) => ({
              fileName: a.fileName, mimeType: a.mimeType, sizeBytes: a.sizeBytes,
              storageKey: `seed/incidents/${s.referenceNo}/${a.fileName}`,
            })),
          },
        },
      });
      created++;
    }
  }

  console.log(`✔ Seeded ${seeds.length} incidents (${created} created, ${updated} updated)`);
}

// ═══════════════════════════════════════════════════════════════
// INVESTOR INQUIRIES
// ═══════════════════════════════════════════════════════════════

async function seedInvestorInquiries() {
  const admin = await prisma.user.findUnique({
    where: { email: "admin@test.local" },
    select: { id: true },
  });
  if (!admin) {
    console.warn("⚠ Skipping investor inquiries — admin user not found");
    return;
  }

  const now = Date.now();
  const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);

  type InquirySeed = {
    referenceNo: string;
    status: "NEW" | "IN_REVIEW" | "CONTACTED" | "CLOSED";
    fullName: string;
    email: string;
    phone: string | null;
    company: string | null;
    country: string | null;
    investorType: "INDIVIDUAL" | "COMPANY" | "FUND" | "FAMILY_OFFICE" | "OTHER";
    interests: ("LODGE_RESORT" | "COASTAL" | "ECO_TOURISM" | "MICE" | "CULTURAL_HERITAGE" | "INFRASTRUCTURE" | "DOMESTIC_LEISURE" | "TECHNOLOGY" | "OTHER")[];
    scale: "UNDER_10M" | "FROM_10M_50M" | "FROM_50M_100M" | "FROM_100M_500M" | "ABOVE_500M" | "PREFER_NOT_TO_SAY" | null;
    message: string;
    createdDaysAgo: number;
    reviewedDaysAgo: number | null;
    reviewNotes: string | null;
  };

  const seeds: InquirySeed[] = [
    { referenceNo: "INV/2026/0001", status: "IN_REVIEW", fullName: "Jonathan Mwangi", email: "j.mwangi@serenainvest.example", phone: "+254 722 500 100", company: "Serena Capital Partners", country: "Kenya", investorType: "INDIVIDUAL", interests: ["LODGE_RESORT", "ECO_TOURISM"], scale: "FROM_10M_50M", message: "Exploring a luxury tented-camp development near the Mara Triangle.", createdDaysAgo: 2, reviewedDaysAgo: 1, reviewNotes: "Forwarded to TFC." },
    { referenceNo: "INV/2026/0002", status: "CONTACTED", fullName: "Fatima Al-Rashid", email: "f.alrashid@gulfheritage.example", phone: "+971 50 555 0100", company: "Gulf Heritage Holdings", country: "UAE", investorType: "FAMILY_OFFICE", interests: ["LODGE_RESORT", "COASTAL", "CULTURAL_HERITAGE"], scale: "ABOVE_500M", message: "Evaluating heritage-listed properties on the Lamu and Malindi coastlines.", createdDaysAgo: 8, reviewedDaysAgo: 5, reviewNotes: "Met delegation in Nairobi." },
    { referenceNo: "INV/2026/0003", status: "NEW", fullName: "Erik Lindqvist", email: "erik@nordicimpact.example", phone: "+46 70 555 0123", company: "Nordic Impact Capital", country: "Sweden", investorType: "FUND", interests: ["ECO_TOURISM", "TECHNOLOGY"], scale: "FROM_100M_500M", message: "USD 350M fund focused on sustainable tourism in Sub-Saharan Africa.", createdDaysAgo: 1, reviewedDaysAgo: null, reviewNotes: null },
    { referenceNo: "INV/2026/0004", status: "NEW", fullName: "Peter Chen", email: "peter.chen@voyagerhotels.example", phone: "+65 9123 4567", company: "Voyager Hotels Group", country: "Singapore", investorType: "COMPANY", interests: ["DOMESTIC_LEISURE", "COASTAL"], scale: "FROM_10M_50M", message: "Mid-scale business and leisure hotels in Nairobi and Mombasa.", createdDaysAgo: 3, reviewedDaysAgo: null, reviewNotes: null },
    { referenceNo: "INV/2026/0005", status: "IN_REVIEW", fullName: "Sarah Otieno", email: "s.otieno@lakevictoriaagri.example", phone: "+254 733 800 400", company: "Lake Victoria Agri-Tourism Ltd", country: "Kenya", investorType: "COMPANY", interests: ["DOMESTIC_LEISURE", "CULTURAL_HERITAGE"], scale: "UNDER_10M", message: "Farm-stay and cultural-experience product targeting the domestic market.", createdDaysAgo: 5, reviewedDaysAgo: 3, reviewNotes: "Referred to KTB." },
    { referenceNo: "INV/2026/0006", status: "CLOSED", fullName: "Ahmed Hassan", email: "ahmed.hassan@redseacapital.example", phone: "+20 100 555 0200", company: "Red Sea Capital", country: "Egypt", investorType: "FUND", interests: ["MICE", "INFRASTRUCTURE"], scale: "FROM_50M_100M", message: "MICE infrastructure in East Africa — 3,000-seat conference facility in Nairobi.", createdDaysAgo: 20, reviewedDaysAgo: 15, reviewNotes: "Declined — no matching PPP framework." },
    { referenceNo: "INV/2026/0007", status: "NEW", fullName: "Amina Yusuf", email: "a.yusuf@eastafricatrust.example", phone: "+254 711 200 300", company: "East Africa Conservation Trust", country: "Kenya", investorType: "FAMILY_OFFICE", interests: ["ECO_TOURISM", "CULTURAL_HERITAGE"], scale: "FROM_10M_50M", message: "Eco-lodge and Maasai cultural-immersion project on community land adjacent to Amboseli.", createdDaysAgo: 4, reviewedDaysAgo: null, reviewNotes: null },
    { referenceNo: "INV/2026/0008", status: "CONTACTED", fullName: "Marco Rossi", email: "marco.rossi@adriatico-hospitality.example", phone: "+39 340 555 7788", company: "Adriatico Hospitality", country: "Italy", investorType: "COMPANY", interests: ["COASTAL", "LODGE_RESORT"], scale: "FROM_100M_500M", message: "Boutique coastal properties in Diani and Watamu — first Sub-Saharan African acquisition.", createdDaysAgo: 6, reviewedDaysAgo: 2, reviewNotes: "Sent the coastal tourism investment dossier." },
  ];

  let created = 0, updated = 0;

  for (const s of seeds) {
    const reviewedAt = s.reviewedDaysAgo !== null ? daysAgo(s.reviewedDaysAgo) : null;
    const createdAt = daysAgo(s.createdDaysAgo);

    const existing = await prisma.investorInquiry.findUnique({
      where: { referenceNo: s.referenceNo },
      select: { id: true },
    });

    if (existing) {
      await prisma.investorInquiry.update({
        where: { id: existing.id },
        data: {
          status: s.status, fullName: s.fullName, email: s.email, phone: s.phone,
          company: s.company, country: s.country,
          investorType: s.investorType, interests: s.interests, scale: s.scale,
          message: s.message,
          reviewedById: reviewedAt ? admin.id : null, reviewedAt, reviewNotes: s.reviewNotes,
        },
      });
      updated++;
    } else {
      await prisma.investorInquiry.create({
        data: {
          referenceNo: s.referenceNo, status: s.status,
          fullName: s.fullName, email: s.email, phone: s.phone, company: s.company, country: s.country,
          investorType: s.investorType, interests: s.interests, scale: s.scale,
          message: s.message,
          reviewedById: reviewedAt ? admin.id : null, reviewedAt, reviewNotes: s.reviewNotes,
          createdAt,
        },
      });
      created++;
    }
  }

  console.log(`✔ Seeded ${seeds.length} investor inquiries (${created} created, ${updated} updated)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });