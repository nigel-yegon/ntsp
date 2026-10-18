-- AlterEnum
ALTER TYPE "IncidentStatus" ADD VALUE 'ESCALATED';

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "escalatedAt" TIMESTAMP(3),
ADD COLUMN     "escalatedById" TEXT,
ADD COLUMN     "escalatedTo" TEXT;

-- CreateIndex
CREATE INDEX "Incident_escalatedById_idx" ON "Incident"("escalatedById");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_escalatedById_fkey" FOREIGN KEY ("escalatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
