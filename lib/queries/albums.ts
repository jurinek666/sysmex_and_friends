import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";

export async function getAlbums() {
  const supabase = await createClient();
  
  // Načteme alba a počet fotek. 
  // 'photos(count)' vrátí pole objektů [{ count: N }]
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Album")
      .select("*, photos(count)")
      .order("dateTaken", { ascending: false });
  });

  if (error) {
    logSupabaseError("getAlbums", error);
    return [];
  }

  // Transformujeme data do formátu, který očekává komponenta (styl Prisma)
  // Prisma vrací: _count: { photos: number }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((album: any) => ({
    ...album,
    _count: {
      photos: album.photos?.[0]?.count ?? 0
    }
  }));
}

export async function getAlbum(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("Album")
    .select("*, photos(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  // Seřadíme fotky v JS, protože řazení vnořených relací v jednoduchém selectu je složitější
  if (data.photos && Array.isArray(data.photos)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.photos.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
  }

  return data;
}