import { getAlbums } from "@/lib/queries/albums";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AlbumForm } from "./AlbumForm";
import { AlbumList } from "./AlbumList";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  // Use centralized query which handles Cloudinary counts and caching
  const albums = await getAlbums();

  // Map to AlbumList format (it expects photos array with count object)
  // getAlbums returns _count.photos
  const albumsForList = albums.map((album) => ({
    ...album,
    cloudinaryFolder: album.cloudinaryFolder || "",
    photos: [{ count: album._count?.photos ?? 0 }],
  }));

  return (
    <AdminLayout title="Admin • Galerie">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Vytvořit nové album</h2>
        <AlbumForm />
      </section>

      <AlbumList albums={albumsForList} />
    </AdminLayout>
  );
}
