import { getAlbums } from "@/lib/queries/albums";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AlbumForm } from "./AlbumForm";
import { AlbumList } from "./AlbumList";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const albums = await getAlbums();

  const mappedAlbums = albums.map((album) => ({
    id: album.id,
    title: album.title,
    dateTaken: album.dateTaken,
    createdAt: album.createdAt,
    updatedAt: album.updatedAt,
    cloudinaryFolder: album.cloudinaryFolder || "",
    description: album.description,
    coverPublicId: album.coverPublicId,
    photos: [{ count: album._count?.photos ?? 0 }],
  }));

  return (
    <AdminLayout title="Admin • Galerie">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Vytvořit nové album</h2>
        <AlbumForm />
      </section>

      <AlbumList albums={mappedAlbums} />
    </AdminLayout>
  );
}
