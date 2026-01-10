import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/admin/auth";
import { ArrowLeft } from "lucide-react";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistList } from "./PlaylistList";

export const dynamic = "force-dynamic";

export default async function AdminPlaylistsPage() {
  await requireAuth();
  const supabase = await createClient();
  
  // Nahrazeno prisma.playlist.findMany(...)
  const { data: playlists } = await supabase
    .from("Playlist")
    .select("*")
    .order("createdAt", { ascending: false });

  // Fallback, kdyby data byla null (např. chyba sítě)
  const safePlaylists = playlists || [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na nástěnku
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Admin • Playlisty</h1>

      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Přidat playlist</h2>
        <PlaylistForm />
      </section>

      <PlaylistList playlists={safePlaylists} />
    </div>
  );
}