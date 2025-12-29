import { prisma } from "@/lib/prisma";

export async function getActiveMembers() {
  return prisma.member.findMany({
    where: { isActive: true },
    orderBy: { displayName: "asc" },
  });
}
