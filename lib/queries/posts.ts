import { createClient } from "@/lib/supabase/server";

export async function getFeaturedPost() {
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
  
  return data;
}

export async function getRecentPosts(limit = 20) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("Post")
    .select("id, title, slug, excerpt, coverImageUrl, publishedAt, updatedAt, isFeatured")
    .order("publishedAt", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return data;
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("Post")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return null;
  }
  
  return data;
}