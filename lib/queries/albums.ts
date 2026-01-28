import { createClient } from "@/lib/supabase/server";
import { fetchImageIdsByFolder } from "@/lib/cloudinary";
import { withRetry, logSupabaseError } from "./utils";

export async function getAlbums() {
  const supabase = await createClient();
  
  // Načteme alba a počet fotek. 
  // 'photos(count)' vrátí pole objektů [{ count: N }]
  let { data, error } = await withRetry(async () => {
    return await supabase
      .from("Album")
      .select("*, photos(count)")
      .order("dateTaken", { ascending: false });
  });

  // Test alternative relationship name if first attempt fails
  if (error && error?.hint?.includes('Photo')) {
    const result2 = await withRetry(async () => {
      return await supabase
        .from("Album")
        .select("*, Photo(count)")
        .order("dateTaken", { ascending: false });
    });
    if (!result2.error) {
      data = result2.data;
      error = null;
    }
  }

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
      photos: (album.photos?.[0]?.count ?? album.Photo?.[0]?.count) ?? 0
    }
  }));
}

export async function getAlbum(id: string) {
  const supabase = await createClient();

  // Try standard lowercase first
  let { data, error } = await supabase
    .from("Album")
    .select("*, photos(*)")
    .eq("id", id)
    .single();

  // If failed, try capitalized Photo relation
  if (error || !data) {
     const { data: data2, error: error2 } = await supabase
        .from("Album")
        .select("*, Photo(*)")
        .eq("id", id)
        .single();

     if (!error2 && data2) {
        data = data2;
        error = null;
     }
  }

  if (error || !data) {
    return null;
  }

  // Sjednocení tvaru: photos nebo Photo z Supabase
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = data as any;
  if (!raw.photos && raw.Photo) {
      raw.photos = raw.Photo;
  }

  // Ensure photos is array
  if (!Array.isArray(raw.photos)) {
      raw.photos = [];
  }

  // Načtení fotek z Cloudinary podle cloudinaryFolder, pokud je vyplněné a Cloudinary vrátí výsledky
  const folder = (data.cloudinaryFolder || "").trim();
  if (folder) {
    const fromCloud = await fetchImageIdsByFolder(folder);
    if (fromCloud.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.photos = fromCloud.map((r: any, i: number) => ({
        id: r.public_id,
        cloudinaryPublicId: r.public_id,
        caption: null,
        sortOrder: i,
      }));
    }
  }

  // Seřadíme fotky podle sortOrder
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data.photos.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return data;
}
