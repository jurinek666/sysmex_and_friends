import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Keep the existing seed runner (project already uses ts-node).
    seed: "ts-node --compiler-options {\"module\":\"commonjs\"} prisma/seed.ts",
  },
  // Prisma ORM v7: connection URL moves here (not in schema.prisma).
  // Use a fallback so `prisma generate` can run even when DATABASE_URL isn't set.
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
