import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const generatedClientDir = path.join(root, "node_modules", ".prisma", "client");
const prismaClientPkgDir = path.join(root, "node_modules", "@prisma", "client");
const targetPrismaDir = path.join(prismaClientPkgDir, ".prisma");
const targetClientDir = path.join(targetPrismaDir, "client");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function removeIfExists(p) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

if (!fs.existsSync(generatedClientDir)) {
  console.error(
    `[prisma-link] Missing generated client at ${generatedClientDir}. Run \"prisma generate\" first.`
  );
  process.exit(1);
}

if (!fs.existsSync(prismaClientPkgDir)) {
  console.error(`[prisma-link] Missing @prisma/client package at ${prismaClientPkgDir}.`);
  process.exit(1);
}

ensureDir(targetPrismaDir);

// Recreate the link on every run to avoid stale copies.
removeIfExists(targetClientDir);

// Use a junction on Windows (works without admin in most setups).
fs.symlinkSync(generatedClientDir, targetClientDir, "junction");

console.log(`[prisma-link] Linked ${targetClientDir} -> ${generatedClientDir}`);
