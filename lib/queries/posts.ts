import { createClient } from "@/lib/supabase/server";
import { withRetry } from "./utils";
import { Post, PostSummary } from "@/lib/types";

export async function getFeaturedPost(): Promise<Post | null> {
  const supabase = await createClient();
  
  // Hledáme jeden zvýrazněný post
  const result = await withRetry(async () => {
    return await supabase
      .from("Post")
      .select("*")
      .eq("isFeatured", true)
      .not("publishedAt", "is", null)
      .order("publishedAt", { ascending: false })
      .limit(1)
      .maybeSingle(); // .maybeSingle() nehodí chybu, když nic nenajde, vrátí null
  });

  if (result.error) {
    // V případě chyby vrátíme null, aplikace poběží dál bez featured postu
    return null;
  }
  
  return result.data as Post | null;
}

export async function getRecentPosts(limit = 20): Promise<PostSummary[]> {
  const supabase = await createClient();
  
  const result = await withRetry(async () => {
    return await supabase
      .from("Post")
      .select("id, slug, title, excerpt, coverImageUrl, isFeatured, publishedAt, createdAt, updatedAt")
      .not("publishedAt", "is", null)
      .order("publishedAt", { ascending: false })
      .limit(limit);
  });

  if (result.error) {
    return [];
  }

  return (result.data || []) as PostSummary[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  
  const result = await withRetry(async () => {
    return await supabase
      .from("Post")
      .select("*")
      .eq("slug", slug)
      .single();
  });

  if (result.error || !result.data) {
    return null;
  }
  
  return result.data as Post;
}
