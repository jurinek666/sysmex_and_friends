import { prisma } from "@/lib/prisma";

export async function getFeaturedPost() {
  return prisma.post.findFirst({
    where: { isFeatured: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getRecentPosts(limit = 20) {
  return prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}
