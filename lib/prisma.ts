// /lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Vytvoření Prisma klienta nebo použití existujícího v dev módu
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

// Uložení do globální proměnné v dev módu
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;