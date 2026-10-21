// prisma/parts/destinations.ts
import type { SeedContext } from "./types";

function img(photoId: string, w = 1200, h = 800) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

const DESTINATIONS = [
  { slug: "maasai-mara",    name: "Maasai Mara National Reserve", county: "Narok",         description: "Home to the Great Migration and the Big Five.", imageUrl: img("photo-1516426122078-c23e76319801"), latitude: -1.485,  longitude: 35.372, featured: true },
  { slug: "amboseli",       name: "Amboseli National Park",       county: "Kajiado",       description: "Elephant herds against Mount Kilimanjaro.",    imageUrl: img("photo-1547970810-dc1eac37d174"), latitude: -2.6527, longitude: 37.2606, featured: true },
  { slug: "diani-beach",    name: "Diani Beach",                  county: "Kwale",         description: "Award-winning white-sand beach on the Indian Ocean.", imageUrl: img("photo-1507525428034-b723cf961d3e"), latitude: -4.2927, longitude: 39.5794, featured: true },
  { slug: "lake-nakuru",    name: "Lake Nakuru National Park",    county: "Nakuru",        description: "Flamingos and rhino sanctuary in the Rift Valley.", imageUrl: img("photo-1518709268805-4e9042af9f23"), latitude: -0.3667, longitude: 36.0833, featured: false },
  { slug: "nairobi",        name: "Nairobi",                      county: "Nairobi",       description: "Kenya's capital — the Green City in the Sun.", imageUrl: img("photo-1611348586804-61bf6c080437"), latitude: -1.2921, longitude: 36.8219, featured: false },
  { slug: "tsavo-east",     name: "Tsavo East National Park",     county: "Taita-Taveta",  description: "One of Kenya's largest parks, famous for red elephants.", imageUrl: img("photo-1564760055775-d63b17a55c44"), latitude: -3.0,    longitude: 38.5,   featured: true },
  { slug: "tsavo-west",     name: "Tsavo West National Park",     county: "Taita-Taveta",  description: "Volcanic hills, lava flows, and Mzima Springs.", imageUrl: img("photo-1549366021-9f761d450615"), latitude: -3.4167, longitude: 38.0,   featured: false },
  { slug: "samburu",        name: "Samburu National Reserve",     county: "Samburu",       description: "Semi-arid wilderness and the Samburu Special Five.", imageUrl: img("photo-1547471080-7cc2caa01a7e"), latitude: 0.5833,  longitude: 37.5333, featured: true },
  { slug: "lamu",           name: "Lamu Old Town",                county: "Lamu",          description: "Oldest Swahili settlement, a UNESCO site.", imageUrl: img("photo-1571407970349-bc81e7e96d47"), latitude: -2.2717, longitude: 40.902, featured: true },
  { slug: "mount-kenya",    name: "Mount Kenya National Park",    county: "Nyeri",         description: "Africa's second-highest mountain.", imageUrl: img("photo-1519681393784-d120267933ba"), latitude: -0.1521, longitude: 37.3084, featured: false },
  { slug: "hells-gate",     name: "Hell's Gate National Park",    county: "Nakuru",        description: "Cycle and walk alongside wildlife.", imageUrl: img("photo-1501785888041-af3ef285b470"), latitude: -0.9167, longitude: 36.3167, featured: false },
  { slug: "lake-naivasha",  name: "Lake Naivasha",                county: "Nakuru",        description: "Freshwater lake with hippos and birdlife.", imageUrl: img("photo-1544551763-46a013bb70d5"), latitude: -0.7667, longitude: 36.3667, featured: false },
  { slug: "lake-baringo",   name: "Lake Baringo",                 county: "Baringo",       description: "Freshwater lake with over 470 bird species.", imageUrl: img("photo-1500375592092-40eb2168fd21"), latitude: 0.4667,  longitude: 36.1,    featured: false },
  { slug: "lake-bogoria",   name: "Lake Bogoria",                 county: "Baringo",       description: "Hot springs, geysers, seasonal flamingos.", imageUrl: img("photo-1516214104703-d870798883c5"), latitude: 0.25,    longitude: 36.1,    featured: false },
  { slug: "nairobi-national-park", name: "Nairobi National Park", county: "Nairobi",       description: "The only national park within a capital city.", imageUrl: img("photo-1547471080-7cc2caa01a7e"), latitude: -1.3733, longitude: 36.8583, featured: true },
  { slug: "watamu",         name: "Watamu Marine National Park",  county: "Kilifi",        description: "Coral reef and turtle nesting site.", imageUrl: img("photo-1544551763-77ef2d0cfc6c"), latitude: -3.3667, longitude: 40.0167, featured: false },
  { slug: "malindi",        name: "Malindi",                      county: "Kilifi",        description: "Historic coastal town with Italian influence.", imageUrl: img("photo-1519046904884-53103b34b206"), latitude: -3.2192, longitude: 40.1169, featured: false },
  { slug: "kisite-mpunguti",name: "Kisite-Mpunguti Marine Park",  county: "Kwale",         description: "Kenya's premier marine park with dolphin sightings.", imageUrl: img("photo-1583212292454-1fe6229603b7"), latitude: -4.7167, longitude: 39.3667, featured: true },
  { slug: "nyahururu-falls",name: "Nyahururu Falls",              county: "Laikipia",      description: "74-metre waterfall on the Ewaso Ng'iro river.", imageUrl: img("photo-1432405972618-c60b0225b8f9"), latitude: 0.0333,  longitude: 36.3667, featured: false },
  { slug: "kakamega-forest",name: "Kakamega Forest",              county: "Kakamega",      description: "Kenya's only remaining tropical rainforest.", imageUrl: img("photo-1441974231531-c6227db76b6e"), latitude: 0.25,    longitude: 34.8667, featured: false },
];

export async function seedDestinations(ctx: SeedContext) {
  for (const d of DESTINATIONS) {
    const { slug, ...data } = d;
    const row = await ctx.prisma.destination.upsert({
      where: { slug },
      update: { imageUrl: data.imageUrl, latitude: data.latitude, longitude: data.longitude },
      create: { slug, ...data },
      select: { id: true, name: true },
    });
    ctx.destinations[slug] = row;
  }
  console.log(`✔ ${DESTINATIONS.length} destinations`);
}