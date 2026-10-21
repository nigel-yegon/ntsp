// prisma/parts/packages.ts
import type { SeedContext } from "./types";
import type { Prisma } from "../../lib/generated/prisma/client";

// ── Helpers ────────────────────────────────────────────────────

function img(photoId: string, width = 1200, height = 800): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

type ItineraryDay = { title: string; description: string };

function days(...entries: [string, string][]): ItineraryDay[] {
  return entries.map(([title, description]) => ({ title, description }));
}

/**
 * Prisma's `Json` column accepts a loosely-typed input. Cast once
 * here so the rest of the file only deals in `ItineraryDay[]`.
 */
function toItineraryJson(itinerary: ItineraryDay[]): Prisma.InputJsonValue {
  return itinerary as unknown as Prisma.InputJsonValue;
}

// ── Seed shape ─────────────────────────────────────────────────

type PackageSeed = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  priceKes: number;
  durationDays: number;

  destinationSlug: string;   // resolved to destinationId at seed time
  ownerEmail: string;        // resolved to businessId at seed time

  imageUrl: string;
  latitude: number;
  longitude: number;
  featured: boolean;

  itinerary: ItineraryDay[];
};

// ── Data ───────────────────────────────────────────────────────

const PACKAGES: PackageSeed[] = [
  // ── Savannah Tours (operator) ─────────────────────────────
  {
    slug: "3-day-maasai-mara",
    title: "3-Day Maasai Mara Safari",
    summary: "Game drives in the world's most famous wildlife reserve.",
    description: "Three days of thrilling game drives in the Maasai Mara.",
    priceKes: 37060,
    durationDays: 3,
    destinationSlug: "maasai-mara",
    ownerEmail: "savannah@business.local",
    imageUrl: img("photo-1516426122078-c23e76319801"),
    latitude: -1.485,
    longitude: 35.372,
    featured: true,
    itinerary: days(
      ["Arrival & evening game drive", "Pick up from Nairobi or JKIA, transfer to the Mara arriving early afternoon. Late-afternoon game drive followed by dinner at the lodge."],
      ["Full day in the Mara", "Sunrise game drive with picnic breakfast. Afternoon game drive toward the Mara River to spot hippos and crocodiles."],
      ["Sunrise drive & return", "Final early-morning game drive, breakfast at camp, and drive back to Nairobi by mid-afternoon."],
    ),
  },
  {
    slug: "7-day-kenya-highlights",
    title: "7-Day Kenya Highlights Safari",
    summary: "Mara, Nakuru, and Amboseli in one classic week-long trip.",
    description: "The perfect introduction to Kenya's safari circuit.",
    priceKes: 189000,
    durationDays: 7,
    destinationSlug: "maasai-mara",
    ownerEmail: "savannah@business.local",
    imageUrl: img("photo-1516426122078-c23e76319801"),
    latitude: -1.485,
    longitude: 35.372,
    featured: true,
    itinerary: days(
      ["Nairobi → Maasai Mara", "Drive from Nairobi to the Mara. Afternoon game drive on arrival."],
      ["Full day in the Mara", "Full-day game drive with a picnic lunch near the Mara River."],
      ["Mara → Lake Nakuru", "Morning game drive, then drive to Nakuru. Afternoon game drive around the lake."],
      ["Nakuru → Amboseli", "Morning game drive, then drive to Amboseli via Nairobi."],
      ["Full day in Amboseli", "Morning and afternoon game drives with Kilimanjaro views."],
      ["Amboseli game drive", "Final early morning game drive and afternoon at leisure."],
      ["Return to Nairobi", "Drive back to Nairobi, arriving by early afternoon. Transfer to airport."],
    ),
  },
  {
    slug: "10-day-bush-and-beach",
    title: "10-Day Bush & Beach",
    summary: "Safari, then sand — the classic Kenyan honeymoon.",
    description: "Four days of game drives in the Mara and Amboseli, then five days on Diani.",
    priceKes: 245000,
    durationDays: 10,
    destinationSlug: "diani-beach",
    ownerEmail: "savannah@business.local",
    imageUrl: img("photo-1507525428034-b723cf961d3e"),
    latitude: -4.2927,
    longitude: 39.5794,
    featured: true,
    itinerary: days(
      ["Arrival in Nairobi", "Pick up at JKIA and overnight in Nairobi before the safari begins."],
      ["Nairobi → Maasai Mara", "Drive to the Mara with game drive en route. Afternoon game drive."],
      ["Full day in the Mara", "Full-day game drive with picnic lunch, tracking the Big Five."],
      ["Mara → Amboseli", "Morning game drive, then transfer to Amboseli. Evening at leisure."],
      ["Full day in Amboseli", "Sunrise game drive to see Kilimanjaro, plus afternoon game drive."],
      ["Amboseli → Nairobi → Diani", "Morning game drive, transfer to Nairobi, evening flight to Diani."],
      ["Diani beach day", "Full day at leisure on the beach."],
      ["Snorkel at Kisite", "Boat trip to Kisite-Mpunguti Marine Park with lunch on Wasini Island."],
      ["Dhow cruise & Swahili dinner", "Free morning, sunset dhow cruise and Swahili dinner in the evening."],
      ["Departure", "Breakfast, transfer to Ukunda airstrip or Moi International Airport."],
    ),
  },
  {
    slug: "5-day-samburu-laikipia",
    title: "5-Day Samburu & Laikipia",
    summary: "Northern Kenya's Special Five and community conservancies.",
    description: "Discover the arid beauty of Samburu and Laikipia.",
    priceKes: 132000,
    durationDays: 5,
    destinationSlug: "samburu",
    ownerEmail: "savannah@business.local",
    imageUrl: img("photo-1547471080-7cc2caa01a7e"),
    latitude: 0.5833,
    longitude: 37.5333,
    featured: true,
    itinerary: days(
      ["Nairobi → Samburu", "Drive north, crossing the equator. Evening game drive in Samburu."],
      ["Samburu full day", "Morning and afternoon game drives looking for the Special Five."],
      ["Samburu → Laikipia", "Morning game drive, then transfer to a Laikipia conservancy."],
      ["Laikipia full day", "Game drives, guided bush walks, and a visit to a community project."],
      ["Return to Nairobi", "Drive back to Nairobi with a stop at the equator marker."],
    ),
  },

  // ── Wild Trail Safaris (operator) ─────────────────────────
  {
    slug: "4-day-tsavo",
    title: "4-Day Tsavo East & West",
    summary: "Red elephants, lava flows, and Mzima Springs.",
    description: "Explore both halves of Tsavo.",
    priceKes: 78000,
    durationDays: 4,
    destinationSlug: "tsavo-east",
    ownerEmail: "wildtrail@business.local",
    imageUrl: img("photo-1564760055775-d63b17a55c44"),
    latitude: -3.0,
    longitude: 38.5,
    featured: false,
    itinerary: days(
      ["Nairobi → Tsavo East", "Drive to Tsavo East. Afternoon game drive at Aruba Dam."],
      ["Tsavo East → Tsavo West", "Morning game drive, then transfer to Tsavo West. Afternoon at Mzima Springs."],
      ["Tsavo West full day", "Morning game drive to Chyulu Hills and Shetani Lava Flow. Afternoon at leisure."],
      ["Return to Nairobi", "Early game drive, then drive back to Nairobi arriving by lunchtime."],
    ),
  },
  {
    slug: "5-day-watamu",
    title: "5-Day Watamu Beach & Marine Park",
    summary: "Snorkeling, turtles, and the Italian-inflected coast.",
    description: "Explore Watamu Marine National Park.",
    priceKes: 82000,
    durationDays: 5,
    destinationSlug: "watamu",
    ownerEmail: "wildtrail@business.local",
    imageUrl: img("photo-1544551763-77ef2d0cfc6c"),
    latitude: -3.3667,
    longitude: 40.0167,
    featured: false,
    itinerary: days(
      ["Arrival at Watamu", "Transfer from Malindi airport. Afternoon at leisure."],
      ["Marine Park snorkel", "Full day in Watamu Marine National Park with snorkeling and a seafood lunch."],
      ["Turtle watch & Gede ruins", "Morning at Gede ruins, evening turtle watching at the marine reserve."],
      ["Beach day", "Relax on the beach, optional kayaking or kite surfing."],
      ["Departure", "Breakfast and transfer to Malindi airport."],
    ),
  },
  {
    slug: "3-day-malindi-gedi",
    title: "3-Day Malindi & Gedi Ruins",
    summary: "Historic Swahili coast and marine park.",
    description: "Malindi's Italian-Swahili culture and Gedi ruins.",
    priceKes: 52000,
    durationDays: 3,
    destinationSlug: "malindi",
    ownerEmail: "wildtrail@business.local",
    imageUrl: img("photo-1519046904884-53103b34b206"),
    latitude: -3.2192,
    longitude: 40.1169,
    featured: false,
    itinerary: days(
      ["Arrival at Malindi", "Transfer from Malindi airport. Afternoon at leisure."],
      ["Gedi & Marine Park", "Morning tour of the Gedi ruins, afternoon snorkeling in Malindi Marine National Park."],
      ["Departure", "Breakfast and transfer to the airport."],
    ),
  },
  {
    slug: "2-day-nairobi-park-city",
    title: "2-Day Nairobi National Park & City",
    summary: "Wildlife and culture in a weekend.",
    description: "Nairobi National Park, Giraffe Centre, Karen Blixen Museum.",
    priceKes: 26000,
    durationDays: 2,
    destinationSlug: "nairobi-national-park",
    ownerEmail: "wildtrail@business.local",
    imageUrl: img("photo-1547471080-7cc2caa01a7e"),
    latitude: -1.3733,
    longitude: 36.8583,
    featured: false,
    itinerary: days(
      ["Nairobi National Park", "Dawn game drive in the park, followed by a visit to the Sheldrick Wildlife Trust."],
      ["Cultural day", "Giraffe Centre, Karen Blixen Museum, and Maasai Market."],
    ),
  },

  // ── Summit Trekking (operator) ────────────────────────────
  {
    slug: "6-day-mount-kenya-trek",
    title: "6-Day Mount Kenya Trek",
    summary: "Summit Point Lenana via the Sirimon and Chogoria routes.",
    description: "A six-day trek through alpine meadows and glacial valleys.",
    priceKes: 95000,
    durationDays: 6,
    destinationSlug: "mount-kenya",
    ownerEmail: "summit@business.local",
    imageUrl: img("photo-1519681393784-d120267933ba"),
    latitude: -0.1521,
    longitude: 37.3084,
    featured: false,
    itinerary: days(
      ["Nanyuki → Old Moses Camp", "Drive to the Sirimon gate, trek 3–4 hours to Old Moses Camp (3,300m)."],
      ["Old Moses → Shipton's Camp", "Trek through the moorland to Shipton's Camp (4,200m)."],
      ["Acclimatisation day", "Day hike toward Hausberg Col to acclimatise."],
      ["Summit Point Lenana", "Pre-dawn start to reach Point Lenana (4,985m) for sunrise, then descend to Mintos."],
      ["Descent to Chogoria", "Long descent through the Chogoria route with views of the Gorges Valley."],
      ["Return to Nanyuki", "Morning drive out of the park, transfer to Nanyuki or Nairobi."],
    ),
  },

  // ── Coastal Day Trips (operator) ──────────────────────────
  {
    slug: "5-day-diani-retreat",
    title: "5-Day Diani Beach Retreat",
    summary: "Relax on Kenya's best beach with snorkeling and dhow cruises.",
    description: "Five days of sun, sand, and sea at Diani Beach.",
    priceKes: 89999,
    durationDays: 5,
    destinationSlug: "diani-beach",
    ownerEmail: "coastal@business.local",
    imageUrl: img("photo-1507525428034-b723cf961d3e"),
    latitude: -4.2927,
    longitude: 39.5794,
    featured: false,
    itinerary: days(
      ["Arrival at Diani", "Airport pickup from Moi International or Ukunda airstrip. Afternoon at leisure by the beach."],
      ["Snorkel at Kisite-Mpunguti", "Full-day boat trip to Kisite-Mpunguti Marine Park with snorkeling and seafood lunch on Wasini Island."],
      ["Sunset dhow & Swahili dinner", "Free morning. Sunset dhow cruise with sundowners, followed by a Swahili seafood dinner."],
      ["Beach day & optional activities", "Full day at leisure — optional kite surfing, skydiving, or a day trip to Shimba Hills."],
      ["Departure", "Breakfast and transfer to the airport."],
    ),
  },

  // ── Nairobi City Safaris (operator) ───────────────────────
  {
    slug: "nairobi-city-safari",
    title: "Nairobi City & Safari Experience",
    summary: "Explore Nairobi's culture, wildlife, and cuisine in 2 days.",
    description: "Nairobi National Park, Giraffe Centre, and Maasai Market.",
    priceKes: 28500,
    durationDays: 2,
    destinationSlug: "nairobi",
    ownerEmail: "citysafari@business.local",
    imageUrl: img("photo-1611348586804-61bf6c080437"),
    latitude: -1.2921,
    longitude: 36.8219,
    featured: false,
    itinerary: days(
      ["Nairobi National Park & Sheldrick", "Dawn game drive in Nairobi National Park, followed by a visit to the Sheldrick Wildlife Trust at 11am."],
      ["Giraffe Centre & Maasai Market", "Giraffe Centre in Langata, lunch in Karen, afternoon shopping at the Maasai Market, transfer to the airport or hotel."],
    ),
  },

  // ── Mara Serena (mixed business — owns lodges AND packages) ──
  {
    slug: "4-day-mara-camping",
    title: "4-Day Maasai Mara Budget Camping",
    summary: "The Mara experience on a budget.",
    description: "Shared game drives and tented camp accommodation.",
    priceKes: 58000,
    durationDays: 4,
    destinationSlug: "maasai-mara",
    ownerEmail: "mara@business.local",
    imageUrl: img("photo-1521405924368-64c5b84bec60"),
    latitude: -1.485,
    longitude: 35.372,
    featured: false,
    itinerary: days(
      ["Nairobi → Maasai Mara", "Drive to the Mara. Afternoon game drive."],
      ["Full day in the Mara", "Full-day game drive with picnic lunch."],
      ["Full day in the Mara", "Morning and afternoon game drives with your small group."],
      ["Return to Nairobi", "Morning game drive, drive back to Nairobi."],
    ),
  },
];

// ── Seed function ──────────────────────────────────────────────

export async function seedPackages(ctx: SeedContext) {
  let created = 0;
  let updated = 0;
  const skipped: string[] = [];
  const perOwner: Record<string, number> = {};

  for (const p of PACKAGES) {
    const destination = ctx.destinations[p.destinationSlug];
    const owner = ctx.businesses[p.ownerEmail];

    if (!destination) {
      console.warn(`  ⚠ Skipping "${p.slug}" — unknown destinationSlug "${p.destinationSlug}"`);
      skipped.push(p.slug);
      continue;
    }
    if (!owner) {
      console.warn(`  ⚠ Skipping "${p.slug}" — unknown ownerEmail "${p.ownerEmail}"`);
      skipped.push(p.slug);
      continue;
    }

    // Resolve relations before building the payload so the object
    // handed to Prisma has no seed-only fields on it.
    const data = {
      title: p.title,
      summary: p.summary,
      description: p.description,
      priceKes: p.priceKes,
      durationDays: p.durationDays,
      imageUrl: p.imageUrl,
      latitude: p.latitude,
      longitude: p.longitude,
      featured: p.featured,
      itinerary: toItineraryJson(p.itinerary),
      destinationId: destination.id,
      businessId: owner.id,
      published: true,
    };

    const existing = await ctx.prisma.tourPackage.findUnique({
      where: { slug: p.slug },
      select: { id: true },
    });

    if (existing) {
      await ctx.prisma.tourPackage.update({
        where: { id: existing.id },
        data,
      });
      updated++;
      ctx.listings.packages[p.slug] = {
        id: existing.id,
        ownerId: owner.id,
        kind: "package",
      };
    } else {
      const created_ = await ctx.prisma.tourPackage.create({
        data: { slug: p.slug, ...data },
        select: { id: true },
      });
      created++;
      ctx.listings.packages[p.slug] = {
        id: created_.id,
        ownerId: owner.id,
        kind: "package",
      };
    }

    perOwner[p.ownerEmail] = (perOwner[p.ownerEmail] ?? 0) + 1;
  }

  const ownerCount = Object.keys(perOwner).length;
  console.log(
    `✔ Packages: ${PACKAGES.length} (${created} created, ${updated} updated, ${skipped.length} skipped, ${ownerCount} owners)`,
  );
  for (const [email, count] of Object.entries(perOwner).sort()) {
    console.log(`    ${email} → ${count} package${count === 1 ? "" : "s"}`);
  }
}