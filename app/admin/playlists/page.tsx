import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminCreatePlaylist, adminDeletePlaylist } from "../_actions";

export const dynamic = "force-dynamic";

export default async function AdminPlaylistsPage() {
  const playlists = await prisma.playlist.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function handleCreate(formData: FormData) {
    "use server";
    await adminCreatePlaylist(formData);
  }

  async function handleDeletePlaylist(formData: FormData) {
    "use server";
    await adminDeletePlaylist(formData);
  }

  return (
    <main className="min-h-screen bg-white pb-20 text-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin • Playlisty</h1>
            <p className="text-gray-600 mt-2">Správa hudby na úvodní stránce.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="text-blue-600 font-semibold hover:underline">
              ← Admin
            </Link>
          </div>
        </div>

        {/* Create Form */}
        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Nový playlist</h2>
          <form action={handleCreate} className="mt-6 grid grid-cols-1 gap-4">
            
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Název playlistu</span>
              <input
                name="title"
                type="text"
                required
                placeholder="např. To nejlepší z 2023"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Odkaz pro vložení (Spotify Embed URL)</span>
              <p className="text-xs text-gray-500 mb-1">
                Na Spotify klikni na 3 tečky u playlistu -&gt; Sdílet -&gt; Vložit playlist (Embed). 
                Zkopíruj pouze hodnotu <code>src=&quot;...&quot;</code>. <br/>
                Vypadá to takto: <code>https://open.spotify.com/embed/playlist/xxxxx...</code>
              </p>
              <input
                name="spotifyUrl"
                type="text"
                required
                placeholder="https://open.spotify.com/embed/playlist/..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Krátký popisek (max 200 znaků)</span>
              <textarea
                name="description"
                rows={2}
                maxLength={200}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white px-3 py-2"
              />
            </label>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Aktivní (zobrazit na hlavní straně)
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Přidat playlist
            </button>
          </form>
        </section>

        {/* List */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Seznam ({playlists.length})</h2>
          <div className="space-y-3">
            {playlists.map((p: typeof playlists[0]) => (
              <div key={p.id} className={`rounded-2xl border p-5 shadow-sm bg-white ${p.isActive ? "border-green-500 ring-1 ring-green-500" : "border-gray-200"}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {p.title}
                      {p.isActive && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Zobrazeno na webu
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                     {p.spotifyUrl?.replace("https://open.spotify.com/", "open.spotify.com/")}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/playlists/${p.id}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Upravit
                    </Link>
                    <span className="text-gray-300">|</span>
                    <form action={handleDeletePlaylist}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-red-600 font-semibold hover:underline" type="submit">
                        Smazat
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}