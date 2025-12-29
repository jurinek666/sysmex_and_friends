import { prisma } from "@/lib/prisma";

export async function getFeaturedPost() {
  try {
    return await prisma.post.findFirst({
      where: { isFeatured: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    // dev fallback: bez DB app poběží (jen nebude featured post)
    return null;
  }
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
