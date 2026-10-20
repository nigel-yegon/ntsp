//  * prisma/seed-tour-packages.ts
//  *
//  * Development seed for TourPackage.
//  *
//  * Sources consulted:
//  * - https://savannahexperiences.co.ke/packages
//  * - https://turkenya.com/safaris
//  *
//  * Prices are published "from" prices in KES per person where shown by
//  * the source. They are not guaranteed current quotes or live availability.
//  *
//  * The day-by-day itinerary text below is an illustrative draft for the
//  * development site, not a verified operator-issued itinerary.
//  *
//  * IMPORTANT:
//  * 1. Run against your DEVELOPMENT database only.
//  * 2. Seed destinations first using your existing destination seed.
//  * 3. This script does not create or impersonate operator accounts.
//  */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type PackageSeed = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  priceKes: number;
  durationDays: number;
  destinationSlug: string;
  featured?: boolean;
  order: number;
  itinerary: string[];
  sourceUrl: string;
};

const packages: PackageSeed[] = [
  {
    title: "Maasai Mara Classic Safari",
    slug: "maasai-mara-classic-safari",
    summary:
      "A three-day wildlife escape to Kenya's famous Maasai Mara landscape.",
    description:
      "A short safari focused on the open savannah and wildlife viewing in the Maasai Mara National Reserve. Published reference price: from KES 24,500 per person. Confirm current rates, inclusions, park fees and availability with the relevant operator before booking.",
    priceKes: 24500,
    durationDays: 3,
    destinationSlug: "maasai-mara-national-reserve",
    featured: true,
    order: 1,
    itinerary: [
      "Day 1: Travel to the Maasai Mara area and check in at the arranged accommodation.",
      "Day 2: Wildlife viewing and game drives, subject to park access and local conditions.",
      "Day 3: Morning activity where practical, then return travel.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Amboseli National Park Safari",
    slug: "amboseli-national-park-safari",
    summary:
      "Explore Amboseli's wildlife habitats with views of Mount Kilimanjaro when weather permits.",
    description:
      "A three-day safari concept based on a publicly listed Amboseli package. Published reference price: from KES 27,500 per person. Final price depends on travel dates, accommodation, park fees and operator confirmation.",
    priceKes: 27500,
    durationDays: 3,
    destinationSlug: "amboseli-national-park",
    featured: true,
    order: 2,
    itinerary: [
      "Day 1: Depart for Amboseli and check in at the arranged accommodation.",
      "Day 2: Explore the park on wildlife-viewing drives.",
      "Day 3: Final activity where practical, followed by return travel.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Maasai Mara and Lake Naivasha Safari",
    slug: "maasai-mara-lake-naivasha-safari",
    summary:
      "Combine savannah wildlife viewing with a Rift Valley lake experience.",
    description:
      "A four-day combination of the Maasai Mara and Lake Naivasha, based on a publicly listed package. Published reference price: from KES 39,500 per person. Confirm the route, transport, accommodation and activities with the operator.",
    priceKes: 39500,
    durationDays: 4,
    destinationSlug: "maasai-mara-national-reserve",
    featured: true,
    order: 3,
    itinerary: [
      "Day 1: Travel to the Lake Naivasha area and settle in.",
      "Day 2: Continue toward the Maasai Mara region.",
      "Day 3: Wildlife viewing in the Maasai Mara, subject to park access.",
      "Day 4: Return travel.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Kenya Explorer Safari",
    slug: "kenya-explorer-safari",
    summary:
      "A six-day wildlife journey combining Amboseli, Lake Naivasha and the Maasai Mara.",
    description:
      "A multi-stop safari concept based on a publicly listed Kenya Explorer package. Published reference price: from KES 59,500 per person. The itinerary shown here is illustrative; verify the operator's actual route and inclusions.",
    priceKes: 59500,
    durationDays: 6,
    destinationSlug: "amboseli-national-park",
    featured: true,
    order: 4,
    itinerary: [
      "Day 1: Travel to Amboseli and check in.",
      "Day 2: Wildlife viewing in Amboseli.",
      "Day 3: Travel toward the Lake Naivasha area.",
      "Day 4: Explore the Naivasha area and continue the journey.",
      "Day 5: Wildlife viewing in the Maasai Mara region.",
      "Day 6: Return travel.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Diani Beach Getaway",
    slug: "diani-beach-getaway",
    summary:
      "A three-day coastal break on the white-sand shores of Diani Beach.",
    description:
      "A coastal holiday concept based on a publicly listed Diani package. Published reference price: from KES 29,500 per person. Transport, accommodation, meals and activities must be confirmed with the operator.",
    priceKes: 29500,
    durationDays: 3,
    destinationSlug: "diani-beach",
    featured: true,
    order: 5,
    itinerary: [
      "Day 1: Travel to Diani and check in.",
      "Day 2: Beach time and optional activities arranged separately or by the operator.",
      "Day 3: Check out and return travel.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Samburu Wildlife Safari",
    slug: "samburu-wildlife-safari",
    summary:
      "Discover northern Kenya's distinctive wildlife and semi-arid landscapes.",
    description:
      "A Samburu safari concept based on a publicly listed package. Published reference price: from KES 34,500 per person. Confirm the exact duration, accommodation and included activities with the operator.",
    priceKes: 34500,
    durationDays: 3,
    destinationSlug: "samburu-national-reserve",
    featured: false,
    order: 6,
    itinerary: [
      "Day 1: Travel to the Samburu region and check in.",
      "Day 2: Wildlife viewing in the reserve, subject to park access.",
      "Day 3: Morning activity where practical and return travel.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Tsavo East and Tsavo West Safari",
    slug: "tsavo-east-tsavo-west-safari",
    summary:
      "Explore two large protected landscapes in southeastern Kenya.",
    description:
      "A four-day safari concept based on a publicly listed Tsavo East and Tsavo West package. Published reference price: from KES 37,500 per person. Verify the route, park fees, transport and accommodation before booking.",
    priceKes: 37500,
    durationDays: 4,
    destinationSlug: "tsavo-east-national-park",
    featured: false,
    order: 7,
    itinerary: [
      "Day 1: Travel to Tsavo East and check in.",
      "Day 2: Wildlife viewing in Tsavo East.",
      "Day 3: Transfer toward Tsavo West and explore designated visitor areas.",
      "Day 4: Final activity where practical and return travel.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Mount Kenya Adventure",
    slug: "mount-kenya-adventure",
    summary:
      "A short guided adventure through Mount Kenya's forest and mountain landscapes.",
    description:
      "A two-day adventure concept based on a publicly listed Mount Kenya package. Published reference price: from KES 21,500 per person. Route difficulty, guide arrangements, park fees and suitable equipment should be confirmed before travel.",
    priceKes: 21500,
    durationDays: 2,
    destinationSlug: "mount-kenya-national-park",
    featured: false,
    order: 8,
    itinerary: [
      "Day 1: Travel to the selected Mount Kenya route and begin the guided trek.",
      "Day 2: Continue the planned trek and descend according to the guide's schedule.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Nairobi City and Wildlife Tour",
    slug: "nairobi-city-wildlife-tour",
    summary:
      "Combine Nairobi's urban sights with selected wildlife experiences.",
    description:
      "A day-tour concept based on a publicly listed Nairobi city and wildlife package. Published reference price: from KES 8,500 per person. Confirm entrance fees, transport and which attractions are included.",
    priceKes: 8500,
    durationDays: 1,
    destinationSlug: "nairobi-city-centre",
    featured: true,
    order: 9,
    itinerary: [
      "Day 1: Visit selected Nairobi city and wildlife attractions according to the confirmed tour schedule.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Nairobi National Park Day Safari",
    slug: "nairobi-national-park-day-safari",
    summary:
      "A day of wildlife viewing within easy reach of central Nairobi.",
    description:
      "A day safari concept based on a publicly listed Nairobi National Park package. Published reference price: from KES 8,500 per person. Confirm park entry fees, transport and guide arrangements with the operator.",
    priceKes: 8500,
    durationDays: 1,
    destinationSlug: "nairobi-national-park",
    featured: false,
    order: 10,
    itinerary: [
      "Day 1: Enter Nairobi National Park for a planned wildlife-viewing drive and return to Nairobi.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Giraffe Centre and Nairobi Nature Escape",
    slug: "giraffe-centre-nairobi-nature-escape",
    summary:
      "A short Nairobi outing focused on nature and wildlife experiences.",
    description:
      "A day-trip concept based on a publicly listed Giraffe Centre and Nairobi nature package. Published reference price: from KES 2,500 per person. Confirm entry arrangements, transport and inclusions before booking.",
    priceKes: 2500,
    durationDays: 1,
    destinationSlug: "nairobi-city-centre",
    featured: false,
    order: 11,
    itinerary: [
      "Day 1: Visit the Giraffe Centre and any additional confirmed stops on the operator's schedule.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Naivasha Day Escape",
    slug: "naivasha-day-escape",
    summary:
      "Enjoy a Rift Valley day trip with nature and outdoor activities around Naivasha.",
    description:
      "A day-trip concept based on a publicly listed Naivasha package. Published reference price: from KES 5,499 per person. Cycling, boat rides, park entry and other activities are subject to the final operator itinerary and local conditions.",
    priceKes: 5499,
    durationDays: 1,
    destinationSlug: "lake-naivasha",
    featured: true,
    order: 12,
    itinerary: [
      "Day 1: Travel to the Naivasha area for the activities confirmed in the final itinerary, then return.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Kiambethu Tea Farm Day Tour",
    slug: "kiambethu-tea-farm-day-tour",
    summary:
      "Explore tea-growing heritage and landscapes in the Limuru area.",
    description:
      "A day-tour concept based on a publicly listed Kiambethu Tea Farm package. Published reference price: from KES 8,500 per person. Confirm tour times, transport and what is included with the operator.",
    priceKes: 8500,
    durationDays: 1,
    destinationSlug: "nairobi-city-centre",
    featured: false,
    order: 13,
    itinerary: [
      "Day 1: Travel to the Limuru area for the confirmed tea farm visit and return.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Ol Pejeta Conservancy Day Safari",
    slug: "ol-pejeta-conservancy-day-safari",
    summary:
      "A day trip focused on wildlife and conservation in the Laikipia region.",
    description:
      "A day-safari concept based on a publicly listed Ol Pejeta package. Published reference price: from KES 14,500 per person. Confirm the actual departure point, transport, conservancy fees and inclusions with the operator.",
    priceKes: 14500,
    durationDays: 1,
    destinationSlug: "mount-kenya-national-park",
    featured: false,
    order: 14,
    itinerary: [
      "Day 1: Travel to Ol Pejeta Conservancy, take part in the confirmed activities, and return.",
    ],
    sourceUrl: "https://savannahexperiences.co.ke/packages",
  },
  {
    title: "Maasai Mara Classic",
    slug: "turkenya-maasai-mara-classic",
    summary:
      "A three-day Maasai Mara safari with wildlife viewing and overnight stays.",
    description:
      "Reference package listed by Turkenya Tours & Safaris. Published reference price: from KES 45,000. The displayed price may differ by season, accommodation and party size. Confirm current details directly with the operator.",
    priceKes: 45000,
    durationDays: 3,
    destinationSlug: "maasai-mara-national-reserve",
    featured: false,
    order: 15,
    itinerary: [
      "Day 1: Travel to the Maasai Mara region and check in.",
      "Day 2: Wildlife viewing and game drives, subject to conditions.",
      "Day 3: Final activity where practical and return travel.",
    ],
    sourceUrl: "https://turkenya.com/safaris",
  },
  {
    title: "Amboseli and Kilimanjaro",
    slug: "turkenya-amboseli-kilimanjaro",
    summary:
      "A four-day Amboseli safari with opportunities for wildlife viewing and mountain scenery.",
    description:
      "Reference package listed by Turkenya Tours & Safaris. Published reference price: from KES 62,000. Confirm season, accommodation, park fees and availability directly with the operator.",
    priceKes: 62000,
    durationDays: 4,
    destinationSlug: "amboseli-national-park",
    featured: false,
    order: 16,
    itinerary: [
      "Day 1: Travel to Amboseli and check in.",
      "Day 2: Wildlife viewing in Amboseli.",
      "Day 3: Further park activities according to the confirmed itinerary.",
      "Day 4: Return travel.",
    ],
    sourceUrl: "https://turkenya.com/safaris",
  },
  {
    title: "Samburu Explorer",
    slug: "turkenya-samburu-explorer",
    summary:
      "A five-day journey into Samburu's distinctive northern Kenya landscapes.",
    description:
      "Reference package listed by Turkenya Tours & Safaris. Published reference price: from KES 78,000. Confirm the route, accommodation, park fees and exact inclusions directly with the operator.",
    priceKes: 78000,
    durationDays: 5,
    destinationSlug: "samburu-national-reserve",
    featured: false,
    order: 17,
    itinerary: [
      "Day 1: Travel to the Samburu region and check in.",
      "Day 2: Wildlife viewing and exploration of the reserve.",
      "Day 3: Continue the planned safari activities.",
      "Day 4: Additional wildlife viewing or local activities per the confirmed schedule.",
      "Day 5: Return travel.",
    ],
    sourceUrl: "https://turkenya.com/safaris",
  },
  {
    title: "Ultimate Kenya Circuit",
    slug: "turkenya-ultimate-kenya-circuit",
    summary:
      "An eight-day multi-destination safari across Kenya's wildlife regions.",
    description:
      "Reference package listed by Turkenya Tours & Safaris. Published reference price: from KES 145,000. Confirm the exact route, accommodation, meals, park fees and availability directly with the operator.",
    priceKes: 145000,
    durationDays: 8,
    destinationSlug: "maasai-mara-national-reserve",
    featured: true,
    order: 18,
    itinerary: [
      "Day 1: Begin the multi-day journey according to the confirmed operator route.",
      "Day 2: Wildlife viewing at the first scheduled destination.",
      "Day 3: Transfer to the next destination.",
      "Day 4: Explore the next scheduled park or reserve.",
      "Day 5: Continue the safari route.",
      "Day 6: Wildlife viewing or activities at the scheduled destination.",
      "Day 7: Final full day of planned activities.",
      "Day 8: Return travel or onward transfer.",
    ],
    sourceUrl: "https://turkenya.com/safaris",
  },
];

async function main() {
  console.log(`Seeding ${packages.length} tour packages...`);

  for (const item of packages) {
    const destination = await prisma.destination.findUnique({
      where: { slug: item.destinationSlug },
      select: { id: true, name: true },
    });

    if (!destination) {
      throw new Error(
        `Missing destination "${item.destinationSlug}" for package "${item.slug}". ` +
          "Run the destination seed first or correct the destinationSlug.",
      );
    }

    const {
      slug,
      destinationSlug: _destinationSlug,
      sourceUrl: _sourceUrl,
      ...data
    } = item;

    await prisma.tourPackage.upsert({
      where: { slug },
      update: {
        ...data,
        destinationId: destination.id,
      },
      create: {
        ...data,
        slug,
        destinationId: destination.id,
        published: true,
      },
    });

    console.log(`✔ ${item.title} → ${destination.name}`);
  }

  console.log(`\n✔ Seeded ${packages.length} tour packages.`);
}

main()
  .catch((error) => {
    console.error("Tour package seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
