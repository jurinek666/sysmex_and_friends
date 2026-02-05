import { createClient } from "@/lib/supabase/server";
import { fetchImageIdsByFolder } from "@/lib/cloudinary";
import { unstable_cache } from "next/cache";
import { withRetry, logSupabaseError } from "./utils";
import { Album, AlbumDetail, AlbumPhoto } from "@/lib/types";

// Helper for Supabase rows
interface AlbumRow {
  id: string;
  title: string;
  dateTaken: string;
  createdAt: string;
  updatedAt: string;
  cloudinaryFolder: string | null;
  description: string | null;
  coverPublicId: string | null;
  photos?: { count: number }[];
  Photo?: { count: number }[];
}

interface AlbumDetailRow extends Omit<AlbumRow, 'photos' | 'Photo'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photos?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Photo?: any[];
  cloudinary_folder?: string;
}

export async function getAlbums(): Promise<Album[]> {
  const supabase = await createClient();

  let { data, error } = await withRetry(async () => {
    return await supabase
      .from("Album")
      .select("id, title, dateTaken, createdAt, updatedAt, cloudinaryFolder, description, coverPublicId, photos(count)")
      .order("dateTaken", { ascending: false });
  });

  if (error && error.hint?.includes("Photo")) {
    const result2 = await withRetry(async () => {
      return await supabase
        .from("Album")
        .select("id, title, dateTaken, createdAt, updatedAt, cloudinaryFolder, description, coverPublicId, Photo(count)")
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

  const rows = (data || []) as unknown as AlbumRow[];

  const albums: Album[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    dateTaken: row.dateTaken,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    cloudinaryFolder: row.cloudinaryFolder,
    description: row.description,
    coverPublicId: row.coverPublicId,
    _count: {
      photos: row.photos?.[0]?.count ?? row.Photo?.[0]?.count ?? 0,
    },
  }));

  const getCloudinaryCountCached = (folder: string) =>
    unstable_cache(
      async () => {
        const fromCloud = await fetchImageIdsByFolder(folder);
        return fromCloud.length;
      },
      ["cloudinary-count", folder],
      { revalidate: 300 }
    )();

  const withCloudCounts = await Promise.all(
    albums.map(async (album) => {
      const folder = String(album.cloudinaryFolder || "").trim();
      if ((album._count?.photos ?? 0) === 0 && folder) {
        const count = await getCloudinaryCountCached(folder);
        if (count > 0) {
          return {
            ...album,
            _count: {
              ...album._count,
              photos: count,
            },
          };
        }
      }
      return album;
    })
  );

  return withCloudCounts;
}

export async function getAlbumsWithRandomCoverPhotos(maxToEnrich = 4): Promise<Album[]> {
  const albums = await getAlbums();
  const toEnrich = albums.slice(0, maxToEnrich);
  const enriched = await Promise.all(
    toEnrich.map(async (album) => {
      const folder = String(album.cloudinaryFolder || "").trim();
      const count = album._count?.photos ?? 0;
      if (!folder || count === 0) return { ...album, randomCoverPublicId: null };
      const list = await fetchImageIdsByFolder(folder);
      if (list.length === 0) return { ...album, randomCoverPublicId: null };
      const random = list[Math.floor(Math.random() * list.length)];
      return { ...album, randomCoverPublicId: random.public_id };
    })
  );
  return [...enriched, ...albums.slice(maxToEnrich)];
}

async function applyPhotosAndCloudinary(data: AlbumDetailRow): Promise<AlbumDetail> {
  const rawPhotos = Array.isArray(data.photos) ? data.photos : Array.isArray(data.Photo) ? data.Photo : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let photos: AlbumPhoto[] = rawPhotos.map((p: any, i: number) => ({
    id: p.id || `local-${i}`,
    cloudinaryPublicId: p.cloudinaryPublicId || p.public_id || "",
    caption: p.caption || null,
    sortOrder: p.sortOrder ?? i
  }));

  const folder = (data.cloudinaryFolder ?? data.cloudinary_folder ?? "").trim();

  if (folder) {
    const fromCloud = await fetchImageIdsByFolder(folder);
    if (fromCloud.length > 0) {
      photos = fromCloud.map((r, i) => ({
        id: r.public_id,
        cloudinaryPublicId: r.public_id,
        caption: null,
        sortOrder: i,
      }));
    }
  }

  photos.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return {
    id: data.id,
    title: data.title,
    dateTaken: data.dateTaken,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    cloudinaryFolder: data.cloudinaryFolder ?? null,
    description: data.description,
    coverPublicId: data.coverPublicId,
    photos,
    _count: { photos: photos.length }
  };
}

export async function getAlbum(id: string): Promise<AlbumDetail | null> {
  const supabase = await createClient();

  const fetchWithRelation = async (relation: "Photo" | "photos") =>
    withRetry(async () => {
      return await supabase
        .from("Album")
        .select(`*, ${relation}(*)`)
        .eq("id", id)
        .single();
    });

  let { data, error } = await fetchWithRelation("Photo");

  if (error) {
    const hintOrMessage = `${error.hint ?? ""}${error.message ?? ""}`;
    if (hintOrMessage.includes("photos") || hintOrMessage.includes("Photo")) {
      const result2 = await fetchWithRelation("photos");
      if (!result2.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = result2.data as any;
        error = null;
      }
    }
  }

  if (error) {
    const result3 = await withRetry(async () => {
      return await supabase.from("Album").select("*").eq("id", id).single();
    });
    if (!result3.error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = result3.data as any;
      error = null;
    } else {
      error = result3.error;
    }
  }

  if (error || !data) {
    if (error && error.code !== "PGRST116") {
      logSupabaseError("getAlbum", error);
    }
    return null;
  }

  return await applyPhotosAndCloudinary(data as unknown as AlbumDetailRow);
}
