-- CreateEnum
CREATE TYPE "InvestorType" AS ENUM ('INDIVIDUAL', 'COMPANY', 'FUND', 'FAMILY_OFFICE', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestmentInterest" AS ENUM ('LODGE_RESORT', 'COASTAL', 'ECO_TOURISM', 'MICE', 'CULTURAL_HERITAGE', 'INFRASTRUCTURE', 'DOMESTIC_LEISURE', 'TECHNOLOGY', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestmentScale" AS ENUM ('UNDER_10M', 'FROM_10M_50M', 'FROM_50M_100M', 'FROM_100M_500M', 'ABOVE_500M', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED');

-- CreateTable
CREATE TABLE "InvestorInquiry" (
    "id" TEXT NOT NULL,
    "referenceNo" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "country" TEXT,
    "investorType" "InvestorType" DEFAULT 'INDIVIDUAL',
    "interests" "InvestmentInterest"[],
    "scale" "InvestmentScale",
    "message" TEXT NOT NULL,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestorInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestorInquiry_referenceNo_key" ON "InvestorInquiry"("referenceNo");

-- CreateIndex
CREATE INDEX "InvestorInquiry_status_idx" ON "InvestorInquiry"("status");

-- CreateIndex
CREATE INDEX "InvestorInquiry_createdAt_idx" ON "InvestorInquiry"("createdAt");

-- CreateIndex
CREATE INDEX "InvestorInquiry_reviewedById_idx" ON "InvestorInquiry"("reviewedById");

-- AddForeignKey
ALTER TABLE "InvestorInquiry" ADD CONSTRAINT "InvestorInquiry_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE SEQUENCE IF NOT EXISTS investor_inquiry_reference_seq START 1;