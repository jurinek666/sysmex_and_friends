import { getAllPlaylists } from "@/lib/queries/playlists";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistList } from "./PlaylistList";

export const dynamic = "force-dynamic";

export default async function AdminPlaylistsPage() {
  const playlists = await getAllPlaylists();

  return (
    <AdminLayout title="Admin • Playlisty">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Přidat playlist</h2>
        <PlaylistForm />
      </section>

      <PlaylistList playlists={playlists} />
    </AdminLayout>
  );
}
