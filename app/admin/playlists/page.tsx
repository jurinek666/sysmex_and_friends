import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminCreatePlaylist, adminDeletePlaylist } from "../_actions";

export const dynamic = "force-dynamic";

export default async function AdminPlaylistsPage() {
  const playlists = await prisma.playlist.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin • Playlisty</h1>

      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Přidat playlist</h2>
        <form action={adminCreatePlaylist} className="space-y-4">
          <input name="title" placeholder="Název (např. Jaro 2024)" required className="w-full p-2 border rounded" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spotify Embed Code (nebo URL)</label>
            <input 
              name="spotifyUrl" 
              placeholder='<iframe style="border-radius:12px" src="https://open.spotify.com/embed/..." ...' 
              required 
              className="w-full p-2 border rounded font-mono text-sm" 
            />
            <p className="text-xs text-gray-500 mt-1">
              Na Spotify: Tři tečky &rarr; Sdílet &rarr; Vložit playlist (Embed). Zkopíruj celý kód a vlož ho sem. My si z něj vytáhneme to potřebné.
            </p>
          </div>

          <textarea name="description" placeholder="Popisek (max 200 znaků)" maxLength={200} className="w-full p-2 border rounded" />

          <label className="flex items-center gap-2">
            <input type="checkbox" name="isActive" className="w-4 h-4" />
            <span className="text-sm">Aktivní (zobrazit na webu)</span>
          </label>

          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700">Uložit playlist</button>
        </form>
      </section>

      <div className="space-y-4">
        {playlists.map((p) => (
          <div key={p.id} className={`border p-4 rounded-xl bg-white flex justify-between items-center ${p.isActive ? 'border-green-500 ring-1 ring-green-500' : ''}`}>
            <div>
              <div className="font-bold flex items-center gap-2">
                {p.title}
                {p.isActive && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Active</span>}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-md">{p.spotifyUrl}</div>
            </div>
            <form action={adminDeletePlaylist}>
              <input type="hidden" name="id" value={p.id} />
              <button className="text-red-600 hover:underline text-sm font-semibold">Smazat</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}