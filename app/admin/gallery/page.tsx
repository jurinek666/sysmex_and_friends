import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/queries/utils";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AlbumForm } from "./AlbumForm";
import { AlbumList } from "./AlbumList";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const supabase = await createClient();

  // 1) První pokus: photos(count)
  let { data: albums, error } = await supabase
    .from("Album")
    .select("*, photos(count)")
    .order("dateTaken", { ascending: false });

  // 2) Při chybě (typicky špatný název relace) zkusit Photo(count)
  if (error && error?.hint?.includes?.("Photo")) {
    const res = await supabase
      .from("Album")
      .select("*, Photo(count)")
      .order("dateTaken", { ascending: false });
    if (!res.error && res.data) {
      albums = res.data.map((a: { Photo?: { count: number }[]; photos?: { count: number }[]; [k: string]: unknown }) => ({
        ...a,
        photos: a.Photo ?? a.photos,
      }));
      error = null;
    }
  }

  // 3) Při stále přítomné chybě: pouze sloupce Album, bez vazby
  if (error) {
    logSupabaseError("AdminGalleryPage (albums)", error);
    const res = await supabase.from("Album").select("*").order("dateTaken", { ascending: false });
    albums = res.error ? [] : (res.data || []).map((a) => ({ ...a, photos: [{ count: 0 }] }));
  }

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