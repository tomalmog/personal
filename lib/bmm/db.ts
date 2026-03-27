import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { bmmPrisma: PrismaClient };

export const prisma =
  globalForPrisma.bmmPrisma ||
  new PrismaClient({
    datasourceUrl: process.env.BMM_DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.bmmPrisma = prisma;
