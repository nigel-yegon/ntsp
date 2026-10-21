// prisma/parts/types.ts
import type { PrismaClient } from "../../lib/generated/prisma/client";

export type SeedContext = {
  prisma: PrismaClient;
  passwordHash: string;

  // ── Populated by seedDestinations ───────────────────────────
  destinations: Record<string, { id: number; name: string }>;

  // ── Populated by seedBusinesses ─────────────────────────────
  // Keyed by the business user's email.
  businesses: Record<string, { id: string; name: string }>;

  // ── Populated by seedAccommodations / seedPackages ──────────
  // Keyed by listing slug. `kind` lets downstream seeds tell
  // whether a given listing is an accommodation or a package
  // without scanning both maps.
  listings: {
    accommodations: Record<
      string,
      { id: number; ownerId: string; kind: "accommodation" }
    >;
    packages: Record<
      string,
      { id: number; ownerId: string; kind: "package" }
    >;
  };

  // ── Populated by seedUsers ──────────────────────────────────
  users: {
    admin?: { id: string };
    employers: { id: string; companyId: string | null }[];
    perusers: { id: string }[];
    verifiers: { id: string }[];
    committee: { id: string }[];
    ps: { id: string }[];
    customers: { id: string; name: string }[];
  };
};