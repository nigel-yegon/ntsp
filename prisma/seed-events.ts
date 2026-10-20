// Kenya Tourism Events Seed


import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type EventSeed = {
  name: string;
  slug: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  featured?: boolean;
  published?: boolean;
};

const events: EventSeed[] = [
  {
    name: "Poets You Should Know",
    slug: "poets-you-should-know-2026",
    description: "A poetry event listed on the Magical Kenya events calendar.",
    startDate: "2026-10-29",
    location: "Alliance Française, Nairobi",
    latitude: -1.2864,
    longitude: 36.8172,
    published: true,
  },
  {
    name: "One Night Only: Brunch Edition",
    slug: "one-night-only-brunch-edition-2026",
    description: "A live entertainment event featuring Ne-Yo, Sol and other performers.",
    startDate: "2026-10-20",
    location: "Ulinzi Sports Complex, Nairobi",
    latitude: -1.325,
    longitude: 36.778,
    published: true,
  },
  {
    name: "Grandpa Was an Emperor",
    slug: "grandpa-was-an-emperor-2026",
    description: "A cultural performance listed on the Magical Kenya events calendar.",
    startDate: "2026-10-26",
    location: "Alliance Française, Nairobi",
    latitude: -1.2864,
    longitude: 36.8172,
    published: true,
  },
  {
    name: "Celebrating International Animation Day",
    slug: "international-animation-day-2026",
    description: "An animation-themed event listed on the national tourism events calendar.",
    startDate: "2026-10-28",
    location: "Nairobi",
    latitude: -1.2921,
    longitude: 36.8219,
    published: true,
  },
  {
    name: "International Mediation Conference",
    slug: "international-mediation-conference-2026",
    description: "A conference listed on the Magical Kenya events calendar.",
    startDate: "2026-10-29",
    location: "Golden Tulip Hotel, Nairobi",
    latitude: -1.254,
    longitude: 36.804,
    published: true,
  },
  {
    name: "Rock Riot Halloween Edition",
    slug: "rock-riot-halloween-2026",
    description: "A live music event listed on the Magical Kenya events calendar.",
    startDate: "2026-10-31",
    location: "Sarakasi Dome, Nairobi",
    latitude: -1.282,
    longitude: 36.84,
    published: true,
  },
  {
    name: "KITFEST 2026",
    slug: "kitfest-2026",
    description: "A festival listed on the Magical Kenya events calendar. Confirm the full programme before travel.",
    startDate: "2026-11-04",
    location: "Multiple venues, Kenya",
    published: true,
  },
  {
    name: "The Moth in Nairobi",
    slug: "the-moth-nairobi-2026",
    description: "A live storytelling event listed on the Magical Kenya events calendar.",
    startDate: "2026-11-07",
    location: "Catholic University of Eastern Africa, Nairobi",
    latitude: -1.245,
    longitude: 36.759,
    published: true,
  },
  {
    name: "KSPCA Shaggy Dog Show",
    slug: "kspca-shaggy-dog-show-2026",
    description: "A community dog show listed on the Magical Kenya events calendar.",
    startDate: "2026-11-08",
    location: "Hillcrest Preparatory, Karen, Nairobi",
    latitude: -1.324,
    longitude: 36.708,
    published: true,
  },
  {
    name: "The Glory of Gabrieli",
    slug: "glory-of-gabrieli-2026",
    description: "A musical performance listed on the Magical Kenya events calendar.",
    startDate: "2026-11-14",
    location: "Holy Cross Catholic Church, Nairobi",
    published: true,
  },
  {
    name: "Young Nation Kids Festival",
    slug: "young-nation-kids-festival-2026",
    description: "A children's festival listed on the Magical Kenya events calendar.",
    startDate: "2026-11-14",
    location: "Kenya School of TVET, Nairobi",
    latitude: -1.229,
    longitude: 36.805,
    published: true,
  },
  {
    name: "Africa's Next Super Model Grand Finale",
    slug: "africas-next-super-model-2026",
    description: "A fashion and modelling event listed on the Magical Kenya events calendar.",
    startDate: "2026-11-21",
    location: "Broadwalk Mall, Nairobi",
    published: true,
  },
  {
    name: "The Kenyan Fashion Story",
    slug: "kenyan-fashion-story-2026",
    description: "A fashion event listed on the Magical Kenya events calendar.",
    startDate: "2026-11-28",
    location: "Karen Village, Nairobi",
    latitude: -1.329,
    longitude: 36.707,
    published: true,
  },
  {
    name: "Amahl & The Night Visitors",
    slug: "amahl-night-visitors-2026",
    description: "An opera production with Nairobi preview and Siaya performances.",
    startDate: "2026-12-05",
    location: "Baraka Opera Kenya Performing Arts Centre, Randago, Siaya",
    published: true,
  },
  {
    name: "Artisan Makers Market Christmas Souk",
    slug: "artisan-makers-christmas-souk-2026",
    description: "A seasonal artisan market listed on the Magical Kenya events calendar.",
    startDate: "2026-12-05",
    location: "Shamba Events, Kenya",
    published: true,
  },
  {
    name: "A Symphony of Favour",
    slug: "symphony-of-favour-2026",
    description: "A musical event listed on the Magical Kenya events calendar.",
    startDate: "2026-12-06",
    location: "Jalaram Auditorium, Nairobi",
    published: true,
  },
  {
    name: "The Impact Dinner",
    slug: "impact-dinner-2026",
    description: "A dinner event listed on the Magical Kenya events calendar.",
    startDate: "2026-12-10",
    location: "Safari Park Hotel, Nairobi",
    latitude: -1.218,
    longitude: 36.878,
    published: true,
  },
  {
    name: "World Tourism Resilience Day Conference and Expo",
    slug: "tourism-resilience-week-2026",
    description: "A global tourism resilience conference and expo held at KICC in February 2026. Retained as historical event data.",
    startDate: "2026-02-16",
    endDate: "2026-02-18",
    location: "Kenyatta International Convention Centre, Nairobi",
    latitude: -1.2921,
    longitude: 36.8219,
    published: true,
  },
  {
    name: "UN World Tourism Week and World Tourism Day",
    slug: "un-world-tourism-week-2026",
    description: "Kenya's tourism week focused on tourism, culture, sport, conservation and gastronomy.",
    startDate: "2026-09-23",
    endDate: "2026-09-27",
    location: "University of Eldoret Grounds, Uasin Gishu County",
    latitude: 0.5143,
    longitude: 35.2698,
    published: true,
  },
  {
    name: "Madaraka Day Celebrations",
    slug: "madaraka-day-2027",
    description: "Annual national holiday commemorating Kenya's attainment of internal self-rule. Confirm the official celebration venue and programme.",
    startDate: "2027-06-01",
    location: "Kenya; official venue to be announced",
    published: false,
  },
  {
    name: "Mashujaa Day",
    slug: "mashujaa-day-2027",
    description: "Annual national holiday honouring Kenya's heroes and heroines. Official celebration venue to be confirmed.",
    startDate: "2027-10-20",
    location: "Kenya; official venue to be announced",
    published: false,
  },
  {
    name: "Jamhuri Day",
    slug: "jamhuri-day-2026",
    description: "Annual national holiday marking Kenya's republic and independence milestones. Confirm the official programme and venue.",
    startDate: "2026-12-12",
    location: "Kenya; official venue to be confirmed",
    published: false,
  },
  {
    name: "Christmas Day Celebrations",
    slug: "christmas-day-2026",
    description: "Annual public holiday and seasonal celebration across Kenya. This is a calendar entry, not a specific ticketed event.",
    startDate: "2026-12-25",
    location: "Nationwide, Kenya",
    published: false,
  },
  {
    name: "New Year's Day Celebrations",
    slug: "new-years-day-2027",
    description: "Annual public holiday and seasonal celebration across Kenya. Local event details may vary.",
    startDate: "2027-01-01",
    location: "Nationwide, Kenya",
    published: false,
  },
];

async function main() {
  let count = 0;

  for (const event of events) {
    const data = {
      name: event.name,
      description: event.description,
      startDate: new Date(`${event.startDate}T09:00:00+03:00`),
      endDate: event.endDate
        ? new Date(`${event.endDate}T18:00:00+03:00`)
        : null,
      location: event.location,
      latitude: event.latitude ?? null,
      longitude: event.longitude ?? null,
      featured: event.featured ?? false,
      order: count + 1,
      published: event.published ?? false,
    };

    await prisma.event.upsert({
      where: { slug: event.slug },
      update: data,
      create: {
        ...data,
        slug: event.slug,
      },
    });

    count++;
  }

  console.log(`Seeded or updated ${count} tourism events.`);
  console.log(
    `${events.filter((event) => event.published).length} published; ` +
    `${events.filter((event) => !event.published).length} unpublished.`,
  );
}

main()
  .catch((error) => {
    console.error("Event seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


