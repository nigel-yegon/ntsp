-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "perusedAt" TIMESTAMP(3),
ADD COLUMN     "perusedById" TEXT,
ADD COLUMN     "slotRequired" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Document_perusedById_idx" ON "Document"("perusedById");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_perusedById_fkey" FOREIGN KEY ("perusedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
