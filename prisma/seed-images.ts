// prisma/seed-images.ts
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function img(photoId: string, width = 1600, height = 1000): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

/* ─── Destination images (20) ──────────────────────────────── */

const destinationImages: Record<string, string> = {
  // Wildlife reserves & parks
  "maasai-mara-national-reserve":         img("photo-1516426122078-c23e76319801"),
  "amboseli-national-park":               img("photo-1547970810-dc1eac37d174"),
  "tsavo-east-national-park":             img("photo-1564760055775-d63b17a55c44"),
  "tsavo-west-national-park":             img("photo-1549366021-9f761d450615"),
  "samburu-national-reserve":             img("photo-1547471080-7cc2caa01a7e"),
  "lake-nakuru-national-park":            img("photo-1518709268805-4e9042af9f23"),
  "nairobi-national-park":                img("photo-1547471080-7cc2caa01a7e"),

  // Coast
  "diani-beach":                          img("photo-1507525428034-b723cf961d3e"),
  "watamu-marine-national-park":          img("photo-1544551763-77ef2d0cfc6c"),
  "kisite-mpunguti-marine-protected-area":img("photo-1583212292454-1fe6229603b7"),

  // Lamu
  "lamu-archipelago":                     img("photo-1571407970349-bc81e7e96d47"),
  "lamu-old-town":                        img("photo-1571407970349-bc81e7e96d47"),

  // Mombasa & Gedi
  "fort-jesus-mombasa":                   img("photo-1519046904884-53103b34b206"),
  "gedi-historic-town":                   img("photo-1571407970349-bc81e7e96d47"),

  // Mountains & Rift Valley
  "mount-kenya-national-park":            img("photo-1519681393784-d120267933ba"),
  "hells-gate-national-park":             img("photo-1501785888041-af3ef285b470"),
  "lake-naivasha":                        img("photo-1544551763-46a013bb70d5"),
  "lake-bogoria":                         img("photo-1516214104703-d870798883c5"),

  // Forest
  "kakamega-forest-national-reserve":     img("photo-1441974231531-c6227db76b6e"),

  // Nairobi
  "nairobi-city-centre":                  img("photo-1611348586804-61bf6c080437"),
};

/* ─── Attraction images (30) ───────────────────────────────── */

const attractionImages: Record<string, string> = {
  // Maasai Mara
  "mara-river":                           img("photo-1534177616072-ef7dc120449d"),
  "mara-triangle":                        img("photo-1516426122078-c23e76319801"),

  // Amboseli & Tsavo
  "observation-hill-amboseli":            img("photo-1589553416260-f586c8f1514f"),
  "mzima-springs":                        img("photo-1544551763-77ef2d0cfc6c"),
  "mudanda-rock":                         img("photo-1564760055775-d63b17a55c44"),

  // Samburu
  "ewaso-ngiro-river-samburu":            img("photo-1547471080-7cc2caa01a7e"),

  // Lake Nakuru
  "lake-nakuru":                          img("photo-1518709268805-4e9042af9f23"),

  // Nairobi National Park
  "nairobi-animal-orphanage":             img("photo-1564760055775-d63b17a55c44"),

  // Coast
  "diani-beach-shoreline":                img("photo-1507525428034-b723cf961d3e"),
  "watamu-coral-reef-area":               img("photo-1544551763-77ef2d0cfc6c"),
  "kisite-island":                        img("photo-1583212292454-1fe6229603b7"),

  // Lamu
  "lamu-waterfront":                      img("photo-1571407970349-bc81e7e96d47"),
  "lamu-old-town-alleyways":              img("photo-1571407970349-bc81e7e96d47"),

  // Mombasa & Gedi
  "fort-jesus-museum":                    img("photo-1519046904884-53103b34b206"),
  "gedi-ruins":                           img("photo-1571407970349-bc81e7e96d47"),
  "mombasa-old-town":                     img("photo-1519046904884-53103b34b206"),

  // Mountains
  "mount-kenya-summit-area":              img("photo-1519681393784-d120267933ba"),
  "mount-longonot-crater-rim":            img("photo-1501785888041-af3ef285b470"),

  // Rift Valley lakes
  "crescent-island":                      img("photo-1544551763-46a013bb70d5"),
  "lake-bogoria-hot-springs":             img("photo-1516214104703-d870798883c5"),
  "lake-elementaita":                     img("photo-1518709268805-4e9042af9f23"),

  // Forest
  "kakamega-forest-trails":               img("photo-1441974231531-c6227db76b6e"),
  "arabuko-sokoke-forest":                img("photo-1441974231531-c6227db76b6e"),

  // Nairobi cultural sites
  "nairobi-national-museum":              img("photo-1564399579883-451a5d44ec08"),
  "karen-blixen-museum":                  img("photo-1564399579883-451a5d44ec08"),
  "kicc":                                 img("photo-1611348586804-61bf6c080437"),
  "nairobi-railway-museum":               img("photo-1553413077-190dd305871c"),
  "nairobi-city-market":                  img("photo-1519567241046-7f570eee3ce6"),

  // Hells Gate
  "fischers-tower":                       img("photo-1501785888041-af3ef285b470"),

  // Migori
  "thimlich-ohinga":                      img("photo-1564399579883-451a5d44ec08"),
};

/* ─── Tour package images (19) ─────────────────────────────── */

const packageImages: Record<string, string> = {
  "maasai-mara-classic-safari":           img("photo-1516426122078-c23e76319801"),
  "amboseli-national-park-safari":        img("photo-1547970810-dc1eac37d174"),
  "maasai-mara-lake-naivasha-safari":     img("photo-1516426122078-c23e76319801"),
  "kenya-explorer-safari":                img("photo-1516426122078-c23e76319801"),
  "diani-beach-getaway":                  img("photo-1507525428034-b723cf961d3e"),
  "samburu-wildlife-safari":              img("photo-1547471080-7cc2caa01a7e"),
  "tsavo-east-tsavo-west-safari":         img("photo-1564760055775-d63b17a55c44"),
  "mount-kenya-adventure":                img("photo-1519681393784-d120267933ba"),
  "nairobi-city-wildlife-tour":           img("photo-1611348586804-61bf6c080437"),
  "nairobi-national-park-day-safari":     img("photo-1547471080-7cc2caa01a7e"),
  "giraffe-centre-nairobi-nature-escape": img("photo-1547721064-da6cfb341d50"),
  "naivasha-day-escape":                  img("photo-1544551763-46a013bb70d5"),
  "kiambethu-tea-farm-day-tour":          img("photo-1447933601403-0c6688de566e"),
  "ol-pejeta-conservancy-day-safari":     img("photo-1547471080-7cc2caa01a7e"),
  "turkenya-maasai-mara-classic":         img("photo-1516426122078-c23e76319801"),
  "turkenya-amboseli-kilimanjaro":        img("photo-1547970810-dc1eac37d174"),
  "turkenya-samburu-explorer":            img("photo-1547471080-7cc2caa01a7e"),
  "turkenya-ultimate-kenya-circuit":      img("photo-1516426122078-c23e76319801"),
};

/* ─── Apply ────────────────────────────────────────────────── */

async function applyDestinationImages() {
  let updated = 0;
  let missing = 0;

  for (const [slug, imageUrl] of Object.entries(destinationImages)) {
    const res = await prisma.destination.updateMany({
      where: { slug },
      data: { imageUrl },
    });
    if (res.count === 0) {
      console.warn(`⚠ Destination not found: ${slug}`);
      missing++;
    } else {
      updated += res.count;
    }
  }

  console.log(`✔ Destinations: ${updated} updated, ${missing} missing`);
}

async function applyAttractionImages() {
  let updated = 0;
  let missing = 0;

  for (const [slug, imageUrl] of Object.entries(attractionImages)) {
    const res = await prisma.attraction.updateMany({
      where: { slug },
      data: { imageUrl },
    });
    if (res.count === 0) {
      console.warn(`⚠ Attraction not found: ${slug}`);
      missing++;
    } else {
      updated += res.count;
    }
  }

  console.log(`✔ Attractions: ${updated} updated, ${missing} missing`);
}

async function applyPackageImages() {
  let updated = 0;
  let missing = 0;

  for (const [slug, imageUrl] of Object.entries(packageImages)) {
    const res = await prisma.tourPackage.updateMany({
      where: { slug },
      data: { imageUrl },
    });
    if (res.count === 0) {
      console.warn(`⚠ TourPackage not found: ${slug}`);
      missing++;
    } else {
      updated += res.count;
    }
  }

  console.log(`✔ TourPackages: ${updated} updated, ${missing} missing`);
}

async function main() {
  console.log("🖼  Applying image URLs…\n");
  await applyDestinationImages();
  await applyAttractionImages();
  await applyPackageImages();
  console.log("\n✅ Image seed complete.");
}

main()
  .catch((error) => {
    console.error("Image seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });