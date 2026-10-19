// lib/reference.ts
import { prisma } from "@/lib/prisma";

const PREFIX = "NTSP/EXP";

export async function createReferenceNo(): Promise<string> {
  const rows = await prisma.$queryRaw<{ nextval: bigint }[]>`
    SELECT nextval('expatriate_reference_seq') AS nextval
  `;
  const n = Number(rows[0].nextval);
  const year = new Date().getFullYear();
  return `${PREFIX}/${year}/${n.toString().padStart(4, "0")}`;
}
// lib/reference.ts — append

export async function createIncidentReferenceNo(): Promise<string> {
  const rows = await prisma.$queryRaw<{ nextval: bigint }[]>`
    SELECT nextval('incident_reference_seq') AS nextval
  `;
  const n = Number(rows[0].nextval);
  const year = new Date().getFullYear();
  return `INC/${year}/${n.toString().padStart(4, "0")}`;
}
/**
 * Investor inquiry reference numbers:  INV/YYYY/NNNN
 * Uses its own Postgres sequence so inquiries and incidents
 * don't interleave their numbering.
 */
export async function createInvestorInquiryReferenceNo(): Promise<string> {
  const rows = await prisma.$queryRaw<{ nextval: bigint }[]>`
    SELECT nextval('investor_inquiry_reference_seq') AS nextval
  `;
  const n = Number(rows[0].nextval);
  const year = new Date().getFullYear();
  return `INV/${year}/${n.toString().padStart(4, "0")}`;
}