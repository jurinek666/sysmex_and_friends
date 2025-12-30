// /lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Allow global `var prisma` to prevent hot-reload issues in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create the Prisma client or reuse existing one in dev
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

// Prevent multiple clients in dev
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
