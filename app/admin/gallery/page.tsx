import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminCreateAlbum, adminDeleteAlbum } from "../_actions";
import { Folder, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const albums = await prisma.album.findMany({
    orderBy: { dateTaken: "desc" },
    include: { _count: { select: { photos: true } } },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin • Galerie</h1>

      {/* Formulář pro nové album */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Nové Album
        </h2>
        <form action={adminCreateAlbum} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Název alba</label>
            <input 
              name="title" 
              placeholder="Např. Vánoční večírek 2024" 
              required 
              className="w-full p-2 border rounded-xl" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum akce</label>
            <input 
              name="dateTaken" 
              type="date" 
              required 
              className="w-full p-2 border rounded-xl" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cloudinary Složka</label>
            <input 
              name="cloudinaryFolder" 
              placeholder="např. vanoce-2024" 
              required 
              className="w-full p-2 border rounded-xl font-mono text-sm" 
            />
            <p className="text-xs text-gray-500 mt-1">Složka se vytvoří na Cloudinary automaticky při nahrání první fotky.</p>
          </div>

          <div className="md:col-span-2 pt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 w-full md:w-auto">
              Vytvořit album
            </button>
          </div>
        </form>
      </section>

      {/* Seznam alb */}
      <div className="grid gap-4">
        {albums.map((album) => (
          <div key={album.id} className="border p-4 rounded-xl bg-white flex justify-between items-center hover:bg-gray-50 transition-colors">
            <Link href={`/admin/gallery/${album.id}`} className="flex-1 block">
              <div className="font-bold text-lg text-blue-900 mb-1">{album.title}</div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {album.dateTaken.toLocaleDateString("cs-CZ")}
                </span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                  /{album.cloudinaryFolder}
                </span>
                <span>
                  {album._count.photos} fotek
                </span>
              </div>
            </Link>
            
            <div className="flex items-center gap-4 pl-4 border-l ml-4">
              <Link 
                href={`/admin/gallery/${album.id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Otevřít
              </Link>
              <form action={adminDeleteAlbum}>
                <input type="hidden" name="id" value={album.id} />
                <button 
                  className="text-red-600 hover:underline text-sm font-medium"
                  // Jednoduchá ochrana proti smazání omylem
                  // onClick={(e) => !confirm("Opravdu smazat album?") && e.preventDefault()}
                >
                  Smazat
                </button>
              </form>
            </div>
          </div>
        ))}

        {albums.length === 0 && (
          <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
            Zatím žádná alba.
          </div>
        )}
      </div>
    </div>
  );
}