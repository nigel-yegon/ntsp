// prisma/parts/users.ts
import type { SeedContext } from "./types";
import { Role } from "../../lib/generated/prisma/client";

export async function seedUsers(ctx: SeedContext) {
  // Companies for employers
  for (let i = 0; i < 10; i++) {
    await ctx.prisma.company.upsert({
      where: { registrationNo: `DEMO-CO-${1000 + i}` },
      update: {},
      create: {
        name: `Demo Employer Co ${i + 1}`,
        registrationNo: `DEMO-CO-${1000 + i}`,
        kraPin: `P${String(1000000 + i)}X`,
        tourismLicenceNo: `TLA-${2000 + i}`,
      },
    });
  }

  // Admin
  const admin = await ctx.prisma.user.upsert({
    where: { email: "admin@test.local" },
    update: { passwordHash: ctx.passwordHash },
    create: {
      email: "admin@test.local",
      name: "System Admin",
      role: Role.ADMIN,
      passwordHash: ctx.passwordHash,
      emailVerified: new Date(),
    },
  });
  ctx.users.admin = { id: admin.id };

  // Employers (with companies)
  ctx.users.employers = [];
  for (let i = 0; i < 10; i++) {
    const company = await ctx.prisma.company.findUniqueOrThrow({
      where: { registrationNo: `DEMO-CO-${1000 + i}` },
    });
    const u = await ctx.prisma.user.upsert({
      where: { email: `employer${i + 1}@demo.local` },
      update: { passwordHash: ctx.passwordHash },
      create: {
        email: `employer${i + 1}@demo.local`,
        name: `Employer Demo ${i + 1}`,
        role: Role.EMPLOYER,
        passwordHash: ctx.passwordHash,
        emailVerified: new Date(),
        companyId: company.id,
      },
    });
    ctx.users.employers.push({ id: u.id, companyId: company.id });
  }

  // Customers
  ctx.users.customers = [];
  const customerNames = ["Amina Hassan", "James Mwangi", "Sophie Turner", "David Kimani", "Lucia Fernández", "Hiroshi Sato"];
  for (let i = 0; i < customerNames.length; i++) {
    const u = await ctx.prisma.user.upsert({
      where: { email: `customer${i + 1}@demo.local` },
      update: { passwordHash: ctx.passwordHash },
      create: {
        email: `customer${i + 1}@demo.local`,
        name: customerNames[i],
        role: Role.CUSTOMER,
        passwordHash: ctx.passwordHash,
        emailVerified: new Date(),
      },
    });
    ctx.users.customers.push({ id: u.id, name: customerNames[i] });
  }

  // Perusers
  ctx.users.perusers = [];
  for (let i = 0; i < 10; i++) {
    const u = await ctx.prisma.user.upsert({
      where: { email: `peruser${i + 1}@demo.local` },
      update: { passwordHash: ctx.passwordHash },
      create: {
        email: `peruser${i + 1}@demo.local`,
        name: `Peruser Demo ${i + 1}`,
        role: Role.PERUSER,
        passwordHash: ctx.passwordHash,
        emailVerified: new Date(),
      },
    });
    ctx.users.perusers.push({ id: u.id });
  }

  // Verifiers
  ctx.users.verifiers = [];
  for (let i = 0; i < 10; i++) {
    const u = await ctx.prisma.user.upsert({
      where: { email: `verifier${i + 1}@demo.local` },
      update: { passwordHash: ctx.passwordHash },
      create: {
        email: `verifier${i + 1}@demo.local`,
        name: `Verifier Demo ${i + 1}`,
        role: Role.VERIFIER,
        passwordHash: ctx.passwordHash,
        emailVerified: new Date(),
      },
    });
    ctx.users.verifiers.push({ id: u.id });
  }

  // Committee
  ctx.users.committee = [];
  for (let i = 0; i < 10; i++) {
    const u = await ctx.prisma.user.upsert({
      where: { email: `committee${i + 1}@demo.local` },
      update: { passwordHash: ctx.passwordHash },
      create: {
        email: `committee${i + 1}@demo.local`,
        name: `Committee Demo ${i + 1}`,
        role: Role.COMMITTEE_MEMBER,
        passwordHash: ctx.passwordHash,
        emailVerified: new Date(),
      },
    });
    ctx.users.committee.push({ id: u.id });
  }

  // PS
  ctx.users.ps = [];
  for (let i = 0; i < 10; i++) {
    const u = await ctx.prisma.user.upsert({
      where: { email: `ps${i + 1}@demo.local` },
      update: { passwordHash: ctx.passwordHash },
      create: {
        email: `ps${i + 1}@demo.local`,
        name: `PS Demo ${i + 1}`,
        role: Role.PERMANENT_SECRETARY,
        passwordHash: ctx.passwordHash,
        emailVerified: new Date(),
      },
    });
    ctx.users.ps.push({ id: u.id });
  }

  console.log(`✔ Users: 10 employers, 6 customers, 10 perusers, 10 verifiers, 10 committee, 10 PS, 1 admin`);
}