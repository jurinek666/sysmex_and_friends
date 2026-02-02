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
      .select("id, title, dateTaken, createdAt, cloudinaryFolder, photos(count)")
      .order("dateTaken", { ascending: false });
  });

  // Test alternative relationship name if first attempt fails
  if (error && error?.hint?.includes('Photo')) {
    const result2 = await withRetry(async () => {
      return await supabase
        .from("Album")
        .select("id, title, dateTaken, createdAt, cloudinaryFolder, Photo(count)")
        .order("dateTaken", { ascending: false });
    });
    if (!result2.error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = result2.data as any;
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
      photos: album.photos?.[0]?.count ?? album.Photo?.[0]?.count ?? 0
    }
  }));
}

<<<<<<< HEAD
async function applyPhotosAndCloudinary(
  data: Record<string, unknown> & { photos: { sortOrder?: number }[] }
): Promise<unknown> {
  const raw = data as { photos?: unknown[]; Photo?: unknown[] };
  data.photos = (Array.isArray(raw.photos) ? raw.photos : Array.isArray(raw.Photo) ? raw.Photo : []) as {
    sortOrder?: number;
  }[];

  const folder = (
    (data as { cloudinaryFolder?: string; cloudinary_folder?: string }).cloudinaryFolder ??
    (data as { cloudinary_folder?: string }).cloudinary_folder ??
    ""
  ).trim();
=======
export async function getAlbum(id: string) {
  const supabase = await createClient();

  let { data, error } = await withRetry(async () => {
    return await supabase
      .from("Album")
      .select("*, photos(*)")
      .eq("id", id)
      .single();
  });

  // Test alternative relationship name if first attempt fails
  if (error && error?.hint?.includes('Photo')) {
    const result2 = await withRetry(async () => {
      return await supabase
        .from("Album")
        .select("*, Photo(*)")
        .eq("id", id)
        .single();
    });

    if (!result2.error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = result2.data as any;
      error = null;
    }
  }

  if (error || !data) {
    if (error) {
      // Ignorujeme chybu, pokud se jen nenašlo (kód PGRST116 je "Results contain 0 rows")
      if (error.code !== 'PGRST116') {
        logSupabaseError("getAlbum", error);
      }
    }
    return null;
  }

  // Sjednocení tvaru: photos nebo Photo z Supabase
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const albumData = data as any;
  const raw = albumData as { photos?: unknown[]; Photo?: unknown[] };
  albumData.photos = Array.isArray(raw.photos) ? raw.photos : (Array.isArray(raw.Photo) ? raw.Photo : []);

  // Načtení fotek z Cloudinary podle cloudinaryFolder, pokud je vyplněné a Cloudinary vrátí výsledky
  const folder = (albumData.cloudinaryFolder || "").trim();
>>>>>>> 57f7d4661be098848aeffe68efbe6b16ee3a7f43
  if (folder) {
    const fromCloud = await fetchImageIdsByFolder(folder);
    if (fromCloud.length > 0) {
      albumData.photos = fromCloud.map((r, i) => ({
        id: r.public_id,
        cloudinaryPublicId: r.public_id,
        caption: null,
        sortOrder: i,
      }));
    }
  }

<<<<<<< HEAD
  data.photos.sort((a: { sortOrder?: number }, b: { sortOrder?: number }) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return data as unknown;
}

export async function getAlbum(id: string) {
  const supabase = await createClient();

  // Schéma typicky používá Photo (velké P); zkusíme nejdřív Photo, pak photos
  let res = await supabase
    .from("Album")
    .select("*, Photo(*)")
    .eq("id", id)
    .single();

  if (!res.error && res.data) {
    return await applyPhotosAndCloudinary(res.data as Record<string, unknown> & { photos: { sortOrder?: number }[] });
  }

  if (res.error) logSupabaseError("getAlbum", res.error);

  const hintOrMessage = (res.error?.hint ?? "") + (res.error?.message ?? "");
  if (hintOrMessage.includes("photos")) {
    const res2 = await supabase
      .from("Album")
      .select("*, photos(*)")
      .eq("id", id)
      .single();
    if (!res2.error && res2.data) {
      return await applyPhotosAndCloudinary(res2.data as Record<string, unknown> & { photos: { sortOrder?: number }[] });
    }
    if (res2.error) logSupabaseError("getAlbum", res2.error);
  }

  const res3 = await supabase.from("Album").select("*").eq("id", id).single();
  if (!res3.error && res3.data) {
    const data = res3.data as Record<string, unknown> & { photos: { sortOrder?: number }[] };
    data.photos = [];
    return await applyPhotosAndCloudinary(data);
  }
  if (res3.error) logSupabaseError("getAlbum", res3.error);

  return null;
}
=======
  // Seřadíme fotky podle sortOrder
  albumData.photos.sort((a: { sortOrder?: number }, b: { sortOrder?: number }) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return albumData;
}
>>>>>>> 57f7d4661be098848aeffe68efbe6b16ee3a7f43
