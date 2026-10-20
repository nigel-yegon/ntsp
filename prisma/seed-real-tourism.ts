/**
 * Development-only tourism content import.
 * Creates/updates 20 destination records and 30 attraction records (50 total).
 * It does not seed users, businesses, bookings, packages, accommodation, events, or incidents.
 *
 * Before running: ensure DATABASE_URL points to the DEVELOPMENT database.
 * Coordinates are approximate representative points, not official boundaries or navigation pins.
 * Image URLs are intentionally null until rights-cleared images are selected.
 */
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const destinations = [
  { name: "Maasai Mara National Reserve", slug: "maasai-mara-national-reserve", county: "Narok", description: "A protected savannah landscape in south-western Kenya known for large populations of wildlife and seasonal movements of wildebeest and other grazing animals. Wildlife sightings and migration timing vary by season.", imageUrl: null, latitude: -1.485, longitude: 35.372, featured: true, order: 1, published: true },
  { name: "Amboseli National Park", slug: "amboseli-national-park", county: "Kajiado", description: "A national park in southern Kenya known for elephant populations, open plains and views of Mount Kilimanjaro on clear days.", imageUrl: null, latitude: -2.6527, longitude: 37.2606, featured: true, order: 2, published: true },
  { name: "Tsavo East National Park", slug: "tsavo-east-national-park", county: "Taita-Taveta", description: "A large protected area in south-eastern Kenya with semi-arid landscapes, open plains and diverse wildlife.", imageUrl: null, latitude: -3.0, longitude: 38.5, featured: true, order: 3, published: true },
  { name: "Tsavo West National Park", slug: "tsavo-west-national-park", county: "Taita-Taveta", description: "A protected landscape in south-eastern Kenya with volcanic terrain, lava flows, springs and wildlife habitats.", imageUrl: null, latitude: -3.25, longitude: 38.0, featured: false, order: 4, published: true },
  { name: "Samburu National Reserve", slug: "samburu-national-reserve", county: "Samburu", description: "A semi-arid reserve in northern Kenya along the Ewaso Ng’iro River, known for distinctive arid-zone wildlife and birdlife.", imageUrl: null, latitude: 0.5833, longitude: 37.5333, featured: true, order: 5, published: true },
  { name: "Lake Nakuru National Park", slug: "lake-nakuru-national-park", county: "Nakuru", description: "A Rift Valley national park encompassing Lake Nakuru and habitats for birdlife and wildlife, including protected rhinoceros populations.", imageUrl: null, latitude: -0.3667, longitude: 36.0833, featured: false, order: 6, published: true },
  { name: "Nairobi National Park", slug: "nairobi-national-park", county: "Nairobi", description: "A wildlife protected area on the southern edge of Nairobi, with open grassland, wetlands and wildlife against a city backdrop.", imageUrl: null, latitude: -1.3733, longitude: 36.8583, featured: true, order: 7, published: true },
  { name: "Diani Beach", slug: "diani-beach", county: "Kwale", description: "A coastal destination on the Indian Ocean south of Mombasa, with a long sandy shoreline and access to marine and water-based activities. Conditions and services vary by operator and season.", imageUrl: null, latitude: -4.2927, longitude: 39.5794, featured: true, order: 8, published: true },
  { name: "Watamu Marine National Park", slug: "watamu-marine-national-park", county: "Kilifi", description: "A protected marine area on Kenya’s north coast with coral reef ecosystems and coastal marine life.", imageUrl: null, latitude: -3.3667, longitude: 40.0167, featured: true, order: 9, published: true },
  { name: "Kisite-Mpunguti Marine Protected Area", slug: "kisite-mpunguti-marine-protected-area", county: "Kwale", description: "A marine protected area off Kenya’s southern coast, known for coral reef habitats and marine biodiversity.", imageUrl: null, latitude: -4.7167, longitude: 39.3667, featured: true, order: 10, published: true },
  { name: "Lamu Archipelago", slug: "lamu-archipelago", county: "Lamu", description: "An island group on Kenya’s northern coast with Swahili cultural heritage, coastal settlements and marine environments.", imageUrl: null, latitude: -2.2717, longitude: 40.902, featured: false, order: 11, published: true },
  { name: "Lamu Old Town", slug: "lamu-old-town", county: "Lamu", description: "A historic Swahili settlement recognised on the UNESCO World Heritage List for its architecture and continuing cultural traditions.", imageUrl: null, latitude: -2.2717, longitude: 40.902, featured: true, order: 12, published: true },
  { name: "Fort Jesus, Mombasa", slug: "fort-jesus-mombasa", county: "Mombasa", description: "A Portuguese-built fort in Mombasa dating to the late sixteenth century, recognised as a UNESCO World Heritage property.", imageUrl: null, latitude: -4.0624, longitude: 39.6795, featured: true, order: 13, published: true },
  { name: "Gedi Historic Town and Archaeological Site", slug: "gedi-historic-town", county: "Kilifi", description: "The archaeological remains of a Swahili town near the coast, inscribed on the UNESCO World Heritage List in 2024.", imageUrl: null, latitude: -3.315, longitude: 40.018, featured: true, order: 14, published: true },
  { name: "Mount Kenya National Park", slug: "mount-kenya-national-park", county: "Nyeri", description: "A protected mountain landscape around Mount Kenya, with montane forest, alpine habitats and a UNESCO-listed natural property.", imageUrl: null, latitude: -0.1521, longitude: 37.3084, featured: true, order: 15, published: true },
  { name: "Hell’s Gate National Park", slug: "hells-gate-national-park", county: "Nakuru", description: "A Rift Valley national park with dramatic cliffs, gorges and geothermal features. Access and activities depend on park rules and current conditions.", imageUrl: null, latitude: -0.9167, longitude: 36.3167, featured: false, order: 16, published: true },
  { name: "Lake Naivasha", slug: "lake-naivasha", county: "Nakuru", description: "A freshwater lake in the Great Rift Valley surrounded by wetlands and wildlife habitats, with birdwatching and boat activities offered by local operators.", imageUrl: null, latitude: -0.7667, longitude: 36.3667, featured: false, order: 17, published: true },
  { name: "Lake Bogoria", slug: "lake-bogoria", county: "Baringo", description: "An alkaline lake in the Rift Valley known for geothermal springs and birdlife; it forms part of the Kenya Lake System in the Great Rift Valley World Heritage property.", imageUrl: null, latitude: 0.25, longitude: 36.1, featured: false, order: 18, published: true },
  { name: "Kakamega Forest National Reserve", slug: "kakamega-forest-national-reserve", county: "Kakamega", description: "A protected forest in western Kenya valued for its biodiversity, forest walks and birdlife.", imageUrl: null, latitude: 0.25, longitude: 34.8667, featured: false, order: 19, published: true },
  { name: "Nairobi City Centre", slug: "nairobi-city-centre", county: "Nairobi", description: "The central business district of Kenya’s capital, with civic buildings, urban public spaces, museums and access to city cultural attractions.", imageUrl: null, latitude: -1.2864, longitude: 36.8172, featured: false, order: 20, published: true },
];

const attractions = [
  { name: "Mara River", slug: "mara-river", description: "A river system running through the Maasai Mara ecosystem and across the Kenya–Tanzania border. Wildlife viewing and river conditions vary seasonally.", category: "Natural Feature", destinationSlug: "maasai-mara-national-reserve", imageUrl: null, latitude: -1.4, longitude: 34.9, order: 1, published: true },
  { name: "Mara Triangle", slug: "mara-triangle", description: "A western section of the Maasai Mara ecosystem managed as a wildlife conservation area, known for open grassland and wildlife viewing.", category: "Wildlife", destinationSlug: "maasai-mara-national-reserve", imageUrl: null, latitude: -1.35, longitude: 34.9, order: 2, published: true },
  { name: "Observation Hill", slug: "observation-hill-amboseli", description: "A raised viewpoint within Amboseli National Park offering views across the park and, when weather permits, toward Mount Kilimanjaro.", category: "Viewpoint", destinationSlug: "amboseli-national-park", imageUrl: null, latitude: -2.65, longitude: 37.27, order: 3, published: true },
  { name: "Mzima Springs", slug: "mzima-springs", description: "A spring-fed pool system in Tsavo West National Park, known for clear water and aquatic wildlife viewing from designated areas.", category: "Natural Feature", destinationSlug: "tsavo-west-national-park", imageUrl: null, latitude: -2.99, longitude: 38.02, order: 4, published: true },
  { name: "Mudanda Rock", slug: "mudanda-rock", description: "A prominent rock outcrop in Tsavo East National Park overlooking a water catchment area used by wildlife.", category: "Natural Feature", destinationSlug: "tsavo-east-national-park", imageUrl: null, latitude: -3.05, longitude: 38.47, order: 5, published: true },
  { name: "Ewaso Ng’iro River", slug: "ewaso-ngiro-river-samburu", description: "A river that supports wildlife and riverine habitat in the Samburu landscape.", category: "Natural Feature", destinationSlug: "samburu-national-reserve", imageUrl: null, latitude: 0.55, longitude: 37.53, order: 6, published: true },
  { name: "Lake Nakuru", slug: "lake-nakuru", description: "An alkaline lake within Lake Nakuru National Park and part of the Kenya Lake System in the Great Rift Valley World Heritage property.", category: "Lake", destinationSlug: "lake-nakuru-national-park", imageUrl: null, latitude: -0.37, longitude: 36.08, order: 7, published: true },
  { name: "Nairobi Animal Orphanage", slug: "nairobi-animal-orphanage", description: "A Kenya Wildlife Service facility in Nairobi National Park that cares for rescued and orphaned wildlife. Confirm current access arrangements before visiting.", category: "Wildlife Centre", destinationSlug: "nairobi-national-park", imageUrl: null, latitude: -1.366, longitude: 36.75, order: 8, published: true },
  { name: "Diani Beach shoreline", slug: "diani-beach-shoreline", description: "The sandy Indian Ocean shoreline at Diani, used for beach recreation and access to locally operated coastal activities.", category: "Beach", destinationSlug: "diani-beach", imageUrl: null, latitude: -4.2927, longitude: 39.5794, order: 9, published: true },
  { name: "Watamu coral reef area", slug: "watamu-coral-reef-area", description: "Coral reef habitats within the Watamu marine protected area. Snorkelling and diving access depends on marine conditions and licensed operators.", category: "Marine", destinationSlug: "watamu-marine-national-park", imageUrl: null, latitude: -3.3667, longitude: 40.0167, order: 10, published: true },
  { name: "Kisite Island", slug: "kisite-island", description: "A small island within the Kisite marine protected area, associated with reef habitats and marine wildlife.", category: "Marine", destinationSlug: "kisite-mpunguti-marine-protected-area", imageUrl: null, latitude: -4.7, longitude: 39.37, order: 11, published: true },
  { name: "Lamu waterfront", slug: "lamu-waterfront", description: "The waterfront edge of Lamu town, reflecting the island’s historic relationship with Indian Ocean trade and maritime life.", category: "Heritage", destinationSlug: "lamu-archipelago", imageUrl: null, latitude: -2.271, longitude: 40.902, order: 12, published: true },
  { name: "Lamu Old Town alleyways", slug: "lamu-old-town-alleyways", description: "Narrow lanes and traditional Swahili-built streets within the historic town recognised by UNESCO.", category: "Heritage", destinationSlug: "lamu-old-town", imageUrl: null, latitude: -2.2717, longitude: 40.902, order: 13, published: true },
  { name: "Fort Jesus Museum", slug: "fort-jesus-museum", description: "The museum and historic fort complex in Mombasa, interpreted as part of the site’s Portuguese, Swahili and Indian Ocean history.", category: "Museum / Heritage", destinationSlug: "fort-jesus-mombasa", imageUrl: null, latitude: -4.0624, longitude: 39.6795, order: 14, published: true },
  { name: "Gedi ruins", slug: "gedi-ruins", description: "Ruins of a Swahili settlement, including surviving stone structures and archaeological features near the Kenyan coast.", category: "Archaeology", destinationSlug: "gedi-historic-town", imageUrl: null, latitude: -3.315, longitude: 40.018, order: 15, published: true },
  { name: "Mount Kenya summit area", slug: "mount-kenya-summit-area", description: "The high mountain zone of Mount Kenya. Routes, summit access, permits and safety requirements must be checked with the relevant authorities and guides.", category: "Mountain", destinationSlug: "mount-kenya-national-park", imageUrl: null, latitude: -0.152, longitude: 37.308, order: 16, published: true },
  { name: "Fischer’s Tower", slug: "fischers-tower", description: "A volcanic rock formation in Hell’s Gate National Park, a notable landmark for visitors and climbers subject to park rules.", category: "Geological Feature", destinationSlug: "hells-gate-national-park", imageUrl: null, latitude: -0.9, longitude: 36.31, order: 17, published: true },
  { name: "Crescent Island", slug: "crescent-island", description: "A peninsula-like island on Lake Naivasha known for walking safaris and wildlife viewing under local access arrangements.", category: "Wildlife", destinationSlug: "lake-naivasha", imageUrl: null, latitude: -0.78, longitude: 36.37, order: 18, published: true },
  { name: "Lake Bogoria hot springs", slug: "lake-bogoria-hot-springs", description: "Geothermal springs and geysers around Lake Bogoria. Keep to designated routes and observe local safety guidance.", category: "Geothermal", destinationSlug: "lake-bogoria", imageUrl: null, latitude: 0.25, longitude: 36.1, order: 19, published: true },
  { name: "Kakamega Forest nature trails", slug: "kakamega-forest-trails", description: "Forest trails that provide access to the reserve’s forest habitat and birdlife; trail access and guiding arrangements should be checked locally.", category: "Nature Trail", destinationSlug: "kakamega-forest-national-reserve", imageUrl: null, latitude: 0.25, longitude: 34.8667, order: 20, published: true },
  { name: "Nairobi National Museum", slug: "nairobi-national-museum", description: "A National Museums of Kenya institution presenting collections and exhibitions on Kenya’s heritage, culture and natural history.", category: "Museum", destinationSlug: "nairobi-city-centre", imageUrl: null, latitude: -1.272, longitude: 36.814, order: 21, published: true },
  { name: "Karen Blixen Museum", slug: "karen-blixen-museum", description: "A historic house museum in the Karen area of Nairobi associated with author Karen Blixen and the history of the property.", category: "Museum / Heritage", destinationSlug: "nairobi-city-centre", imageUrl: null, latitude: -1.35, longitude: 36.713, order: 22, published: true },
  { name: "Kenyatta International Convention Centre", slug: "kicc", description: "A landmark conference and events venue in central Nairobi, with a recognisable tower and city views when visitor access is available.", category: "Architecture / Urban", destinationSlug: "nairobi-city-centre", imageUrl: null, latitude: -1.288, longitude: 36.823, order: 23, published: true },
  { name: "Nairobi Railway Museum", slug: "nairobi-railway-museum", description: "A railway heritage museum in Nairobi with exhibits relating to the development of rail transport in Kenya and the region.", category: "Museum", destinationSlug: "nairobi-city-centre", imageUrl: null, latitude: -1.296, longitude: 36.827, order: 24, published: true },
  { name: "Nairobi City Market", slug: "nairobi-city-market", description: "A central Nairobi market associated with local crafts, flowers, produce and everyday city commerce. Current opening times and vendor availability should be confirmed locally.", category: "Market / Urban", destinationSlug: "nairobi-city-centre", imageUrl: null, latitude: -1.283, longitude: 36.817, order: 25, published: true },
  { name: "Lake Elementaita", slug: "lake-elementaita", description: "A lake in the Great Rift Valley and one of the three components of the Kenya Lake System World Heritage property.", category: "Lake", destinationSlug: "lake-naivasha", imageUrl: null, latitude: -0.45, longitude: 36.26, order: 26, published: true },
  { name: "Mount Longonot crater rim", slug: "mount-longonot-crater-rim", description: "The volcanic crater and rim of Mount Longonot, a popular hiking landscape near the Rift Valley floor. Route conditions and park requirements should be checked before travel.", category: "Mountain / Hiking", destinationSlug: "hells-gate-national-park", imageUrl: null, latitude: -0.914, longitude: 36.45, order: 27, published: true },
  { name: "Arabuko-Sokoke Forest", slug: "arabuko-sokoke-forest", description: "A coastal forest reserve in Kilifi County known for important forest habitats and birdlife; confirm the appropriate entry point and local guidance.", category: "Forest / Nature", destinationSlug: "watamu-marine-national-park", imageUrl: null, latitude: -3.3, longitude: 39.9, order: 28, published: true },
  { name: "Mombasa Old Town", slug: "mombasa-old-town", description: "A historic district of Mombasa with Swahili, Arab, Indian and European influences in its urban architecture and street pattern.", category: "Heritage / Urban", destinationSlug: "fort-jesus-mombasa", imageUrl: null, latitude: -4.062, longitude: 39.672, order: 29, published: true },
  { name: "Thimlich Ohinga Archaeological Site", slug: "thimlich-ohinga", description: "A dry-stone walled settlement in Migori County inscribed on the UNESCO World Heritage List for its archaeological and cultural significance.", category: "Archaeology", destinationSlug: "nairobi-city-centre", imageUrl: null, latitude: -1.05, longitude: 34.42, order: 30, published: true },
];

async function main() {
  const destinationIds = new Map<string, number>();

  for (const destination of destinations) {
    const { slug, ...data } = destination;
    const saved = await prisma.destination.upsert({
      where: { slug },
      update: {
        name: data.name,
        county: data.county,
        description: data.description,
        imageUrl: null,
        latitude: data.latitude,
        longitude: data.longitude,
        featured: data.featured,
        order: data.order,
        published: data.published,
      },
      create: { slug, ...data },
      select: { id: true, slug: true },
    });
    destinationIds.set(saved.slug, saved.id);
  }

  for (const attraction of attractions) {
    const { destinationSlug, slug, ...data } = attraction;
    const destinationId = destinationIds.get(destinationSlug);
    if (!destinationId) throw new Error(`Missing destination for attraction: ${slug}`);

    await prisma.attraction.upsert({
      where: { slug },
      update: {
        name: data.name,
        description: data.description,
        category: data.category,
        imageUrl: null,
        latitude: data.latitude,
        longitude: data.longitude,
        destinationId,
        order: data.order,
        published: data.published,
      },
      create: { slug, ...data, destinationId },
    });
  }

  console.log(`Imported ${destinations.length} destinations and ${attractions.length} attractions.`);
  console.log("Records are published in the target database; confirm that DATABASE_URL is development-only.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
