import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";
import { Playlist } from "@/lib/types";

export async function getActivePlaylist(): Promise<Playlist | null> {
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
  
  return data as Playlist | null;
}

export async function getAllPlaylists(): Promise<Playlist[]> {
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
  
  return (data || []) as Playlist[];
}
