// prisma/seed-users.ts
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  BusinessVerification,
  PermitClass,
  ApplicationType,
  ApplicationStatus,
  EventType,
  VoteDecision,
  AssignmentRole,
  BookingStatus,
  ThreadSubject,
  IncidentStatus,
  IncidentCategory,
  InquiryStatus,
  InvestorType,
  InvestmentInterest,
  InvestmentScale,
  ResourceCategory,
} from "../lib/generated/prisma/client.js";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PASSWORD = "password123";

const roles: { role: Role; count: number; label: string }[] = [
  { role: Role.EMPLOYER,            count: 10, label: "employer" },
  { role: Role.CUSTOMER,            count: 10, label: "customer" },
  { role: Role.BUSINESS,            count: 10, label: "business" },
  { role: Role.OPERATOR,            count: 10, label: "operator" },
  { role: Role.PERUSER,             count: 10, label: "peruser" },
  { role: Role.VERIFIER,            count: 10, label: "verifier" },
  { role: Role.COMMITTEE_MEMBER,    count: 10, label: "committee" },
  { role: Role.PERMANENT_SECRETARY, count: 10, label: "ps" },
];

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  console.log("🔐 Hashing done\n");

  // ── Companies (for employers) ─────────────────────────────
  const companies = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.company.upsert({
        where: { registrationNo: `DEMO-CO-${1000 + i}` },
        update: {},
        create: {
          name: `Demo Employer Co ${i + 1}`,
          registrationNo: `DEMO-CO-${1000 + i}`,
          kraPin: `P${String(1000000 + i)}X`,
          tourismLicenceNo: `TLA-${2000 + i}`,
        },
      })
    )
  );
  console.log(`🏢 ${companies.length} companies ready`);

  // ── Users per role ────────────────────────────────────────
  const created: Record<string, any[]> = {};

  for (const { role, count, label } of roles) {
    created[label] = [];

    for (let i = 0; i < count; i++) {
      const n = i + 1;
      const email = `${label}${n}@demo.local`;
      const user = await prisma.user.upsert({
        where: { email },
        update: { passwordHash },
        create: {
          email,
          name: `${label.charAt(0).toUpperCase() + label.slice(1)} Demo ${n}`,
          phone: `+2547${String(10000000 + i).slice(0, 8)}`,
          passwordHash,
          role,
          emailVerified: new Date(),
          companyId: role === Role.EMPLOYER ? companies[i].id : null,
        },
      });
      created[label].push(user);
    }
    console.log(`👥 ${label}: ${created[label].length} users`);
  }

  // ── BUSINESS: BusinessProfile + owned Accommodations & Packages ──
  const destinations = await prisma.destination.findMany({ take: 5 });
  if (destinations.length === 0) {
    throw new Error(
      "No destinations found — seed destinations first (prisma/seed.ts)."
    );
  }

  for (let i = 0; i < created.business.length; i++) {
    const user = created.business[i];
    const dest = destinations[i % destinations.length];

    await prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: `${user.name} Safaris`,
        registrationNo: `BIZ-REG-${3000 + i}`,
        kraPin: `P${String(2000000 + i)}Y`,
        contactEmail: user.email,
        contactPhone: user.phone,
        website: `https://biz${i + 1}.demo.local`,
        description: `A demo tour business run by ${user.name}.`,
        businessType: "TOUR_OPERATOR",
        traLicenseNumber: `TRA-${4000 + i}`,
        ktbRegistered: true,
        katoMember: i % 2 === 0,
        verificationStatus: BusinessVerification.APPROVED,
        approvedAt: new Date(),
      },
    });

    await prisma.accommodation
      .create({
        data: {
          name: `${user.name} Lodge`,
          slug: `biz-${i + 1}-lodge-${Date.now()}-${i}`,
          type: "LODGE",
          description: "Demo lodge created by the user seeder.",
          location: `${dest.county} County`,
          priceRange: "KES 8,000 – 25,000",
          destinationId: dest.id,
          businessId: user.id,
        },
      })
      .catch(() => null);

    await prisma.tourPackage
      .create({
        data: {
          title: `${user.name} Safari`,
          slug: `biz-${i + 1}-safari-${Date.now()}-${i}`,
          summary: "3-day demo safari package.",
          description: "A demo tour package created by the user seeder.",
          priceKes: 45000 + i * 1000,
          durationDays: 3,
          destinationId: dest.id,
          businessId: user.id,
          featured: i < 3,
          published: true,
        },
      })
      .catch(() => null);
  }
  console.log("🏨 Business profiles + listings created");

  // ── OPERATOR: also get a BusinessProfile ───────────────────
  for (let i = 0; i < created.operator.length; i++) {
    const user = created.operator[i];
    await prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: `${user.name} Tours`,
        contactEmail: user.email,
        contactPhone: user.phone,
        businessType: "TOUR_OPERATOR",
        traLicenseNumber: `TRA-OP-${5000 + i}`,
        ktbRegistered: true,
        verificationStatus: BusinessVerification.APPROVED,
        approvedAt: new Date(),
      },
    });
  }
  console.log("🚐 Operator business profiles created");

  // ── EMPLOYER: submit applications ─────────────────────────
  for (let i = 0; i < created.employer.length; i++) {
    const user = created.employer[i];
    const company = companies[i];
    await prisma.application
      .create({
        data: {
          referenceNo: `WP-2025-${String(1000 + i)}`,
          status: ApplicationStatus.SUBMITTED,
          submittedById: user.id,
          companyId: company.id,
          permitClass:
            i % 2 === 0 ? PermitClass.CLASS_G : PermitClass.CLASS_D,
          applicationType: ApplicationType.FIRST_APPLICATION,
          applicantName: `Applicant ${i + 1}`,
          applicantNationality: "Kenyan",
          applicantPassportNo: `P${String(600000 + i)}`,
          applicantEmail: `applicant${i + 1}@demo.local`,
          applicantPhone: `+2547${String(20000000 + i).slice(0, 8)}`,
          purposeStatement: "Demo work permit application.",
          submittedAt: new Date(),
          events: {
            create: {
              type: EventType.SUBMITTED,
              actorId: user.id,
              message: "Application submitted by demo employer.",
            },
          },
          documents: {
            create: [
              {
                slotId: "passport",
                fileName: "passport.pdf",
                mimeType: "application/pdf",
                sizeBytes: 12000,
                storageKey: `demo/${i}/passport.pdf`,
              },
              {
                slotId: "photo",
                fileName: "photo.jpg",
                mimeType: "image/jpeg",
                sizeBytes: 8000,
                storageKey: `demo/${i}/photo.jpg`,
              },
            ],
          },
        },
      })
      .catch(() => null);
  }
  console.log("📝 Employer applications created");

  // ── Fetch for pipeline stages ─────────────────────────────
  const apps = await prisma.application.findMany({ take: 10 });

  // ── PERUSER: assigned at SUBMITTED, does perusal ──────────
  for (let i = 0; i < created.peruser.length && i < apps.length; i++) {
    const user = created.peruser[i];

    await prisma.assignment
      .create({
        data: {
          applicationId: apps[i].id,
          role: AssignmentRole.PERUSER,
          assigneeId: user.id,
        },
      })
      .catch(() => null);

    const doc = await prisma.document.findFirst({
      where: { applicationId: apps[i].id },
    });
    if (doc) {
      await prisma.document
        .update({
          where: { id: doc.id },
          data: {
            perusalStatus:
              i % 3 === 0 ? "NEEDS_RESUBMISSION" : "ACCEPTED",
            perusedById: user.id,
            perusedAt: new Date(),
          },
        })
        .catch(() => null);
    }
  }
  console.log("🔎 Perusers assigned + documents perused");

  // ── VERIFIER: assigned at UNDER_VERIFICATION, does verification ──
  for (let i = 0; i < created.verifier.length && i < apps.length; i++) {
    const user = created.verifier[i];

    await prisma.assignment
      .create({
        data: {
          applicationId: apps[i].id,
          role: AssignmentRole.VERIFIER,
          assigneeId: user.id,
        },
      })
      .catch(() => null);

    const doc = await prisma.document.findFirst({
      where: { applicationId: apps[i].id },
    });
    if (doc) {
      await prisma.document
        .update({
          where: { id: doc.id },
          data: {
            verificationStatus: "ACCEPTED",
            reviewedById: user.id,
            reviewedAt: new Date(),
          },
        })
        .catch(() => null);
    }
  }
  console.log("✅ Verifiers assigned + documents verified");

  // ── COMMITTEE_MEMBER: cast votes ──────────────────────────
  for (let i = 0; i < created.committee.length && i < apps.length; i++) {
    const user = created.committee[i];
    await prisma.committeeVote
      .create({
        data: {
          applicationId: apps[i].id,
          voterId: user.id,
          decision: VoteDecision.APPROVE,
          comment: "Demo approval vote.",
        },
      })
      .catch(() => null);
  }
  console.log("🗳️  Committee votes cast");

  // ── PERMANENT_SECRETARY: assignment role PS_REVIEWER ──────
  for (let i = 0; i < created.ps.length && i < apps.length; i++) {
    const user = created.ps[i];
    await prisma.assignment
      .create({
        data: {
          applicationId: apps[i].id,
          role: AssignmentRole.PS_REVIEWER,
          assigneeId: user.id,
        },
      })
      .catch(() => null);
  }
  console.log("🎖️  PS reviewers assigned");

  // ── CUSTOMER: bookings + message threads ──────────────────
  const businessUsers = created.business;
  const packages = await prisma.tourPackage.findMany({ take: 10 });
  const stays = await prisma.accommodation.findMany({ take: 10 });

  for (let i = 0; i < created.customer.length; i++) {
    const user = created.customer[i];
    const biz = businessUsers[i % businessUsers.length];
    const pkg = packages[i % packages.length];
    const stay = stays[i % stays.length];

    if (pkg) {
      await prisma.booking
        .create({
          data: {
            customerId: user.id,
            businessId: biz.id,
            tourPackageId: pkg.id,
            checkIn: new Date(Date.now() + 7 * 864e5),
            checkOut: new Date(Date.now() + 10 * 864e5),
            guests: 2 + (i % 3),
            notes: "Demo booking request.",
            status: BookingStatus.REQUESTED,
          },
        })
        .catch(() => null);
    }

    if (stay) {
      await prisma.booking
        .create({
          data: {
            customerId: user.id,
            businessId: biz.id,
            accommodationId: stay.id,
            checkIn: new Date(Date.now() + 14 * 864e5),
            checkOut: new Date(Date.now() + 16 * 864e5),
            guests: 2,
            status: BookingStatus.CONFIRMED,
            respondedAt: new Date(),
            responseNote: "Confirmed by demo business.",
          },
        })
        .catch(() => null);
    }

    await prisma.messageThread
      .create({
        data: {
          customerId: user.id,
          businessId: biz.id,
          subject: ThreadSubject.TOUR_PACKAGE,
          tourPackageId: pkg?.id ?? null,
          subjectLabel: pkg?.title ?? "General enquiry",
          messages: {
            create: [
              {
                authorId: user.id,
                body: "Hi, is this still available?",
                readByBusiness: false,
              },
              {
                authorId: biz.id,
                body: "Yes! Happy to help.",
                readByCustomer: false,
              },
            ],
          },
        },
      })
      .catch(() => null);
  }
  console.log("🎟️  Customer bookings + threads created");

  // ── ADMIN + admin-side demo data ──────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin1@demo.local" },
    update: { passwordHash },
    create: {
      email: "admin1@demo.local",
      name: "Admin Demo 1",
      passwordHash,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  for (let i = 0; i < 5; i++) {
    await prisma.incident
      .create({
        data: {
          referenceNo: `INC-2025-${String(100 + i)}`,
          status: IncidentStatus.OPEN,
          category: IncidentCategory.WILDLIFE,
          reporterName: `Reporter ${i + 1}`,
          reporterEmail: `reporter${i + 1}@demo.local`,
          title: `Demo incident ${i + 1}`,
          description: "A demo incident record.",
          location: "Maasai Mara",
          occurredAt: new Date(Date.now() - i * 864e5),
          reviewedById: i % 2 === 0 ? admin.id : null,
          reviewedAt: i % 2 === 0 ? new Date() : null,
        },
      })
      .catch(() => null);

    await prisma.investorInquiry
      .create({
        data: {
          referenceNo: `INV-2025-${String(100 + i)}`,
          status: InquiryStatus.NEW,
          fullName: `Investor ${i + 1}`,
          email: `investor${i + 1}@demo.local`,
          phone: `+2547${String(30000000 + i).slice(0, 8)}`,
          company: `Investor Co ${i + 1}`,
          country: "Kenya",
          investorType: InvestorType.INDIVIDUAL,
          interests: [
            InvestmentInterest.LODGE_RESORT,
            InvestmentInterest.ECO_TOURISM,
          ],
          scale: InvestmentScale.FROM_10M_50M,
          message: "Demo investor inquiry.",
        },
      })
      .catch(() => null);
  }

  for (let i = 0; i < 5; i++) {
    await prisma.resource.create({
      data: {
        title: `Demo Resource ${i + 1}`,
        description: "A demo resource.",
        category: ResourceCategory.POLICY,
        fileName: `resource-${i + 1}.pdf`,
        mimeType: "application/pdf",
        sizeBytes: 50000,
        storageKey: `resources/demo-${i + 1}.pdf`,
        published: true,
        uploadedById: admin.id,
        uploaderName: admin.name,
      },
    });
  }
  console.log("🛡️  Admin + incidents + inquiries + resources created");

  // ── Summary ───────────────────────────────────────────────
  const totals = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });
  console.log("\n📊 User totals by role:");
  for (const t of totals) console.log(`   ${t.role}: ${t._count}`);
  console.log(`\n🔑 All demo users have password: "${PASSWORD}"`);
  console.log(
    "   e.g. peruser1@demo.local, verifier1@demo.local, committee1@demo.local, admin1@demo.local\n"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });