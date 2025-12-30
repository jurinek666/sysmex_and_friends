import { prisma } from "@/lib/prisma";

export async function getLatestResults(limit = 5) {
  try {
    return await prisma.result.findMany({
      take: limit,
      orderBy: { date: "desc" },
      include: { season: true },
    });
  } catch {
    return [];
  }
}

export async function getResultsBySeasonCode(code?: string) {
  try {
    if (!code) {
      return await prisma.result.findMany({
        orderBy: { date: "desc" },
        include: { season: true },
      });
    }

    return await prisma.result.findMany({
      where: { season: { code } },
      orderBy: { date: "desc" },
      include: { season: true },
    });
  } catch {
    return [];
  }
}

export async function getSeasons() {
  try {
    return await prisma.season.findMany({ orderBy: { startDate: "desc" } });
  } catch {
    return [];
  }
}
