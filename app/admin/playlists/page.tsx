import Link from "next/link";
import { createClient } from "@/lib/supabase/server"; // Změna importu
import { adminCreatePlaylist, adminDeletePlaylist } from "../_actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPlaylistsPage() {
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
        <form action={adminCreatePlaylist} className="space-y-4">
          <input name="title" placeholder="Název (např. Jaro 2024)" required className="w-full p-3 border rounded-xl" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spotify Embed Code (nebo URL)</label>
            <input 
              name="spotifyUrl" 
              placeholder='<iframe ... src="..." ...' 
              required 
              className="w-full p-3 border rounded-xl font-mono text-sm bg-gray-50" 
            />
            <p className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded-lg">
              ℹ️ Na Spotify klikni na <strong>Tři tečky → Sdílet → Vložit playlist (Embed)</strong>. Zkopíruj celý kód a vlož ho sem.
            </p>
          </div>

          <textarea name="description" placeholder="Popisek (max 200 znaků)" maxLength={200} className="w-full p-3 border rounded-xl" />

          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
            <input type="checkbox" name="isActive" className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
            <span className="font-medium">Aktivní (zobrazit tento playlist na webu)</span>
          </label>

          <button type="submit" className="w-full bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-medium transition-colors">Uložit playlist</button>
        </form>
      </section>

      <div className="space-y-4">
        {safePlaylists.map((p) => (
          <div key={p.id} className={`border p-5 rounded-2xl bg-white flex justify-between items-center shadow-sm ${p.isActive ? 'border-green-500 ring-1 ring-green-500' : ''}`}>
            <div>
              <div className="font-bold text-lg flex items-center gap-2">
                {p.title}
                {p.isActive && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase tracking-wide">Active</span>}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-md mt-1">{p.spotifyUrl}</div>
            </div>
            <form action={adminDeletePlaylist}>
              <input type="hidden" name="id" value={p.id} />
              <button className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">Smazat</button>
            </form>
          </div>
        ))}
        {safePlaylists.length === 0 && <div className="text-center text-gray-400 py-12">Zatím žádné playlisty.</div>}
      </div>
    </div>
  );
}