import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistList } from "./PlaylistList";

export const dynamic = "force-dynamic";

export default async function AdminPlaylistsPage() {
  const supabase = await createClient();
  
  // Nahrazeno prisma.playlist.findMany(...)
  const { data: playlists } = await supabase
    .from("playlists")
    .select(`
      id,
      title,
      description,
      spotifyUrl:spotify_url,
      isActive:is_active,
      createdAt:created_at,
      updatedAt:updated_at
    `)
    .order("created_at", { ascending: false });

  // Fallback, kdyby data byla null (např. chyba sítě)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safePlaylists = (playlists || []) as any[];

  return (
    <AdminLayout title="Admin • Playlisty">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Přidat playlist</h2>
        <PlaylistForm />
      </section>

      <PlaylistList playlists={safePlaylists} />
    </AdminLayout>
  );
}
