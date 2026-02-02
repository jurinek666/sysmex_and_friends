import { createClient } from "@/lib/supabase/server";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  publishedAt: string;
  updatedAt: string;
  isFeatured: boolean;
}

export type PostSummary = Pick<Post, "id" | "title" | "slug" | "excerpt" | "coverImageUrl" | "publishedAt" | "updatedAt" | "isFeatured">;

export async function getFeaturedPost(): Promise<Post | null> {
  const supabase = await createClient();
  
  // Hledáme jeden zvýrazněný post
  const { data, error } = await supabase
    .from("Post")
    .select("*")
    .eq("isFeatured", true)
    .order("publishedAt", { ascending: false })
    .limit(1)
    .maybeSingle(); // .maybeSingle() nehodí chybu, když nic nenajde, vrátí null

  if (error) {
    // V případě chyby vrátíme null, aplikace poběží dál bez featured postu
    return null;
  }
  
  return data as Post;
}

export async function getRecentPosts(limit = 20): Promise<PostSummary[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("Post")
    .select("id, title, slug, excerpt, coverImageUrl, publishedAt, updatedAt, isFeatured")
    .order("publishedAt", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return data as PostSummary[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("Post")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return null;
  }
  
  return data as Post;
}
