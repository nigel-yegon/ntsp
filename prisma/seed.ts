import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg';

const adapter = new PrismaPostgresAdapter({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding NTSP database...");

  // ─── Destinations ──────────────────────────────────────────────
  const maasaiMara = await prisma.destination.upsert({
    where: { slug: "maasai-mara" },
    update: {},
    create: {
      name: "Maasai Mara National Reserve",
      slug: "maasai-mara",
      county: "Narok",
      description:
        "Home to the Great Migration and the Big Five, the Maasai Mara is Kenya's most iconic wildlife destination.",
      imageUrl: "/images/maasai-mara.jpg",
      featured: true,
    },
  });

  const amboseli = await prisma.destination.upsert({
    where: { slug: "amboseli" },
    update: {},
    create: {
      name: "Amboseli National Park",
      slug: "amboseli",
      county: "Kajiado",
      description:
        "Famous for its large elephant herds and stunning views of Mount Kilimanjaro across the border in Tanzania.",
      imageUrl: "/images/amboseli.jpg",
      featured: true,
    },
  });

  const diani = await prisma.destination.upsert({
    where: { slug: "diani-beach" },
    update: {},
    create: {
      name: "Diani Beach",
      slug: "diani-beach",
      county: "Kwale",
      description:
        "Award-winning white-sand beach on the Indian Ocean, perfect for relaxation, water sports, and coral reef diving.",
      imageUrl: "/images/diani.jpg",
      featured: true,
    },
  });

  const lakeNakuru = await prisma.destination.upsert({
    where: { slug: "lake-nakuru" },
    update: {},
    create: {
      name: "Lake Nakuru National Park",
      slug: "lake-nakuru",
      county: "Nakuru",
      description:
        "Famous for its flamingos and rhino sanctuary, set around a shallow alkaline lake in the Great Rift Valley.",
      imageUrl: "/images/nakuru.jpg",
      featured: false,
    },
  });

  const nairobi = await prisma.destination.upsert({
    where: { slug: "nairobi" },
    update: {},
    create: {
      name: "Nairobi",
      slug: "nairobi",
      county: "Nairobi",
      description:
        "Kenya's vibrant capital, known as the 'Green City in the Sun', home to Nairobi National Park and rich cultural experiences.",
      imageUrl: "/images/nairobi.jpg",
      featured: false,
    },
  });

  // ─── Attractions ───────────────────────────────────────────────
  const attractions = [
    {
      name: "Great Wildebeest Migration",
      slug: "great-migration",
      description:
        "Witness over 1.5 million wildebeest and zebras cross the Mara River — one of nature's greatest spectacles.",
      category: "Wildlife",
      destinationId: maasaiMara.id,
    },
    {
      name: "Maasai Cultural Village Visit",
      slug: "maasai-cultural-village",
      description:
        "Immerse yourself in Maasai traditions, music, dance, and beadwork at an authentic manyatta.",
      category: "Cultural",
      destinationId: maasaiMara.id,
    },
    {
      name: "Elephant Research Camp",
      slug: "amboseli-elephants",
      description:
        "Visit the Amboseli Trust for Elephants and learn about the world's longest-running elephant study.",
      category: "Wildlife",
      destinationId: amboseli.id,
    },
    {
      name: "Mount Kilimanjaro Views",
      slug: "kilimanjaro-views",
      description:
        "Enjoy spectacular views of Africa's highest peak at sunrise and sunset from Observation Hill.",
      category: "Adventure",
      destinationId: amboseli.id,
    },
    {
      name: "Diani Beach Snorkeling",
      slug: "diani-snorkeling",
      description:
        "Explore vibrant coral reefs and swim with tropical fish at Kisite-Mpunguti Marine Park.",
      category: "Beach",
      destinationId: diani.id,
    },
    {
      name: "Flamingo Watching",
      slug: "nakuru-flamingos",
      description:
        "See thousands of flamingos and over 400 bird species along the shores of Lake Nakuru.",
      category: "Wildlife",
      destinationId: lakeNakuru.id,
    },
    {
      name: "Nairobi National Park Safari",
      slug: "nairobi-safari",
      description:
        "The only national park within a capital city — spot rhinos and lions with skyscrapers on the horizon.",
      category: "Wildlife",
      destinationId: nairobi.id,
    },
    {
      name: "Giraffe Centre",
      slug: "giraffe-centre",
      description:
        "Hand-feed endangered Rothschild giraffes at this world-famous conservation centre.",
      category: "Cultural",
      destinationId: nairobi.id,
    },
  ];

  for (const a of attractions) {
    await prisma.attraction.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }

  // ─── Tour Packages ─────────────────────────────────────────────
  const packages = [
    {
      title: "3-Day Maasai Mara Safari",
      slug: "3-day-maasai-mara",
      summary: "Game drives in the world's most famous wildlife reserve.",
      description:
        "Enjoy three days of thrilling game drives in the Maasai Mara, with chances to see lions, elephants, and the Big Five. Includes full-board accommodation in a safari lodge, park fees, and a professional guide.",
      priceKes: 37060,
      durationDays: 3,
      destinationId: maasaiMara.id,
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
      destinationId: amboseli.id,
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
      destinationId: diani.id,
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
      destinationId: nairobi.id,
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
      destinationId: lakeNakuru.id,
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

  // ─── Accommodations ────────────────────────────────────────────
  const accommodations = [
    {
      name: "Mara Serena Safari Lodge",
      slug: "mara-serena",
      type: "Lodge",
      description:
        "Luxury lodge perched on a hill with panoramic views of the Mara plains.",
      location: "Maasai Mara, Narok",
      priceRange: "KES 25,000 - 55,000",
      destinationId: maasaiMara.id,
    },
    {
      name: "Amboseli Serena Safari Lodge",
      slug: "amboseli-serena",
      type: "Lodge",
      description:
        "Nestled in a grove of acacia trees with uninterrupted views of Mount Kilimanjaro.",
      location: "Amboseli, Kajiado",
      priceRange: "KES 22,000 - 48,000",
      destinationId: amboseli.id,
    },
    {
      name: "Diani Sea Resort",
      slug: "diani-sea-resort",
      type: "Resort",
      description:
        "Beachfront resort with pools, water sports, and all-inclusive dining options.",
      location: "Diani Beach, Kwale",
      priceRange: "KES 18,000 - 40,000",
      destinationId: diani.id,
    },
    {
      name: "Sarova Lion Hill Lodge",
      slug: "sarova-lion-hill",
      type: "Lodge",
      description:
        "Set on a plateau overlooking Lake Nakuru, ideal for birdwatchers and rhino spotting.",
      location: "Lake Nakuru, Nakuru",
      priceRange: "KES 20,000 - 45,000",
      destinationId: lakeNakuru.id,
    },
    {
      name: "The Norfolk Hotel",
      slug: "norfolk-hotel",
      type: "Hotel",
      description:
        "Historic 5-star hotel in the heart of Nairobi, founded in 1904.",
      location: "Nairobi CBD",
      priceRange: "KES 15,000 - 35,000",
      destinationId: nairobi.id,
    },
    {
      name: "Tortilis Camp",
      slug: "tortilis-camp",
      type: "Tented Camp",
      description:
        "Eco-friendly tented camp on the edge of Amboseli, overlooking Mount Kilimanjaro.",
      location: "Amboseli, Kajiado",
      priceRange: "KES 40,000 - 75,000",
      destinationId: amboseli.id,
    },
  ];

  for (const a of accommodations) {
    await prisma.accommodation.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }

  // ─── Events ────────────────────────────────────────────────────
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
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: e,
    });
  }

  // ─── Blog Posts ────────────────────────────────────────────────
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

At the border, you may be asked for proof of onward travel and sufficient funds. Have your return ticket and a bank statement or credit card ready.

Citizens of most East African Community countries and a handful of others are exempt from the eTA. Check the official portal for the current exemption list.`,
      published: true,
      publishedAt: new Date("2026-08-05"),
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: p,       // 👈 overwrite on re-seed so edits take effect
      create: p,
    });
  }

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