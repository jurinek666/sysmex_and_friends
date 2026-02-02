import { createClient } from "@/lib/supabase/server";
import { fetchImageIdsByFolder } from "@/lib/cloudinary";
import { withRetry, logSupabaseError } from "./utils";

type AlbumRecord = Record<string, unknown> & {
  photos?: { sortOrder?: number }[];
  Photo?: { sortOrder?: number }[];
  cloudinaryFolder?: string;
  cloudinary_folder?: string;
};

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
  if (error && error?.hint?.includes("Photo")) {
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
      photos: album.photos?.[0]?.count ?? album.Photo?.[0]?.count ?? 0,
    },
  }));
}

async function applyPhotosAndCloudinary(data: AlbumRecord): Promise<AlbumRecord> {
  const raw = data as { photos?: unknown[]; Photo?: unknown[] };
  data.photos = (Array.isArray(raw.photos)
    ? raw.photos
    : Array.isArray(raw.Photo)
    ? raw.Photo
    : []) as { sortOrder?: number }[];

  const folder = (
    data.cloudinaryFolder ?? data.cloudinary_folder ?? ""
  ).trim();

  if (folder) {
    const fromCloud = await fetchImageIdsByFolder(folder);
    if (fromCloud.length > 0) {
      data.photos = fromCloud.map((r, i) => ({
        id: r.public_id,
        cloudinaryPublicId: r.public_id,
        caption: null,
        sortOrder: i,
      }));
    }
  }

  data.photos.sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  return data;
}

export async function getAlbum(id: string) {
  const supabase = await createClient();

  const fetchWithRelation = async (relation: "Photo" | "photos") =>
    withRetry<AlbumRecord>(async () => {
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
    const result3 = await withRetry<AlbumRecord>(async () => {
      return await supabase.from("Album").select("*").eq("id", id).single();
    });
    if (!result3.error) {
      data = result3.data as AlbumRecord;
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

  return await applyPhotosAndCloudinary(data as AlbumRecord);
}
