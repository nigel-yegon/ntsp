import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg';

const adapter = new PrismaPostgresAdapter({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding NTSP database...");

  // ═══════════════════════════════════════════════════════════════
  // DESTINATIONS — 20 records
  // ═══════════════════════════════════════════════════════════════
  const destinations = [
    {
      name: "Maasai Mara National Reserve",
      slug: "maasai-mara",
      county: "Narok",
      description:
        "Home to the Great Migration and the Big Five, the Maasai Mara is Kenya's most iconic wildlife destination.",
      imageUrl: "/images/destinations/maasai-mara.png",
      featured: true,
    },
    {
      name: "Amboseli National Park",
      slug: "amboseli",
      county: "Kajiado",
      description:
        "Famous for its large elephant herds and stunning views of Mount Kilimanjaro across the border in Tanzania.",
      imageUrl: "/images/destinations/amboseli.png",
      featured: true,
    },
    {
      name: "Diani Beach",
      slug: "diani-beach",
      county: "Kwale",
      description:
        "Award-winning white-sand beach on the Indian Ocean, perfect for relaxation, water sports, and coral reef diving.",
      imageUrl: "/images/destinations/diani.png",
      featured: true,
    },
    {
      name: "Lake Nakuru National Park",
      slug: "lake-nakuru",
      county: "Nakuru",
      description:
        "Famous for its flamingos and rhino sanctuary, set around a shallow alkaline lake in the Great Rift Valley.",
      imageUrl: "/images/destinations/lake-nakuru.png",
      featured: false,
    },
    {
      name: "Nairobi",
      slug: "nairobi",
      county: "Nairobi",
      description:
        "Kenya's vibrant capital, known as the 'Green City in the Sun', home to Nairobi National Park and rich cultural experiences.",
      imageUrl: "/images/destinations/nairobi.png",
      featured: false,
    },
    {
      name: "Tsavo East National Park",
      slug: "tsavo-east",
      county: "Taita-Taveta",
      description:
        "One of Kenya's largest and oldest parks, known for its red elephants and vast arid plains.",
      imageUrl: "/images/destinations/tsavo-east.png",
      featured: true,
    },
    {
      name: "Tsavo West National Park",
      slug: "tsavo-west",
      county: "Taita-Taveta",
      description:
        "Volcanic hills, lava flows, and the crystal-clear Mzima Springs, home to hippos and crocodiles.",
      imageUrl: "/images/destinations/tsavo-west.png",
      featured: false,
    },
    {
      name: "Samburu National Reserve",
      slug: "samburu",
      county: "Samburu",
      description:
        "Semi-arid wilderness along the Ewaso Ng'iro river, home to the Samburu Special Five.",
      imageUrl: "/images/destinations/samburu.png",
      featured: true,
    },
    {
      name: "Lamu Old Town",
      slug: "lamu",
      county: "Lamu",
      description:
        "UNESCO World Heritage Site and the oldest continuously inhabited Swahili settlement in East Africa.",
      imageUrl: "/images/destinations/lamu.png",
      featured: true,
    },
    {
      name: "Mount Kenya National Park",
      slug: "mount-kenya",
      county: "Nyeri",
      description:
        "Africa's second-highest mountain, with glaciers, alpine meadows, and a UNESCO-listed natural landscape.",
      imageUrl: "/images/destinations/mount-kenya.png",
      featured: false,
    },
    {
      name: "Hell's Gate National Park",
      slug: "hells-gate",
      county: "Nakuru",
      description:
        "One of the few Kenyan parks where you can walk, cycle, and climb alongside wildlife, with dramatic geothermal scenery.",
      imageUrl: "/images/destinations/hells-gate.png",
      featured: false,
    },
    {
      name: "Lake Naivasha",
      slug: "lake-naivasha",
      county: "Nakuru",
      description:
        "Freshwater lake in the Rift Valley with abundant birdlife, hippos, and boat safaris to Crescent Island.",
      imageUrl: "/images/destinations/lake-naivasha.png",
      featured: false,
    },
    {
      name: "Lake Baringo",
      slug: "lake-baringo",
      county: "Baringo",
      description:
        "One of the Rift Valley's two freshwater lakes, home to over 470 bird species and crocodile-filled waters.",
      imageUrl: "/images/destinations/lake-baringo.png",
      featured: false,
    },
    {
      name: "Lake Bogoria",
      slug: "lake-bogoria",
      county: "Baringo",
      description:
        "Alkaline lake famous for its hot springs, geysers, and huge seasonal flocks of lesser flamingos.",
      imageUrl: "/images/destinations/lake-bogoria.png",
      featured: false,
    },
    {
      name: "Nairobi National Park",
      slug: "nairobi-national-park",
      county: "Nairobi",
      description:
        "The only national park within a capital city — a unique blend of wildlife and urban skyline.",
      imageUrl: "/images/destinations/nairobi-national-park.png",
      featured: true,
    },
    {
      name: "Watamu Marine National Park",
      slug: "watamu",
      county: "Kilifi",
      description:
        "Protected coral reef and turtle nesting site, part of the Malindi-Watamu Biosphere Reserve.",
      imageUrl: "/images/destinations/watamu.png",
      featured: false,
    },
    {
      name: "Malindi",
      slug: "malindi",
      county: "Kilifi",
      description:
        "Historic coastal town with Italian influence, a marine park, and easy access to Gedi ruins.",
      imageUrl: "/images/destinations/malindi.png",
      featured: false,
    },
    {
      name: "Kisite-Mpunguti Marine Park",
      slug: "kisite-mpunguti",
      county: "Kwale",
      description:
        "Kenya's premier marine park, famous for dolphin sightings, snorkeling, and coral gardens.",
      imageUrl: "/images/destinations/kisite-mpunguti.png",
      featured: true,
    },
    {
      name: "Nyahururu Falls",
      slug: "nyahururu-falls",
      county: "Laikipia",
      description:
        "Also known as Thomson's Falls — a 74-metre waterfall on the Ewaso Ng'iro river, a popular stopover.",
      imageUrl: "/images/destinations/nyahururu-falls.png",
      featured: false,
    },
    {
      name: "Kakamega Forest",
      slug: "kakamega-forest",
      county: "Kakamega",
      description:
        "Kenya's only remaining tropical rainforest, with over 400 butterfly species and 300 bird species.",
      imageUrl: "/images/destinations/kakamega-forest.png",
      featured: false,
    },
  ];

  const destinationMap: Record<string, { id: number }> = {};

  for (const d of destinations) {
    const record = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {},
      create: d,
    });
    destinationMap[d.slug] = record;
  }

  console.log(`✔ Seeded ${destinations.length} destinations`);

  // ═══════════════════════════════════════════════════════════════
  // ATTRACTIONS — 24 records across destinations
  // ═══════════════════════════════════════════════════════════════
  const attractions = [
    // Maasai Mara
    {
      name: "Great Wildebeest Migration",
      slug: "great-migration",
      description:
        "Witness over 1.5 million wildebeest and zebras cross the Mara River — one of nature's greatest spectacles.",
      category: "Wildlife",
      destinationId: destinationMap["maasai-mara"].id,
    },
    {
      name: "Maasai Cultural Village Visit",
      slug: "maasai-cultural-village",
      description:
        "Immerse yourself in Maasai traditions, music, dance, and beadwork at an authentic manyatta.",
      category: "Cultural",
      destinationId: destinationMap["maasai-mara"].id,
    },
    {
      name: "Hot Air Balloon Safari",
      slug: "mara-balloon-safari",
      description:
        "Drift over the Mara plains at dawn and land to a champagne bush breakfast.",
      category: "Adventure",
      destinationId: destinationMap["maasai-mara"].id,
    },
    // Amboseli
    {
      name: "Elephant Research Camp",
      slug: "amboseli-elephants",
      description:
        "Visit the Amboseli Trust for Elephants and learn about the world's longest-running elephant study.",
      category: "Wildlife",
      destinationId: destinationMap["amboseli"].id,
    },
    {
      name: "Mount Kilimanjaro Views",
      slug: "kilimanjaro-views",
      description:
        "Enjoy spectacular views of Africa's highest peak at sunrise and sunset from Observation Hill.",
      category: "Adventure",
      destinationId: destinationMap["amboseli"].id,
    },
    // Diani
    {
      name: "Diani Beach Snorkeling",
      slug: "diani-snorkeling",
      description:
        "Explore vibrant coral reefs and swim with tropical fish at Kisite-Mpunguti Marine Park.",
      category: "Beach",
      destinationId: destinationMap["diani-beach"].id,
    },
    {
      name: "Sunset Dhow Cruise",
      slug: "diani-dhow-cruise",
      description:
        "Sail a traditional Swahili dhow along the coast as the sun sinks into the Indian Ocean.",
      category: "Beach",
      destinationId: destinationMap["diani-beach"].id,
    },
    {
      name: "Skydiving over Diani",
      slug: "diani-skydiving",
      description:
        "Tandem skydive from 12,000 feet with views of the reef, coastline, and inland savannah.",
      category: "Adventure",
      destinationId: destinationMap["diani-beach"].id,
    },
    // Lake Nakuru
    {
      name: "Flamingo Watching",
      slug: "nakuru-flamingos",
      description:
        "See thousands of flamingos and over 400 bird species along the shores of Lake Nakuru.",
      category: "Wildlife",
      destinationId: destinationMap["lake-nakuru"].id,
    },
    {
      name: "Rhino Tracking",
      slug: "nakuru-rhino-tracking",
      description:
        "Track both black and white rhinos in one of Kenya's most successful sanctuaries.",
      category: "Wildlife",
      destinationId: destinationMap["lake-nakuru"].id,
    },
    // Nairobi
    {
      name: "Nairobi National Park Safari",
      slug: "nairobi-safari",
      description:
        "The only national park within a capital city — spot rhinos and lions with skyscrapers on the horizon.",
      category: "Wildlife",
      destinationId: destinationMap["nairobi"].id,
    },
    {
      name: "Giraffe Centre",
      slug: "giraffe-centre",
      description:
        "Hand-feed endangered Rothschild giraffes at this world-famous conservation centre.",
      category: "Cultural",
      destinationId: destinationMap["nairobi"].id,
    },
    {
      name: "David Sheldrick Elephant Orphanage",
      slug: "sheldrick-elephants",
      description:
        "Meet orphaned baby elephants and learn about their rehabilitation before release into the wild.",
      category: "Wildlife",
      destinationId: destinationMap["nairobi"].id,
    },
    {
      name: "Karen Blixen Museum",
      slug: "karen-blixen-museum",
      description:
        "Step into the world of Out of Africa at the former home of the Danish author.",
      category: "Cultural",
      destinationId: destinationMap["nairobi"].id,
    },
    // Tsavo East
    {
      name: "Red Elephant Safari",
      slug: "tsavo-red-elephants",
      description:
        "Spot the famous red-dusted elephants of Tsavo, colored by the park's iron-rich soil.",
      category: "Wildlife",
      destinationId: destinationMap["tsavo-east"].id,
    },
    {
      name: "Lugard Falls",
      slug: "lugard-falls",
      description:
        "Rocky rapids on the Galana River, surrounded by dramatic black lava formations.",
      category: "Adventure",
      destinationId: destinationMap["tsavo-east"].id,
    },
    // Tsavo West
    {
      name: "Mzima Springs",
      slug: "mzima-springs",
      description:
        "Crystal-clear springs producing 250 million litres of water a day, with an underwater viewing chamber.",
      category: "Wildlife",
      destinationId: destinationMap["tsavo-west"].id,
    },
    {
      name: "Chyulu Hills",
      slug: "chyulu-hills",
      description:
        "Volcanic hills with lava tube caves and panoramic views toward Kilimanjaro.",
      category: "Adventure",
      destinationId: destinationMap["tsavo-west"].id,
    },
    // Samburu
    {
      name: "Samburu Special Five",
      slug: "samburu-special-five",
      description:
        "See the Grevy's zebra, reticulated giraffe, Beisa oryx, gerenuk, and Somali ostrich — all unique to northern Kenya.",
      category: "Wildlife",
      destinationId: destinationMap["samburu"].id,
    },
    // Lamu
    {
      name: "Lamu Old Town Walking Tour",
      slug: "lamu-walking-tour",
      description:
        "Wander the narrow streets of the UNESCO-listed Swahili settlement, visiting historic mosques and houses.",
      category: "Cultural",
      destinationId: destinationMap["lamu"].id,
    },
    {
      name: "Dhow Sailing to Shelа",
      slug: "lamu-dhow-shela",
      description:
        "Sail by traditional dhow to the tranquil beaches of Shela and enjoy a Swahili seafood lunch.",
      category: "Beach",
      destinationId: destinationMap["lamu"].id,
    },
    // Mount Kenya
    {
      name: "Point Lenana Trek",
      slug: "point-lenana-trek",
      description:
        "A four-day trek to Point Lenana (4,985m), the highest point reachable without technical climbing.",
      category: "Adventure",
      destinationId: destinationMap["mount-kenya"].id,
    },
    // Watamu
    {
      name: "Turtle Watching at Watamu",
      slug: "watamu-turtles",
      description:
        "Watch green and hawksbill turtles nest on Watamu's beaches — one of Kenya's oldest marine conservation efforts.",
      category: "Wildlife",
      destinationId: destinationMap["watamu"].id,
    },
  ];

  for (const a of attractions) {
    await prisma.attraction.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }

  console.log(`✔ Seeded ${attractions.length} attractions`);

  // ═══════════════════════════════════════════════════════════════
  // TOUR PACKAGES — 22 records
  // ═══════════════════════════════════════════════════════════════
  const packages = [
    {
      title: "3-Day Maasai Mara Safari",
      slug: "3-day-maasai-mara",
      summary: "Game drives in the world's most famous wildlife reserve.",
      description:
        "Enjoy three days of thrilling game drives in the Maasai Mara, with chances to see lions, elephants, and the Big Five. Includes full-board accommodation in a safari lodge, park fees, and a professional guide.",
      priceKes: 37060,
      durationDays: 3,
      destinationId: destinationMap["maasai-mara"].id,
      featured: true,
    },
    {
      title: "12-Hour Amboseli Day Trip",
      slug: "amboseli-day-trip",
      summary: "A quick escape to see elephants against Mount Kilimanjaro.",
      description:
        "Perfect for travellers short on time. Fly from Nairobi to Amboseli, enjoy a full-day game drive, lunch, and return the same evening.",
      priceKes: 65500,
      durationDays: 1,
      destinationId: destinationMap["amboseli"].id,
      featured: true,
    },
    {
      title: "5-Day Diani Beach Retreat",
      slug: "5-day-diani-retreat",
      summary: "Relax on Kenya's best beach with snorkeling and dhow cruises.",
      description:
        "Five days of sun, sand, and sea at Diani Beach. Includes snorkeling at Kisite Marine Park, a sunset dhow cruise, and beachfront resort accommodation.",
      priceKes: 89999,
      durationDays: 5,
      destinationId: destinationMap["diani-beach"].id,
      featured: false,
    },
    {
      title: "Nairobi City & Safari Experience",
      slug: "nairobi-city-safari",
      summary: "Explore Nairobi's culture, wildlife, and cuisine in 2 days.",
      description:
        "Visit Nairobi National Park, the Giraffe Centre, the David Sheldrick Elephant Orphanage, and the Maasai Market. Includes city hotel accommodation and meals.",
      priceKes: 28500,
      durationDays: 2,
      destinationId: destinationMap["nairobi"].id,
      featured: false,
    },
    {
      title: "Lake Nakuru & Rift Valley Explorer",
      slug: "nakuru-rift-valley",
      summary: "Flamingos, rhinos, and stunning Rift Valley scenery.",
      description:
        "A 2-day safari to Lake Nakuru National Park, known for its flamingo flocks and rhino sanctuary. Includes a stop at the Great Rift Valley viewpoint.",
      priceKes: 32000,
      durationDays: 2,
      destinationId: destinationMap["lake-nakuru"].id,
      featured: false,
    },
    {
      title: "7-Day Kenya Highlights Safari",
      slug: "7-day-kenya-highlights",
      summary: "Mara, Nakuru, and Amboseli in one classic week-long trip.",
      description:
        "The perfect introduction to Kenya's safari circuit. Seven days visiting Maasai Mara, Lake Nakuru, and Amboseli, with all park fees, full-board lodging, and a professional driver-guide.",
      priceKes: 189000,
      durationDays: 7,
      destinationId: destinationMap["maasai-mara"].id,
      featured: true,
    },
    {
      title: "10-Day Bush & Beach",
      slug: "10-day-bush-and-beach",
      summary: "Safari, then sand — the classic Kenyan honeymoon.",
      description:
        "Four days of game drives in the Mara and Amboseli, followed by five days of beachside relaxation at Diani. Includes internal flights and all transfers.",
      priceKes: 245000,
      durationDays: 10,
      destinationId: destinationMap["diani-beach"].id,
      featured: true,
    },
    {
      title: "4-Day Tsavo East & West",
      slug: "4-day-tsavo",
      summary: "Red elephants, lava flows, and Mzima Springs.",
      description:
        "Explore both halves of Tsavo — from the red elephants of Tsavo East to the volcanic landscapes and Mzima Springs of Tsavo West.",
      priceKes: 78000,
      durationDays: 4,
      destinationId: destinationMap["tsavo-east"].id,
      featured: false,
    },
    {
      title: "5-Day Samburu & Laikipia",
      slug: "5-day-samburu-laikipia",
      summary: "Northern Kenya's Special Five and community conservancies.",
      description:
        "Discover the arid beauty of Samburu and the community-run conservancies of Laikipia, home to the Samburu Special Five and Kenya's largest elephant populations.",
      priceKes: 132000,
      durationDays: 5,
      destinationId: destinationMap["samburu"].id,
      featured: true,
    },
    {
      title: "4-Day Lamu Cultural Escape",
      slug: "4-day-lamu",
      summary: "Swahili history, dhow sailing, and quiet beaches.",
      description:
        "Explore the UNESCO-listed Lamu Old Town, sail by traditional dhow to Shela, and unwind on untouched Indian Ocean beaches.",
      priceKes: 68000,
      durationDays: 4,
      destinationId: destinationMap["lamu"].id,
      featured: false,
    },
    {
      title: "6-Day Mount Kenya Trek",
      slug: "6-day-mount-kenya-trek",
      summary: "Summit Point Lenana via the Sirimon and Chogoria routes.",
      description:
        "A six-day trek through alpine meadows and glacial valleys, summiting Point Lenana (4,985m) at sunrise. Includes mountain huts, guides, and porters.",
      priceKes: 95000,
      durationDays: 6,
      destinationId: destinationMap["mount-kenya"].id,
      featured: false,
    },
    {
      title: "3-Day Hell's Gate & Naivasha",
      slug: "3-day-hells-gate-naivasha",
      summary: "Cycle among wildlife and boat past hippos.",
      description:
        "Cycle through Hell's Gate National Park alongside zebras and giraffes, then take a boat safari on Lake Naivasha to see hippos and fish eagles.",
      priceKes: 42000,
      durationDays: 3,
      destinationId: destinationMap["hells-gate"].id,
      featured: false,
    },
    {
      title: "5-Day Watamu Beach & Marine Park",
      slug: "5-day-watamu",
      summary: "Snorkeling, turtles, and the Italian-inflected coast.",
      description:
        "Explore the protected coral gardens of Watamu Marine National Park, watch turtles nest, and enjoy the laid-back coastal town of Watamu.",
      priceKes: 82000,
      durationDays: 5,
      destinationId: destinationMap["watamu"].id,
      featured: false,
    },
    {
      title: "2-Day Lake Naivasha Weekend",
      slug: "2-day-naivasha-weekend",
      summary: "The perfect weekend escape from Nairobi.",
      description:
        "A quick escape to the Rift Valley — boat safaris, Crescent Island walks, and sundowners overlooking the lake.",
      priceKes: 34000,
      durationDays: 2,
      destinationId: destinationMap["lake-naivasha"].id,
      featured: false,
    },
    {
      title: "3-Day Kakamega Forest Explorer",
      slug: "3-day-kakamega-forest",
      summary: "Kenya's only tropical rainforest.",
      description:
        "Three days in Kenya's last remaining tropical rainforest, with guided nature walks, birdwatching, and butterfly spotting.",
      priceKes: 45000,
      durationDays: 3,
      destinationId: destinationMap["kakamega-forest"].id,
      featured: false,
    },
    {
      title: "4-Day Lake Baringo & Bogoria",
      slug: "4-day-baringo-bogoria",
      summary: "Freshwater and alkaline lakes of the northern Rift.",
      description:
        "Visit two contrasting Rift Valley lakes — Baringo's birdlife and crocodiles, and Bogoria's hot springs and flamingos.",
      priceKes: 62000,
      durationDays: 4,
      destinationId: destinationMap["lake-baringo"].id,
      featured: false,
    },
    {
      title: "8-Day Best of Southern Kenya",
      slug: "8-day-southern-kenya",
      summary: "Nairobi, Amboseli, Tsavo, and Diani in one trip.",
      description:
        "A comprehensive southern circuit — Nairobi's cultural sites, Amboseli's elephants, Tsavo's red landscapes, and Diani's beaches.",
      priceKes: 198000,
      durationDays: 8,
      destinationId: destinationMap["diani-beach"].id,
      featured: true,
    },
    {
      title: "3-Day Malindi & Gedi Ruins",
      slug: "3-day-malindi-gedi",
      summary: "Historic Swahili coast and marine park.",
      description:
        "Discover Malindi's Italian-Swahili culture, the ancient Gedi ruins, and the coral gardens of Malindi Marine National Park.",
      priceKes: 52000,
      durationDays: 3,
      destinationId: destinationMap["malindi"].id,
      featured: false,
    },
    {
      title: "5-Day Samburu Flying Safari",
      slug: "5-day-samburu-flying",
      summary: "Fly-in luxury safari to northern Kenya.",
      description:
        "Skip the long drive — fly directly from Nairobi to Samburu for a luxury tented-camp experience with guided game drives.",
      priceKes: 225000,
      durationDays: 5,
      destinationId: destinationMap["samburu"].id,
      featured: false,
    },
    {
      title: "2-Day Nairobi National Park & City",
      slug: "2-day-nairobi-park-city",
      summary: "Wildlife and culture in a weekend.",
      description:
        "A compact weekend pairing Nairobi National Park's lions and rhinos with the Giraffe Centre, Karen Blixen Museum, and Maasai Market.",
      priceKes: 26000,
      durationDays: 2,
      destinationId: destinationMap["nairobi-national-park"].id,
      featured: false,
    },
    {
      title: "4-Day Maasai Mara Budget Camping",
      slug: "4-day-mara-camping",
      summary: "The Mara experience on a budget.",
      description:
        "Four days in the Mara staying at a comfortable tented camp, with shared game drives and all park fees included.",
      priceKes: 58000,
      durationDays: 4,
      destinationId: destinationMap["maasai-mara"].id,
      featured: false,
    },
    {
      title: "6-Day Honeymoon Safari & Diani",
      slug: "6-day-honeymoon",
      summary: "Intimate safari nights and ocean days.",
      description:
        "Three nights in a private safari camp in the Mara, then three nights at a luxury beachfront resort on Diani. Includes private guide and romantic dinners.",
      priceKes: 320000,
      durationDays: 6,
      destinationId: destinationMap["maasai-mara"].id,
      featured: false,
    },
  ];

  for (const p of packages) {
    await prisma.tourPackage.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log(`✔ Seeded ${packages.length} tour packages`);

  // ═══════════════════════════════════════════════════════════════
  // ACCOMMODATIONS — 24 records
  // ═══════════════════════════════════════════════════════════════
  const accommodations = [
    // Maasai Mara
    {
      name: "Mara Serena Safari Lodge",
      slug: "mara-serena",
      type: "Lodge",
      description:
        "Luxury lodge perched on a hill with panoramic views of the Mara plains.",
      location: "Maasai Mara, Narok",
      priceRange: "KES 25,000 - 55,000",
      destinationId: destinationMap["maasai-mara"].id,
    },
    {
      name: "Angama Mara",
      slug: "angama-mara",
      type: "Lodge",
      description:
        "Award-winning tented suites suspended above the Great Rift Valley with views over the Mara Triangle.",
      location: "Maasai Mara, Narok",
      priceRange: "KES 90,000 - 180,000",
      destinationId: destinationMap["maasai-mara"].id,
    },
    {
      name: "Governors' Camp",
      slug: "governors-camp",
      type: "Tented Camp",
      description:
        "One of the original Mara camps, on the banks of the Mara River, famous for its colonial-era charm.",
      location: "Maasai Mara, Narok",
      priceRange: "KES 60,000 - 120,000",
      destinationId: destinationMap["maasai-mara"].id,
    },
    {
      name: "Mara Sopa Lodge",
      slug: "mara-sopa",
      type: "Lodge",
      description:
        "Rustic lodge with individual cottages spread across landscaped grounds, ideal for families.",
      location: "Maasai Mara, Narok",
      priceRange: "KES 18,000 - 35,000",
      destinationId: destinationMap["maasai-mara"].id,
    },
    // Amboseli
    {
      name: "Amboseli Serena Safari Lodge",
      slug: "amboseli-serena",
      type: "Lodge",
      description:
        "Nestled in a grove of acacia trees with uninterrupted views of Mount Kilimanjaro.",
      location: "Amboseli, Kajiado",
      priceRange: "KES 22,000 - 48,000",
      destinationId: destinationMap["amboseli"].id,
    },
    {
      name: "Tortilis Camp",
      slug: "tortilis-camp",
      type: "Tented Camp",
      description:
        "Eco-friendly tented camp on the edge of Amboseli, overlooking Mount Kilimanjaro.",
      location: "Amboseli, Kajiado",
      priceRange: "KES 40,000 - 75,000",
      destinationId: destinationMap["amboseli"].id,
    },
    {
      name: "Ol Tukai Lodge",
      slug: "ol-tukai",
      type: "Lodge",
      description:
        "Classic Amboseli lodge surrounded by fever trees, with a hippo pool nearby.",
      location: "Amboseli, Kajiado",
      priceRange: "KES 26,000 - 52,000",
      destinationId: destinationMap["amboseli"].id,
    },
    // Diani
    {
      name: "Diani Sea Resort",
      slug: "diani-sea-resort",
      type: "Resort",
      description:
        "Beachfront resort with pools, water sports, and all-inclusive dining options.",
      location: "Diani Beach, Kwale",
      priceRange: "KES 18,000 - 40,000",
      destinationId: destinationMap["diani-beach"].id,
    },
    {
      name: "Almanara Luxury Villas",
      slug: "almanara-villas",
      type: "Resort",
      description:
        "Private beachfront villas with dedicated staff, perfect for families and small groups.",
      location: "Diani Beach, Kwale",
      priceRange: "KES 80,000 - 150,000",
      destinationId: destinationMap["diani-beach"].id,
    },
    {
      name: "The Sands at Nomad",
      slug: "sands-nomad",
      type: "Resort",
      description:
        "Boutique beach resort with colonial-style architecture and an award-winning restaurant.",
      location: "Diani Beach, Kwale",
      priceRange: "KES 30,000 - 65,000",
      destinationId: destinationMap["diani-beach"].id,
    },
    // Lake Nakuru
    {
      name: "Sarova Lion Hill Lodge",
      slug: "sarova-lion-hill",
      type: "Lodge",
      description:
        "Set on a plateau overlooking Lake Nakuru, ideal for birdwatchers and rhino spotting.",
      location: "Lake Nakuru, Nakuru",
      priceRange: "KES 20,000 - 45,000",
      destinationId: destinationMap["lake-nakuru"].id,
    },
    {
      name: "Lake Nakuru Lodge",
      slug: "lake-nakuru-lodge",
      type: "Lodge",
      description:
        "Family-run lodge inside the park, with views of the lake and easy access to game drives.",
      location: "Lake Nakuru, Nakuru",
      priceRange: "KES 16,000 - 32,000",
      destinationId: destinationMap["lake-nakuru"].id,
    },
    // Nairobi
    {
      name: "The Norfolk Hotel",
      slug: "norfolk-hotel",
      type: "Hotel",
      description:
        "Historic 5-star hotel in the heart of Nairobi, founded in 1904.",
      location: "Nairobi CBD",
      priceRange: "KES 15,000 - 35,000",
      destinationId: destinationMap["nairobi"].id,
    },
    {
      name: "Giraffe Manor",
      slug: "giraffe-manor",
      type: "Hotel",
      description:
        "Iconic boutique hotel where endangered Rothschild giraffes poke their heads through the windows at breakfast.",
      location: "Langata, Nairobi",
      priceRange: "KES 120,000 - 220,000",
      destinationId: destinationMap["nairobi"].id,
    },
    {
      name: "Hemingways Nairobi",
      slug: "hemingways-nairobi",
      type: "Hotel",
      description:
        "Luxury suites in the leafy suburb of Karen, with butler service and a renowned spa.",
      location: "Karen, Nairobi",
      priceRange: "KES 55,000 - 95,000",
      destinationId: destinationMap["nairobi"].id,
    },
    // Tsavo East
    {
      name: "Ashnil Aruba Lodge",
      slug: "ashnil-aruba",
      type: "Lodge",
      description:
        "Comfortable lodge overlooking an active waterhole in Tsavo East, popular with elephant herds.",
      location: "Tsavo East, Taita-Taveta",
      priceRange: "KES 22,000 - 45,000",
      destinationId: destinationMap["tsavo-east"].id,
    },
    {
      name: "Satao Camp",
      slug: "satao-camp",
      type: "Tented Camp",
      description:
        "Classic tented camp in Tsavo East with a waterhole in front of the restaurant.",
      location: "Tsavo East, Taita-Taveta",
      priceRange: "KES 28,000 - 55,000",
      destinationId: destinationMap["tsavo-east"].id,
    },
    // Tsavo West
    {
      name: "Kilaguni Serena Safari Lodge",
      slug: "kilaguni-serena",
      type: "Lodge",
      description:
        "Tsavo West's oldest lodge, with a waterhole visible from the restaurant and views of Kilimanjaro.",
      location: "Tsavo West, Taita-Taveta",
      priceRange: "KES 24,000 - 48,000",
      destinationId: destinationMap["tsavo-west"].id,
    },
    // Samburu
    {
      name: "Samburu Sopa Lodge",
      slug: "samburu-sopa",
      type: "Lodge",
      description:
        "Rondavel-style lodge on a hilltop in Samburu, with views over the river valley.",
      location: "Samburu National Reserve",
      priceRange: "KES 20,000 - 40,000",
      destinationId: destinationMap["samburu"].id,
    },
    {
      name: "Elephant Bedroom Camp",
      slug: "elephant-bedroom-camp",
      type: "Tented Camp",
      description:
        "Intimate luxury camp on the Ewaso Ng'iro river, frequently visited by elephants at the camp's edge.",
      location: "Samburu National Reserve",
      priceRange: "KES 65,000 - 125,000",
      destinationId: destinationMap["samburu"].id,
    },
    // Lamu
    {
      name: "The Majlis Resort",
      slug: "majlis-lamu",
      type: "Resort",
      description:
        "Beachfront boutique resort on Manda Island, with views across the channel to Lamu Old Town.",
      location: "Manda Island, Lamu",
      priceRange: "KES 45,000 - 95,000",
      destinationId: destinationMap["lamu"].id,
    },
    {
      name: "Peponi Hotel",
      slug: "peponi-hotel",
      type: "Hotel",
      description:
        "Legendary Swahili-style hotel on Shela beach, run by the Korschen family since 1967.",
      location: "Shela, Lamu",
      priceRange: "KES 28,000 - 55,000",
      destinationId: destinationMap["lamu"].id,
    },
    // Mount Kenya
    {
      name: "Fairmont Mount Kenya Safari Club",
      slug: "fairmont-mt-kenya",
      type: "Hotel",
      description:
        "Historic resort at the foot of Mount Kenya, once owned by William Holden and frequented by celebrities.",
      location: "Nanyuki, Laikipia",
      priceRange: "KES 35,000 - 75,000",
      destinationId: destinationMap["mount-kenya"].id,
    },
    // Watamu
    {
      name: "Medina Palms",
      slug: "medina-palms",
      type: "Resort",
      description:
        "Contemporary suites and rooftop pools on Watamu's Turtle Bay, a short walk from the marine park.",
      location: "Watamu, Kilifi",
      priceRange: "KES 32,000 - 65,000",
      destinationId: destinationMap["watamu"].id,
    },
  ];

  for (const a of accommodations) {
    await prisma.accommodation.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }

  console.log(`✔ Seeded ${accommodations.length} accommodations`);

  // ═══════════════════════════════════════════════════════════════
  // EVENTS — 20 records
  // ═══════════════════════════════════════════════════════════════
  const events = [
    {
      name: "Magical Kenya Travel Expo (MKTE) 2026",
      slug: "mkte-2026",
      description:
        "Kenya's premier travel trade show, bringing together global buyers, exhibitors, and tourism leaders for networking and partnership opportunities.",
      startDate: new Date("2026-10-06"),
      endDate: new Date("2026-10-08"),
      location: "Nairobi, Kenya",
      featured: true,
    },
    {
      name: "Wildebeest Migration Season",
      slug: "migration-season-2026",
      description:
        "The annual Great Migration brings over 1.5 million wildebeest and zebras into the Maasai Mara from the Serengeti.",
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-10-31"),
      location: "Maasai Mara National Reserve",
      featured: true,
    },
    {
      name: "Lamu Cultural Festival",
      slug: "lamu-cultural-festival-2026",
      description:
        "A celebration of Swahili culture with dhow races, donkey races, traditional dances, and poetry.",
      startDate: new Date("2026-11-20"),
      endDate: new Date("2026-11-23"),
      location: "Lamu Island",
      featured: false,
    },
    {
      name: "Safari Rally Kenya 2026",
      slug: "safari-rally-2026",
      description:
        "Round 3 of the World Rally Championship, held on the grueling gravel roads of Naivasha and the Rift Valley.",
      startDate: new Date("2026-03-19"),
      endDate: new Date("2026-03-22"),
      location: "Naivasha, Nakuru County",
      featured: true,
    },
    {
      name: "Maralal International Camel Derby",
      slug: "maralal-camel-derby-2026",
      description:
        "A unique cultural and sporting event featuring camel races, cycling, and Samburu traditions.",
      startDate: new Date("2026-08-07"),
      endDate: new Date("2026-08-09"),
      location: "Maralal, Samburu County",
      featured: false,
    },
    {
      name: "Mombasa Carnival",
      slug: "mombasa-carnival-2026",
      description:
        "An annual street parade celebrating Swahili, Arab, Indian, and African heritage on the coast.",
      startDate: new Date("2026-11-01"),
      endDate: new Date("2026-11-03"),
      location: "Mombasa",
      featured: true,
    },
    {
      name: "Nairobi International Trade Fair",
      slug: "nairobi-trade-fair-2026",
      description:
        "East and Central Africa's largest trade exhibition, showcasing agriculture, tourism, and industry.",
      startDate: new Date("2026-09-28"),
      endDate: new Date("2026-10-04"),
      location: "Jamhuri Park, Nairobi",
      featured: false,
    },
    {
      name: "Kenya Music Festival 2026",
      slug: "kenya-music-festival-2026",
      description:
        "The annual national music competition, from primary school choirs to professional ensembles.",
      startDate: new Date("2026-08-10"),
      endDate: new Date("2026-08-15"),
      location: "Nairobi",
      featured: false,
    },
    {
      name: "Lake Turkana Festival",
      slug: "turkana-festival-2026",
      description:
        "A celebration of the cultural diversity of the Turkana basin's tribes — El Molo, Rendille, Samburu, Turkana, Dassanech, and more.",
      startDate: new Date("2026-06-12"),
      endDate: new Date("2026-06-14"),
      location: "Loiyangalani, Marsabit County",
      featured: false,
    },
    {
      name: "Rhino Charge 2026",
      slug: "rhino-charge-2026",
      description:
        "An off-road motorsport event that raises funds for rhino conservation across Kenya.",
      startDate: new Date("2026-06-06"),
      endDate: null,
      location: "Laikipia",
      featured: false,
    },
    {
      name: "Kenya Open Golf Championship",
      slug: "kenya-open-golf-2026",
      description:
        "One of Africa's oldest and most prestigious golf tournaments, part of the Sunshine Tour.",
      startDate: new Date("2026-02-19"),
      endDate: new Date("2026-02-22"),
      location: "Karen Country Club, Nairobi",
      featured: false,
    },
    {
      name: "Kisumu Fish Festival",
      slug: "kisumu-fish-festival-2026",
      description:
        "A lakeside celebration of Luo culture, Lake Victoria's tilapia, and traditional music.",
      startDate: new Date("2026-12-11"),
      endDate: new Date("2026-12-13"),
      location: "Kisumu",
      featured: false,
    },
    {
      name: "Lewa Safari Marathon",
      slug: "lewa-marathon-2026",
      description:
        "A world-famous marathon run entirely inside a wildlife conservancy, raising funds for conservation and community projects.",
      startDate: new Date("2026-06-27"),
      endDate: null,
      location: "Lewa Wildlife Conservancy, Laikipia",
      featured: true,
    },
    {
      name: "Malindi Cultural Festival",
      slug: "malindi-festival-2026",
      description:
        "A coastal celebration of Swahili, Italian, and Arab influences in Malindi's history.",
      startDate: new Date("2026-11-27"),
      endDate: new Date("2026-11-29"),
      location: "Malindi",
      featured: false,
    },
    {
      name: "Koroga Festival",
      slug: "koroga-festival-2026",
      description:
        "A quarterly outdoor music and food festival featuring Kenyan and international artists.",
      startDate: new Date("2026-04-05"),
      endDate: new Date("2026-04-05"),
      location: "Nairobi",
      featured: false,
    },
    {
      name: "Nairobi Restaurant Week",
      slug: "nairobi-restaurant-week-2026",
      description:
        "Ten days of fixed-price menus across Nairobi's top restaurants, celebrating Kenyan cuisine.",
      startDate: new Date("2026-02-06"),
      endDate: new Date("2026-02-16"),
      location: "Nairobi",
      featured: false,
    },
    {
      name: "Blankets & Wine",
      slug: "blankets-and-wine-2026",
      description:
        "A monthly open-air concert showcasing Kenyan and East African live music.",
      startDate: new Date("2026-01-25"),
      endDate: null,
      location: "Nairobi",
      featured: false,
    },
    {
      name: "Kili Marathon",
      slug: "kili-marathon-2026",
      description:
        "A marathon run at the foot of Mount Kilimanjaro, starting and finishing in Amboseli.",
      startDate: new Date("2026-03-01"),
      endDate: null,
      location: "Amboseli",
      featured: false,
    },
    {
      name: "Kijani Festival",
      slug: "kijani-festival-2026",
      description:
        "A music and arts festival held on the shores of Lake Naivasha, blending Kenyan and international acts.",
      startDate: new Date("2026-09-12"),
      endDate: new Date("2026-09-13"),
      location: "Lake Naivasha",
      featured: false,
    },
    {
      name: "Marathon des Sables Kenya",
      slug: "marathon-des-sables-2026",
      description:
        "An ultra-marathon through the Chalbi Desert, part of the global Marathon des Sables series.",
      startDate: new Date("2026-07-18"),
      endDate: new Date("2026-07-24"),
      location: "Chalbi Desert, Marsabit County",
      featured: false,
    },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: e,
    });
  }

  console.log(`✔ Seeded ${events.length} events`);

  // ═══════════════════════════════════════════════════════════════
  // BLOG POSTS — 20 records
  // ═══════════════════════════════════════════════════════════════
  const posts = [
    {
      title: "The Best Time to Visit the Maasai Mara",
      slug: "best-time-to-visit-maasai-mara",
      excerpt:
        "Migration season vs. green season — what each offers, and when to book for the best rates.",
      content: `The Maasai Mara is spectacular year-round, but the experience varies dramatically by season.

Peak season runs from July to October, coinciding with the Great Wildebeest Migration. This is when over 1.5 million wildebeest and zebras cross the Mara River from the Serengeti. Expect premium rates, packed lodges, and spectacular river crossings — but also the best wildlife viewing of the year.

The green season (November to May) is quieter and much cheaper. Rates can drop 40–60% compared to peak. The landscape is lush after the short rains, birdlife is abundant, and you often have sightings almost to yourself. The trade-off is that some camps close, and roads can be muddy.

If you want to see the migration without the crowds, consider late June or early November — shoulder seasons with reasonable rates and good viewing.`,
      tags: ["Safari", "Wildlife", "Planning"],
      published: true,
      publishedAt: new Date("2026-09-12"),
    },
    {
      title: "A First-Timer's Guide to Diani Beach",
      slug: "diani-beach-guide",
      excerpt:
        "Where to stay, what to eat, and how to get the most out of Kenya's award-winning coastline.",
      content: `Diani Beach stretches for 17 kilometres along the Indian Ocean, south of Mombasa in Kwale County. It's consistently ranked among Africa's best beaches, and for good reason — powder-white sand, warm turquoise water, and a coral reef that shelters the shoreline.

Getting there is straightforward. Fly into Moi International Airport (MBA) in Mombasa, then take a 45-minute taxi or the Likoni Ferry. Alternatively, fly directly into Ukunda airstrip (UKA), which sits right next to Diani.

Where to stay depends on what you want. The northern end near the Kongo River is quieter, with boutique hotels and private villas. The southern stretch has larger resorts with full amenities — pools, spas, and dive centres.

Don't miss: snorkeling or diving at Kisite-Mpunguti Marine Park, a sunset dhow cruise, and a day trip to the Shimba Hills for the rare sable antelope. For food, try the fresh seafood at one of the beachfront restaurants — the crab and prawns are exceptional.

Best time to visit is December to March (dry, sunny) or July to October (cooler, fewer crowds). Avoid April and May, when the long rains hit.`,
      tags: ["Beach", "Coast", "Planning"],
      published: true,
      publishedAt: new Date("2026-08-28"),
    },
    {
      title: "Kenya Visa & Entry Guide for 2026",
      slug: "kenya-visa-guide-2026",
      excerpt:
        "Everything you need to know about the eTA, vaccinations, and what to have ready at the border.",
      content: `Kenya introduced the Electronic Travel Authorisation (eTA) in early 2024, replacing traditional visas for most visitors. Here's what you need to know for a smooth arrival.

Apply online at etakenya.go.ke before you travel. Processing typically takes three working days, but apply at least a week ahead in case of delays. The fee is USD 30 for most nationalities, and the eTA is valid for 90 days from approval.

You'll need: a passport valid for at least six months beyond your arrival date, a recent passport-style photo, your flight itinerary, and accommodation details for the first night.

Yellow fever vaccination is required if you're arriving from a yellow-fever-endemic country. Otherwise, it's recommended but not mandatory. Check with your travel clinic about malaria prophylaxis if you're heading to the coast or safari areas.

At the border, you may be asked for proof of onward travel and sufficient funds. Have your return ticket and a bank statement or credit card ready.`,
      tags: ["Planning", "Visa"],
      published: true,
      publishedAt: new Date("2026-08-05"),
    },
    {
      title: "Packing for a Kenyan Safari: The Complete List",
      slug: "safari-packing-list",
      excerpt:
        "What to bring, what to leave behind, and why neutral colors matter on game drives.",
      content: `Packing for a safari is different from packing for a beach holiday. Here's what actually matters.

Clothing: Neutral colors — khaki, olive, beige, brown. Avoid bright blue and black, which attract tsetse flies. Layers are key: mornings are cool, midday is hot, evenings cool down again. A light fleece or jacket for dawn game drives.

Footwear: Comfortable closed shoes for game drives, sandals for around camp. Skip the hiking boots unless you're trekking.

Gear: Binoculars (one pair per person), a camera with a zoom lens of at least 200mm, spare batteries, and plenty of memory cards. A wide-brimmed hat. Sunscreen. Insect repellent.

Documents: Passport, eTA confirmation, travel insurance, vaccination certificate.`

,
      tags: ["Safari", "Planning"],
      published: true,
      publishedAt: new Date("2026-07-22"),
    },
    {
      title: "The Great Migration: A Month-by-Month Guide",
      slug: "great-migration-month-by-month",
      excerpt:
        "Follow the wildebeest from the Serengeti to the Mara and back — and know when to book.",
      content: `The Great Migration is a year-round cycle. Understanding it lets you pick the right month and location.

January to March: The herds are calving in the southern Serengeti. Predator action is intense; this is a photographer's dream.

April to May: The herds move north through the central Serengeti. Many camps close in Kenya during the long rains.

June: The first wildebeest cross the Grumeti River in Tanzania. Kenya's Mara camps begin to fill.

July to August: The famous Mara River crossings. This is what everyone comes for, and it's spectacular — but crowded and expensive.

September to October: The herds spread across the Mara plains. Still excellent viewing.

November: The herds begin moving south again. Some Mara camps close; rates drop.

December: The herds are back in the Serengeti. The cycle begins again.`,
      tags: ["Wildlife", "Safari", "Planning"],
      published: true,
      publishedAt: new Date("2026-07-10"),
    },
    {
      title: "Kenyan Coffee: A Traveler's Guide",
      slug: "kenyan-coffee-guide",
      excerpt:
        "From the slopes of Mount Kenya to your morning cup — where to taste the real thing.",
      content: `Kenyan coffee is among the finest in the world. If you're visiting, here's how to taste it properly.

The growing regions: Nyeri, Kirinyaga, Murang'a, and the slopes of Mount Kenya produce the most prized beans. The high altitude, volcanic soil, and equatorial sun create a bright, fruity, blackcurrant-forward profile.

Where to taste: In Nairobi, look for specialty coffee shops like Spring Valley Coffee, The Boston Coffee House, and Connect Coffee Roasters. In Nyeri, visit a coffee estate and see the full process — picking, pulping, drying, roasting.

What to buy: Single-origin AA beans, roasted within the last two weeks. Ask for the roast date. Avoid anything pre-ground.

What to avoid: Over-roasted "espresso blends" that bury the origin character under charred flavors. Kenyan beans deserve a light to medium roast.`,
      tags: ["Culture", "Nairobi"],
      published: true,
      publishedAt: new Date("2026-06-30"),
    },
    {
      title: "Nairobi in 48 Hours",
      slug: "nairobi-48-hours",
      excerpt:
        "The perfect weekend itinerary for Kenya's capital — wildlife, culture, and food.",
      content: `Most travelers pass through Nairobi on the way to a safari. Don't. The city deserves two full days.

Day 1 — Wildlife and history.

Morning: Nairobi National Park. Yes, you can see lions, rhinos, and buffalo with the skyline in the background. Go at dawn.

Midday: The David Sheldrick Wildlife Trust. Book ahead to attend the 11am elephant feeding.

Afternoon: The Giraffe Centre in Langata. Feed Rothschild giraffes from a raised platform.

Evening: Dinner at Talisman or Mama Oliech (for the tilapia).

Day 2 — Culture and craft.

Morning: The Karen Blixen Museum. See the house from Out of Africa.

Midday: The Maasai Market (different locations on different days — check before you go).

Afternoon: The Nairobi Railway Museum or the Nairobi National Museum.

Evening: Sundowners at the rooftop of the Sarova Stanley, then dinner at Fogo Gaucho or About Thyme.`,
      tags: ["Nairobi", "Culture", "Planning"],
      published: true,
      publishedAt: new Date("2026-06-14"),
    },
    {
      title: "Diani vs. Watamu: Which Kenyan Beach?",
      slug: "diani-vs-watamu",
      excerpt:
        "Two of Kenya's best coast destinations compared — crowds, reefs, and vibes.",
      content: `Both are spectacular. But they're different experiences.

Diani is the more developed of the two — larger resorts, more restaurants, better infrastructure. It's south of Mombasa, easy to reach, and offers easy access to Kisite-Mpunguti Marine Park for snorkeling.

Watamu is quieter, smaller, and more Italian-influenced (a legacy of decades of Italian tourism). Its marine park is right offshore — you can snorkel from the beach at low tide. Turtles nest on Watamu's beaches.

Choose Diani if: You want options, amenities, and a range of accommodation from budget to luxury.

Choose Watamu if: You want a slower pace, easy reef access, and a more intimate scale.

Both have excellent beaches. Both have warm water year-round. Neither is a mistake.`,
      tags: ["Beach", "Coast"],
      published: true,
      publishedAt: new Date("2026-05-28"),
    },
    {
      title: "Kenya's Big Five (and Where to See Them)",
      slug: "kennys-big-five",
      excerpt:
        "Lion, leopard, elephant, buffalo, rhino — where to go for each.",
      content: `The Big Five — lion, leopard, elephant, buffalo, and rhino — were originally named for the difficulty of hunting them. Today they're the bucket-list animals for most safari-goers.

Lion: Maasai Mara and Amboseli are the best bets. The Mara's open plains make them easy to spot.

Leopard: The Mara and Samburu. Leopards are solitary and elusive, but the Mara's riverine forest along the Mara River is one of the best places in Africa.

Elephant: Amboseli for the big tuskers against Kilimanjaro; Samburu for the "Samburu Special Five" including elephants.

Buffalo: Any major park. Huge herds are common in the Mara and Tsavo.

Rhino: Lake Nakuru and Nairobi National Park are the most reliable. Both have fenced sanctuaries.`,
      tags: ["Wildlife", "Safari"],
      published: true,
      publishedAt: new Date("2026-05-11"),
    },
    {
      title: "A Guide to the Swahili Coast",
      slug: "swahili-coast-guide",
      excerpt:
        "Lamu, Mombasa, Malindi — the history, culture, and food of Kenya's Indian Ocean.",
      content: `Kenya's coast is not just beaches. It's one of the oldest continuous cultural regions in the world — a thousand years of Swahili civilization shaped by Arab, Persian, Indian, and African influence.

Lamu is the most intact historic town in East Africa. Cars are almost nonexistent; donkeys and dhows are the transport. The architecture is coral stone and mangrove timber, with carved wooden doors that are works of art in themselves.

Mombasa is the largest coastal city. Fort Jesus (a UNESCO World Heritage Site) tells the story of Portuguese, Omani, and British rule. Old Town's narrow streets and markets are worth a half day.

Malindi has a distinctive Italian character from decades of Italian tourism, but beneath it lies a Swahili town with ancient ruins nearby — Gedi, a medieval city abandoned in the 17th century.

Food on the coast: coconut curries, biryani, pilau, fresh seafood, and the Swahili version of samosas (called "sambusa"). Eat at the fish market in Mombasa, or the waterfront in Lamu.`,
      tags: ["Coast", "Culture", "Beach"],
      published: true,
      publishedAt: new Date("2026-04-22"),
    },
    {
      title: "Safety Tips for Traveling in Kenya",
      slug: "safety-tips-kenya",
      excerpt:
        "How to stay safe and avoid the common pitfalls — from Nairobi streets to safari camps.",
      content: `Kenya is generally safe for tourists who take reasonable precautions. Here's what matters.

In cities: Avoid walking alone at night. Use hotel-arranged transport after dark. Keep valuables out of sight. Don't walk with your phone out.

In Nairobi specifically: The Central Business District is busy and generally safe during the day. Avoid the areas around River Road at night.

On safari: Follow your guide's instructions without question. Don't leave your tent at night unless you're escorted. Don't walk between vehicles.

On the coast: Diani, Watamu, and Lamu are safe for tourists. Mombasa is generally fine but stick to populated areas.

Transport: Use Uber or Bolt in Nairobi and Mombasa. For intercity travel, use reputable coaches like Easy Coach or modern shuttle services.

Emergency: Police 999 or 112. Tourist Police hotline: +254 20 341 4955.`,
      tags: ["Planning", "Safety"],
      published: true,
      publishedAt: new Date("2026-04-05"),
    },
    {
      title: "Wildlife Photography in Kenya: A Beginner's Guide",
      slug: "wildlife-photography-guide",
      excerpt:
        "Gear, settings, and etiquette for capturing Kenya's wildlife on camera.",
      content: `Kenya is one of the best wildlife photography destinations on earth. Here's how to make the most of it.

The single most important piece of gear: a zoom lens. A 100-400mm or 200-500mm is ideal. Bring more reach than you think you need — you'll use it.

Camera settings for wildlife: Shutter priority at 1/1000s or faster for moving animals. Continuous autofocus with animal eye detection. High-speed burst mode.

Golden hour is everything. Most photographers shoot from 6–9am and again from 4–6:30pm. Midday light is harsh and flat.

Ethics: Never ask your guide to move off-road for a photo. Don't crowd wildlife at a sighting. Turn off flash. Don't use drones in national parks (it's illegal).

What to photograph besides animals: The landscapes at golden hour. Maasai and Samburu people (ask permission first). The texture of the savannah. Your fellow travelers. The story, not just the trophy shot.`,
      tags: ["Wildlife", "Photography", "Safari"],
      published: true,
      publishedAt: new Date("2026-03-18"),
    },
    {
      title: "The Samburu Special Five",
      slug: "samburu-special-five",
      excerpt:
        "Five species you won't see anywhere else in Kenya — and why Samburu is worth the drive.",
      content: `Samburu National Reserve, 350 kilometres north of Nairobi, is home to five species that are unique or nearly unique to northern Kenya. Together they're called the "Samburu Special Five."

Grevy's zebra: The largest zebra species, with narrow stripes and a white belly. Fewer than 3,000 remain in the wild.

Reticulated giraffe: Sharp, geometric pattern rather than the softer patches of other giraffes. Considered a distinct species since 2016.

Beisa oryx: Long, straight horns. Adapted to desert and semi-desert.

Gerenuk: A long-necked antelope that stands on its hind legs to reach higher branches. Nicknamed the "giraffe gazelle."

Somali ostrich: A distinct species with blue-grey legs and neck (males) or brown feathers (females).

All five can often be seen in a single day in Samburu. The reserve is also home to leopards, lions, cheetahs, and elephants.`,
      tags: ["Wildlife", "Safari"],
      published: true,
      publishedAt: new Date("2026-03-01"),
    },
    {
      title: "Kenya's Best Safari Lodges for a Splurge",
      slug: "kenya-splurge-lodges",
      excerpt:
        "Where to spend when you want the trip of a lifetime — luxury camps and lodges worth the price.",
      content: `Some trips deserve the top tier. Here are Kenya's standout splurge properties.

Angama Mara (Maasai Mara): Suspended on the edge of the Rift Valley with views over the Mara Triangle. Suites are canvas and glass; the service is faultless.

Giraffe Manor (Nairobi): The most photographed hotel in Kenya. Waking up to a Rothschild giraffe at your window is the whole point.

Tortilis Camp (Amboseli): Intimate tented camp on the edge of Amboseli, with Kilimanjaro framed by every view.

Elephant Bedroom Camp (Samburu): Elephants regularly walk through camp. The tented suites are spacious and beautiful.

The Majlis (Lamu): Beachfront resort on Manda Island with views across the channel to Lamu Old Town.

Segera Retreat (Laikipia): A private conservancy with a mix of art, conservation, and luxury. Five-star.

These are expensive — but if you're going to splurge once, this is the list.`,
      tags: ["Safari", "Planning", "Stay"],
      published: true,
      publishedAt: new Date("2026-02-12"),
    },
    {
      title: "Traveling Kenya on a Budget",
      slug: "kennys-budget-travel",
      excerpt:
        "How to see the best of Kenya without spending a fortune — camps, matatus, and local food.",
      content: `Kenya can be expensive. It can also be surprisingly affordable. Here's how to do it on a budget.

Safari: Budget camping safaris (shared game drives, basic tents) run from KES 15,000–25,000 per day. They're not luxury, but they're real safaris.

Accommodation: Hostels in Nairobi start around KES 2,000 per night. Airbnb and guesthouses in Diani can be under KES 5,000. Mid-range lodges in most parks run KES 10,000–20,000.

Transport: Matatus connect every major town cheaply. A Nairobi-to-Mombasa bus is around KES 1,500. Standard-gauge railway is even cheaper.

Food: Eat where locals eat. A plate of nyama choma at a local grill is KES 300–500. Ugali and sukuma wiki at a roadside hotel is KES 150. Nairobi has excellent Ethiopian, Indian, and Swahili food at reasonable prices.

Parks: Kenya Wildlife Service park fees vary — around USD 60–80 per adult per day for the popular parks. Nairobi National Park is the cheapest, and it's inside the city.`,
      tags: ["Planning", "Budget"],
      published: true,
      publishedAt: new Date("2026-01-25"),
    },
    {
      title: "A Guide to Nyama Choma",
      slug: "nyama-choma-guide",
      excerpt:
        "Kenya's national dish — where to eat it, how to order it, and what to expect.",
      content: `Nyama choma means "roasted meat" in Swahili. It's Kenya's unofficial national dish, and eating it is a cultural experience as much as a meal.

What it is: Goat, beef, or chicken, roasted over charcoal until the outside is crisp and the inside is tender. Served with ugali (maize meal), kachumbari (tomato and onion salad), and sometimes sukuma wiki (collard greens).

Where to eat it: The best nyama choma is at local joints, not tourist restaurants. In Nairobi, try the areas around Kikuyu, Ngong Road, and the famous "Nyama Choma Trail" along Langata Road.

How to order: You point at the cut of meat you want — a "quarter" or "half" of a goat is common. The butcher roasts it to order. You eat with your hands, using ugali to scoop.

What to drink: Tusker beer, or a cold soda. Some places serve muratina, a traditional honey wine.

Vegetarian? Sukuma wiki, ugali, and kachumbari make a great meal on their own.`,
      tags: ["Culture", "Food", "Nairobi"],
      published: true,
      publishedAt: new Date("2026-01-14"),
    },
    {
      title: "Lake Naivasha: The Weekend Escape",
      slug: "lake-naivasha-weekend",
      excerpt:
        "Boat safaris, hippos, and Crescent Island — the perfect weekend from Nairobi.",
      content: `Lake Naivasha is 90 minutes from Nairobi and one of the easiest weekend escapes in Kenya.

The lake: A freshwater lake in the Rift Valley, home to hippos, over 400 bird species, and a thriving flower-farming industry.

Crescent Island: A private island in the lake where you can walk among giraffes, zebras, and wildebeest — no fences, no vehicles. It's one of the few places in Kenya where you can walk freely among large mammals.

Boat safaris: Take a boat to see hippos up close (from a safe distance), fish eagles, and the lake's resident pelicans.

Where to stay: Lake Naivasha Sopa Resort, Enashipai, or one of the many boutique lodges on the shore.

What to eat: The restaurants at the lodges are good, but for something special, drive to The Ranch House or eat fresh tilapia at one of the lakeside grills.`,
      tags: ["Nakuru", "Weekend", "Wildlife"],
      published: true,
      publishedAt: new Date("2025-12-20"),
    },
    {
      title: "The Truth About Kenyan Roads",
      slug: "kenyan-roads-truth",
      excerpt:
        "What to expect when driving in Kenya — road conditions, driving culture, and why most visitors shouldn't self-drive.",
      content: `Kenya drives on the left, uses a mix of tarmac and rough gravel, and has one of the more chaotic driving cultures in East Africa. Here's what to know.

Main highways: The Mombasa Road, the Nairobi-Nakuru highway, and the Thika Superhighway are all in good condition. Speed bumps are frequent and often unmarked.

Rural roads: Variable. The road to the Mara is 5–6 hours from Nairobi, mostly tarmac with some rough sections near the park. The road to Amboseli is 4 hours, mostly tarmac.

Traffic: Nairobi traffic is notorious. Avoid driving during rush hour (7–9am, 5–7pm) if you can.

Self-drive? Possible for confident drivers with experience of left-hand driving. Not recommended for a first safari.

Better option: Hire a driver-guide. They know the roads, the shortcuts, and the parks. The cost is worth every shilling.`,
      tags: ["Planning", "Transport"],
      published: true,
      publishedAt: new Date("2025-12-03"),
    },
    {
      title: "Kenya's Best Time to Visit for Birdwatching",
      slug: "kennys-birdwatching",
      excerpt:
        "Over 1,100 species, two rainy seasons, and the migratory window — here's when to go.",
      content: `Kenya has over 1,100 recorded bird species — one of the richest avifaunas in Africa.

Resident species: Common year-round. The Rift Valley lakes, Kakamega Forest, and the coastal forests have the highest diversity.

Palearctic migrants: Arrive from Europe and Asia from October to March. The Rift Valley lakes are the single best place to see them — Nakuru, Naivasha, Baringo, and Bogoria.

Intra-African migrants: Arrive with the rains. April to May and November are the peak periods.

Best overall months: November to March for migratory species and pleasant weather. The Rift Valley lake circuit is at its best.

Best specific sites: Lake Nakuru (flamingos, pelicans), Lake Baringo (over 470 species), Kakamega Forest (rainforest species), and the Arabuko-Sokoke Forest near Malindi (endemic species).`,
      tags: ["Wildlife", "Birdwatching", "Planning"],
      published: true,
      publishedAt: new Date("2025-11-18"),
    },
    {
      title: "Ethical Wildlife Tourism in Kenya",
      slug: "ethical-wildlife-tourism",
      excerpt:
        "How to travel in a way that supports conservation and respects wildlife — not exploits it.",
      content: `Kenya's wildlife is under pressure from poaching, habitat loss, and climate change. Ethical tourism can be part of the solution — or part of the problem.

Choose the right operators: Look for camps and lodges that are members of the Kenya Association of Tour Operators (KATO) or that partner with conservancies. Many are actively involved in anti-poaching and community work.

Avoid: Elephant rides, lion walks, and any "sanctuary" that allows cub-petting. These are exploitative operations dressed up as conservation.

Support: Community conservancies like Lewa, Ol Pejeta, and Mara North. These pay local landowners, employ local staff, and protect wildlife corridors.

Photography: Never pressure your guide to move off-road for a better shot. It damages habitat and stresses animals.

Tipping: A significant part of many guides' income. Budget USD 10–20 per day.`,
      tags: ["Wildlife", "Conservation", "Ethics"],
      published: true,
      publishedAt: new Date("2025-10-30"),
    },
  ];

  for (const p of posts) {
  await prisma.post.upsert({
    where: { slug: p.slug },
    update: {
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: null,
      tags: { set: p.tags },
      published: p.published,
      publishedAt: p.publishedAt,
    },
    create: {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: null,
      tags: p.tags,
      published: p.published,
      publishedAt: p.publishedAt,
    },
  });
}
  console.log(`✔ Seeded ${posts.length} blog posts`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });