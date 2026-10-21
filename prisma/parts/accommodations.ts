// prisma/parts/accommodations.ts
import type { SeedContext } from "./types";

function img(id: string, w = 1200, h = 800) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

type Acc = {
  slug: string;
  name: string;
  type: string;
  destination: string;    // destination slug — resolved to destinationId at write time
  ownerEmail: string;     // business email — resolved to businessId at write time
  description: string;
  location: string;
  priceRange: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
};

const ACCOMMODATIONS: Acc[] = [
  // ── Maasai Mara — owned by mara@business.local ──
  { slug: "mara-serena",        name: "Mara Serena Safari Lodge",     type: "Lodge",       destination: "maasai-mara",           ownerEmail: "mara@business.local",    description: "Luxury lodge with panoramic views of the Mara plains.", location: "Maasai Mara, Narok",         priceRange: "KES 25,000 - 55,000",  imageUrl: img("photo-1571896349842-33c89424de2d"), latitude: -1.49,  longitude: 35.36 },
  { slug: "mara-sopa",          name: "Mara Sopa Lodge",              type: "Lodge",       destination: "maasai-mara",           ownerEmail: "mara@business.local",    description: "Rustic family lodge with landscaped grounds.",          location: "Maasai Mara, Narok",         priceRange: "KES 18,000 - 35,000",  imageUrl: img("photo-1582719508461-905c673771fd"), latitude: -1.50,  longitude: 35.40 },
  { slug: "governors-camp",     name: "Governors' Camp",              type: "Tented Camp", destination: "maasai-mara",           ownerEmail: "mara@business.local",    description: "One of the original Mara camps on the river.",          location: "Maasai Mara, Narok",         priceRange: "KES 60,000 - 120,000", imageUrl: img("photo-1520250497591-112f2f40a3f4"), latitude: -1.50,  longitude: 35.33 },
  { slug: "angama-mara",        name: "Angama Mara",                  type: "Lodge",       destination: "maasai-mara",           ownerEmail: "mara@business.local",    description: "Award-winning tented suites above the Mara Triangle.",  location: "Maasai Mara, Narok",         priceRange: "KES 90,000 - 180,000", imageUrl: img("photo-1566073771259-6a8506099945"), latitude: -1.45,  longitude: 35.25 },

  // ── Amboseli — owned by amboseli@business.local ──
  { slug: "amboseli-serena",    name: "Amboseli Serena Safari Lodge", type: "Lodge",       destination: "amboseli",              ownerEmail: "amboseli@business.local", description: "Acacia-framed lodge with Kilimanjaro views.",            location: "Amboseli, Kajiado",          priceRange: "KES 22,000 - 48,000",  imageUrl: img("photo-1571003123894-1f0594d2b5d9"), latitude: -2.66,  longitude: 37.27 },
  { slug: "tortilis-camp",      name: "Tortilis Camp",                type: "Tented Camp", destination: "amboseli",              ownerEmail: "amboseli@business.local", description: "Eco-friendly camp overlooking Kilimanjaro.",            location: "Amboseli, Kajiado",          priceRange: "KES 40,000 - 75,000",  imageUrl: img("photo-1517824806704-9040b037703b"), latitude: -2.70,  longitude: 37.25 },
  { slug: "ol-tukai",           name: "Ol Tukai Lodge",               type: "Lodge",       destination: "amboseli",              ownerEmail: "amboseli@business.local", description: "Classic Amboseli lodge surrounded by fever trees.",     location: "Amboseli, Kajiado",          priceRange: "KES 26,000 - 52,000",  imageUrl: img("photo-1564501049412-61c2a3083791"), latitude: -2.68,  longitude: 37.30 },

  // ── Diani — owned by diani@business.local ──
  { slug: "diani-sea-resort",   name: "Diani Sea Resort",             type: "Resort",      destination: "diani-beach",           ownerEmail: "diani@business.local",    description: "Beachfront resort with pools and water sports.",        location: "Diani Beach, Kwale",         priceRange: "KES 18,000 - 40,000",  imageUrl: img("photo-1582719478250-c89cae4dc85b"), latitude: -4.29,  longitude: 39.58 },
  { slug: "almanara-villas",    name: "Almanara Luxury Villas",       type: "Resort",      destination: "diani-beach",           ownerEmail: "diani@business.local",    description: "Private beachfront villas.",                            location: "Diani Beach, Kwale",         priceRange: "KES 80,000 - 150,000", imageUrl: img("photo-1613490493576-7fde63acd811"), latitude: -4.31,  longitude: 39.57 },
  { slug: "sands-nomad",        name: "The Sands at Nomad",           type: "Resort",      destination: "diani-beach",           ownerEmail: "diani@business.local",    description: "Boutique beach resort with award-winning restaurant.",  location: "Diani Beach, Kwale",         priceRange: "KES 30,000 - 65,000",  imageUrl: img("photo-1520250497591-112f2f40a3f4"), latitude: -4.28,  longitude: 39.59 },

  // ── Lamu — owned by lamu@business.local ──
  { slug: "majlis-lamu",        name: "The Majlis Resort",            type: "Resort",      destination: "lamu",                  ownerEmail: "lamu@business.local",     description: "Boutique beachfront on Manda Island.",                  location: "Manda Island, Lamu",         priceRange: "KES 45,000 - 95,000",  imageUrl: img("photo-1571003123894-1f0594d2b5d9"), latitude: -2.27,  longitude: 40.90 },
  { slug: "peponi-hotel",       name: "Peponi Hotel",                 type: "Hotel",       destination: "lamu",                  ownerEmail: "lamu@business.local",     description: "Legendary Swahili hotel on Shela beach.",               location: "Shela, Lamu",                priceRange: "KES 28,000 - 55,000",  imageUrl: img("photo-1564501049412-61c2a3083791"), latitude: -2.28,  longitude: 40.92 },

  // ── Watamu / Malindi — owned by watamu@business.local ──
  { slug: "medina-palms",       name: "Medina Palms",                 type: "Resort",      destination: "watamu",                ownerEmail: "watamu@business.local",   description: "Contemporary suites on Turtle Bay.",                    location: "Watamu, Kilifi",             priceRange: "KES 32,000 - 65,000",  imageUrl: img("photo-1613490493576-7fde63acd811"), latitude: -3.37,  longitude: 40.02 },
  { slug: "temple-point",       name: "Temple Point Resort",          type: "Resort",      destination: "watamu",                ownerEmail: "watamu@business.local",   description: "Eco-style resort on a headland.",                       location: "Watamu, Kilifi",             priceRange: "KES 22,000 - 45,000",  imageUrl: img("photo-1520250497591-112f2f40a3f4"), latitude: -3.36,  longitude: 40.03 },
  { slug: "ocean-beach-malindi",name: "Ocean Beach Resort",           type: "Resort",      destination: "malindi",               ownerEmail: "watamu@business.local",   description: "Beach resort at the edge of Malindi Marine Park.",      location: "Malindi, Kilifi",            priceRange: "KES 18,000 - 38,000",  imageUrl: img("photo-1519046904884-53103b34b206"), latitude: -3.22,  longitude: 40.13 },

  // ── Tsavo — owned by coastal@business.local ──
  { slug: "ashnil-aruba",       name: "Ashnil Aruba Lodge",           type: "Lodge",       destination: "tsavo-east",            ownerEmail: "coastal@business.local",  description: "Lodge over an active Tsavo East waterhole.",            location: "Tsavo East, Taita-Taveta",   priceRange: "KES 22,000 - 45,000",  imageUrl: img("photo-1566073771259-6a8506099945"), latitude: -3.01,  longitude: 38.49 },
  { slug: "satao-camp",         name: "Satao Camp",                   type: "Tented Camp", destination: "tsavo-east",            ownerEmail: "coastal@business.local",  description: "Classic Tsavo East camp with a waterhole.",             location: "Tsavo East, Taita-Taveta",   priceRange: "KES 28,000 - 55,000",  imageUrl: img("photo-1517824806704-9040b037703b"), latitude: -2.99,  longitude: 38.51 },
  { slug: "kilaguni-serena",    name: "Kilaguni Serena Safari Lodge", type: "Lodge",       destination: "tsavo-west",            ownerEmail: "coastal@business.local",  description: "Tsavo West's oldest lodge with Kilimanjaro views.",     location: "Tsavo West, Taita-Taveta",   priceRange: "KES 24,000 - 48,000",  imageUrl: img("photo-1571896349842-33c89424de2d"), latitude: -3.42,  longitude: 38.00 },

  // ── Samburu — owned by savannah@business.local ──
  { slug: "samburu-sopa",       name: "Samburu Sopa Lodge",           type: "Lodge",       destination: "samburu",               ownerEmail: "savannah@business.local", description: "Rondavel lodge on a Samburu hilltop.",                  location: "Samburu National Reserve",   priceRange: "KES 20,000 - 40,000",  imageUrl: img("photo-1582719508461-905c673771fd"), latitude: 0.59,   longitude: 37.54 },
  { slug: "elephant-bedroom-camp", name: "Elephant Bedroom Camp",     type: "Tented Camp", destination: "samburu",               ownerEmail: "savannah@business.local", description: "Intimate luxury camp on the Ewaso Ng'iro.",            location: "Samburu National Reserve",   priceRange: "KES 65,000 - 125,000", imageUrl: img("photo-1517824806704-9040b037703b"), latitude: 0.60,   longitude: 37.52 },

  // ── Nairobi + Rift lakes + Hell's Gate — owned by nairobi@business.local ──
  { slug: "giraffe-manor",      name: "Giraffe Manor",                type: "Hotel",       destination: "nairobi",               ownerEmail: "nairobi@business.local",  description: "Iconic hotel with Rothschild giraffes at breakfast.",   location: "Langata, Nairobi",           priceRange: "KES 120,000 - 220,000", imageUrl: img("photo-1547721064-da6cfb341d50"), latitude: -1.37,  longitude: 36.75 },
  { slug: "hemingways-nairobi", name: "Hemingways Nairobi",           type: "Hotel",       destination: "nairobi",               ownerEmail: "nairobi@business.local",  description: "Luxury suites in Karen with renowned spa.",            location: "Karen, Nairobi",             priceRange: "KES 55,000 - 95,000",  imageUrl: img("photo-1582719478250-c89cae4dc85b"), latitude: -1.35,  longitude: 36.71 },
  { slug: "norfolk-hotel",      name: "The Norfolk Hotel",            type: "Hotel",       destination: "nairobi",               ownerEmail: "nairobi@business.local",  description: "Historic 5-star in downtown Nairobi.",                 location: "Nairobi CBD",                priceRange: "KES 15,000 - 35,000",  imageUrl: img("photo-1564501049412-61c2a3083791"), latitude: -1.28,  longitude: 36.82 },
  { slug: "ole-sereni",         name: "Ole Sereni Hotel",             type: "Hotel",       destination: "nairobi-national-park", ownerEmail: "nairobi@business.local",  description: "Hotel overlooking Nairobi National Park.",              location: "Mombasa Road, Nairobi",      priceRange: "KES 12,000 - 25,000",  imageUrl: img("photo-1566073771259-6a8506099945"), latitude: -1.33,  longitude: 36.85 },
  { slug: "sarova-lion-hill",   name: "Sarova Lion Hill Lodge",       type: "Lodge",       destination: "lake-nakuru",           ownerEmail: "nairobi@business.local",  description: "Plateau lodge overlooking Lake Nakuru.",                location: "Lake Nakuru, Nakuru",        priceRange: "KES 20,000 - 45,000",  imageUrl: img("photo-1571896349842-33c89424de2d"), latitude: -0.37,  longitude: 36.08 },
  { slug: "lake-nakuru-lodge",  name: "Lake Nakuru Lodge",            type: "Lodge",       destination: "lake-nakuru",           ownerEmail: "nairobi@business.local",  description: "Family-run lodge inside the park.",                     location: "Lake Nakuru, Nakuru",        priceRange: "KES 16,000 - 32,000",  imageUrl: img("photo-1566073771259-6a8506099945"), latitude: -0.36,  longitude: 36.09 },
  { slug: "naivasha-sopa",      name: "Lake Naivasha Sopa Resort",    type: "Resort",      destination: "lake-naivasha",         ownerEmail: "nairobi@business.local",  description: "Resort on the shore of Lake Naivasha.",                 location: "Naivasha, Nakuru",           priceRange: "KES 22,000 - 42,000",  imageUrl: img("photo-1544551763-46a013bb70d5"), latitude: -0.76,  longitude: 36.36 },
  { slug: "baringo-club",       name: "Lake Baringo Club",            type: "Hotel",       destination: "lake-baringo",          ownerEmail: "nairobi@business.local",  description: "Lakeside hotel popular with birdwatchers.",             location: "Lake Baringo, Baringo",      priceRange: "KES 12,000 - 25,000",  imageUrl: img("photo-1500375592092-40eb2168fd21"), latitude: 0.47,   longitude: 36.10 },
  { slug: "bogoria-spa",        name: "Bogoria Spa Resort",           type: "Resort",      destination: "lake-bogoria",          ownerEmail: "nairobi@business.local",  description: "Hotel near Lake Bogoria's hot springs.",                location: "Lake Bogoria, Baringo",      priceRange: "KES 10,000 - 20,000",  imageUrl: img("photo-1516214104703-d870798883c5"), latitude: 0.25,   longitude: 36.10 },
  { slug: "hells-gate-guesthouse", name: "Hell's Gate Guesthouse",    type: "Guesthouse",  destination: "hells-gate",            ownerEmail: "nairobi@business.local",  description: "Simple guesthouse near the park gate.",                 location: "Hell's Gate, Nakuru",        priceRange: "KES 4,000 - 8,000",    imageUrl: img("photo-1501785888041-af3ef285b470"), latitude: -0.91,  longitude: 36.31 },

  // ── Mount Kenya + Nyahururu + Kakamega — owned by summit@business.local ──
  { slug: "fairmont-mt-kenya",  name: "Fairmont Mount Kenya Safari Club", type: "Hotel",   destination: "mount-kenya",           ownerEmail: "summit@business.local",   description: "Historic resort at the foot of Mount Kenya.",           location: "Nanyuki, Laikipia",          priceRange: "KES 35,000 - 75,000",  imageUrl: img("photo-1571003123894-1f0594d2b5d9"), latitude: -0.05,  longitude: 37.08 },
  { slug: "serena-mountain-lodge", name: "Serena Mountain Lodge",     type: "Lodge",       destination: "mount-kenya",           ownerEmail: "summit@business.local",   description: "Only lodge inside Mount Kenya NP, with a salt lick.",   location: "Mount Kenya, Nyeri",         priceRange: "KES 22,000 - 42,000",  imageUrl: img("photo-1571896349842-33c89424de2d"), latitude: -0.32,  longitude: 37.18 },
  { slug: "thomsons-falls-lodge", name: "Thomson's Falls Lodge",      type: "Lodge",       destination: "nyahururu-falls",       ownerEmail: "summit@business.local",   description: "Historic lodge overlooking the falls.",                 location: "Nyahururu, Laikipia",        priceRange: "KES 10,000 - 20,000",  imageUrl: img("photo-1432405972618-c60b0225b8f9"), latitude: 0.04,   longitude: 36.37 },
  { slug: "kakamega-forest-lodge", name: "Kakamega Forest Lodge",     type: "Lodge",       destination: "kakamega-forest",       ownerEmail: "summit@business.local",   description: "Eco-lodge on the edge of the forest.",                  location: "Kakamega Forest",            priceRange: "KES 8,000 - 15,000",   imageUrl: img("photo-1441974231531-c6227db76b6e"), latitude: 0.24,   longitude: 34.87 },
];

export async function seedAccommodations(ctx: SeedContext) {
  let created = 0;
  let updated = 0;
  const skipped: string[] = [];
  const perOwner: Record<string, number> = {};

  for (const a of ACCOMMODATIONS) {
    const dest = ctx.destinations[a.destination];
    const owner = ctx.businesses[a.ownerEmail];

    if (!dest) {
      console.warn(`  ⚠ Skipping "${a.slug}" — unknown destination "${a.destination}"`);
      skipped.push(a.slug);
      continue;
    }
    if (!owner) {
      console.warn(`  ⚠ Skipping "${a.slug}" — unknown owner "${a.ownerEmail}"`);
      skipped.push(a.slug);
      continue;
    }

    const data = {
      name: a.name,
      type: a.type,
      description: a.description,
      location: a.location,
      priceRange: a.priceRange,
      imageUrl: a.imageUrl,
      latitude: a.latitude,
      longitude: a.longitude,
      destinationId: dest.id,
      businessId: owner.id,
      published: true,
    };

    const existing = await ctx.prisma.accommodation.findUnique({
      where: { slug: a.slug },
      select: { id: true },
    });

    if (existing) {
      await ctx.prisma.accommodation.update({
        where: { id: existing.id },
        data,
      });
      updated++;
      ctx.listings.accommodations[a.slug] = {
        id: existing.id,
        ownerId: owner.id,
        kind: "accommodation",
      };
    } else {
      const row = await ctx.prisma.accommodation.create({
        data: { slug: a.slug, ...data },
        select: { id: true },
      });
      created++;
      ctx.listings.accommodations[a.slug] = {
        id: row.id,
        ownerId: owner.id,
        kind: "accommodation",
      };
    }

    perOwner[a.ownerEmail] = (perOwner[a.ownerEmail] ?? 0) + 1;
  }

  console.log(
    `✔ Accommodations: ${ACCOMMODATIONS.length} (${created} created, ${updated} updated, ${skipped.length} skipped)`,
  );
  for (const [email, count] of Object.entries(perOwner).sort()) {
    console.log(`    ${email} → ${count} accommodation${count === 1 ? "" : "s"}`);
  }
}