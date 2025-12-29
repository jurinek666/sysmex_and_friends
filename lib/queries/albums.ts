import { prisma } from "@/lib/prisma";

export async function getAlbums() {
  return prisma.album.findMany({
    orderBy: { dateTaken: "desc" },
    include: {
      _count: {
        select: { photos: true },
      },
    },
  });
}

export async function getAlbum(id: string) {
  return prisma.album.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
}
