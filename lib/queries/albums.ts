import { createClient } from "@/lib/supabase/server";
import { fetchImageIdsByFolder } from "@/lib/cloudinary";
import { withRetry, logSupabaseError } from "./utils";

export interface Album {
  id: string;
  title: string;
  description: string | null;
  dateTaken: string;
  createdAt: string;
  updatedAt: string;
  cloudinaryFolder: string | null;
  isPublic: boolean;
  photos: Photo[];
  _count?: {
    photos: number;
  };
}

export interface Photo {
  id: string;
  cloudinaryPublicId: string;
  caption: string | null;
  sortOrder: number;
  albumId: string;
}

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
  })) as Album[];
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

  // Sjednocení tvaru: photos nebo Photo z Supabase
  const raw = data as { photos?: unknown[]; Photo?: unknown[] } & Album;
  data.photos = (Array.isArray(raw.photos) ? raw.photos : (Array.isArray(raw.Photo) ? raw.Photo : [])) as Photo[];

  // Načtení fotek z Cloudinary podle cloudinaryFolder, pokud je vyplněné a Cloudinary vrátí výsledky
  const folder = (data.cloudinaryFolder || "").trim();
  if (folder) {
    const fromCloud = await fetchImageIdsByFolder(folder);
    if (fromCloud.length > 0) {
      data.photos = fromCloud.map((r, i) => ({
        id: r.public_id,
        cloudinaryPublicId: r.public_id,
        caption: null,
        sortOrder: i,
        albumId: data.id,
      }));
    }
  }

  // Seřadíme fotky podle sortOrder
  data.photos.sort((a: Photo, b: Photo) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return data as Album;
}
