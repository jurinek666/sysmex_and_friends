import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";
import { Playlist } from "@/lib/types";

export async function getActivePlaylist(): Promise<Playlist | null> {
  const supabase = await createClient();
  
  // Načteme aktivní playlist (nejnovější)
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("playlists")
      .select(`
        id,
        title,
        description,
        spotifyUrl:spotify_url,
        isActive:is_active,
        createdAt:created_at,
        updatedAt:updated_at
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
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
      .from("playlists")
      .select(`
        id,
        title,
        description,
        spotifyUrl:spotify_url,
        isActive:is_active
      `)
      .order("created_at", { ascending: false });
  });

  if (error) {
    logSupabaseError("getAllPlaylists", error);
    return [];
  }
  
  return (data || []) as Playlist[];
}
