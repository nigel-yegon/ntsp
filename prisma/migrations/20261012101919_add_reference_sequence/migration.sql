CREATE SEQUENCE IF NOT EXISTS expatriate_reference_seq START 1;

-- CreateIndex
CREATE INDEX "ApplicationEvent_actorId_idx" ON "ApplicationEvent"("actorId");

-- CreateIndex
CREATE INDEX "CommitteeVote_voterId_idx" ON "CommitteeVote"("voterId");

-- CreateIndex
CREATE INDEX "Document_reviewedById_idx" ON "Document"("reviewedById");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
