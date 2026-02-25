"use server";

import { getRecentPosts } from "@/lib/queries/posts";
import { PostSummary } from "@/lib/types";

export async function loadMorePosts(offset: number, limit: number): Promise<PostSummary[]> {
  return await getRecentPosts(limit, offset);
}
