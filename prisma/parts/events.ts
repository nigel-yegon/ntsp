// prisma/parts/events.ts
import type { SeedContext } from "./types";

function img(photoId: string, width = 1200, height = 800): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

type EventSeed = {
  name: string;
  slug: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string;
  featured: boolean;
  order: number;
};

const EVENTS: EventSeed[] = [
  { name: "Magical Kenya Travel Expo (MKTE) 2026", slug: "mkte-2026", description: "Kenya's premier travel trade show.", startDate: new Date("2026-10-06"), endDate: new Date("2026-10-08"), location: "KICC, Nairobi", latitude: -1.2921, longitude: 36.8219, imageUrl: img("photo-1540575467063-178a50c2df87"), featured: true, order: 1 },
  { name: "Wildebeest Migration Season", slug: "migration-season-2026", description: "The annual Great Migration.", startDate: new Date("2026-07-01"), endDate: new Date("2026-10-31"), location: "Maasai Mara", latitude: -1.485, longitude: 35.372, imageUrl: img("photo-1534177616072-ef7dc120449d"), featured: true, order: 2 },
  { name: "Lamu Cultural Festival", slug: "lamu-cultural-festival-2026", description: "A celebration of Swahili culture.", startDate: new Date("2026-11-20"), endDate: new Date("2026-11-23"), location: "Lamu Island", latitude: -2.2717, longitude: 40.902, imageUrl: img("photo-1571407970349-bc81e7e96d47"), featured: false, order: 3 },
  { name: "Safari Rally Kenya 2026", slug: "safari-rally-2026", description: "Round 3 of the World Rally Championship.", startDate: new Date("2026-03-19"), endDate: new Date("2026-03-22"), location: "Naivasha", latitude: -0.7167, longitude: 36.4359, imageUrl: img("photo-1503376780353-7e6692767b70"), featured: true, order: 4 },
  { name: "Maralal International Camel Derby", slug: "maralal-camel-derby-2026", description: "Camel races and Samburu traditions.", startDate: new Date("2026-08-07"), endDate: new Date("2026-08-09"), location: "Maralal", latitude: 1.0967, longitude: 36.6972, imageUrl: img("photo-1509316785289-025f5b846b35"), featured: false, order: 5 },
  { name: "Mombasa Carnival", slug: "mombasa-carnival-2026", description: "Street parade on the coast.", startDate: new Date("2026-11-01"), endDate: new Date("2026-11-03"), location: "Mombasa", latitude: -4.0435, longitude: 39.6682, imageUrl: img("photo-1519046904884-53103b34b206"), featured: true, order: 6 },
  { name: "Nairobi International Trade Fair", slug: "nairobi-trade-fair-2026", description: "East Africa's largest trade exhibition.", startDate: new Date("2026-09-28"), endDate: new Date("2026-10-04"), location: "Jamhuri Park", latitude: -1.301, longitude: 36.768, imageUrl: img("photo-1540575467063-178a50c2df87"), featured: false, order: 7 },
  { name: "Kenya Music Festival 2026", slug: "kenya-music-festival-2026", description: "National music competition.", startDate: new Date("2026-08-10"), endDate: new Date("2026-08-15"), location: "Nairobi", latitude: -1.2921, longitude: 36.8219, imageUrl: img("photo-1493225457124-a3eb161ffa5f"), featured: false, order: 8 },
  { name: "Lake Turkana Festival", slug: "turkana-festival-2026", description: "Cultural diversity of the Turkana basin.", startDate: new Date("2026-06-12"), endDate: new Date("2026-06-14"), location: "Loiyangalani", latitude: 2.75, longitude: 36.7167, imageUrl: img("photo-1516450360452-9312f5e86fc7"), featured: false, order: 9 },
  { name: "Rhino Charge 2026", slug: "rhino-charge-2026", description: "Off-road motorsport for rhino conservation.", startDate: new Date("2026-06-06"), endDate: null, location: "Laikipia", latitude: 0.05, longitude: 36.8, imageUrl: img("photo-1503376780353-7e6692767b70"), featured: false, order: 10 },
  { name: "Kenya Open Golf Championship", slug: "kenya-open-golf-2026", description: "Africa's oldest golf tournament.", startDate: new Date("2026-02-19"), endDate: new Date("2026-02-22"), location: "Karen Country Club", latitude: -1.335, longitude: 36.71, imageUrl: img("photo-1535131749006-b7f58c99034b"), featured: false, order: 11 },
  { name: "Kisumu Fish Festival", slug: "kisumu-fish-festival-2026", description: "Luo culture and Lake Victoria tilapia.", startDate: new Date("2026-12-11"), endDate: new Date("2026-12-13"), location: "Kisumu", latitude: -0.0917, longitude: 34.768, imageUrl: img("photo-1544551763-46a013bb70d5"), featured: false, order: 12 },
  { name: "Lewa Safari Marathon", slug: "lewa-marathon-2026", description: "Marathon inside a conservancy.", startDate: new Date("2026-06-27"), endDate: null, location: "Lewa Conservancy", latitude: 0.1833, longitude: 37.45, imageUrl: img("photo-1552674605-db6ffd4facb5"), featured: true, order: 13 },
  { name: "Malindi Cultural Festival", slug: "malindi-festival-2026", description: "Swahili, Italian, and Arab heritage.", startDate: new Date("2026-11-27"), endDate: new Date("2026-11-29"), location: "Malindi", latitude: -3.2192, longitude: 40.1169, imageUrl: img("photo-1519046904884-53103b34b206"), featured: false, order: 14 },
  { name: "Koroga Festival", slug: "koroga-festival-2026", description: "Music and food festival.", startDate: new Date("2026-04-05"), endDate: new Date("2026-04-05"), location: "Nairobi", latitude: -1.2921, longitude: 36.8219, imageUrl: img("photo-1493225457124-a3eb161ffa5f"), featured: false, order: 15 },
  { name: "Nairobi Restaurant Week", slug: "nairobi-restaurant-week-2026", description: "Fixed-price menus across Nairobi.", startDate: new Date("2026-02-06"), endDate: new Date("2026-02-16"), location: "Nairobi", latitude: -1.2921, longitude: 36.8219, imageUrl: img("photo-1414235077428-338989a2e8c0"), featured: false, order: 16 },
  { name: "Blankets & Wine", slug: "blankets-and-wine-2026", description: "Monthly open-air concert.", startDate: new Date("2026-01-25"), endDate: null, location: "Nairobi", latitude: -1.2921, longitude: 36.8219, imageUrl: img("photo-1493225457124-a3eb161ffa5f"), featured: false, order: 17 },
  { name: "Kili Marathon", slug: "kili-marathon-2026", description: "Marathon at the foot of Kilimanjaro.", startDate: new Date("2026-03-01"), endDate: null, location: "Amboseli", latitude: -2.6527, longitude: 37.2606, imageUrl: img("photo-1552674605-db6ffd4facb5"), featured: false, order: 18 },
  { name: "Kijani Festival", slug: "kijani-festival-2026", description: "Music and arts on Lake Naivasha.", startDate: new Date("2026-09-12"), endDate: new Date("2026-09-13"), location: "Lake Naivasha", latitude: -0.7667, longitude: 36.3667, imageUrl: img("photo-1470229722913-7c0e2dbbafd3"), featured: false, order: 19 },
  { name: "Marathon des Sables Kenya", slug: "marathon-des-sables-2026", description: "Ultra-marathon in the Chalbi Desert.", startDate: new Date("2026-07-18"), endDate: new Date("2026-07-24"), location: "Chalbi Desert", latitude: 2.75, longitude: 37.5, imageUrl: img("photo-1552674605-db6ffd4facb5"), featured: false, order: 20 },
];

export async function seedEvents(ctx: SeedContext) {
  let created = 0;
  let updated = 0;

  for (const e of EVENTS) {
    const { slug, ...data } = e;
    const existing = await ctx.prisma.event.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      await ctx.prisma.event.update({
        where: { id: existing.id },
        data: {
          imageUrl: data.imageUrl,
          latitude: data.latitude,
          longitude: data.longitude,
          featured: data.featured,
          order: data.order,
        },
      });
      updated++;
    } else {
      await ctx.prisma.event.create({
        data: {
          ...data,
          slug,
          published: true,
        },
      });
      created++;
    }
  }

  console.log(`✔ Events: ${EVENTS.length} (${created} created, ${updated} updated)`);
}