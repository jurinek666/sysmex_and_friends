import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

declare global {
   
  var prisma: PrismaClient | undefined;
   
  var prismaPool: pg.Pool | undefined;
}

function ensureParam(url: string, key: string, value: string) {
  const u = new URL(url);
  if (!u.searchParams.has(key)) u.searchParams.set(key, value);
  return u.toString();
}

let connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Chybí DATABASE_URL v prostředí.");

const isLocal = /localhost|127\.0\.0\.1/i.test(connectionString);

// Pokud nejsi na lokální DB, přidej pgbouncer=true (řeší prepared statements u poolerů)
if (!isLocal) {
  connectionString = ensureParam(connectionString, "pgbouncer", "true");
}

const pool =
  globalThis.prismaPool ||
  new Pool({
    connectionString,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
    max: process.env.NODE_ENV === "production" ? 5 : 2,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    keepAlive: true,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
  globalThis.prismaPool = pool;
}

export default prisma;

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
