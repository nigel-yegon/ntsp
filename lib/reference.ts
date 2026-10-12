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