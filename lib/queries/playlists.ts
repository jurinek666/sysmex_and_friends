import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";

export async function getActivePlaylist() {
  const supabase = await createClient();
  
  // Načteme aktivní playlist (nejnovější)
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Playlist")
      .select("*")
      .eq("isActive", true)
      .order("createdAt", { ascending: false })
      .limit(1)
      .maybeSingle();
  });

  if (error) {
    logSupabaseError("getActivePlaylist", error);
    return null;
  }
  
  return data;
}

export async function getAllPlaylists() {
  const supabase = await createClient();
  
  // Načteme všechny playlisty
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Playlist")
      .select("id, title, description, spotifyUrl, isActive")
      .order("createdAt", { ascending: false });
  });

  if (error) {
    logSupabaseError("getAllPlaylists", error);
    return [];
  }
  
  return data || [];
}
