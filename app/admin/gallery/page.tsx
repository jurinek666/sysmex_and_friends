import { createClient } from "@/lib/supabase/server";
import { getAlbums } from "@/lib/queries/albums";
import { logSupabaseError } from "@/lib/queries/utils";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AlbumForm } from "./AlbumForm";
import { AlbumList } from "./AlbumList";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const supabase = await createClient();

  // Optimized query with snake_case aliases
  // eslint-disable-next-line prefer-const
  let { data: albums, error } = await supabase
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

  if (error) {
    logSupabaseError("AdminGalleryPage (albums)", error);
    // Fallback if relation fails
    const res = await supabase
      .from("Album")
      .select(`
        id,
        title,
        dateTaken,
        createdAt,
        updatedAt,
        cloudinaryFolder,
        description,
        coverPublicId
      `)
      .order("dateTaken", { ascending: false });

    albums = res.error ? [] : (res.data || []).map((a) => ({ ...a, Photo: [{ count: 0 }] }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeAlbums = (albums || []) as any[];

  // Merge with Cloudinary counts from getAlbums (which handles caching of external API)
  const albumCounts = await getAlbums();
  const countById = new Map(
    albumCounts.map((album) => [album.id, album._count?.photos ?? 0])
  );

  const albumsWithCounts = safeAlbums.map((album) => ({
    ...album,
    photos: [{ count: countById.get(album.id) ?? (album as { Photo?: { count: number }[] }).Photo?.[0]?.count ?? 0 }],
  }));

  return (
    <AdminLayout title="Admin • Galerie">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Vytvořit nové album</h2>
        <AlbumForm />
      </section>

      <AlbumList albums={albumsWithCounts} />
    </AdminLayout>
  );
}
