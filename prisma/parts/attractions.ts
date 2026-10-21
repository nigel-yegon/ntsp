// prisma/parts/attractions.ts
import type { SeedContext } from "./types";

function img(id: string, w = 1200, h = 800) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

const ATTRACTIONS = [
  { slug: "great-migration",        destination: "maasai-mara", name: "Great Wildebeest Migration",      category: "Wildlife",  description: "Over 1.5 million wildebeest cross the Mara River each year.",      imageUrl: img("photo-1534177616072-ef7dc120449d") },
  { slug: "maasai-cultural-village",destination: "maasai-mara", name: "Maasai Cultural Village Visit",   category: "Cultural",  description: "Authentic manyatta visit — traditions, music, beadwork.",        imageUrl: img("photo-1516450360452-9312f5e86fc7") },
  { slug: "mara-balloon-safari",    destination: "maasai-mara", name: "Hot Air Balloon Safari",          category: "Adventure", description: "Dawn flight with champagne bush breakfast.",                     imageUrl: img("photo-1521405924368-64c5b84bec60") },
  { slug: "amboseli-elephants",     destination: "amboseli",    name: "Elephant Research Camp",          category: "Wildlife",  description: "Learn about the world's longest-running elephant study.",         imageUrl: img("photo-1564760055775-d63b17a55c44") },
  { slug: "kilimanjaro-views",      destination: "amboseli",    name: "Mount Kilimanjaro Views",         category: "Adventure", description: "Sunrise and sunset views of Africa's highest peak.",              imageUrl: img("photo-1589553416260-f586c8f1514f") },
  { slug: "diani-snorkeling",       destination: "diani-beach", name: "Diani Beach Snorkeling",          category: "Beach",     description: "Explore coral reefs at Kisite-Mpunguti Marine Park.",            imageUrl: img("photo-1544551763-46a013bb70d5") },
  { slug: "diani-dhow-cruise",      destination: "diani-beach", name: "Sunset Dhow Cruise",              category: "Beach",     description: "Sail a traditional Swahili dhow along the coast.",                imageUrl: img("photo-1502680390469-be75c86b636f") },
  { slug: "diani-skydiving",        destination: "diani-beach", name: "Skydiving over Diani",            category: "Adventure", description: "Tandem skydive from 12,000 feet with reef views.",                imageUrl: img("photo-1521673461164-de4def04bb98") },
  { slug: "nakuru-flamingos",       destination: "lake-nakuru", name: "Flamingo Watching",               category: "Wildlife",  description: "Thousands of flamingos and 400+ bird species.",                   imageUrl: img("photo-1518709268805-4e9042af9f23") },
  { slug: "nakuru-rhino-tracking",  destination: "lake-nakuru", name: "Rhino Tracking",                  category: "Wildlife",  description: "Track black and white rhinos in a protected sanctuary.",          imageUrl: img("photo-1549366021-9f761d450615") },
  { slug: "nairobi-safari",         destination: "nairobi",     name: "Nairobi National Park Safari",    category: "Wildlife",  description: "The only national park within a capital city.",                   imageUrl: img("photo-1547471080-7cc2caa01a7e") },
  { slug: "giraffe-centre",         destination: "nairobi",     name: "Giraffe Centre",                  category: "Cultural",  description: "Hand-feed endangered Rothschild giraffes.",                       imageUrl: img("photo-1547721064-da6cfb341d50") },
  { slug: "sheldrick-elephants",    destination: "nairobi",     name: "David Sheldrick Elephant Orphanage", category: "Wildlife", description: "Meet orphaned baby elephants.",                                  imageUrl: img("photo-1564760055775-d63b17a55c44") },
  { slug: "karen-blixen-museum",    destination: "nairobi",     name: "Karen Blixen Museum",             category: "Cultural",  description: "Step into the world of Out of Africa.",                           imageUrl: img("photo-1518709268805-4e9042af9f23") },
  { slug: "tsavo-red-elephants",    destination: "tsavo-east",  name: "Red Elephant Safari",             category: "Wildlife",  description: "Spot the famous red-dusted elephants of Tsavo.",                  imageUrl: img("photo-1564760055775-d63b17a55c44") },
  { slug: "lugard-falls",           destination: "tsavo-east",  name: "Lugard Falls",                    category: "Adventure", description: "Rocky rapids on the Galana River.",                                imageUrl: img("photo-1432405972618-c60b0225b8f9") },
  { slug: "mzima-springs",          destination: "tsavo-west",  name: "Mzima Springs",                   category: "Wildlife",  description: "Crystal-clear springs with an underwater viewing chamber.",       imageUrl: img("photo-1544551763-77ef2d0cfc6c") },
  { slug: "chyulu-hills",           destination: "tsavo-west",  name: "Chyulu Hills",                    category: "Adventure", description: "Volcanic hills with lava tube caves.",                            imageUrl: img("photo-1501785888041-af3ef285b470") },
  { slug: "samburu-special-five",   destination: "samburu",     name: "Samburu Special Five",            category: "Wildlife",  description: "Grevy's zebra, reticulated giraffe, Beisa oryx, gerenuk, Somali ostrich.", imageUrl: img("photo-1547471080-7cc2caa01a7e") },
  { slug: "lamu-walking-tour",      destination: "lamu",        name: "Lamu Old Town Walking Tour",      category: "Cultural",  description: "Wander the narrow streets of the UNESCO site.",                   imageUrl: img("photo-1571407970349-bc81e7e96d47") },
  { slug: "lamu-dhow-shela",        destination: "lamu",        name: "Dhow Sailing to Shela",           category: "Beach",     description: "Sail by dhow to the beaches of Shela.",                           imageUrl: img("photo-1502680390469-be75c86b636f") },
  { slug: "point-lenana-trek",      destination: "mount-kenya", name: "Point Lenana Trek",               category: "Adventure", description: "A four-day trek to 4,985m, no technical climbing required.",      imageUrl: img("photo-1519681393784-d120267933ba") },
  { slug: "watamu-turtles",         destination: "watamu",      name: "Turtle Watching at Watamu",       category: "Wildlife",  description: "Green and hawksbill turtles nest on Watamu's beaches.",           imageUrl: img("photo-1518467166778-b88f373ffec7") },
];

export async function seedAttractions(ctx: SeedContext) {
  for (const a of ATTRACTIONS) {
    const dest = ctx.destinations[a.destination];
    if (!dest) { console.warn(`⚠ Missing destination for ${a.slug}`); continue; }
    const { destination, ...data } = a;
    await ctx.prisma.attraction.upsert({
      where: { slug: a.slug },
      update: { imageUrl: data.imageUrl },
      create: { ...data, destinationId: dest.id },
    });
  }
  console.log(`✔ ${ATTRACTIONS.length} attractions`);
}