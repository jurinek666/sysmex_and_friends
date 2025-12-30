import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: "up" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, db: "down", error: "DB unreachable" },
      { status: 503 }
    );
  }
}
