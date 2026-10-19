// prisma/seed.ts
import "dotenv/config";
import { existsSync } from "fs";
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

  console.log("✅ Seed complete.");
}

// ═══════════════════════════════════════════════════════════════
// BUSINESS & CUSTOMER SEEDS
// ═══════════════════════════════════════════════════════════════

const BUSINESS_SEEDS = [
  {
    email: "mara@business.local",
    name: "Mara Serena Manager",
    businessName: "Mara Serena Safari Lodges",
    contactEmail: "bookings@mara-serena.example",
    contactPhone: "+254 700 100 100",
    description:
      "A collection of lodges and camps in the Maasai Mara, offering full-board game drive packages.",
    verificationStatus: "APPROVED" as const,
    accommodationSlugs: ["mara-serena", "mara-sopa", "governors-camp"],
    packageSlugs: ["3-day-maasai-mara", "4-day-mara-camping"],
  },
  {
    email: "diani@business.local",
    name: "Diani Resorts Manager",
    businessName: "Diani Beach Resorts",
    contactEmail: "reservations@diani-resorts.example",
    contactPhone: "+254 700 200 200",
    description:
      "Beachfront resorts and villas on Kenya's award-winning Diani Beach, with snorkeling and dhow cruise packages.",
    verificationStatus: "APPROVED" as const,
    accommodationSlugs: ["diani-sea-resort", "almanara-villas", "sands-nomad"],
    packageSlugs: ["5-day-diani-retreat"],
  },
  {
    email: "savannah@business.local",
    name: "Savannah Tours Operator",
    businessName: "Savannah Tours Ltd",
    contactEmail: "info@savannah-tours.example",
    contactPhone: "+254 700 300 300",
    description:
      "A safari tour operator running scheduled and custom itineraries across Kenya's national parks and reserves.",
    verificationStatus: "APPROVED" as const,
    accommodationSlugs: [],
    packageSlugs: [
      "7-day-kenya-highlights",
      "10-day-bush-and-beach",
      "5-day-samburu-laikipia",
      "8-day-southern-kenya",
      "6-day-mount-kenya-trek",
    ],
  },
  {
    email: "amboseli@business.local",
    name: "Amboseli Lodges Manager",
    businessName: "Amboseli Lodges",
    contactEmail: "stay@amboseli-lodges.example",
    contactPhone: "+254 700 400 400",
    description:
      "Lodges and camps with views of Mount Kilimanjaro in Amboseli National Park.",
    verificationStatus: "PENDING" as const,
    accommodationSlugs: ["amboseli-serena", "tortilis-camp", "ol-tukai"],
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
// DESTINATIONS — 20 records
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
      update: {
        imageUrl: d.imageUrl,
        latitude: d.latitude,
        longitude: d.longitude,
      },
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
// ATTRACTIONS — 23 records
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
      update: {
        imageUrl: a.imageUrl,
        latitude: a.latitude,
        longitude: a.longitude,
      },
      create: a,
    });
  }

  console.log(`✔ Seeded ${attractions.length} attractions`);
}

// ═══════════════════════════════════════════════════════════════
// TOUR PACKAGES — 22 records
// ═══════════════════════════════════════════════════════════════

async function seedTourPackages() {
  const destinationMap = await getDestinationMap();

  const packages = [
    { title: "3-Day Maasai Mara Safari", slug: "3-day-maasai-mara", summary: "Game drives in the world's most famous wildlife reserve.", description: "Enjoy three days of thrilling game drives in the Maasai Mara, with chances to see lions, elephants, and the Big Five. Includes full-board accommodation in a safari lodge, park fees, and a professional guide.", priceKes: 37060, durationDays: 3, imageUrl: img("photo-1516426122078-c23e76319801"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.4850, longitude: 35.3720, featured: true },
    { title: "12-Hour Amboseli Day Trip", slug: "amboseli-day-trip", summary: "A quick escape to see elephants against Mount Kilimanjaro.", description: "Perfect for travellers short on time. Fly from Nairobi to Amboseli, enjoy a full-day game drive, lunch, and return the same evening.", priceKes: 65500, durationDays: 1, imageUrl: img("photo-1547970810-dc1eac37d174"), destinationId: destinationMap["amboseli"].id, latitude: -2.6527, longitude: 37.2606, featured: true },
    { title: "5-Day Diani Beach Retreat", slug: "5-day-diani-retreat", summary: "Relax on Kenya's best beach with snorkeling and dhow cruises.", description: "Five days of sun, sand, and sea at Diani Beach. Includes snorkeling at Kisite Marine Park, a sunset dhow cruise, and beachfront resort accommodation.", priceKes: 89999, durationDays: 5, imageUrl: img("photo-1507525428034-b723cf961d3e"), destinationId: destinationMap["diani-beach"].id, latitude: -4.2927, longitude: 39.5794, featured: false },
    { title: "Nairobi City & Safari Experience", slug: "nairobi-city-safari", summary: "Explore Nairobi's culture, wildlife, and cuisine in 2 days.", description: "Visit Nairobi National Park, the Giraffe Centre, the David Sheldrick Elephant Orphanage, and the Maasai Market. Includes city hotel accommodation and meals.", priceKes: 28500, durationDays: 2, imageUrl: img("photo-1611348586804-61bf6c080437"), destinationId: destinationMap["nairobi"].id, latitude: -1.2921, longitude: 36.8219, featured: false },
    { title: "Lake Nakuru & Rift Valley Explorer", slug: "nakuru-rift-valley", summary: "Flamingos, rhinos, and stunning Rift Valley scenery.", description: "A 2-day safari to Lake Nakuru National Park, known for its flamingo flocks and rhino sanctuary. Includes a stop at the Great Rift Valley viewpoint.", priceKes: 32000, durationDays: 2, imageUrl: img("photo-1518709268805-4e9042af9f23"), destinationId: destinationMap["lake-nakuru"].id, latitude: -0.3667, longitude: 36.0833, featured: false },
    { title: "7-Day Kenya Highlights Safari", slug: "7-day-kenya-highlights", summary: "Mara, Nakuru, and Amboseli in one classic week-long trip.", description: "The perfect introduction to Kenya's safari circuit. Seven days visiting Maasai Mara, Lake Nakuru, and Amboseli, with all park fees, full-board lodging, and a professional driver-guide.", priceKes: 189000, durationDays: 7, imageUrl: img("photo-1516426122078-c23e76319801"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.4850, longitude: 35.3720, featured: true },
    { title: "10-Day Bush & Beach", slug: "10-day-bush-and-beach", summary: "Safari, then sand — the classic Kenyan honeymoon.", description: "Four days of game drives in the Mara and Amboseli, followed by five days of beachside relaxation at Diani. Includes internal flights and all transfers.", priceKes: 245000, durationDays: 10, imageUrl: img("photo-1507525428034-b723cf961d3e"), destinationId: destinationMap["diani-beach"].id, latitude: -4.2927, longitude: 39.5794, featured: true },
    { title: "4-Day Tsavo East & West", slug: "4-day-tsavo", summary: "Red elephants, lava flows, and Mzima Springs.", description: "Explore both halves of Tsavo — from the red elephants of Tsavo East to the volcanic landscapes and Mzima Springs of Tsavo West.", priceKes: 78000, durationDays: 4, imageUrl: img("photo-1564760055775-d63b17a55c44"), destinationId: destinationMap["tsavo-east"].id, latitude: -3.0000, longitude: 38.5000, featured: false },
    { title: "5-Day Samburu & Laikipia", slug: "5-day-samburu-laikipia", summary: "Northern Kenya's Special Five and community conservancies.", description: "Discover the arid beauty of Samburu and the community-run conservancies of Laikipia, home to the Samburu Special Five and Kenya's largest elephant populations.", priceKes: 132000, durationDays: 5, imageUrl: img("photo-1547471080-7cc2caa01a7e"), destinationId: destinationMap["samburu"].id, latitude: 0.5833, longitude: 37.5333, featured: true },
    { title: "4-Day Lamu Cultural Escape", slug: "4-day-lamu", summary: "Swahili history, dhow sailing, and quiet beaches.", description: "Explore the UNESCO-listed Lamu Old Town, sail by traditional dhow to Shela, and unwind on untouched Indian Ocean beaches.", priceKes: 68000, durationDays: 4, imageUrl: img("photo-1571407970349-bc81e7e96d47"), destinationId: destinationMap["lamu"].id, latitude: -2.2717, longitude: 40.9020, featured: false },
    { title: "6-Day Mount Kenya Trek", slug: "6-day-mount-kenya-trek", summary: "Summit Point Lenana via the Sirimon and Chogoria routes.", description: "A six-day trek through alpine meadows and glacial valleys, summiting Point Lenana (4,985m) at sunrise. Includes mountain huts, guides, and porters.", priceKes: 95000, durationDays: 6, imageUrl: img("photo-1519681393784-d120267933ba"), destinationId: destinationMap["mount-kenya"].id, latitude: -0.1521, longitude: 37.3084, featured: false },
    { title: "3-Day Hell's Gate & Naivasha", slug: "3-day-hells-gate-naivasha", summary: "Cycle among wildlife and boat past hippos.", description: "Cycle through Hell's Gate National Park alongside zebras and giraffes, then take a boat safari on Lake Naivasha to see hippos and fish eagles.", priceKes: 42000, durationDays: 3, imageUrl: img("photo-1501785888041-af3ef285b470"), destinationId: destinationMap["hells-gate"].id, latitude: -0.9167, longitude: 36.3167, featured: false },
    { title: "5-Day Watamu Beach & Marine Park", slug: "5-day-watamu", summary: "Snorkeling, turtles, and the Italian-inflected coast.", description: "Explore the protected coral gardens of Watamu Marine National Park, watch turtles nest, and enjoy the laid-back coastal town of Watamu.", priceKes: 82000, durationDays: 5, imageUrl: img("photo-1544551763-77ef2d0cfc6c"), destinationId: destinationMap["watamu"].id, latitude: -3.3667, longitude: 40.0167, featured: false },
    { title: "2-Day Lake Naivasha Weekend", slug: "2-day-naivasha-weekend", summary: "The perfect weekend escape from Nairobi.", description: "A quick escape to the Rift Valley — boat safaris, Crescent Island walks, and sundowners overlooking the lake.", priceKes: 34000, durationDays: 2, imageUrl: img("photo-1544551763-46a013bb70d5"), destinationId: destinationMap["lake-naivasha"].id, latitude: -0.7667, longitude: 36.3667, featured: false },
    { title: "3-Day Kakamega Forest Explorer", slug: "3-day-kakamega-forest", summary: "Kenya's only tropical rainforest.", description: "Three days in Kenya's last remaining tropical rainforest, with guided nature walks, birdwatching, and butterfly spotting.", priceKes: 45000, durationDays: 3, imageUrl: img("photo-1441974231531-c6227db76b6e"), destinationId: destinationMap["kakamega-forest"].id, latitude: 0.2500, longitude: 34.8667, featured: false },
    { title: "4-Day Lake Baringo & Bogoria", slug: "4-day-baringo-bogoria", summary: "Freshwater and alkaline lakes of the northern Rift.", description: "Visit two contrasting Rift Valley lakes — Baringo's birdlife and crocodiles, and Bogoria's hot springs and flamingos.", priceKes: 62000, durationDays: 4, imageUrl: img("photo-1500375592092-40eb2168fd21"), destinationId: destinationMap["lake-baringo"].id, latitude: 0.4667, longitude: 36.1000, featured: false },
    { title: "8-Day Best of Southern Kenya", slug: "8-day-southern-kenya", summary: "Nairobi, Amboseli, Tsavo, and Diani in one trip.", description: "A comprehensive southern circuit — Nairobi's cultural sites, Amboseli's elephants, Tsavo's red landscapes, and Diani's beaches.", priceKes: 198000, durationDays: 8, imageUrl: img("photo-1507525428034-b723cf961d3e"), destinationId: destinationMap["diani-beach"].id, latitude: -4.2927, longitude: 39.5794, featured: true },
    { title: "3-Day Malindi & Gedi Ruins", slug: "3-day-malindi-gedi", summary: "Historic Swahili coast and marine park.", description: "Discover Malindi's Italian-Swahili culture, the ancient Gedi ruins, and the coral gardens of Malindi Marine National Park.", priceKes: 52000, durationDays: 3, imageUrl: img("photo-1519046904884-53103b34b206"), destinationId: destinationMap["malindi"].id, latitude: -3.2192, longitude: 40.1169, featured: false },
    { title: "5-Day Samburu Flying Safari", slug: "5-day-samburu-flying", summary: "Fly-in luxury safari to northern Kenya.", description: "Skip the long drive — fly directly from Nairobi to Samburu for a luxury tented-camp experience with guided game drives.", priceKes: 225000, durationDays: 5, imageUrl: img("photo-1547471080-7cc2caa01a7e"), destinationId: destinationMap["samburu"].id, latitude: 0.5833, longitude: 37.5333, featured: false },
    { title: "2-Day Nairobi National Park & City", slug: "2-day-nairobi-park-city", summary: "Wildlife and culture in a weekend.", description: "A compact weekend pairing Nairobi National Park's lions and rhinos with the Giraffe Centre, Karen Blixen Museum, and Maasai Market.", priceKes: 26000, durationDays: 2, imageUrl: img("photo-1547471080-7cc2caa01a7e"), destinationId: destinationMap["nairobi-national-park"].id, latitude: -1.3733, longitude: 36.8583, featured: false },
    { title: "4-Day Maasai Mara Budget Camping", slug: "4-day-mara-camping", summary: "The Mara experience on a budget.", description: "Four days in the Mara staying at a comfortable tented camp, with shared game drives and all park fees included.", priceKes: 58000, durationDays: 4, imageUrl: img("photo-1521405924368-64c5b84bec60"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.4850, longitude: 35.3720, featured: false },
    { title: "6-Day Honeymoon Safari & Diani", slug: "6-day-honeymoon", summary: "Intimate safari nights and ocean days.", description: "Three nights in a private safari camp in the Mara, then three nights at a luxury beachfront resort on Diani. Includes private guide and romantic dinners.", priceKes: 320000, durationDays: 6, imageUrl: img("photo-1516426122078-c23e76319801"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.4850, longitude: 35.3720, featured: false },
  ];

  for (const p of packages) {
    await prisma.tourPackage.upsert({
      where: { slug: p.slug },
      update: {
        imageUrl: p.imageUrl,
        latitude: p.latitude,
        longitude: p.longitude,
      },
      create: p,
    });
  }

  console.log(`✔ Seeded ${packages.length} tour packages`);
}

// ═══════════════════════════════════════════════════════════════
// ACCOMMODATIONS — 24 records
// ═══════════════════════════════════════════════════════════════

async function seedAccommodations() {
  const destinationMap = await getDestinationMap();

  const accommodations = [
    { name: "Mara Serena Safari Lodge", slug: "mara-serena", type: "Lodge", description: "Luxury lodge perched on a hill with panoramic views of the Mara plains.", location: "Maasai Mara, Narok", priceRange: "KES 25,000 - 55,000", imageUrl: img("photo-1571896349842-33c89424de2d"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.4900, longitude: 35.3600 },
    { name: "Angama Mara", slug: "angama-mara", type: "Lodge", description: "Award-winning tented suites suspended above the Great Rift Valley with views over the Mara Triangle.", location: "Maasai Mara, Narok", priceRange: "KES 90,000 - 180,000", imageUrl: img("photo-1566073771259-6a8506099945"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.4500, longitude: 35.2500 },
    { name: "Governors' Camp", slug: "governors-camp", type: "Tented Camp", description: "One of the original Mara camps, on the banks of the Mara River, famous for its colonial-era charm.", location: "Maasai Mara, Narok", priceRange: "KES 60,000 - 120,000", imageUrl: img("photo-1520250497591-112f2f40a3f4"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.5000, longitude: 35.3300 },
    { name: "Mara Sopa Lodge", slug: "mara-sopa", type: "Lodge", description: "Rustic lodge with individual cottages spread across landscaped grounds, ideal for families.", location: "Maasai Mara, Narok", priceRange: "KES 18,000 - 35,000", imageUrl: img("photo-1582719508461-905c673771fd"), destinationId: destinationMap["maasai-mara"].id, latitude: -1.5000, longitude: 35.4000 },
    { name: "Amboseli Serena Safari Lodge", slug: "amboseli-serena", type: "Lodge", description: "Nestled in a grove of acacia trees with uninterrupted views of Mount Kilimanjaro.", location: "Amboseli, Kajiado", priceRange: "KES 22,000 - 48,000", imageUrl: img("photo-1571003123894-1f0594d2b5d9"), destinationId: destinationMap["amboseli"].id, latitude: -2.6600, longitude: 37.2700 },
    { name: "Tortilis Camp", slug: "tortilis-camp", type: "Tented Camp", description: "Eco-friendly tented camp on the edge of Amboseli, overlooking Mount Kilimanjaro.", location: "Amboseli, Kajiado", priceRange: "KES 40,000 - 75,000", imageUrl: img("photo-1517824806704-9040b037703b"), destinationId: destinationMap["amboseli"].id, latitude: -2.7000, longitude: 37.2500 },
    { name: "Ol Tukai Lodge", slug: "ol-tukai", type: "Lodge", description: "Classic Amboseli lodge surrounded by fever trees, with a hippo pool nearby.", location: "Amboseli, Kajiado", priceRange: "KES 26,000 - 52,000", imageUrl: img("photo-1564501049412-61c2a3083791"), destinationId: destinationMap["amboseli"].id, latitude: -2.6800, longitude: 37.3000 },
    { name: "Diani Sea Resort", slug: "diani-sea-resort", type: "Resort", description: "Beachfront resort with pools, water sports, and all-inclusive dining options.", location: "Diani Beach, Kwale", priceRange: "KES 18,000 - 40,000", imageUrl: img("photo-1582719478250-c89cae4dc85b"), destinationId: destinationMap["diani-beach"].id, latitude: -4.2900, longitude: 39.5800 },
    { name: "Almanara Luxury Villas", slug: "almanara-villas", type: "Resort", description: "Private beachfront villas with dedicated staff, perfect for families and small groups.", location: "Diani Beach, Kwale", priceRange: "KES 80,000 - 150,000", imageUrl: img("photo-1613490493576-7fde63acd811"), destinationId: destinationMap["diani-beach"].id, latitude: -4.3100, longitude: 39.5700 },
    { name: "The Sands at Nomad", slug: "sands-nomad", type: "Resort", description: "Boutique beach resort with colonial-style architecture and an award-winning restaurant.", location: "Diani Beach, Kwale", priceRange: "KES 30,000 - 65,000", imageUrl: img("photo-1520250497591-112f2f40a3f4"), destinationId: destinationMap["diani-beach"].id, latitude: -4.2800, longitude: 39.5900 },
    { name: "Sarova Lion Hill Lodge", slug: "sarova-lion-hill", type: "Lodge", description: "Set on a plateau overlooking Lake Nakuru, ideal for birdwatchers and rhino spotting.", location: "Lake Nakuru, Nakuru", priceRange: "KES 20,000 - 45,000", imageUrl: img("photo-1571896349842-33c89424de2d"), destinationId: destinationMap["lake-nakuru"].id, latitude: -0.3700, longitude: 36.0800 },
    { name: "Lake Nakuru Lodge", slug: "lake-nakuru-lodge", type: "Lodge", description: "Family-run lodge inside the park, with views of the lake and easy access to game drives.", location: "Lake Nakuru, Nakuru", priceRange: "KES 16,000 - 32,000", imageUrl: img("photo-1566073771259-6a8506099945"), destinationId: destinationMap["lake-nakuru"].id, latitude: -0.3600, longitude: 36.0900 },
    { name: "The Norfolk Hotel", slug: "norfolk-hotel", type: "Hotel", description: "Historic 5-star hotel in the heart of Nairobi, founded in 1904.", location: "Nairobi CBD", priceRange: "KES 15,000 - 35,000", imageUrl: img("photo-1564501049412-61c2a3083791"), destinationId: destinationMap["nairobi"].id, latitude: -1.2860, longitude: 36.8200 },
    { name: "Giraffe Manor", slug: "giraffe-manor", type: "Hotel", description: "Iconic boutique hotel where endangered Rothschild giraffes poke their heads through the windows at breakfast.", location: "Langata, Nairobi", priceRange: "KES 120,000 - 220,000", imageUrl: img("photo-1547721064-da6cfb341d50"), destinationId: destinationMap["nairobi"].id, latitude: -1.3700, longitude: 36.7500 },
    { name: "Hemingways Nairobi", slug: "hemingways-nairobi", type: "Hotel", description: "Luxury suites in the leafy suburb of Karen, with butler service and a renowned spa.", location: "Karen, Nairobi", priceRange: "KES 55,000 - 95,000", imageUrl: img("photo-1582719478250-c89cae4dc85b"), destinationId: destinationMap["nairobi"].id, latitude: -1.3500, longitude: 36.7100 },
    { name: "Ashnil Aruba Lodge", slug: "ashnil-aruba", type: "Lodge", description: "Comfortable lodge overlooking an active waterhole in Tsavo East, popular with elephant herds.", location: "Tsavo East, Taita-Taveta", priceRange: "KES 22,000 - 45,000", imageUrl: img("photo-1566073771259-6a8506099945"), destinationId: destinationMap["tsavo-east"].id, latitude: -3.0100, longitude: 38.4900 },
    { name: "Satao Camp", slug: "satao-camp", type: "Tented Camp", description: "Classic tented camp in Tsavo East with a waterhole in front of the restaurant.", location: "Tsavo East, Taita-Taveta", priceRange: "KES 28,000 - 55,000", imageUrl: img("photo-1517824806704-9040b037703b"), destinationId: destinationMap["tsavo-east"].id, latitude: -2.9900, longitude: 38.5100 },
    { name: "Kilaguni Serena Safari Lodge", slug: "kilaguni-serena", type: "Lodge", description: "Tsavo West's oldest lodge, with a waterhole visible from the restaurant and views of Kilimanjaro.", location: "Tsavo West, Taita-Taveta", priceRange: "KES 24,000 - 48,000", imageUrl: img("photo-1571896349842-33c89424de2d"), destinationId: destinationMap["tsavo-west"].id, latitude: -3.4200, longitude: 38.0000 },
    { name: "Samburu Sopa Lodge", slug: "samburu-sopa", type: "Lodge", description: "Rondavel-style lodge on a hilltop in Samburu, with views over the river valley.", location: "Samburu National Reserve", priceRange: "KES 20,000 - 40,000", imageUrl: img("photo-1582719508461-905c673771fd"), destinationId: destinationMap["samburu"].id, latitude: 0.5900, longitude: 37.5400 },
    { name: "Elephant Bedroom Camp", slug: "elephant-bedroom-camp", type: "Tented Camp", description: "Intimate luxury camp on the Ewaso Ng'iro river, frequently visited by elephants at the camp's edge.", location: "Samburu National Reserve", priceRange: "KES 65,000 - 125,000", imageUrl: img("photo-1517824806704-9040b037703b"), destinationId: destinationMap["samburu"].id, latitude: 0.6000, longitude: 37.5200 },
    { name: "The Majlis Resort", slug: "majlis-lamu", type: "Resort", description: "Beachfront boutique resort on Manda Island, with views across the channel to Lamu Old Town.", location: "Manda Island, Lamu", priceRange: "KES 45,000 - 95,000", imageUrl: img("photo-1571003123894-1f0594d2b5d9"), destinationId: destinationMap["lamu"].id, latitude: -2.2700, longitude: 40.9000 },
    { name: "Peponi Hotel", slug: "peponi-hotel", type: "Hotel", description: "Legendary Swahili-style hotel on Shela beach, run by the Korschen family since 1967.", location: "Shela, Lamu", priceRange: "KES 28,000 - 55,000", imageUrl: img("photo-1564501049412-61c2a3083791"), destinationId: destinationMap["lamu"].id, latitude: -2.2800, longitude: 40.9200 },
    { name: "Fairmont Mount Kenya Safari Club", slug: "fairmont-mt-kenya", type: "Hotel", description: "Historic resort at the foot of Mount Kenya, once owned by William Holden and frequented by celebrities.", location: "Nanyuki, Laikipia", priceRange: "KES 35,000 - 75,000", imageUrl: img("photo-1571003123894-1f0594d2b5d9"), destinationId: destinationMap["mount-kenya"].id, latitude: -0.0500, longitude: 37.0800 },
    { name: "Medina Palms", slug: "medina-palms", type: "Resort", description: "Contemporary suites and rooftop pools on Watamu's Turtle Bay, a short walk from the marine park.", location: "Watamu, Kilifi", priceRange: "KES 32,000 - 65,000", imageUrl: img("photo-1613490493576-7fde63acd811"), destinationId: destinationMap["watamu"].id, latitude: -3.3700, longitude: 40.0200 },
  ];

  for (const a of accommodations) {
    await prisma.accommodation.upsert({
      where: { slug: a.slug },
      update: {
        imageUrl: a.imageUrl,
        latitude: a.latitude,
        longitude: a.longitude,
      },
      create: a,
    });
  }

  console.log(`✔ Seeded ${accommodations.length} accommodations`);
}

// ═══════════════════════════════════════════════════════════════
// EVENTS — 20 records
// ═══════════════════════════════════════════════════════════════

async function seedEvents() {
  const events = [
    { name: "Magical Kenya Travel Expo (MKTE) 2026", slug: "mkte-2026", description: "Kenya's premier travel trade show, bringing together global buyers, exhibitors, and tourism leaders for networking and partnership opportunities.", startDate: new Date("2026-10-06"), endDate: new Date("2026-10-08"), location: "Nairobi, Kenya", imageUrl: img("photo-1540575467063-178a50c2df87"), featured: true },
    { name: "Wildebeest Migration Season", slug: "migration-season-2026", description: "The annual Great Migration brings over 1.5 million wildebeest and zebras into the Maasai Mara from the Serengeti.", startDate: new Date("2026-07-01"), endDate: new Date("2026-10-31"), location: "Maasai Mara National Reserve", imageUrl: img("photo-1534177616072-ef7dc120449d"), featured: true },
    { name: "Lamu Cultural Festival", slug: "lamu-cultural-festival-2026", description: "A celebration of Swahili culture with dhow races, donkey races, traditional dances, and poetry.", startDate: new Date("2026-11-20"), endDate: new Date("2026-11-23"), location: "Lamu Island", imageUrl: img("photo-1571407970349-bc81e7e96d47"), featured: false },
    { name: "Safari Rally Kenya 2026", slug: "safari-rally-2026", description: "Round 3 of the World Rally Championship, held on the grueling gravel roads of Naivasha and the Rift Valley.", startDate: new Date("2026-03-19"), endDate: new Date("2026-03-22"), location: "Naivasha, Nakuru County", imageUrl: img("photo-1503376780353-7e6692767b70"), featured: true },
    { name: "Maralal International Camel Derby", slug: "maralal-camel-derby-2026", description: "A unique cultural and sporting event featuring camel races, cycling, and Samburu traditions.", startDate: new Date("2026-08-07"), endDate: new Date("2026-08-09"), location: "Maralal, Samburu County", imageUrl: img("photo-1509316785289-025f5b846b35"), featured: false },
    { name: "Mombasa Carnival", slug: "mombasa-carnival-2026", description: "An annual street parade celebrating Swahili, Arab, Indian, and African heritage on the coast.", startDate: new Date("2026-11-01"), endDate: new Date("2026-11-03"), location: "Mombasa", imageUrl: img("photo-1519046904884-53103b34b206"), featured: true },
    { name: "Nairobi International Trade Fair", slug: "nairobi-trade-fair-2026", description: "East and Central Africa's largest trade exhibition, showcasing agriculture, tourism, and industry.", startDate: new Date("2026-09-28"), endDate: new Date("2026-10-04"), location: "Jamhuri Park, Nairobi", imageUrl: img("photo-1540575467063-178a50c2df87"), featured: false },
    { name: "Kenya Music Festival 2026", slug: "kenya-music-festival-2026", description: "The annual national music competition, from primary school choirs to professional ensembles.", startDate: new Date("2026-08-10"), endDate: new Date("2026-08-15"), location: "Nairobi", imageUrl: img("photo-1493225457124-a3eb161ffa5f"), featured: false },
    { name: "Lake Turkana Festival", slug: "turkana-festival-2026", description: "A celebration of the cultural diversity of the Turkana basin's tribes — El Molo, Rendille, Samburu, Turkana, Dassanech, and more.", startDate: new Date("2026-06-12"), endDate: new Date("2026-06-14"), location: "Loiyangalani, Marsabit County", imageUrl: img("photo-1516450360452-9312f5e86fc7"), featured: false },
    { name: "Rhino Charge 2026", slug: "rhino-charge-2026", description: "An off-road motorsport event that raises funds for rhino conservation across Kenya.", startDate: new Date("2026-06-06"), endDate: null, location: "Laikipia", imageUrl: img("photo-1503376780353-7e6692767b70"), featured: false },
    { name: "Kenya Open Golf Championship", slug: "kenya-open-golf-2026", description: "One of Africa's oldest and most prestigious golf tournaments, part of the Sunshine Tour.", startDate: new Date("2026-02-19"), endDate: new Date("2026-02-22"), location: "Karen Country Club, Nairobi", imageUrl: img("photo-1535131749006-b7f58c99034b"), featured: false },
    { name: "Kisumu Fish Festival", slug: "kisumu-fish-festival-2026", description: "A lakeside celebration of Luo culture, Lake Victoria's tilapia, and traditional music.", startDate: new Date("2026-12-11"), endDate: new Date("2026-12-13"), location: "Kisumu", imageUrl: img("photo-1544551763-46a013bb70d5"), featured: false },
    { name: "Lewa Safari Marathon", slug: "lewa-marathon-2026", description: "A world-famous marathon run entirely inside a wildlife conservancy, raising funds for conservation and community projects.", startDate: new Date("2026-06-27"), endDate: null, location: "Lewa Wildlife Conservancy, Laikipia", imageUrl: img("photo-1552674605-db6ffd4facb5"), featured: true },
    { name: "Malindi Cultural Festival", slug: "malindi-festival-2026", description: "A coastal celebration of Swahili, Italian, and Arab influences in Malindi's history.", startDate: new Date("2026-11-27"), endDate: new Date("2026-11-29"), location: "Malindi", imageUrl: img("photo-1519046904884-53103b34b206"), featured: false },
    { name: "Koroga Festival", slug: "koroga-festival-2026", description: "A quarterly outdoor music and food festival featuring Kenyan and international artists.", startDate: new Date("2026-04-05"), endDate: new Date("2026-04-05"), location: "Nairobi", imageUrl: img("photo-1493225457124-a3eb161ffa5f"), featured: false },
    { name: "Nairobi Restaurant Week", slug: "nairobi-restaurant-week-2026", description: "Ten days of fixed-price menus across Nairobi's top restaurants, celebrating Kenyan cuisine.", startDate: new Date("2026-02-06"), endDate: new Date("2026-02-16"), location: "Nairobi", imageUrl: img("photo-1414235077428-338989a2e8c0"), featured: false },
    { name: "Blankets & Wine", slug: "blankets-and-wine-2026", description: "A monthly open-air concert showcasing Kenyan and East African live music.", startDate: new Date("2026-01-25"), endDate: null, location: "Nairobi", imageUrl: img("photo-1493225457124-a3eb161ffa5f"), featured: false },
    { name: "Kili Marathon", slug: "kili-marathon-2026", description: "A marathon run at the foot of Mount Kilimanjaro, starting and finishing in Amboseli.", startDate: new Date("2026-03-01"), endDate: null, location: "Amboseli", imageUrl: img("photo-1552674605-db6ffd4facb5"), featured: false },
    { name: "Kijani Festival", slug: "kijani-festival-2026", description: "A music and arts festival held on the shores of Lake Naivasha, blending Kenyan and international acts.", startDate: new Date("2026-09-12"), endDate: new Date("2026-09-13"), location: "Lake Naivasha", imageUrl: img("photo-1470229722913-7c0e2dbbafd3"), featured: false },
    { name: "Marathon des Sables Kenya", slug: "marathon-des-sables-2026", description: "An ultra-marathon through the Chalbi Desert, part of the global Marathon des Sables series.", startDate: new Date("2026-07-18"), endDate: new Date("2026-07-24"), location: "Chalbi Desert, Marsabit County", imageUrl: img("photo-1552674605-db6ffd4facb5"), featured: false },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: { imageUrl: e.imageUrl },
      create: e,
    });
  }

  console.log(`✔ Seeded ${events.length} events`);
}

// ═══════════════════════════════════════════════════════════════
// BLOG POSTS — 20 records
// ═══════════════════════════════════════════════════════════════

async function seedBlogPosts() {
  const posts = [
    { title: "The Best Time to Visit the Maasai Mara", slug: "best-time-to-visit-maasai-mara", excerpt: "Migration season vs. green season — what each offers, and when to book for the best rates.", content: `The Maasai Mara is spectacular year-round, but the experience varies dramatically by season.\n\nPeak season runs from July to October, coinciding with the Great Wildebeest Migration. This is when over 1.5 million wildebeest and zebras cross the Mara River from the Serengeti. Expect premium rates, packed lodges, and spectacular river crossings — but also the best wildlife viewing of the year.\n\nThe green season (November to May) is quieter and much cheaper. Rates can drop 40–60% compared to peak. The landscape is lush after the short rains, birdlife is abundant, and you often have sightings almost to yourself. The trade-off is that some camps close, and roads can be muddy.\n\nIf you want to see the migration without the crowds, consider late June or early November — shoulder seasons with reasonable rates and good viewing.`, coverImage: img("photo-1516426122078-c23e76319801"), tags: "Safari,Wildlife,Planning", published: true, publishedAt: new Date("2026-09-12") },
    { title: "A First-Timer's Guide to Diani Beach", slug: "diani-beach-guide", excerpt: "Where to stay, what to eat, and how to get the most out of Kenya's award-winning coastline.", content: `Diani Beach stretches for 17 kilometres along the Indian Ocean, south of Mombasa in Kwale County. It's consistently ranked among Africa's best beaches, and for good reason — powder-white sand, warm turquoise water, and a coral reef that shelters the shoreline.\n\nGetting there is straightforward. Fly into Moi International Airport (MBA) in Mombasa, then take a 45-minute taxi or the Likoni Ferry. Alternatively, fly directly into Ukunda airstrip (UKA), which sits right next to Diani.\n\nWhere to stay depends on what you want. The northern end near the Kongo River is quieter, with boutique hotels and private villas. The southern stretch has larger resorts with full amenities — pools, spas, and dive centres.\n\nDon't miss: snorkeling or diving at Kisite-Mpunguti Marine Park, a sunset dhow cruise, and a day trip to the Shimba Hills for the rare sable antelope. For food, try the fresh seafood at one of the beachfront restaurants — the crab and prawns are exceptional.\n\nBest time to visit is December to March (dry, sunny) or July to October (cooler, fewer crowds). Avoid April and May, when the long rains hit.`, coverImage: img("photo-1507525428034-b723cf961d3e"), tags: "Beach,Coast,Planning", published: true, publishedAt: new Date("2026-08-28") },
    { title: "Kenya Visa & Entry Guide for 2026", slug: "kenya-visa-guide-2026", excerpt: "Everything you need to know about the eTA, vaccinations, and what to have ready at the border.", content: `Kenya introduced the Electronic Travel Authorisation (eTA) in early 2024, replacing traditional visas for most visitors. Here's what you need to know for a smooth arrival.\n\nApply online at etakenya.go.ke before you travel. Processing typically takes three working days, but apply at least a week ahead in case of delays. The fee is USD 30 for most nationalities, and the eTA is valid for 90 days from approval.\n\nYou'll need: a passport valid for at least six months beyond your arrival date, a recent passport-style photo, your flight itinerary, and accommodation details for the first night.\n\nYellow fever vaccination is required if you're arriving from a yellow-fever-endemic country. Otherwise, it's recommended but not mandatory. Check with your travel clinic about malaria prophylaxis if you're heading to the coast or safari areas.\n\nAt the border, you may be asked for proof of onward travel and sufficient funds. Have your return ticket and a bank statement or credit card ready.`, coverImage: img("photo-1488646953014-85cb44e25828"), tags: "Planning,Visa", published: true, publishedAt: new Date("2026-08-05") },
    { title: "Packing for a Kenyan Safari: The Complete List", slug: "safari-packing-list", excerpt: "What to bring, what to leave behind, and why neutral colors matter on game drives.", content: `Packing for a safari is different from packing for a beach holiday. Here's what actually matters.\n\nClothing: Neutral colors — khaki, olive, beige, brown. Avoid bright blue and black, which attract tsetse flies. Layers are key: mornings are cool, midday is hot, evenings cool down again. A light fleece or jacket for dawn game drives.\n\nFootwear: Comfortable closed shoes for game drives, sandals for around camp. Skip the hiking boots unless you're trekking.\n\nGear: Binoculars (one pair per person), a camera with a zoom lens of at least 200mm, spare batteries, and plenty of memory cards. A wide-brimmed hat. Sunscreen. Insect repellent.\n\nDocuments: Passport, eTA confirmation, travel insurance, vaccination certificate.`, coverImage: img("photo-1502920917128-1aa500764cbd"), tags: "Safari,Planning", published: true, publishedAt: new Date("2026-07-22") },
    { title: "The Great Migration: A Month-by-Month Guide", slug: "great-migration-month-by-month", excerpt: "Follow the wildebeest from the Serengeti to the Mara and back — and know when to book.", content: `The Great Migration is a year-round cycle. Understanding it lets you pick the right month and location.\n\nJanuary to March: The herds are calving in the southern Serengeti. Predator action is intense; this is a photographer's dream.\n\nApril to May: The herds move north through the central Serengeti. Many camps close in Kenya during the long rains.\n\nJune: The first wildebeest cross the Grumeti River in Tanzania. Kenya's Mara camps begin to fill.\n\nJuly to August: The famous Mara River crossings. This is what everyone comes for, and it's spectacular — but crowded and expensive.\n\nSeptember to October: The herds spread across the Mara plains. Still excellent viewing.\n\nNovember: The herds begin moving south again. Some Mara camps close; rates drop.\n\nDecember: The herds are back in the Serengeti. The cycle begins again.`, coverImage: img("photo-1534177616072-ef7dc120449d"), tags: "Wildlife,Safari,Planning", published: true, publishedAt: new Date("2026-07-10") },
    { title: "Kenyan Coffee: A Traveler's Guide", slug: "kenyan-coffee-guide", excerpt: "From the slopes of Mount Kenya to your morning cup — where to taste the real thing.", content: `Kenyan coffee is among the finest in the world. If you're visiting, here's how to taste it properly.\n\nThe growing regions: Nyeri, Kirinyaga, Murang'a, and the slopes of Mount Kenya produce the most prized beans. The high altitude, volcanic soil, and equatorial sun create a bright, fruity, blackcurrant-forward profile.\n\nWhere to taste: In Nairobi, look for specialty coffee shops like Spring Valley Coffee, The Boston Coffee House, and Connect Coffee Roasters. In Nyeri, visit a coffee estate and see the full process — picking, pulping, drying, roasting.\n\nWhat to buy: Single-origin AA beans, roasted within the last two weeks. Ask for the roast date. Avoid anything pre-ground.`, coverImage: img("photo-1447933601403-0c6688de566e"), tags: "Culture,Nairobi", published: true, publishedAt: new Date("2026-06-30") },
    { title: "Nairobi in 48 Hours", slug: "nairobi-48-hours", excerpt: "The perfect weekend itinerary for Kenya's capital — wildlife, culture, and food.", content: `Most travelers pass through Nairobi on the way to a safari. Don't. The city deserves two full days.\n\nDay 1 — Wildlife and history.\n\nMorning: Nairobi National Park. Yes, you can see lions, rhinos, and buffalo with the skyline in the background. Go at dawn.\n\nMidday: The David Sheldrick Wildlife Trust. Book ahead to attend the 11am elephant feeding.\n\nAfternoon: The Giraffe Centre in Langata. Feed Rothschild giraffes from a raised platform.\n\nEvening: Dinner at Talisman or Mama Oliech (for the tilapia).\n\nDay 2 — Culture and craft.\n\nMorning: The Karen Blixen Museum. See the house from Out of Africa.\n\nMidday: The Maasai Market (different locations on different days — check before you go).\n\nAfternoon: The Nairobi Railway Museum or the Nairobi National Museum.\n\nEvening: Sundowners at the rooftop of the Sarova Stanley, then dinner at Fogo Gaucho or About Thyme.`, coverImage: img("photo-1611348586804-61bf6c080437"), tags: "Nairobi,Culture,Planning", published: true, publishedAt: new Date("2026-06-14") },
    { title: "Diani vs. Watamu: Which Kenyan Beach?", slug: "diani-vs-watamu", excerpt: "Two of Kenya's best coast destinations compared — crowds, reefs, and vibes.", content: `Both are spectacular. But they're different experiences.\n\nDiani is the more developed of the two — larger resorts, more restaurants, better infrastructure. It's south of Mombasa, easy to reach, and offers easy access to Kisite-Mpunguti Marine Park for snorkeling.\n\nWatamu is quieter, smaller, and more Italian-influenced (a legacy of decades of Italian tourism). Its marine park is right offshore — you can snorkel from the beach at low tide. Turtles nest on Watamu's beaches.\n\nChoose Diani if: You want options, amenities, and a range of accommodation from budget to luxury.\n\nChoose Watamu if: You want a slower pace, easy reef access, and a more intimate scale.`, coverImage: img("photo-1544551763-46a013bb70d5"), tags: "Beach,Coast", published: true, publishedAt: new Date("2026-05-28") },
    { title: "Kenya's Big Five (and Where to See Them)", slug: "kenyas-big-five", excerpt: "Lion, leopard, elephant, buffalo, rhino — where to go for each.", content: `The Big Five — lion, leopard, elephant, buffalo, and rhino — were originally named for the difficulty of hunting them. Today they're the bucket-list animals for most safari-goers.\n\nLion: Maasai Mara and Amboseli are the best bets. The Mara's open plains make them easy to spot.\n\nLeopard: The Mara and Samburu. Leopards are solitary and elusive, but the Mara's riverine forest along the Mara River is one of the best places in Africa.\n\nElephant: Amboseli for the big tuskers against Kilimanjaro; Samburu for the "Samburu Special Five" including elephants.\n\nBuffalo: Any major park. Huge herds are common in the Mara and Tsavo.\n\nRhino: Lake Nakuru and Nairobi National Park are the most reliable. Both have fenced sanctuaries.`, coverImage: img("photo-1564760055775-d63b17a55c44"), tags: "Wildlife,Safari", published: true, publishedAt: new Date("2026-05-11") },
    { title: "A Guide to the Swahili Coast", slug: "swahili-coast-guide", excerpt: "Lamu, Mombasa, Malindi — the history, culture, and food of Kenya's Indian Ocean.", content: `Kenya's coast is not just beaches. It's one of the oldest continuous cultural regions in the world — a thousand years of Swahili civilization shaped by Arab, Persian, Indian, and African influence.\n\nLamu is the most intact historic town in East Africa. Cars are almost nonexistent; donkeys and dhows are the transport. The architecture is coral stone and mangrove timber, with carved wooden doors that are works of art in themselves.\n\nMombasa is the largest coastal city. Fort Jesus (a UNESCO World Heritage Site) tells the story of Portuguese, Omani, and British rule. Old Town's narrow streets and markets are worth a half day.\n\nMalindi has a distinctive Italian character from decades of Italian tourism, but beneath it lies a Swahili town with ancient ruins nearby — Gedi, a medieval city abandoned in the 17th century.`, coverImage: img("photo-1571407970349-bc81e7e96d47"), tags: "Coast,Culture,Beach", published: true, publishedAt: new Date("2026-04-22") },
    { title: "Safety Tips for Traveling in Kenya", slug: "safety-tips-kenya", excerpt: "How to stay safe and avoid the common pitfalls — from Nairobi streets to safari camps.", content: `Kenya is generally safe for tourists who take reasonable precautions. Here's what matters.\n\nIn cities: Avoid walking alone at night. Use hotel-arranged transport after dark. Keep valuables out of sight. Don't walk with your phone out.\n\nIn Nairobi specifically: The Central Business District is busy and generally safe during the day. Avoid the areas around River Road at night.\n\nOn safari: Follow your guide's instructions without question. Don't leave your tent at night unless you're escorted. Don't walk between vehicles.\n\nOn the coast: Diani, Watamu, and Lamu are safe for tourists. Mombasa is generally fine but stick to populated areas.\n\nTransport: Use Uber or Bolt in Nairobi and Mombasa. For intercity travel, use reputable coaches like Easy Coach or modern shuttle services.\n\nEmergency: Police 999 or 112. Tourist Police hotline: +254 20 341 4955.`, coverImage: img("photo-1488646953014-85cb44e25828"), tags: "Planning,Safety", published: true, publishedAt: new Date("2026-04-05") },
    { title: "Wildlife Photography in Kenya: A Beginner's Guide", slug: "wildlife-photography-guide", excerpt: "Gear, settings, and etiquette for capturing Kenya's wildlife on camera.", content: `Kenya is one of the best wildlife photography destinations on earth. Here's how to make the most of it.\n\nThe single most important piece of gear: a zoom lens. A 100-400mm or 200-500mm is ideal. Bring more reach than you think you need — you'll use it.\n\nCamera settings for wildlife: Shutter priority at 1/1000s or faster for moving animals. Continuous autofocus with animal eye detection. High-speed burst mode.\n\nGolden hour is everything. Most photographers shoot from 6–9am and again from 4–6:30pm. Midday light is harsh and flat.\n\nEthics: Never ask your guide to move off-road for a photo. Don't crowd wildlife at a sighting. Turn off flash. Don't use drones in national parks (it's illegal).`, coverImage: img("photo-1516728778615-2d590ea1855e"), tags: "Wildlife,Photography,Safari", published: true, publishedAt: new Date("2026-03-18") },
    { title: "The Samburu Special Five", slug: "samburu-special-five", excerpt: "Five species you won't see anywhere else in Kenya — and why Samburu is worth the drive.", content: `Samburu National Reserve, 350 kilometres north of Nairobi, is home to five species that are unique or nearly unique to northern Kenya. Together they're called the "Samburu Special Five."\n\nGrevy's zebra: The largest zebra species, with narrow stripes and a white belly. Fewer than 3,000 remain in the wild.\n\nReticulated giraffe: Sharp, geometric pattern rather than the softer patches of other giraffes. Considered a distinct species since 2016.\n\nBeisa oryx: Long, straight horns. Adapted to desert and semi-desert.\n\nGerenuk: A long-necked antelope that stands on its hind legs to reach higher branches. Nicknamed the "giraffe gazelle."\n\nSomali ostrich: A distinct species with blue-grey legs and neck (males) or brown feathers (females).`, coverImage: img("photo-1547471080-7cc2caa01a7e"), tags: "Wildlife,Safari", published: true, publishedAt: new Date("2026-03-01") },
    { title: "Kenya's Best Safari Lodges for a Splurge", slug: "kenya-splurge-lodges", excerpt: "Where to spend when you want the trip of a lifetime — luxury camps and lodges worth the price.", content: `Some trips deserve the top tier. Here are Kenya's standout splurge properties.\n\nAngama Mara (Maasai Mara): Suspended on the edge of the Rift Valley with views over the Mara Triangle. Suites are canvas and glass; the service is faultless.\n\nGiraffe Manor (Nairobi): The most photographed hotel in Kenya. Waking up to a Rothschild giraffe at your window is the whole point.\n\nTortilis Camp (Amboseli): Intimate tented camp on the edge of Amboseli, with Kilimanjaro framed by every view.\n\nElephant Bedroom Camp (Samburu): Elephants regularly walk through camp. The tented suites are spacious and beautiful.\n\nThe Majlis (Lamu): Beachfront resort on Manda Island with views across the channel to Lamu Old Town.`, coverImage: img("photo-1566073771259-6a8506099945"), tags: "Safari,Planning,Stay", published: true, publishedAt: new Date("2026-02-12") },
    { title: "Traveling Kenya on a Budget", slug: "kenyas-budget-travel", excerpt: "How to see the best of Kenya without spending a fortune — camps, matatus, and local food.", content: `Kenya can be expensive. It can also be surprisingly affordable. Here's how to do it on a budget.\n\nSafari: Budget camping safaris (shared game drives, basic tents) run from KES 15,000–25,000 per day. They're not luxury, but they're real safaris.\n\nAccommodation: Hostels in Nairobi start around KES 2,000 per night. Airbnb and guesthouses in Diani can be under KES 5,000. Mid-range lodges in most parks run KES 10,000–20,000.\n\nTransport: Matatus connect every major town cheaply. A Nairobi-to-Mombasa bus is around KES 1,500. Standard-gauge railway is even cheaper.\n\nFood: Eat where locals eat. A plate of nyama choma at a local grill is KES 300–500. Ugali and sukuma wiki at a roadside hotel is KES 150.`, coverImage: img("photo-1488646953014-85cb44e25828"), tags: "Planning,Budget", published: true, publishedAt: new Date("2026-01-25") },
    { title: "A Guide to Nyama Choma", slug: "nyama-choma-guide", excerpt: "Kenya's national dish — where to eat it, how to order it, and what to expect.", content: `Nyama choma means "roasted meat" in Swahili. It's Kenya's unofficial national dish, and eating it is a cultural experience as much as a meal.\n\nWhat it is: Goat, beef, or chicken, roasted over charcoal until the outside is crisp and the inside is tender. Served with ugali (maize meal), kachumbari (tomato and onion salad), and sometimes sukuma wiki (collard greens).\n\nWhere to eat it: The best nyama choma is at local joints, not tourist restaurants. In Nairobi, try the areas around Kikuyu, Ngong Road, and the famous "Nyama Choma Trail" along Langata Road.\n\nHow to order: You point at the cut of meat you want — a "quarter" or "half" of a goat is common. The butcher roasts it to order. You eat with your hands, using ugali to scoop.`, coverImage: img("photo-1414235077428-338989a2e8c0"), tags: "Culture,Food,Nairobi", published: true, publishedAt: new Date("2026-01-14") },
    { title: "Lake Naivasha: The Weekend Escape", slug: "lake-naivasha-weekend", excerpt: "Boat safaris, hippos, and Crescent Island — the perfect weekend from Nairobi.", content: `Lake Naivasha is 90 minutes from Nairobi and one of the easiest weekend escapes in Kenya.\n\nThe lake: A freshwater lake in the Rift Valley, home to hippos, over 400 bird species, and a thriving flower-farming industry.\n\nCrescent Island: A private island in the lake where you can walk among giraffes, zebras, and wildebeest — no fences, no vehicles. It's one of the few places in Kenya where you can walk freely among large mammals.\n\nBoat safaris: Take a boat to see hippos up close (from a safe distance), fish eagles, and the lake's resident pelicans.\n\nWhere to stay: Lake Naivasha Sopa Resort, Enashipai, or one of the many boutique lodges on the shore.`, coverImage: img("photo-1544551763-46a013bb70d5"), tags: "Nakuru,Weekend,Wildlife", published: true, publishedAt: new Date("2025-12-20") },
    { title: "The Truth About Kenyan Roads", slug: "kenyan-roads-truth", excerpt: "What to expect when driving in Kenya — road conditions, driving culture, and why most visitors shouldn't self-drive.", content: `Kenya drives on the left, uses a mix of tarmac and rough gravel, and has one of the more chaotic driving cultures in East Africa. Here's what to know.\n\nMain highways: The Mombasa Road, the Nairobi-Nakuru highway, and the Thika Superhighway are all in good condition. Speed bumps are frequent and often unmarked.\n\nRural roads: Variable. The road to the Mara is 5–6 hours from Nairobi, mostly tarmac with some rough sections near the park. The road to Amboseli is 4 hours, mostly tarmac.\n\nTraffic: Nairobi traffic is notorious. Avoid driving during rush hour (7–9am, 5–7pm) if you can.\n\nBetter option: Hire a driver-guide. They know the roads, the shortcuts, and the parks. The cost is worth every shilling.`, coverImage: img("photo-1449965408869-eaa3f722e40d"), tags: "Planning,Transport", published: true, publishedAt: new Date("2025-12-03") },
    { title: "Kenya's Best Time to Visit for Birdwatching", slug: "kenyas-birdwatching", excerpt: "Over 1,100 species, two rainy seasons, and the migratory window — here's when to go.", content: `Kenya has over 1,100 recorded bird species — one of the richest avifaunas in Africa.\n\nResident species: Common year-round. The Rift Valley lakes, Kakamega Forest, and the coastal forests have the highest diversity.\n\nPalearctic migrants: Arrive from Europe and Asia from October to March. The Rift Valley lakes are the single best place to see them — Nakuru, Naivasha, Baringo, and Bogoria.\n\nIntra-African migrants: Arrive with the rains. April to May and November are the peak periods.\n\nBest overall months: November to March for migratory species and pleasant weather. The Rift Valley lake circuit is at its best.`, coverImage: img("photo-1444464666168-49d633b86797"), tags: "Wildlife,Birdwatching,Planning", published: true, publishedAt: new Date("2025-11-18") },
    { title: "Ethical Wildlife Tourism in Kenya", slug: "ethical-wildlife-tourism", excerpt: "How to travel in a way that supports conservation and respects wildlife — not exploits it.", content: `Kenya's wildlife is under pressure from poaching, habitat loss, and climate change. Ethical tourism can be part of the solution — or part of the problem.\n\nChoose the right operators: Look for camps and lodges that are members of the Kenya Association of Tour Operators (KATO) or that partner with conservancies. Many are actively involved in anti-poaching and community work.\n\nAvoid: Elephant rides, lion walks, and any "sanctuary" that allows cub-petting. These are exploitative operations dressed up as conservation.\n\nSupport: Community conservancies like Lewa, Ol Pejeta, and Mara North. These pay local landowners, employ local staff, and protect wildlife corridors.\n\nPhotography: Never pressure your guide to move off-road for a better shot. It damages habitat and stresses animals.`, coverImage: img("photo-1564760055775-d63b17a55c44"), tags: "Wildlife,Conservation,Ethics", published: true, publishedAt: new Date("2025-10-30") },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: { coverImage: p.coverImage },
      create: p,
    });
  }

  console.log(`✔ Seeded ${posts.length} blog posts`);
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
      update: {},
      create: {
        email: b.email,
        name: b.name,
        role: "BUSINESS",
        passwordHash,
      },
    });

    await prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: b.businessName,
        contactEmail: b.contactEmail,
        contactPhone: b.contactPhone,
        description: b.description,
        verificationStatus: b.verificationStatus,
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

  const maraBusiness = businessUsers.get("mara@business.local")!;
  const dianiBusiness = businessUsers.get("diani@business.local")!;
  const customer1 = customerUsers.get("customer1@test.local")!;
  const customer2 = customerUsers.get("customer2@test.local")!;

  const maraSerena = await prisma.accommodation.findUnique({
    where: { slug: "mara-serena" },
    select: { id: true, name: true },
  });
  const dianiSea = await prisma.accommodation.findUnique({
    where: { slug: "diani-sea-resort" },
    select: { id: true, name: true },
  });

  if (maraSerena) {
    const thread = await prisma.messageThread.create({
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
            {
              authorId: customer1.id,
              body: "Hi, I'm interested in a 3-night stay in early August. Do you have availability for two adults? Is the balloon safari included in the rate?",
              readByCustomer: true,
              readByBusiness: false,
              createdAt: daysAgo(3),
            },
            {
              authorId: maraBusiness.id,
              body: "Hello Amina, thank you for reaching out. We have availability 5–8 August. The balloon safari is a separate add-on (USD 450 per person). Would you like me to hold those dates?",
              readByCustomer: false,
              readByBusiness: true,
              createdAt: daysAgo(2),
            },
          ],
        },
      },
    });
    console.log(`   · Thread ${thread.id} (Mara / Amina)`);
  }

  if (dianiSea) {
    const thread = await prisma.messageThread.create({
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
            {
              authorId: customer2.id,
              body: "Do you offer airport transfers from Moi International? And is the rate all-inclusive?",
              readByCustomer: true,
              readByBusiness: false,
              createdAt: daysAgo(1),
            },
          ],
        },
      },
    });
    console.log(`   · Thread ${thread.id} (Diani / James)`);
  }

  if (maraSerena) {
    await prisma.booking.create({
      data: {
        customerId: customer1.id,
        businessId: maraBusiness.id,
        accommodationId: maraSerena.id,
        checkIn: new Date("2026-08-05"),
        checkOut: new Date("2026-08-08"),
        guests: 2,
        notes: "Requesting a room with a view of the plains if possible.",
        status: "REQUESTED",
        createdAt: daysAgo(3),
      },
    });
    console.log("   · Booking 1 (Mara Serena, REQUESTED)");
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
        responseNote:
          "Confirmed. Sea-facing family suite reserved. Payment link sent by email.",
        createdAt: daysAgo(4),
      },
    });
    console.log("   · Booking 2 (Diani Sea Resort, CONFIRMED)");
  }

  console.log(`✔ Seeded sample threads and bookings for business dashboards`);
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
  const committeeMember = committeeMembers[0] ?? null;

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
    const perusalFor = (): DocSpec["perusalStatus"] => {
      if (stage === "draft" || stage === "submitted") return "PENDING";
      return "ACCEPTED";
    };
    const verificationFor = (): DocSpec["verificationStatus"] => {
      if (stage === "draft" || stage === "submitted" || stage === "under-perusal") {
        return "PENDING";
      }
      return "ACCEPTED";
    };

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

    const docs = standardDocs(spec.docsStage);
    for (const d of docs) {
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
      const voters = committeeMembers.slice(0, 2);
      for (const v of voters) {
        await prisma.committeeVote.upsert({
          where: {
            applicationId_voterId: {
              applicationId: application.id,
              voterId: v.id,
            },
          },
          update: {},
          create: {
            applicationId: application.id,
            voterId: v.id,
            decision: "APPROVE",
            comment: "Documents in order. Recommend approval.",
          },
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
    category:
      | "WILDLIFE"
      | "SAFETY"
      | "OPERATOR"
      | "FACILITY"
      | "GUIDES"
      | "OTHER";
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
    attachments: {
      fileName: string;
      mimeType: string;
      sizeBytes: number;
    }[];
  };

  const seeds: IncidentSeed[] = [
    { referenceNo: "INC/2026/0001", status: "OPEN", category: "WILDLIFE", title: "Injured elephant calf near Talek River", description: "A juvenile elephant with an apparent snare wound on its front left leg was observed near the Talek River crossing. The herd appeared to be protecting it but it was visibly struggling. Please dispatch a KWS veterinary team with urgent priority. Coordinates approximate: 1.485° S, 35.372° E.", location: "Talek River, Maasai Mara", reporterName: "Daniel Kiprop", reporterEmail: "d.kiprop@example.com", reporterPhone: "+254 722 111 222", occurredDaysAgo: 1, reportedDaysAgo: 1, reviewedDaysAgo: null, reviewNotes: null, escalatedTo: null, escalatedDaysAgo: null, attachments: [{ fileName: "injured-calf-01.jpg", mimeType: "image/jpeg", sizeBytes: 1_842_113 }, { fileName: "injured-calf-02.jpg", mimeType: "image/jpeg", sizeBytes: 2_104_556 }] },
    { referenceNo: "INC/2026/0002", status: "OPEN", category: "SAFETY", title: "Missing lifejackets on dhow cruise", description: "The dhow that operates from Diani Beach near the Kongo River mouth had no visible lifejackets for passengers during a sunset cruise. At least 12 tourists on board, none wearing or shown a lifejacket. Operator could not produce a safety certificate when asked. Reported by a concerned guest.", location: "Kongo River mouth, Diani Beach", reporterName: null, reporterEmail: null, reporterPhone: null, occurredDaysAgo: 2, reportedDaysAgo: 2, reviewedDaysAgo: null, reviewNotes: null, escalatedTo: null, escalatedDaysAgo: null, attachments: [] },
    { referenceNo: "INC/2026/0003", status: "OPEN", category: "OPERATOR", title: "Operator driving off-road in Nairobi National Park", description: "Safari vehicle registration KDD 442A was observed driving off designated tracks near the Athi Basin to approach a lion pride. Guide refused to return to the track when asked by other visitors. Vehicle had no visible operator branding.", location: "Nairobi National Park, Athi Basin", reporterName: "Mercy Wambui", reporterEmail: "mercy.w@example.com", reporterPhone: "+254 733 444 555", occurredDaysAgo: 3, reportedDaysAgo: 3, reviewedDaysAgo: null, reviewNotes: null, escalatedTo: null, escalatedDaysAgo: null, attachments: [{ fileName: "vehicle-plate.jpg", mimeType: "image/jpeg", sizeBytes: 982_114 }] },
    { referenceNo: "INC/2026/0004", status: "OPEN", category: "GUIDES", title: "Unlicensed guide at Hell's Gate", description: "A guide offering cycling tours from the main gate could not produce a valid KPSGA guiding licence. Was soliciting tourists at the entrance and quoting below standard rates. Suggested the matter be raised with KWS and KATO.", location: "Hell's Gate National Park", reporterName: "Peter Njenga", reporterEmail: "pnjenga@example.com", reporterPhone: null, occurredDaysAgo: 4, reportedDaysAgo: 3, reviewedDaysAgo: null, reviewNotes: null, escalatedTo: null, escalatedDaysAgo: null, attachments: [] },
    { referenceNo: "INC/2026/0005", status: "UNDER_REVIEW", category: "FACILITY", title: "Unsafe staircase at Lake Nakuru lodge", description: "The wooden staircase leading to the dining terrace at a lodge inside Lake Nakuru NP has two missing planks and a loose handrail. A guest tripped and bruised a knee. Lodge staff acknowledged the issue but did not close the staircase.", location: "Lake Nakuru National Park", reporterName: "Grace Otieno", reporterEmail: "grace.otieno@example.com", reporterPhone: "+254 711 888 999", occurredDaysAgo: 6, reportedDaysAgo: 5, reviewedDaysAgo: 3, reviewNotes: "Confirmed the lodge's public liability documents are current. Reached out to lodge management for a fix timeline. Requested KWS facility inspection report.", escalatedTo: null, escalatedDaysAgo: null, attachments: [{ fileName: "staircase-damage.jpg", mimeType: "image/jpeg", sizeBytes: 1_344_221 }, { fileName: "guest-injury-note.pdf", mimeType: "application/pdf", sizeBytes: 248_990 }] },
    { referenceNo: "INC/2026/0006", status: "UNDER_REVIEW", category: "WILDLIFE", title: "Repeated turtle nest disturbance at Watamu", description: "Local tour operators are repeatedly walking over a marked turtle nest near the Marine Park at night, likely disturbing hatchlings. Nest markers were found flattened on two separate occasions this week. Local conservation group has reported the same issue before.", location: "Watamu Marine National Park", reporterName: null, reporterEmail: "turtle-watch@example.org", reporterPhone: null, occurredDaysAgo: 8, reportedDaysAgo: 7, reviewedDaysAgo: 4, reviewNotes: "Assigned to coast region for site visit. Requested nesting location map from Watamu Turtle Watch. Considering escalation to KWS coastal enforcement.", escalatedTo: null, escalatedDaysAgo: null, attachments: [{ fileName: "flattened-nest.jpg", mimeType: "image/jpeg", sizeBytes: 2_010_441 }] },
    { referenceNo: "INC/2026/0007", status: "ESCALATED", category: "SAFETY", title: "Suspected poisoning of wildlife at a waterhole", description: "Three dead vultures and one dead jackal were found around a waterhole in the Amboseli ecosystem. No visible wounds; suspected carbamate poisoning. Local conservancy has cordoned the waterhole. This is potentially a poaching-related incident and requires KWS forensic response.", location: "Amboseli ecosystem", reporterName: "Big Life Foundation field officer", reporterEmail: "field@example.org", reporterPhone: "+254 720 100 200", occurredDaysAgo: 12, reportedDaysAgo: 11, reviewedDaysAgo: 10, reviewNotes: "Site sealed by conservancy. Carcass samples collected. Escalating to KWS wildlife forensics and the national wildlife poisoning response taskforce.", escalatedTo: "Kenya Wildlife Service", escalatedDaysAgo: 9, attachments: [{ fileName: "vultures-site.jpg", mimeType: "image/jpeg", sizeBytes: 3_104_998 }, { fileName: "field-report.pdf", mimeType: "application/pdf", sizeBytes: 512_004 }] },
    { referenceNo: "INC/2026/0008", status: "RESOLVED", category: "OPERATOR", title: "Abandoned safari vehicle blocking park road", description: "A safari vehicle (KBN 771Y) was abandoned near the Mara Serena junction after an apparent breakdown, blocking one lane for several hours. Park rangers were contacted and a recovery arranged. No casualties.", location: "Maasai Mara, Mara Serena junction", reporterName: "John Kamau", reporterEmail: null, reporterPhone: "+254 714 555 444", occurredDaysAgo: 18, reportedDaysAgo: 18, reviewedDaysAgo: 17, reviewNotes: "Operator (Savannah Tours Ltd) has been contacted. Vehicle recovered. Operator issued a written warning and confirmed road-safety protocol refresh for its guides.", escalatedTo: null, escalatedDaysAgo: null, attachments: [{ fileName: "blocked-road.jpg", mimeType: "image/jpeg", sizeBytes: 1_540_221 }] },
    { referenceNo: "INC/2026/0009", status: "RESOLVED", category: "FACILITY", title: "Broken viewing platform at Nyahururu Falls", description: "A section of the lower viewing platform at Thomson's Falls had rotted through, creating a fall hazard. County works department was notified via the tourism office. Site has since been fenced off pending repair.", location: "Nyahururu Falls, Laikipia", reporterName: "Sarah Mwangi", reporterEmail: "s.mwangi@example.com", reporterPhone: null, occurredDaysAgo: 24, reportedDaysAgo: 22, reviewedDaysAgo: 20, reviewNotes: "Platform closed and fenced by county works. Repair timeline confirmed for next quarter. No injuries reported.", escalatedTo: null, escalatedDaysAgo: null, attachments: [] },
    { referenceNo: "INC/2026/0010", status: "CLOSED", category: "OTHER", title: "Duplicate report — broken platform at Nyahururu Falls", description: "Duplicate of an earlier report about the same damaged viewing platform at Thomson's Falls. Submitter was unaware the issue had already been reported. Closing as duplicate with no further action.", location: "Nyahururu Falls, Laikipia", reporterName: null, reporterEmail: null, reporterPhone: null, occurredDaysAgo: null, reportedDaysAgo: 20, reviewedDaysAgo: 19, reviewNotes: "Duplicate of INC/2026/0009. Closed. Reporter notified via the reference-number page that the issue is already being addressed.", escalatedTo: null, escalatedDaysAgo: null, attachments: [] },
  ];

  let created = 0;
  let updated = 0;

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
  console.log(`   ${seeds.filter((s) => s.status === "OPEN").length} OPEN, ${seeds.filter((s) => s.status === "UNDER_REVIEW").length} UNDER_REVIEW, ${seeds.filter((s) => s.status === "ESCALATED").length} ESCALATED, ${seeds.filter((s) => s.status === "RESOLVED").length} RESOLVED, ${seeds.filter((s) => s.status === "CLOSED").length} CLOSED`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });