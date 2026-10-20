/*
  Warnings:

  - A unique constraint covering the columns `[traLicenseNumber]` on the table `BusinessProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "BusinessVerification" ADD VALUE 'PENDING_TRA_CHECK';

-- AlterTable
ALTER TABLE "BusinessProfile" ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "katoMember" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ktbRegistered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "traLicenseDocUrl" TEXT,
ADD COLUMN     "traLicenseNumber" TEXT,
ADD COLUMN     "verificationNotes" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_traLicenseNumber_key" ON "BusinessProfile"("traLicenseNumber");
