-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMPLOYER', 'VERIFIER', 'COMMITTEE_MEMBER', 'PERMANENT_SECRETARY', 'ADMIN');

-- CreateEnum
CREATE TYPE "PermitClass" AS ENUM ('CLASS_G', 'CLASS_D', 'SPECIAL_PASS');

-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('FIRST_APPLICATION', 'RENEWAL');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_PERUSAL', 'UNDER_VERIFICATION', 'AWAITING_COMMITTEE', 'COMMITTEE_APPROVED', 'COMMITTEE_DECLINED', 'AWAITING_PS_APPROVAL', 'PS_APPROVED', 'PS_DECLINED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "DocumentReviewStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'NEEDS_RESUBMISSION');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SUBMITTED', 'PERUSAL_STARTED', 'DOCUMENT_PERUSED', 'VERIFICATION_STARTED', 'DOCUMENT_VERIFIED', 'ESCALATED_TO_COMMITTEE', 'COMMITTEE_VOTE_CAST', 'COMMITTEE_APPROVED', 'COMMITTEE_DECLINED', 'ESCALATED_TO_PS', 'PS_APPROVED', 'PS_DECLINED', 'FORWARDED_TO_INTERIOR', 'WITHDRAWN', 'NOTE_ADDED');

-- CreateEnum
CREATE TYPE "VoteDecision" AS ENUM ('APPROVE', 'DECLINE', 'ABSTAIN');

-- CreateEnum
CREATE TYPE "AssignmentRole" AS ENUM ('PERUSER', 'VERIFIER', 'COMMITTEE_CHAIR', 'PS_REVIEWER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "kraPin" TEXT,
    "tourismLicenceNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "referenceNo" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedById" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "permitClass" "PermitClass" NOT NULL,
    "applicationType" "ApplicationType" NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantNationality" TEXT NOT NULL,
    "applicantPassportNo" TEXT NOT NULL,
    "applicantEmail" TEXT NOT NULL,
    "applicantPhone" TEXT NOT NULL,
    "purposeStatement" TEXT,
    "submittedAt" TIMESTAMP(3),
    "perusalStartedAt" TIMESTAMP(3),
    "verificationStartedAt" TIMESTAMP(3),
    "committeeDecidedAt" TIMESTAMP(3),
    "psDecidedAt" TIMESTAMP(3),
    "forwardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "perusalStatus" "DocumentReviewStatus" NOT NULL DEFAULT 'PENDING',
    "verificationStatus" "DocumentReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationEvent" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "actorId" TEXT,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommitteeVote" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "decision" "VoteDecision" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommitteeVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "role" "AssignmentRole" NOT NULL,
    "assigneeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_registrationNo_key" ON "Company"("registrationNo");

-- CreateIndex
CREATE INDEX "Company_registrationNo_idx" ON "Company"("registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX "Application_referenceNo_key" ON "Application"("referenceNo");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_submittedById_idx" ON "Application"("submittedById");

-- CreateIndex
CREATE INDEX "Application_companyId_idx" ON "Application"("companyId");

-- CreateIndex
CREATE INDEX "Document_applicationId_idx" ON "Document"("applicationId");

-- CreateIndex
CREATE INDEX "Document_slotId_idx" ON "Document"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_applicationId_slotId_fileName_key" ON "Document"("applicationId", "slotId", "fileName");

-- CreateIndex
CREATE INDEX "ApplicationEvent_applicationId_createdAt_idx" ON "ApplicationEvent"("applicationId", "createdAt");

-- CreateIndex
CREATE INDEX "CommitteeVote_applicationId_idx" ON "CommitteeVote"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "CommitteeVote_applicationId_voterId_key" ON "CommitteeVote"("applicationId", "voterId");

-- CreateIndex
CREATE INDEX "Assignment_assigneeId_idx" ON "Assignment"("assigneeId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_applicationId_role_key" ON "Assignment"("applicationId", "role");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationEvent" ADD CONSTRAINT "ApplicationEvent_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationEvent" ADD CONSTRAINT "ApplicationEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeVote" ADD CONSTRAINT "CommitteeVote_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeVote" ADD CONSTRAINT "CommitteeVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
