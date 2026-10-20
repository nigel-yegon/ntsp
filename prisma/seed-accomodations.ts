// prisma/seed-accommodations.ts
import "dotenv/config";
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

/**
 * 100 accommodations across Kenya.
 *
 * Name: real Kenyan properties where public; synthetic otherwise.
 * Contact: placeholders only (.test email / +254 000 phone).
 * Prices in KES per night.
 */
const ACCOMMODATIONS: {
  name: string;
  slug: string;
  type: "Hotel" | "Lodge" | "Resort" | "Tented Camp" | "Guesthouse" | "Villa";
  description: string;
  location: string;
  county: string;
  priceRange: string;
  destinationSlug: string;
  latitude: number;
  longitude: number;
  published: boolean;
}[] = [
  // ── Maasai Mara (12) ──
  { name: "Mara Serena Safari Lodge", slug: "mara-serena", type: "Lodge", description: "Luxury lodge perched on a hill with panoramic views of the Mara plains.", location: "Maasai Mara, Narok", county: "Narok", priceRange: "KES 25,000 - 55,000", destinationSlug: "maasai-mara", latitude: -1.49, longitude: 35.36, published: true },
  { name: "Angama Mara", slug: "angama-mara", type: "Lodge", description: "Award-winning tented suites suspended above the Great Rift Valley.", location: "Maasai Mara, Narok", county: "Narok", priceRange: "KES 90,000 - 180,000", destinationSlug: "maasai-mara", latitude: -1.45, longitude: 35.25, published: true },
  { name: "Governors' Camp", slug: "governors-camp", type: "Tented Camp", description: "One of the original Mara camps on the banks of the Mara River.", location: "Maasai Mara, Narok", county: "Narok", priceRange: "KES 60,000 - 120,000", destinationSlug: "maasai-mara", latitude: -1.5, longitude: 35.33, published: true },
  { name: "Mara Sopa Lodge", slug: "mara-sopa", type: "Lodge", description: "Rustic lodge with individual cottages ideal for families.", location: "Maasai Mara, Narok", county: "Narok", priceRange: "KES 18,000 - 35,000", destinationSlug: "maasai-mara", latitude: -1.5, longitude: 35.4, published: true },
  { name: "Mara Plains Camp", slug: "mara-plains-camp", type: "Tented Camp", description: "Intimate luxury camp in the Olare Motorogi Conservancy.", location: "Olare Motorogi, Narok", county: "Narok", priceRange: "KES 75,000 - 150,000", destinationSlug: "maasai-mara", latitude: -1.43, longitude: 35.28, published: true },
  { name: "Cottar's 1920s Safari Camp", slug: "cottars-1920s", type: "Tented Camp", description: "Colonial-style safari camp with classic safari atmosphere.", location: "Olderkesi, Narok", county: "Narok", priceRange: "KES 85,000 - 160,000", destinationSlug: "maasai-mara", latitude: -1.36, longitude: 35.36, published: true },
  { name: "Mara River Tented Camp", slug: "mara-river-camp", type: "Tented Camp", description: "Eco-friendly riverside camp overlooking the Mara River.", location: "Mara Triangle, Narok", county: "Narok", priceRange: "KES 55,000 - 95,000", destinationSlug: "maasai-mara", latitude: -1.51, longitude: 35.22, published: true },
  { name: "Asilia Rekero Camp", slug: "rekero-camp", type: "Tented Camp", description: "Small classic camp near the Talek river, prime for river crossings.", location: "Talek River, Narok", county: "Narok", priceRange: "KES 70,000 - 130,000", destinationSlug: "maasai-mara", latitude: -1.47, longitude: 35.3, published: true },
  { name: "Alex Walker's Serian", slug: "serian-mara", type: "Tented Camp", description: "Exclusive-use bush camp with private vehicle and guide.", location: "Mara North, Narok", county: "Narok", priceRange: "KES 120,000 - 200,000", destinationSlug: "maasai-mara", latitude: -1.4, longitude: 35.22, published: true },
  { name: "Encounter Mara", slug: "encounter-mara", type: "Tented Camp", description: "Small tented camp in the Naboisho Conservancy.", location: "Naboisho, Narok", county: "Narok", priceRange: "KES 45,000 - 80,000", destinationSlug: "maasai-mara", latitude: -1.45, longitude: 35.36, published: true },
  { name: "Keekorok Lodge", slug: "keekorok-lodge", type: "Lodge", description: "Historic lodge in the heart of the reserve, popular with classic safaris.", location: "Central Mara, Narok", county: "Narok", priceRange: "KES 22,000 - 45,000", destinationSlug: "maasai-mara", latitude: -1.59, longitude: 35.25, published: true },
  { name: "Talek Bush Camp", slug: "talek-bush-camp", type: "Tented Camp", description: "Budget-friendly tented camp near the Talek gate.", location: "Talek, Narok", county: "Narok", priceRange: "KES 8,000 - 15,000", destinationSlug: "maasai-mara", latitude: -1.47, longitude: 35.35, published: true },

  // ── Amboseli (8) ──
  { name: "Amboseli Serena Safari Lodge", slug: "amboseli-serena", type: "Lodge", description: "Acacia-framed lodge with uninterrupted Kilimanjaro views.", location: "Amboseli, Kajiado", county: "Kajiado", priceRange: "KES 22,000 - 48,000", destinationSlug: "amboseli", latitude: -2.66, longitude: 37.27, published: true },
  { name: "Tortilis Camp", slug: "tortilis-camp", type: "Tented Camp", description: "Eco-friendly camp on the edge of Amboseli, overlooking Kilimanjaro.", location: "Amboseli, Kajiado", county: "Kajiado", priceRange: "KES 40,000 - 75,000", destinationSlug: "amboseli", latitude: -2.7, longitude: 37.25, published: true },
  { name: "Ol Tukai Lodge", slug: "ol-tukai", type: "Lodge", description: "Classic Amboseli lodge surrounded by fever trees.", location: "Amboseli, Kajiado", county: "Kajiado", priceRange: "KES 26,000 - 52,000", destinationSlug: "amboseli", latitude: -2.68, longitude: 37.3, published: true },
  { name: "Kibo Safari Camp", slug: "kibo-safari-camp", type: "Tented Camp", description: "Tented camp with Kilimanjaro views and a swimming pool.", location: "Amboseli, Kajiado", county: "Kajiado", priceRange: "KES 18,000 - 32,000", destinationSlug: "amboseli", latitude: -2.7, longitude: 37.3, published: true },
  { name: "Amboseli Sopa Lodge", slug: "amboseli-sopa", type: "Lodge", description: "Family lodge on 200 acres of grounds, 15 minutes from the gate.", location: "Amboseli, Kajiado", county: "Kajiado", priceRange: "KES 20,000 - 38,000", destinationSlug: "amboseli", latitude: -2.72, longitude: 37.28, published: true },
  { name: "Tawi Lodge", slug: "tawi-lodge", type: "Lodge", description: "Boutique lodge in a private conservancy west of Amboseli.", location: "Kitirua, Kajiado", county: "Kajiado", priceRange: "KES 55,000 - 95,000", destinationSlug: "amboseli", latitude: -2.73, longitude: 37.13, published: true },
  { name: "Sentrim Amboseli Lodge", slug: "sentrim-amboseli", type: "Lodge", description: "Comfortable mid-range lodge with views of the swamps.", location: "Amboseli, Kajiado", county: "Kajiado", priceRange: "KES 15,000 - 28,000", destinationSlug: "amboseli", latitude: -2.65, longitude: 37.25, published: true },
  { name: "Amboseli Discovery Camp", slug: "amboseli-discovery", type: "Tented Camp", description: "Adventure camp on the edge of the park.", location: "Amboseli, Kajiado", county: "Kajiado", priceRange: "KES 10,000 - 18,000", destinationSlug: "amboseli", latitude: -2.7, longitude: 37.24, published: true },

  // ── Diani / South Coast (10) ──
  { name: "Diani Sea Resort", slug: "diani-sea-resort", type: "Resort", description: "Beachfront resort with pools and water sports.", location: "Diani Beach, Kwale", county: "Kwale", priceRange: "KES 18,000 - 40,000", destinationSlug: "diani-beach", latitude: -4.29, longitude: 39.58, published: true },
  { name: "Almanara Luxury Villas", slug: "almanara-villas", type: "Villa", description: "Private beachfront villas with dedicated staff.", location: "Diani Beach, Kwale", county: "Kwale", priceRange: "KES 80,000 - 150,000", destinationSlug: "diani-beach", latitude: -4.31, longitude: 39.57, published: true },
  { name: "The Sands at Nomad", slug: "sands-nomad", type: "Resort", description: "Boutique beach resort with colonial-style architecture.", location: "Diani Beach, Kwale", county: "Kwale", priceRange: "KES 30,000 - 65,000", destinationSlug: "diani-beach", latitude: -4.28, longitude: 39.59, published: true },
  { name: "Nomad Beach Resort", slug: "nomad-beach-resort", type: "Resort", description: "Relaxed beach resort with dive centre and beachside restaurant.", location: "Diani Beach, Kwale", county: "Kwale", priceRange: "KES 22,000 - 45,000", destinationSlug: "diani-beach", latitude: -4.3, longitude: 39.57, published: true },
  { name: "Baobab Beach Resort", slug: "baobab-beach", type: "Resort", description: "All-inclusive coastal resort set in 80 acres of gardens.", location: "Diani Beach, Kwale", county: "Kwale", priceRange: "KES 25,000 - 55,000", destinationSlug: "diani-beach", latitude: -4.31, longitude: 39.57, published: true },
  { name: "Leopard Beach Resort", slug: "leopard-beach", type: "Resort", description: "Five-star resort on a private stretch of Diani beach.", location: "Diani Beach, Kwale", county: "Kwale", priceRange: "KES 40,000 - 80,000", destinationSlug: "diani-beach", latitude: -4.29, longitude: 39.59, published: true },
  { name: "Pinewood Beach Resort", slug: "pinewood-beach", type: "Resort", description: "Colonial-themed resort with a private beach.", location: "Diani Beach, Kwale", county: "Kwale", priceRange: "KES 20,000 - 40,000", destinationSlug: "diani-beach", latitude: -4.31, longitude: 39.56, published: true },
  { name: "AfroChic Diani", slug: "afrochic-diani", type: "Resort", description: "Boutique boutique-style resort near the beach.", location: "Diani Beach, Kwale", county: "Kwale", priceRange: "KES 35,000 - 70,000", destinationSlug: "diani-beach", latitude: -4.27, longitude: 39.6, published: true },
  { name: "Diani Backpackers", slug: "diani-backpackers", type: "Guesthouse", description: "Friendly budget guesthouse popular with backpackers.", location: "Diani Beach, Kwale", county: "Kwale", priceRange: "KES 3,000 - 7,000", destinationSlug: "diani-beach", latitude: -4.29, longitude: 39.59, published: true },
  { name: "Ocean Village Club", slug: "ocean-village-club", type: "Resort", description: "Wellness-focused resort on the quieter south end of Diani.", location: "Diani Beach, Kwale", county: "Kwale", priceRange: "KES 50,000 - 90,000", destinationSlug: "diani-beach", latitude: -4.33, longitude: 39.56, published: true },

  // ── Lake Nakuru (5) ──
  { name: "Sarova Lion Hill Lodge", slug: "sarova-lion-hill", type: "Lodge", description: "Plateau lodge overlooking Lake Nakuru.", location: "Lake Nakuru, Nakuru", county: "Nakuru", priceRange: "KES 20,000 - 45,000", destinationSlug: "lake-nakuru", latitude: -0.37, longitude: 36.08, published: true },
  { name: "Lake Nakuru Lodge", slug: "lake-nakuru-lodge", type: "Lodge", description: "Family-run lodge inside the park.", location: "Lake Nakuru, Nakuru", county: "Nakuru", priceRange: "KES 16,000 - 32,000", destinationSlug: "lake-nakuru", latitude: -0.36, longitude: 36.09, published: true },
  { name: "Flamingo Hill Tented Camp", slug: "flamingo-hill-camp", type: "Tented Camp", description: "Tented camp with views over the lake.", location: "Lake Nakuru, Nakuru", county: "Nakuru", priceRange: "KES 12,000 - 22,000", destinationSlug: "lake-nakuru", latitude: -0.38, longitude: 36.07, published: true },
  { name: "Lake Nakuru Sopa Lodge", slug: "nakuru-sopa", type: "Lodge", description: "Lodge with elevated views over the alkaline lake.", location: "Lake Nakuru, Nakuru", county: "Nakuru", priceRange: "KES 18,000 - 35,000", destinationSlug: "lake-nakuru", latitude: -0.37, longitude: 36.06, published: true },
  { name: "Waterbuck Hotel", slug: "waterbuck-hotel", type: "Hotel", description: "City hotel in Nakuru town, good base for the park.", location: "Nakuru Town", county: "Nakuru", priceRange: "KES 6,000 - 12,000", destinationSlug: "lake-nakuru", latitude: -0.28, longitude: 36.07, published: true },

  // ── Nairobi (15) ──
  { name: "Giraffe Manor", slug: "giraffe-manor", type: "Hotel", description: "Iconic boutique hotel where giraffes visit at breakfast.", location: "Langata, Nairobi", county: "Nairobi", priceRange: "KES 120,000 - 220,000", destinationSlug: "nairobi", latitude: -1.37, longitude: 36.75, published: true },
  { name: "Hemingways Nairobi", slug: "hemingways-nairobi", type: "Hotel", description: "Luxury suites in Karen with butler service and a renowned spa.", location: "Karen, Nairobi", county: "Nairobi", priceRange: "KES 55,000 - 95,000", destinationSlug: "nairobi", latitude: -1.35, longitude: 36.71, published: true },
  { name: "The Norfolk Hotel", slug: "norfolk-hotel", type: "Hotel", description: "Historic five-star hotel founded in 1904.", location: "Nairobi CBD", county: "Nairobi", priceRange: "KES 15,000 - 35,000", destinationSlug: "nairobi", latitude: -1.29, longitude: 36.82, published: true },
  { name: "Fairmont The Norfolk", slug: "fairmont-norfolk", type: "Hotel", description: "Grand colonial-era hotel in the heart of the city.", location: "Nairobi CBD", county: "Nairobi", priceRange: "KES 20,000 - 40,000", destinationSlug: "nairobi", latitude: -1.28, longitude: 36.82, published: true },
  { name: "Tribe Hotel", slug: "tribe-hotel", type: "Hotel", description: "Design hotel in the leafy suburb of Gigiri.", location: "Gigiri, Nairobi", county: "Nairobi", priceRange: "KES 22,000 - 45,000", destinationSlug: "nairobi", latitude: -1.23, longitude: 36.8, published: true },
  { name: "The Stanley", slug: "the-stanley", type: "Hotel", description: "Landmark hotel with a famous rooftop bar.", location: "Nairobi CBD", county: "Nairobi", priceRange: "KES 18,000 - 38,000", destinationSlug: "nairobi", latitude: -1.28, longitude: 36.82, published: true },
  { name: "House of Waine", slug: "house-of-waine", type: "Hotel", description: "Boutique hotel in Karen with lush gardens.", location: "Karen, Nairobi", county: "Nairobi", priceRange: "KES 30,000 - 55,000", destinationSlug: "nairobi", latitude: -1.36, longitude: 36.71, published: true },
  { name: "Palacina Suites", slug: "palacina-suites", type: "Hotel", description: "Suites and apartments in a quiet, leafy enclave.", location: "Kilimani, Nairobi", county: "Nairobi", priceRange: "KES 15,000 - 30,000", destinationSlug: "nairobi", latitude: -1.29, longitude: 36.79, published: true },
  { name: "Wildebeest Eco Camp", slug: "wildebeest-eco-camp", type: "Guesthouse", description: "Eco-friendly camp with tents and rooms, near Karen.", location: "Langata, Nairobi", county: "Nairobi", priceRange: "KES 3,500 - 12,000", destinationSlug: "nairobi", latitude: -1.37, longitude: 36.73, published: true },
  { name: "Sankara Nairobi", slug: "sankara-nairobi", type: "Hotel", description: "Five-star hotel in Westlands with multiple restaurants.", location: "Westlands, Nairobi", county: "Nairobi", priceRange: "KES 25,000 - 50,000", destinationSlug: "nairobi", latitude: -1.26, longitude: 36.8, published: true },
  { name: "Radisson Blu Upper Hill", slug: "radisson-upperhill", type: "Hotel", description: "Business hotel in Nairobi's financial district.", location: "Upper Hill, Nairobi", county: "Nairobi", priceRange: "KES 18,000 - 35,000", destinationSlug: "nairobi", latitude: -1.3, longitude: 36.81, published: true },
  { name: "Emakoko", slug: "emakoko", type: "Lodge", description: "Luxury lodge on the edge of Nairobi National Park.", location: "Nairobi National Park", county: "Nairobi", priceRange: "KES 60,000 - 120,000", destinationSlug: "nairobi-national-park", latitude: -1.38, longitude: 36.85, published: true },
  { name: "Hob House", slug: "hob-house", type: "Guesthouse", description: "Small guesthouse in Karen with garden views.", location: "Karen, Nairobi", county: "Nairobi", priceRange: "KES 8,000 - 15,000", destinationSlug: "nairobi", latitude: -1.34, longitude: 36.72, published: true },
  { name: "Ngong House", slug: "ngong-house", type: "Guesthouse", description: "Elegant guesthouse on the edge of Ngong Forest.", location: "Langata, Nairobi", county: "Nairobi", priceRange: "KES 25,000 - 45,000", destinationSlug: "nairobi", latitude: -1.37, longitude: 36.7, published: true },
  { name: "Ole Sereni Hotel", slug: "ole-sereni", type: "Hotel", description: "Hotel overlooking Nairobi National Park.", location: "Mombasa Road, Nairobi", county: "Nairobi", priceRange: "KES 12,000 - 25,000", destinationSlug: "nairobi", latitude: -1.33, longitude: 36.85, published: true },

  // ── Tsavo East & West (6) ──
  { name: "Ashnil Aruba Lodge", slug: "ashnil-aruba", type: "Lodge", description: "Lodge overlooking an active Tsavo East waterhole.", location: "Tsavo East, Taita-Taveta", county: "Taita-Taveta", priceRange: "KES 22,000 - 45,000", destinationSlug: "tsavo-east", latitude: -3.01, longitude: 38.49, published: true },
  { name: "Satao Camp", slug: "satao-camp", type: "Tented Camp", description: "Classic tented camp with a waterhole.", location: "Tsavo East, Taita-Taveta", county: "Taita-Taveta", priceRange: "KES 28,000 - 55,000", destinationSlug: "tsavo-east", latitude: -2.99, longitude: 38.51, published: true },
  { name: "Kilaguni Serena Safari Lodge", slug: "kilaguni-serena", type: "Lodge", description: "Tsavo West's oldest lodge with Kilimanjaro views.", location: "Tsavo West, Taita-Taveta", county: "Taita-Taveta", priceRange: "KES 24,000 - 48,000", destinationSlug: "tsavo-west", latitude: -3.42, longitude: 38.0, published: true },
  { name: "Severin Safari Camp", slug: "severin-camp", type: "Tented Camp", description: "Luxury tented camp in the heart of Tsavo West.", location: "Tsavo West, Taita-Taveta", county: "Taita-Taveta", priceRange: "KES 45,000 - 80,000", destinationSlug: "tsavo-west", latitude: -3.4, longitude: 37.98, published: true },
  { name: "Finch Hattons", slug: "finch-hattons", type: "Tented Camp", description: "Historic tented camp near Mzima Springs.", location: "Tsavo West, Taita-Taveta", county: "Taita-Taveta", priceRange: "KES 80,000 - 150,000", destinationSlug: "tsavo-west", latitude: -3.43, longitude: 37.99, published: true },
  { name: "Voi Wildlife Lodge", slug: "voi-wildlife", type: "Lodge", description: "Affordable lodge at the Voi gate, popular with self-drive visitors.", location: "Tsavo East, Taita-Taveta", county: "Taita-Taveta", priceRange: "KES 10,000 - 20,000", destinationSlug: "tsavo-east", latitude: -3.4, longitude: 38.57, published: true },

  // ── Samburu (5) ──
  { name: "Samburu Sopa Lodge", slug: "samburu-sopa", type: "Lodge", description: "Rondavel lodge on a Samburu hilltop.", location: "Samburu National Reserve", county: "Samburu", priceRange: "KES 20,000 - 40,000", destinationSlug: "samburu", latitude: 0.59, longitude: 37.54, published: true },
  { name: "Elephant Bedroom Camp", slug: "elephant-bedroom-camp", type: "Tented Camp", description: "Intimate luxury camp on the Ewaso Ng'iro.", location: "Samburu National Reserve", county: "Samburu", priceRange: "KES 65,000 - 125,000", destinationSlug: "samburu", latitude: 0.6, longitude: 37.52, published: true },
  { name: "Sasaab", slug: "sasaab", type: "Lodge", description: "Moroccan-inspired lodge with river and mountain views.", location: "Samburu, Westgate Conservancy", county: "Samburu", priceRange: "KES 80,000 - 160,000", destinationSlug: "samburu", latitude: 0.6, longitude: 37.5, published: true },
  { name: "Larsens Camp", slug: "larsens-camp", type: "Tented Camp", description: "Classic tented camp on the Ewaso Ng'iro river.", location: "Samburu National Reserve", county: "Samburu", priceRange: "KES 40,000 - 70,000", destinationSlug: "samburu", latitude: 0.57, longitude: 37.54, published: true },
  { name: "Ashnil Samburu Camp", slug: "ashnil-samburu", type: "Tented Camp", description: "Comfortable camp inside the reserve.", location: "Samburu National Reserve", county: "Samburu", priceRange: "KES 25,000 - 45,000", destinationSlug: "samburu", latitude: 0.61, longitude: 37.53, published: true },

  // ── Lamu (5) ──
  { name: "The Majlis Resort", slug: "majlis-lamu", type: "Resort", description: "Boutique beachfront resort on Manda Island.", location: "Manda Island, Lamu", county: "Lamu", priceRange: "KES 45,000 - 95,000", destinationSlug: "lamu", latitude: -2.27, longitude: 40.9, published: true },
  { name: "Peponi Hotel", slug: "peponi-hotel", type: "Hotel", description: "Legendary Swahili hotel on Shela beach since 1967.", location: "Shela, Lamu", county: "Lamu", priceRange: "KES 28,000 - 55,000", destinationSlug: "lamu", latitude: -2.28, longitude: 40.92, published: true },
  { name: "Lamu House", slug: "lamu-house", type: "Hotel", description: "Restored Swahili mansion in the old town.", location: "Lamu Old Town", county: "Lamu", priceRange: "KES 15,000 - 30,000", destinationSlug: "lamu", latitude: -2.27, longitude: 40.9, published: true },
  { name: "Shela Bahari Guesthouse", slug: "shela-bahari", type: "Guesthouse", description: "Simple Swahili guesthouse steps from the beach.", location: "Shela, Lamu", county: "Lamu", priceRange: "KES 6,000 - 12,000", destinationSlug: "lamu", latitude: -2.28, longitude: 40.91, published: true },
  { name: "Kizingo Beach House", slug: "kizingo-beach", type: "Villa", description: "Private beach house on the west coast of Lamu island.", location: "Shela, Lamu", county: "Lamu", priceRange: "KES 35,000 - 60,000", destinationSlug: "lamu", latitude: -2.29, longitude: 40.9, published: true },

  // ── Watamu / Malindi (8) ──
  { name: "Medina Palms", slug: "medina-palms", type: "Resort", description: "Contemporary suites and rooftop pools on Turtle Bay.", location: "Watamu, Kilifi", county: "Kilifi", priceRange: "KES 32,000 - 65,000", destinationSlug: "watamu", latitude: -3.37, longitude: 40.02, published: true },
  { name: "Turtle Bay Beach Club", slug: "turtle-bay", type: "Resort", description: "All-inclusive family resort on Turtle Bay.", location: "Watamu, Kilifi", county: "Kilifi", priceRange: "KES 25,000 - 50,000", destinationSlug: "watamu", latitude: -3.36, longitude: 40.02, published: true },
  { name: "Hemingways Watamu", slug: "hemingways-watamu", type: "Resort", description: "Luxury resort with private beach and dive centre.", location: "Watamu, Kilifi", county: "Kilifi", priceRange: "KES 45,000 - 85,000", destinationSlug: "watamu", latitude: -3.37, longitude: 40.01, published: true },
  { name: "Temple Point Resort", slug: "temple-point", type: "Resort", description: "Eco-style resort on a headland overlooking the marine park.", location: "Watamu, Kilifi", county: "Kilifi", priceRange: "KES 22,000 - 45,000", destinationSlug: "watamu", latitude: -3.36, longitude: 40.03, published: true },
  { name: "Lawford's Hotel", slug: "lawfords-hotel", type: "Hotel", description: "Small beachfront hotel in Watamu village.", location: "Watamu, Kilifi", county: "Kilifi", priceRange: "KES 10,000 - 20,000", destinationSlug: "watamu", latitude: -3.38, longitude: 40.02, published: true },
  { name: "Ocean Beach Resort", slug: "ocean-beach-malindi", type: "Resort", description: "Beach resort at the edge of Malindi Marine Park.", location: "Malindi, Kilifi", county: "Kilifi", priceRange: "KES 18,000 - 38,000", destinationSlug: "malindi", latitude: -3.22, longitude: 40.13, published: true },
  { name: "Driftwood Club", slug: "driftwood-club", type: "Hotel", description: "Beachfront club hotel with a private cove.", location: "Malindi, Kilifi", county: "Kilifi", priceRange: "KES 15,000 - 30,000", destinationSlug: "malindi", latitude: -3.23, longitude: 40.13, published: true },
  { name: "Malindi Guesthouse", slug: "malindi-guesthouse", type: "Guesthouse", description: "Simple, well-located budget guesthouse in Malindi town.", location: "Malindi, Kilifi", county: "Kilifi", priceRange: "KES 4,000 - 8,000", destinationSlug: "malindi", latitude: -3.22, longitude: 40.12, published: true },

  // ── Mount Kenya / Laikipia (8) ──
  { name: "Fairmont Mount Kenya Safari Club", slug: "fairmont-mt-kenya", type: "Hotel", description: "Historic resort at the foot of Mount Kenya.", location: "Nanyuki, Laikipia", county: "Laikipia", priceRange: "KES 35,000 - 75,000", destinationSlug: "mount-kenya", latitude: -0.05, longitude: 37.08, published: true },
  { name: "Serena Mountain Lodge", slug: "serena-mountain-lodge", type: "Lodge", description: "Only lodge inside Mount Kenya National Park, with a salt lick.", location: "Mount Kenya, Nyeri", county: "Nyeri", priceRange: "KES 22,000 - 42,000", destinationSlug: "mount-kenya", latitude: -0.32, longitude: 37.18, published: true },
  { name: "Severin Mountain Lodge", slug: "severin-mountain", type: "Lodge", description: "Forest lodge at the base of Mount Kenya.", location: "Nanyuki, Laikipia", county: "Laikipia", priceRange: "KES 18,000 - 35,000", destinationSlug: "mount-kenya", latitude: -0.05, longitude: 37.07, published: true },
  { name: "Ol Pejeta Bush Camp", slug: "ol-pejeta-bush-camp", type: "Tented Camp", description: "Luxury camp in the Ol Pejeta Conservancy.", location: "Ol Pejeta, Laikipia", county: "Laikipia", priceRange: "KES 60,000 - 110,000", destinationSlug: "mount-kenya", latitude: 0.0, longitude: 36.93, published: true },
  { name: "Segera Retreat", slug: "segera-retreat", type: "Lodge", description: "Ultra-luxury retreat on 50,000 acres of Laikipia.", location: "Laikipia", county: "Laikipia", priceRange: "KES 200,000 - 350,000", destinationSlug: "mount-kenya", latitude: 0.22, longitude: 36.83, published: true },
  { name: "Solio Lodge", slug: "solio-lodge", type: "Lodge", description: "Exclusive lodge in a private conservancy known for rhinos.", location: "Solio, Laikipia", county: "Laikipia", priceRange: "KES 120,000 - 200,000", destinationSlug: "mount-kenya", latitude: -0.27, longitude: 36.63, published: true },
  { name: "Lewa Safari Camp", slug: "lewa-safari-camp", type: "Tented Camp", description: "Classic camp in the Lewa Wildlife Conservancy.", location: "Lewa, Laikipia", county: "Laikipia", priceRange: "KES 50,000 - 95,000", destinationSlug: "mount-kenya", latitude: 0.18, longitude: 37.45, published: true },
  { name: "Mount Kenya Guesthouse", slug: "mt-kenya-guesthouse", type: "Guesthouse", description: "Simple guesthouse in Nanyuki town.", location: "Nanyuki, Laikipia", county: "Laikipia", priceRange: "KES 5,000 - 10,000", destinationSlug: "mount-kenya", latitude: -0.02, longitude: 37.07, published: true },

  // ── Naivasha / Hell's Gate (6) ──
  { name: "Lake Naivasha Sopa Resort", slug: "naivasha-sopa", type: "Resort", description: "Resort on the shores of Lake Naivasha.", location: "Lake Naivasha, Nakuru", county: "Nakuru", priceRange: "KES 22,000 - 42,000", destinationSlug: "lake-naivasha", latitude: -0.76, longitude: 36.36, published: true },
  { name: "Enashipai Resort & Spa", slug: "enashipai", type: "Resort", description: "Spa resort overlooking the lake.", location: "Naivasha, Nakuru", county: "Nakuru", priceRange: "KES 28,000 - 55,000", destinationSlug: "lake-naivasha", latitude: -0.76, longitude: 36.36, published: true },
  { name: "Loldia House", slug: "loldia-house", type: "Lodge", description: "Colonial farmhouse on the shores of Lake Naivasha.", location: "Naivasha, Nakuru", county: "Nakuru", priceRange: "KES 60,000 - 100,000", destinationSlug: "lake-naivasha", latitude: -0.83, longitude: 36.35, published: true },
  { name: "Crescent Camp", slug: "crescent-camp", type: "Tented Camp", description: "Tented camp overlooking Crescent Island.", location: "Naivasha, Nakuru", county: "Nakuru", priceRange: "KES 18,000 - 32,000", destinationSlug: "lake-naivasha", latitude: -0.77, longitude: 36.4, published: true },
  { name: "Lake Naivasha Country Club", slug: "naivasha-country-club", type: "Hotel", description: "Historic country club with manicured gardens.", location: "Naivasha, Nakuru", county: "Nakuru", priceRange: "KES 16,000 - 30,000", destinationSlug: "lake-naivasha", latitude: -0.77, longitude: 36.35, published: true },
  { name: "Hell's Gate Guesthouse", slug: "hells-gate-guesthouse", type: "Guesthouse", description: "Simple guesthouse near the park gate.", location: "Hell's Gate, Nakuru", county: "Nakuru", priceRange: "KES 4,000 - 8,000", destinationSlug: "hells-gate", latitude: -0.91, longitude: 36.31, published: true },

  // ── Baringo / Bogoria (4) ──
  { name: "Lake Baringo Club", slug: "baringo-club", type: "Hotel", description: "Lakeside hotel popular with birdwatchers.", location: "Lake Baringo, Baringo", county: "Baringo", priceRange: "KES 12,000 - 25,000", destinationSlug: "lake-baringo", latitude: 0.47, longitude: 36.1, published: true },
  { name: "Samatian Island Lodge", slug: "samatian-island", type: "Lodge", description: "Private lodge on an island in Lake Baringo.", location: "Lake Baringo, Baringo", county: "Baringo", priceRange: "KES 40,000 - 75,000", destinationSlug: "lake-baringo", latitude: 0.5, longitude: 36.1, published: true },
  { name: "Robert's Camp", slug: "roberts-camp", type: "Tented Camp", description: "Camp and campsite on the shore of Lake Baringo.", location: "Lake Baringo, Baringo", county: "Baringo", priceRange: "KES 8,000 - 18,000", destinationSlug: "lake-baringo", latitude: 0.47, longitude: 36.09, published: true },
  { name: "Bogoria Spa Resort", slug: "bogoria-spa", type: "Resort", description: "Hotel near Lake Bogoria's hot springs.", location: "Lake Bogoria, Baringo", county: "Baringo", priceRange: "KES 10,000 - 20,000", destinationSlug: "lake-bogoria", latitude: 0.25, longitude: 36.1, published: true },

  // ── Kakamega (2) ──
  { name: "Rondo Retreat Centre", slug: "rondo-retreat", type: "Guesthouse", description: "Colonial retreat in the heart of Kakamega Forest.", location: "Kakamega Forest", county: "Kakamega", priceRange: "KES 12,000 - 22,000", destinationSlug: "kakamega-forest", latitude: 0.23, longitude: 34.87, published: true },
  { name: "Kakamega Forest Lodge", slug: "kakamega-forest-lodge", type: "Lodge", description: "Eco-lodge on the edge of the forest.", location: "Kakamega Forest", county: "Kakamega", priceRange: "KES 8,000 - 15,000", destinationSlug: "kakamega-forest", latitude: 0.24, longitude: 34.87, published: true },

  // ── Kisite-Mpunguti / Shimoni (3) ──
  { name: "Shimoni Reef Lodge", slug: "shimoni-reef", type: "Lodge", description: "Dive lodge at Shimoni, gateway to Kisite-Mpunguti.", location: "Shimoni, Kwale", county: "Kwale", priceRange: "KES 15,000 - 30,000", destinationSlug: "kisite-mpunguti", latitude: -4.65, longitude: 39.38, published: true },
  { name: "Pilli Pipa Dhow Safari", slug: "pilli-pipa", type: "Guesthouse", description: "Guesthouse linked to dhow safaris in the marine park.", location: "Shimoni, Kwale", county: "Kwale", priceRange: "KES 10,000 - 20,000", destinationSlug: "kisite-mpunguti", latitude: -4.65, longitude: 39.38, published: true },
  { name: "Makoa Farm", slug: "makoa-farm", type: "Guesthouse", description: "Farm guesthouse near the marine park.", location: "Shimoni, Kwale", county: "Kwale", priceRange: "KES 8,000 - 16,000", destinationSlug: "kisite-mpunguti", latitude: -4.63, longitude: 39.4, published: true },

  // ── Nyahururu (2) ──
  { name: "Panorama Hotel Nyahururu", slug: "panorama-nyahururu", type: "Hotel", description: "Family hotel near Thomson's Falls.", location: "Nyahururu, Laikipia", county: "Laikipia", priceRange: "KES 6,000 - 12,000", destinationSlug: "nyahururu-falls", latitude: 0.03, longitude: 36.37, published: true },
  { name: "Thomson's Falls Lodge", slug: "thomsons-falls-lodge", type: "Lodge", description: "Historic lodge overlooking the falls.", location: "Nyahururu, Laikipia", county: "Laikipia", priceRange: "KES 10,000 - 20,000", destinationSlug: "nyahururu-falls", latitude: 0.04, longitude: 36.37, published: true },

  // ── Nanyuki extras (2) ──
  { name: "Aberdare Country Club", slug: "aberdare-country-club", type: "Hotel", description: "Colonial country club on the slopes of the Aberdares.", location: "Nanyuki, Laikipia", county: "Laikipia", priceRange: "KES 22,000 - 42,000", destinationSlug: "mount-kenya", latitude: -0.14, longitude: 36.68, published: true },
  { name: "The Ark Forest Lodge", slug: "ark-lodge", type: "Lodge", description: "Unique treehouse-shaped lodge overlooking a salt lick.", location: "Aberdares, Nyeri", county: "Nyeri", priceRange: "KES 25,000 - 45,000", destinationSlug: "mount-kenya", latitude: -0.36, longitude: 36.85, published: true },
];

async function seedAccommodations() {
  console.log("🌱 Seeding 100 accommodations...");

  const destinations = await prisma.destination.findMany({
    select: { id: true, slug: true },
  });
  const destBySlug = Object.fromEntries(
    destinations.map((d) => [d.slug, d.id])
  );

  // Create (or reuse) a synthetic owner business
  const ownerEmail = "demo-stays@business.local";
  const ownerPassword = await bcrypt.hash("password123", 10);

  const ownerUser = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      name: "Demo Stays Kenya",
      role: "BUSINESS",
      passwordHash: ownerPassword,
    },
  });

  await prisma.businessProfile.upsert({
    where: { userId: ownerUser.id },
    update: {},
    create: {
      userId: ownerUser.id,
      businessName: "Demo Stays Kenya",
      contactEmail: "bookings@demo-stays.test",
      contactPhone: "+254 000 000 000",
      description: "Placeholder operator used for demo accommodations. Safe to delete.",
      verificationStatus: "APPROVED",
      businessType: "ACCOMMODATION",
      traLicenseNumber: "TRA1/DEMO/C02/0001",
      katoMember: false,
    },
  });

  let created = 0;
  let skipped = 0;

  for (const a of ACCOMMODATIONS) {
    const destId = destBySlug[a.destinationSlug];
    if (!destId) {
      console.warn(`⚠ Destination not found: ${a.destinationSlug} — skipping ${a.slug}`);
      skipped++;
      continue;
    }

    // Deterministic image based on the type
    const imageMap: Record<typeof a.type, string> = {
      Hotel: "photo-1564501049412-61c2a3083791",
      Lodge: "photo-1571896349842-33c89424de2d",
      Resort: "photo-1582719478250-c89cae4dc85b",
      "Tented Camp": "photo-1517824806704-9040b037703b",
      Guesthouse: "photo-1582719508461-905c673771fd",
      Villa: "photo-1613490493576-7fde63acd811",
    };

    await prisma.accommodation.upsert({
      where: { slug: a.slug },
      update: {
        name: a.name,
        type: a.type,
        description: a.description,
        location: a.location,
        priceRange: a.priceRange,
        imageUrl: img(imageMap[a.type]),
        destinationId: destId,
        businessId: ownerUser.id,
        latitude: a.latitude,
        longitude: a.longitude,
        published: a.published,
      },
      create: {
        name: a.name,
        slug: a.slug,
        type: a.type,
        description: a.description,
        location: a.location,
        priceRange: a.priceRange,
        imageUrl: img(imageMap[a.type]),
        destinationId: destId,
        businessId: ownerUser.id,
        latitude: a.latitude,
        longitude: a.longitude,
        published: a.published,
      },
    });
    created++;
  }

  console.log(`✅ Seeded ${created} accommodations (${skipped} skipped).`);
  console.log(`   Owner business: ${ownerEmail} (userId=${ownerUser.id})`);
  console.log(`   All test accounts use password: password123`);
}

seedAccommodations()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });