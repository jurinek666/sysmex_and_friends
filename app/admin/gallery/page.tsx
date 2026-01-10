import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/admin/auth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AlbumForm } from "./AlbumForm";
import { AlbumList } from "./AlbumList";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAuth();
  const supabase = await createClient();

  // Nahrazeno prisma.album.findMany(...)
  const { data: albums } = await supabase
    .from("Album")
    .select("*, photos(count)") // Získáme i počet fotek
    .order("dateTaken", { ascending: false });

  // Fallback pro případ chyby nebo null
  const safeAlbums = albums || [];

  return (
    <AdminLayout title="Admin • Galerie">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Vytvořit nové album</h2>
        <AlbumForm />
      </section>

      <AlbumList albums={safeAlbums} />
    </AdminLayout>
  );
}