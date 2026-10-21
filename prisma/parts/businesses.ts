// prisma/parts/businesses.ts
import type { SeedContext } from "./types";
import { Role } from "../../lib/generated/prisma/client";

const BUSINESSES = [
  // Pure hotelier — Diani
  { email: "diani@business.local", name: "Diani Resorts Manager", role: Role.BUSINESS, businessName: "Diani Beach Resorts", businessType: "ACCOMMODATION", traLicenseNumber: "TRA1/47/C02/2055", verificationStatus: "APPROVED" as const, katoMember: false },
  // Mixed — Mara (hotelier + operator)
  { email: "mara@business.local", name: "Mara Serena Manager", role: Role.BUSINESS, businessName: "Mara Serena Safari Lodges", businessType: "ACCOMMODATION", traLicenseNumber: "TRA1/47/C02/1024", verificationStatus: "APPROVED" as const, katoMember: true },
  // Amboseli hotelier
  { email: "amboseli@business.local", name: "Amboseli Lodges Manager", role: Role.BUSINESS, businessName: "Amboseli Lodges", businessType: "ACCOMMODATION", traLicenseNumber: "TRA1/47/C02/9988", verificationStatus: "PENDING" as const, katoMember: false },
  // Lamu hotelier
  { email: "lamu@business.local", name: "Lamu Resorts Manager", role: Role.BUSINESS, businessName: "Lamu Island Resorts", businessType: "ACCOMMODATION", traLicenseNumber: "TRA1/47/C02/4410", verificationStatus: "PENDING" as const, katoMember: false },
  // Nairobi hotelier
  { email: "nairobi@business.local", name: "Nairobi Hotels Manager", role: Role.BUSINESS, businessName: "Nairobi City Hotels", businessType: "ACCOMMODATION", traLicenseNumber: "TRA1/47/C02/5612", verificationStatus: "APPROVED" as const, katoMember: true },
  // Watamu hotelier
  { email: "watamu@business.local", name: "Watamu Resorts Manager", role: Role.BUSINESS, businessName: "Watamu Beach Resorts", businessType: "ACCOMMODATION", traLicenseNumber: "TRA1/47/C02/7789", verificationStatus: "APPROVED" as const, katoMember: false },
  // Operator: Savannah
  { email: "savannah@business.local", name: "Savannah Tours Operator", role: Role.OPERATOR, businessName: "Savannah Tours Ltd", businessType: "TOUR_OPERATOR", traLicenseNumber: "TRA1/47/C01/2057", verificationStatus: "APPROVED" as const, katoMember: true },
  // Operator: Wild Trail
  { email: "wildtrail@business.local", name: "Wild Trail Safaris", role: Role.OPERATOR, businessName: "Wild Trail Safaris", businessType: "TOUR_OPERATOR", traLicenseNumber: "TRA1/47/C01/4471", verificationStatus: "APPROVED" as const, katoMember: true },
  // Operator: Summit
  { email: "summit@business.local", name: "Summit Trekking Co.", role: Role.OPERATOR, businessName: "Summit Trekking Co.", businessType: "TOUR_OPERATOR", traLicenseNumber: "TRA1/47/C01/5918", verificationStatus: "APPROVED" as const, katoMember: true },
  // Operator: Coastal
  { email: "coastal@business.local", name: "Coastal Day Trips", role: Role.OPERATOR, businessName: "Coastal Day Trips Ltd", businessType: "TOUR_OPERATOR", traLicenseNumber: "TRA1/47/C01/6320", verificationStatus: "APPROVED" as const, katoMember: false },
  // Operator: Nairobi City
  { email: "citysafari@business.local", name: "Nairobi City Safaris", role: Role.OPERATOR, businessName: "Nairobi City Safaris", businessType: "TOUR_OPERATOR", traLicenseNumber: "TRA1/47/C01/7104", verificationStatus: "PENDING" as const, katoMember: false },
];

export async function seedBusinesses(ctx: SeedContext) {
  for (const b of BUSINESSES) {
    const user = await ctx.prisma.user.upsert({
      where: { email: b.email },
      update: { role: b.role, passwordHash: ctx.passwordHash },
      create: {
        email: b.email,
        name: b.name,
        role: b.role,
        passwordHash: ctx.passwordHash,
        emailVerified: new Date(),
      },
    });

    await ctx.prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: b.businessName,
        contactEmail: b.email.replace("business.local", "example"),
        contactPhone: "+254 700 000 000",
        businessType: b.businessType,
        traLicenseNumber: b.traLicenseNumber,
        ktbRegistered: true,
        katoMember: b.katoMember,
        verificationStatus: b.verificationStatus,
        approvedAt: b.verificationStatus === "APPROVED" ? new Date() : null,
      },
    });

    ctx.businesses[b.email] = { id: user.id, name: b.businessName };
  }
  console.log(`✔ ${BUSINESSES.length} businesses & operators`);
}