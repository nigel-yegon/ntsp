// prisma/parts/applications.ts
import type { SeedContext } from "./types";

type Stage =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_PERUSAL"
  | "UNDER_VERIFICATION"
  | "AWAITING_COMMITTEE"
  | "AWAITING_PS_APPROVAL"
  | "PS_APPROVED"
  | "FORWARDED_TO_INTERIOR"
  | "WITHDRAWN"
  | "COMMITTEE_DECLINED";

const STATUSES: Stage[] = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_PERUSAL",
  "UNDER_VERIFICATION",
  "AWAITING_COMMITTEE",
  "AWAITING_PS_APPROVAL",
  "PS_APPROVED",
  "FORWARDED_TO_INTERIOR",
  "WITHDRAWN",
  "COMMITTEE_DECLINED",
];

// Which pipeline milestones each status has reached.
const PROGRESS: Record<
  Stage,
  {
    submitted: boolean;
    perused: boolean;
    verified: boolean;
    committee: boolean;
    psDecided: boolean;
    psApproved: boolean;
    forwarded: boolean;
  }
> = {
  DRAFT:                 { submitted: false, perused: false, verified: false, committee: false, psDecided: false, psApproved: false, forwarded: false },
  SUBMITTED:             { submitted: true,  perused: false, verified: false, committee: false, psDecided: false, psApproved: false, forwarded: false },
  UNDER_PERUSAL:         { submitted: true,  perused: false, verified: false, committee: false, psDecided: false, psApproved: false, forwarded: false },
  UNDER_VERIFICATION:    { submitted: true,  perused: true,  verified: false, committee: false, psDecided: false, psApproved: false, forwarded: false },
  AWAITING_COMMITTEE:    { submitted: true,  perused: true,  verified: true,  committee: false, psDecided: false, psApproved: false, forwarded: false },
  AWAITING_PS_APPROVAL:  { submitted: true,  perused: true,  verified: true,  committee: true,  psDecided: false, psApproved: false, forwarded: false },
  PS_APPROVED:           { submitted: true,  perused: true,  verified: true,  committee: true,  psDecided: true,  psApproved: true,  forwarded: false },
  FORWARDED_TO_INTERIOR: { submitted: true,  perused: true,  verified: true,  committee: true,  psDecided: true,  psApproved: true,  forwarded: true  },
  WITHDRAWN:             { submitted: false, perused: false, verified: false, committee: false, psDecided: false, psApproved: false, forwarded: false },
  COMMITTEE_DECLINED:    { submitted: true,  perused: true,  verified: true,  committee: true,  psDecided: false, psApproved: false, forwarded: false },
};

const DOC_SLOTS = [
  { slotId: "passport",                  fileName: "passport-biodata.pdf",           mimeType: "application/pdf", sizeBytes: 1_240_000 },
  { slotId: "purpose-letter",            fileName: "purpose-of-entry-letter.pdf",    mimeType: "application/pdf", sizeBytes: 342_000 },
  { slotId: "tourism-licence",           fileName: "tourism-licence-2026.pdf",       mimeType: "application/pdf", sizeBytes: 890_000 },
  { slotId: "certificate-incorporation", fileName: "certificate-of-incorporation.pdf", mimeType: "application/pdf", sizeBytes: 620_000 },
  { slotId: "kra-compliance",            fileName: "kra-tax-compliance.pdf",         mimeType: "application/pdf", sizeBytes: 415_000 },
];

const NATIONALITIES = ["Kenya", "Nigeria", "China", "France", "India", "Spain", "Japan", "Germany", "United Kingdom", "United States"];
const NAMES = [
  "Amara Okonkwo", "Chen Wei", "Marie Dubois", "Rajesh Kumar", "Sofia Alvarez",
  "Yuki Tanaka", "Anna Schmidt", "James Whitmore", "Robert Chen", "Fatima Yusuf",
];

export async function seedApplications(ctx: SeedContext) {
  const daysAgo = (n: number) => new Date(Date.now() - n * 864e5);
  const daysFromNow = (n: number) => new Date(Date.now() + n * 864e5);

  for (let i = 0; i < STATUSES.length; i++) {
    const status = STATUSES[i];
    const p = PROGRESS[status];

    const employer = ctx.users.employers[i % ctx.users.employers.length];
    if (!employer.companyId) {
      console.warn(`⚠ Skipping application ${i + 1} — employer has no company`);
      continue;
    }

    // Deterministic assignments — same index for the app and the reviewer.
    const peruser  = ctx.users.perusers[i % ctx.users.perusers.length];
    const verifier = ctx.users.verifiers[i % ctx.users.verifiers.length];
    const chair    = ctx.users.committee[i % ctx.users.committee.length];
    const ps       = ctx.users.ps[i % ctx.users.ps.length];
    const voter1   = ctx.users.committee[0];
    const voter2   = ctx.users.committee[1];

    const submittedDaysAgo = p.submitted ? 20 - i : null;
    const perusalDaysAgo   = p.perused ? (submittedDaysAgo ?? 0) - 1 : null;
    const verifyDaysAgo    = p.verified ? (submittedDaysAgo ?? 0) - 2 : null;
    const committeeDaysAgo = p.committee ? (submittedDaysAgo ?? 0) - 4 : null;
    const psDaysAgo        = p.psDecided ? (submittedDaysAgo ?? 0) - 6 : null;
    const forwardedDaysAgo = p.forwarded ? (submittedDaysAgo ?? 0) - 7 : null;

    const referenceNo = `NTSP/EXP/2026/${String(i + 1).padStart(4, "0")}`;

    const existing = await ctx.prisma.application.findUnique({
      where: { referenceNo },
      select: { id: true },
    });

    if (existing) {
      // Only update status on re-run — don't recreate children.
      await ctx.prisma.application.update({
        where: { id: existing.id },
        data: { status: status as any },
      });
      continue;
    }

    const app = await ctx.prisma.application.create({
      data: {
        referenceNo,
        status: status as any,
        submittedById: employer.id,
        companyId: employer.companyId,
        permitClass: i % 2 === 0 ? "CLASS_G" : "CLASS_D",
        applicationType: i % 3 === 0 ? "RENEWAL" : "FIRST_APPLICATION",
        applicantName: NAMES[i],
        applicantNationality: NATIONALITIES[i],
        applicantPassportNo: `P${String(700000 + i)}`,
        applicantEmail: `applicant${i + 1}@demo.local`,
        applicantPhone: `+2547${String(40000000 + i).slice(0, 8)}`,
        purposeStatement:
          status === "COMMITTEE_DECLINED"
            ? "Application for employment as senior safari guide. Committee declined on grounds of insufficient documentation of prior experience."
            : "Demo work permit application for the review pipeline.",
        submittedAt: submittedDaysAgo !== null ? daysAgo(submittedDaysAgo) : null,
        perusalStartedAt: perusalDaysAgo !== null ? daysAgo(perusalDaysAgo) : null,
        verificationStartedAt: verifyDaysAgo !== null ? daysAgo(verifyDaysAgo) : null,
        committeeDecidedAt: committeeDaysAgo !== null ? daysAgo(committeeDaysAgo) : null,
        psDecidedAt: psDaysAgo !== null ? daysAgo(psDaysAgo) : null,
        forwardedAt: forwardedDaysAgo !== null ? daysAgo(forwardedDaysAgo) : null,
      },
    });

    // ── Documents ──────────────────────────────────────────
    for (const slot of DOC_SLOTS) {
      await ctx.prisma.document.create({
        data: {
          applicationId: app.id,
          slotId: slot.slotId,
          slotRequired: true,
          fileName: slot.fileName,
          mimeType: slot.mimeType,
          sizeBytes: slot.sizeBytes,
          storageKey: `seed/${app.id}/${slot.slotId}/${slot.fileName}`,
          perusalStatus: p.perused ? "ACCEPTED" : "PENDING",
          perusedById: p.perused ? peruser.id : null,
          perusedAt: p.perused ? daysAgo((perusalDaysAgo ?? 0) + 1) : null,
          verificationStatus: p.verified ? "ACCEPTED" : "PENDING",
          reviewedById: p.verified ? verifier.id : null,
          reviewedAt: p.verified ? daysAgo((verifyDaysAgo ?? 0) + 1) : null,
          reviewNotes: p.verified ? "Verified — all sections legible and current." : null,
        },
      });
    }

    // ── Assignments ────────────────────────────────────────
    if (p.submitted && !p.perused && status !== "WITHDRAWN") {
      // Application is waiting for a peruser — assign one.
      await ctx.prisma.assignment.create({
        data: { applicationId: app.id, role: "PERUSER", assigneeId: peruser.id },
      });
    } else if (p.perused) {
      await ctx.prisma.assignment.create({
        data: {
          applicationId: app.id,
          role: "PERUSER",
          assigneeId: peruser.id,
          assignedAt: daysAgo((perusalDaysAgo ?? 0) + 2),
          completedAt: daysAgo((perusalDaysAgo ?? 0) + 1),
        },
      });
    }

    if (p.perused && !p.verified && status === "UNDER_VERIFICATION") {
      await ctx.prisma.assignment.create({
        data: { applicationId: app.id, role: "VERIFIER", assigneeId: verifier.id },
      });
    } else if (p.verified) {
      await ctx.prisma.assignment.create({
        data: {
          applicationId: app.id,
          role: "VERIFIER",
          assigneeId: verifier.id,
          assignedAt: daysAgo((verifyDaysAgo ?? 0) + 2),
          completedAt: daysAgo((verifyDaysAgo ?? 0) + 1),
        },
      });
    }

    if (p.verified && !p.committee && status === "AWAITING_COMMITTEE") {
      await ctx.prisma.assignment.create({
        data: { applicationId: app.id, role: "COMMITTEE_CHAIR", assigneeId: chair.id },
      });
    } else if (p.committee) {
      await ctx.prisma.assignment.create({
        data: {
          applicationId: app.id,
          role: "COMMITTEE_CHAIR",
          assigneeId: chair.id,
          assignedAt: daysAgo((committeeDaysAgo ?? 0) + 3),
          completedAt: daysAgo((committeeDaysAgo ?? 0) + 1),
        },
      });
    }

    if (p.committee && !p.psDecided && status === "AWAITING_PS_APPROVAL") {
      await ctx.prisma.assignment.create({
        data: { applicationId: app.id, role: "PS_REVIEWER", assigneeId: ps.id },
      });
    } else if (p.psDecided) {
      await ctx.prisma.assignment.create({
        data: {
          applicationId: app.id,
          role: "PS_REVIEWER",
          assigneeId: ps.id,
          assignedAt: daysAgo((psDaysAgo ?? 0) + 2),
          completedAt: daysAgo((psDaysAgo ?? 0) + 1),
        },
      });
    }

    // ── Committee votes ────────────────────────────────────
    if (p.committee) {
      const isDecline = status === "COMMITTEE_DECLINED";
      const comment = isDecline
        ? "Declined — insufficient evidence of prior guiding experience."
        : "Documents verified and case meritorious. Recommend approval.";
      await ctx.prisma.committeeVote.createMany({
        data: [
          { applicationId: app.id, voterId: voter1.id, decision: isDecline ? "DECLINE" : "APPROVE", comment },
          { applicationId: app.id, voterId: voter2.id, decision: isDecline ? "DECLINE" : "APPROVE", comment },
        ],
      });
    }

    // ── Timeline events (chronological) ────────────────────
    type Ev = { type: any; actorId: string; message?: string; at: Date };
    const events: Ev[] = [];

    if (p.submitted) {
      events.push({
        type: "SUBMITTED",
        actorId: employer.id,
        message: "Application submitted.",
        at: daysAgo(submittedDaysAgo!),
      });
    }
    if (p.perused) {
      events.push(
        { type: "PERUSAL_STARTED", actorId: peruser.id, at: daysAgo((perusalDaysAgo ?? 0) + 2) },
        { type: "DOCUMENT_PERUSED", actorId: peruser.id, message: "All required documents perused.", at: daysAgo((perusalDaysAgo ?? 0) + 1) },
      );
    }
    if (p.verified) {
      events.push(
        { type: "VERIFICATION_STARTED", actorId: verifier.id, at: daysAgo((verifyDaysAgo ?? 0) + 2) },
        { type: "DOCUMENT_VERIFIED", actorId: verifier.id, message: "All documents verified and accepted.", at: daysAgo((verifyDaysAgo ?? 0) + 1) },
      );
    }
    if (p.verified && !p.committee) {
      events.push({
        type: "ESCALATED_TO_COMMITTEE",
        actorId: verifier.id,
        message: "Case escalated to the committee for review.",
        at: daysAgo((verifyDaysAgo ?? 0) + 1),
      });
    }
    if (p.committee) {
      events.push(
        { type: "COMMITTEE_VOTE_CAST", actorId: voter1.id, message: "Voted.", at: daysAgo((committeeDaysAgo ?? 0) + 2) },
        { type: "COMMITTEE_VOTE_CAST", actorId: voter2.id, message: "Voted.", at: daysAgo((committeeDaysAgo ?? 0) + 2) },
      );
      if (status === "COMMITTEE_DECLINED") {
        events.push({
          type: "COMMITTEE_DECLINED",
          actorId: chair.id,
          message: "Committee declined the application.",
          at: daysAgo(committeeDaysAgo!),
        });
      } else {
        events.push({
          type: "ESCALATED_TO_PS",
          actorId: chair.id,
          message: "Quorum reached. Forwarded to Permanent Secretary.",
          at: daysAgo(committeeDaysAgo!),
        });
      }
    }
    if (p.psDecided && p.psApproved) {
      events.push({
        type: "PS_APPROVED",
        actorId: ps.id,
        message: "Approved by the Permanent Secretary.",
        at: daysAgo(psDaysAgo!),
      });
    }
    if (p.forwarded) {
      events.push({
        type: "FORWARDED_TO_INTERIOR",
        actorId: ps.id,
        message: "Forwarded to Ministry of Interior for issuance.",
        at: daysAgo(forwardedDaysAgo!),
      });
    }
    if (status === "WITHDRAWN") {
      events.push({
        type: "WITHDRAWN",
        actorId: employer.id,
        message: "Applicant withdrew the application.",
        at: daysFromNow(-1),
      });
    }

    if (events.length > 0) {
      await ctx.prisma.applicationEvent.createMany({
        data: events.map((e) => ({
          applicationId: app.id,
          type: e.type,
          actorId: e.actorId,
          message: e.message ?? null,
          createdAt: e.at,
        })),
      });
    }
  }

  console.log(`✔ Applications: ${STATUSES.length} (one per workflow status, fully assigned)`);
}