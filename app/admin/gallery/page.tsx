import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { adminCreateAlbum, adminDeleteAlbum } from "../_actions";
import { Folder, Calendar, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const supabase = await createClient();

  // Nahrazeno prisma.album.findMany(...)
  const { data: albums } = await supabase
    .from("Album")
    .select("*, photos(count)") // Získáme i počet fotek
    .order("dateTaken", { ascending: false });

  // Fallback pro případ chyby nebo null
  const safeAlbums = albums || [];

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

      <h1 className="text-3xl font-bold mb-8">Admin • Galerie</h1>

      {/* Formulář pro přidání alba */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Vytvořit nové album</h2>
        <form action={adminCreateAlbum} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Název alba</label>
              <input name="title" placeholder="Např. Vánoční večírek" required className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum akce</label>
              <input type="date" name="dateTaken" required className="w-full p-3 border rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cloudinary složka <span className="text-gray-400 font-normal">(přesný název složky v cloudu)</span>
            </label>
            <div className="relative">
              <Folder className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input name="cloudinaryFolder" placeholder="např. 2024-vanocni-vecirek" required className="w-full p-3 pl-10 border rounded-xl font-mono text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Popis (volitelné)</label>
            <textarea name="description" rows={2} className="w-full p-3 border rounded-xl" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium transition-colors">
            Vytvořit album
          </button>
        </form>
      </section>

      {/* Seznam alb */}
      <div className="space-y-4">
        {safeAlbums.map((album: any) => (
          <div key={album.id} className="border p-5 rounded-2xl bg-white flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4">
            <div>
              <div className="font-bold text-lg">{album.title}</div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(album.dateTaken).toLocaleDateString("cs-CZ")}
                </span>
                <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md">
                  <Folder className="w-3 h-3" />
                  {album.cloudinaryFolder}
                </span>
                <span>
                   {/* Supabase vrací pole objektů pro count, musíme to ošetřit */}
                   {album.photos?.[0]?.count ?? 0} fotek
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               {/* Tlačítko pro synchronizaci fotek zatím vynecháme nebo může být separate action */}
              <form action={adminDeleteAlbum}>
                <input type="hidden" name="id" value={album.id} />
                <button className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                  Smazat
                </button>
              </form>
            </div>
          </div>
        ))}
        {safeAlbums.length === 0 && (
          <div className="text-center text-gray-400 py-12">Zatím žádná alba.</div>
        )}
      </div>
    </div>
  );
}