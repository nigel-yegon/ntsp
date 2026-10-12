// lib/reference.ts
import { prisma } from "@/lib/prisma";

const PREFIX = "NTSP/EXP";

export async function createReferenceNo(): Promise<string> {
  // nextval is atomic; safe under concurrent submissions.
  const rows = await prisma.$queryRaw<{ nextval: bigint }[]>`
    SELECT nextval('expatriate_reference_seq') AS nextval
  `;
  const n = Number(rows[0].nextval);
  const year = new Date().getFullYear();
  const padded = n.toString().padStart(4, "0");
  return `${PREFIX}/${year}/${padded}`;
}