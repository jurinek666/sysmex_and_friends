import { prisma } from "@/lib/prisma";

export async function getLatestResults(limit = 5) {
  return prisma.result.findMany({
    take: limit,
    orderBy: { date: "desc" },
    include: { season: true },
  });
}

export async function getResultsBySeasonCode(code?: string) {
  if (!code) {
    return prisma.result.findMany({
      orderBy: { date: "desc" },
      include: { season: true },
    });
  }

  return prisma.result.findMany({
    where: { season: { code } },
    orderBy: { date: "desc" },
    include: { season: true },
  });
}

export async function getSeasons() {
  return prisma.season.findMany({ orderBy: { startDate: "desc" } });
}
