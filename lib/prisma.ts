import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'

const adapter = new PrismaPostgresAdapter({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })