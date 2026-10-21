// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import type { SeedContext } from "./parts/types";

import { seedDestinations } from "./parts/destinations";
import { seedAttractions } from "./parts/attractions";
import { seedUsers } from "./parts/users";
import { seedBusinesses } from "./parts/businesses";
import { seedAccommodations } from "./parts/accommodations";
import { seedPackages } from "./parts/packages";
import { seedEvents } from "./parts/events";
import { seedPosts } from "./parts/posts";
import { seedResources } from "./parts/resources";
import { seedApplications } from "./parts/applications";
import { seedBookings } from "./parts/bookings";
import { seedIncidents } from "./parts/incidents";
import { seedInquiries } from "./parts/inquiries";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 NTSP consolidated seed\n");

  const ctx: SeedContext = {
    prisma,
    passwordHash: await bcrypt.hash("password123", 10),
    destinations: {},
    businesses: {},
    listings: {
      accommodations: {},
      packages: {},
    },
    users: {
      admin: undefined,
      employers: [],
      perusers: [],
      verifiers: [],
      committee: [],
      ps: [],
      customers: [],
    },
  };

  await seedDestinations(ctx);
  await seedAttractions(ctx);
  await seedUsers(ctx);
  await seedBusinesses(ctx);
  await seedAccommodations(ctx);
  await seedPackages(ctx);
  await seedEvents(ctx);
  await seedPosts(ctx);
  await seedResources(ctx);
  await seedApplications(ctx);
  await seedBookings(ctx);
  await seedIncidents(ctx);
  await seedInquiries(ctx);

  console.log("\n✅ Seed complete. All demo accounts use password123.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());