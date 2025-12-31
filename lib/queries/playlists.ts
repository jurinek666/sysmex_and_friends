import { createClient } from "@/lib/supabase/server";

export async function getActivePlaylist() {
  const supabase = await createClient();
  
  // Načteme aktivní playlist (nejnovější)
  const { data, error } = await supabase
    .from("Playlist")
    .select("*")
    .eq("isActive", true)
    .order("createdAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching active playlist:", error);
    return null;
  }
  
  return data;
}

