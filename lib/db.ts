import { PrismaClient } from '@prisma/client';

// Singleton to avoid connection storms in dev (hot reload creates new instances)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
