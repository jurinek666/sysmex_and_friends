import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export async function getFeaturedPost(): Promise<Post | null> {
  const supabase = await createClient();
  
  // Hledáme jeden zvýrazněný post
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Post")
      .select("*")
      .eq("isFeatured", true)
      .not("publishedAt", "is", null)
      .order("publishedAt", { ascending: false })
      .limit(1)
      .maybeSingle(); // .maybeSingle() nehodí chybu, když nic nenajde, vrátí null
  });

  if (error) {
    // V případě chyby vrátíme null, aplikace poběží dál bez featured postu
    logSupabaseError("getFeaturedPost", error);
    return null;
  }
  
  return data as Post | null;
}

export async function getRecentPosts(limit = 20): Promise<Post[]> {
  const supabase = await createClient();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Post")
      .select("id, title, slug, excerpt, coverImageUrl, publishedAt, updatedAt, isFeatured")
      .not("publishedAt", "is", null)
      .order("publishedAt", { ascending: false })
      .limit(limit);
  });

  if (error) {
    logSupabaseError("getRecentPosts", error);
    return [];
  }

  return (data || []) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Post")
      .select("*")
      .eq("slug", slug)
      .not("publishedAt", "is", null)
      .single();
  });

  if (error) {
    logSupabaseError("getPostBySlug", error);
    return null;
  }
  
  return data as Post | null;
}
