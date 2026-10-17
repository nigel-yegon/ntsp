// prisma.config.ts
import { config } from "dotenv";
import { existsSync } from "fs";
import { defineConfig, env } from "@prisma/config";

// Load the appropriate env file for the current environment.
// Prisma CLI commands run outside Next.js, so they don't get the
// automatic .env* loading that Next.js provides.
const candidates = [".env.local", ".env.production", ".env"];
const envFile = candidates.find((f) => existsSync(f));
if (envFile) {
  config({ path: envFile });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
