import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Důležité: Importujeme singleton z lib/prisma.ts

export const dynamic = 'force-dynamic'; // Zajistí, že se endpoint nebude cachovat

export async function GET() {
  try {
    // Rychlý test spojení s DB
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (err) {
    console.error("Health check failed:", err);
    return NextResponse.json(
      {
        status: "error",
        database: "unreachable",
        message: (err as Error).message,
      },
      { status: 503 } // Service Unavailable
    );
  }
  // NIKDY nevolat prisma.$disconnect() v serverless/edge route handlerech,
  // pokud chceme využívat connection pooling a rychlé odpovědi.
}