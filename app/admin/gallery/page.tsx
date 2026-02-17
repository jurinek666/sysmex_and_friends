import { getAlbums } from "@/lib/queries/albums";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AlbumForm } from "./AlbumForm";
import { AlbumList } from "./AlbumList";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  // getAlbums already handles Supabase query, retry logic, and Cloudinary counts
  const albums = await getAlbums();

  return (
    <AdminLayout title="Admin • Galerie">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Vytvořit nové album</h2>
        <AlbumForm />
      </section>

      <AlbumList albums={albums} />
    </AdminLayout>
  );
}
