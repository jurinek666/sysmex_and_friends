import { createClient } from "@/lib/supabase/server";
import { fetchImageIdsByFolder } from "@/lib/cloudinary";
import { unstable_cache } from "next/cache";
import { withRetry, logSupabaseError } from "./utils";
import { Album, AlbumDetail, AlbumPhoto } from "@/lib/types";

// Helper for Supabase rows
interface PhotoRow {
  id: string;
  cloudinaryPublicId: string;
  cloudinary_public_id?: string;
  public_id?: string;
  caption: string | null;
  sortOrder: number | null;
  sort_order?: number | null;
}

interface AlbumRow {
  id: string;
  title: string;
  dateTaken: string;
  createdAt: string;
  updatedAt: string;
  cloudinaryFolder: string | null;
  description: string | null;
  coverPublicId: string | null;
  Photo?: { count: number }[];
}

interface AlbumDetailRow extends Omit<AlbumRow, 'Photo'> {
  Photo: PhotoRow[];
}

export async function getAlbums(): Promise<Album[]> {
  const supabase = await createClient();

  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Album")
      .select(`
        id,
        title,
        dateTaken,
        createdAt,
        updatedAt,
        cloudinaryFolder,
        description,
        coverPublicId,
        Photo(count)
      `)
      .order("dateTaken", { ascending: false });
  });

  if (error) {
    logSupabaseError("getAlbums", error);
    return [];
  }

  // Cast safely using the defined interface
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
      photos: row.Photo?.[0]?.count ?? 0,
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
  const rawPhotos: PhotoRow[] = Array.isArray(data.Photo) ? data.Photo : [];

  let photos: AlbumPhoto[] = rawPhotos.map((p, i) => ({
    id: p.id || `local-${i}`,
    cloudinaryPublicId: p.cloudinaryPublicId || p.cloudinary_public_id || p.public_id || "",
    caption: p.caption || null,
    sortOrder: p.sortOrder ?? p.sort_order ?? i
  }));

  const folder = (data.cloudinaryFolder ?? "").trim();

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

  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Album")
      .select(`
        id,
        title,
        dateTaken,
        createdAt,
        updatedAt,
        cloudinaryFolder,
        description,
        coverPublicId,
        Photo(
          id,
          cloudinaryPublicId,
          caption,
          sortOrder
        )
      `)
      .eq("id", id)
      .single();
  });

  if (error || !data) {
    if (error && error.code !== "PGRST116") {
      logSupabaseError("getAlbum", error);
    }
    return null;
  }

  // Cast safely using the defined interface
  return await applyPhotosAndCloudinary(data as unknown as AlbumDetailRow);
}
