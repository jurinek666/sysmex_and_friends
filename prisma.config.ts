import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Prisma 7 už nebere seed z package.json -> definujeme tady
    seed: 'ts-node --compiler-options {"module":"commonjs"} prisma/seed.ts',
  },
  // V Prisma 7 patří DB URL sem (a schema.prisma už ji nemá)
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
