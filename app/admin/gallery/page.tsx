import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminCreateAlbum, adminDeleteAlbum } from "../_actions";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const albums = await prisma.album.findMany({
    orderBy: { dateTaken: "desc" },
    include: { _count: { select: { photos: true } } },
  });

  // Wrappery pro TS
  async function handleCreateAlbum(formData: FormData) {
    "use server";
    await adminCreateAlbum(formData);
  }

  async function handleDeleteAlbum(formData: FormData) {
    "use server";
    await adminDeleteAlbum(formData);
  }

  return (
    <main className="min-h-screen bg-white pb-20 text-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin • Galerie</h1>
            <p className="text-gray-600 mt-2">Spravuj alba a nahrávej fotky.</p>
          </div>
          <div className="flex gap-4">
             <Link href="/admin" className="text-blue-600 font-semibold hover:underline">
              ← Admin
            </Link>
            <Link href="/galerie" className="text-blue-600 font-semibold hover:underline">
              Veřejná galerie →
            </Link>
          </div>
        </div>

        {/* Vytvořit Album */}
        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Nové album</h2>
          <form action={handleCreateAlbum} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Název alba</span>
              <input name="title" required className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 bg-white" placeholder="Vánoční večírek" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Datum akce</span>
              <input name="dateTaken" type="date" required className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 bg-white" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Složka na Cloudinary</span>
              <input name="cloudinaryFolder" required className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 bg-white" placeholder="akce-2024" />
              <span className="text-xs text-gray-400">Bez mezer a diakritiky.</span>
            </label>
            <button type="submit" className="md:col-span-3 w-full bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition">
              Vytvořit album
            </button>
          </form>
        </section>

        {/* Seznam Alb */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Existující alba</h2>
          {albums.length === 0 ? (
             <p className="text-gray-500">Žádná alba.</p>
          ) : (
             albums.map(album => (
               <div key={album.id} className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                 <div>
                    <h3 className="font-bold text-lg">{album.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(album.dateTaken).toLocaleDateString("cs-CZ")} • {album._count.photos} fotek
                    </p>
                    <p className="text-xs text-gray-400 font-mono">Složka: {album.cloudinaryFolder}</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <Link 
                      href={`/admin/gallery/${album.id}`} 
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-100"
                    >
                      Spravovat fotky
                    </Link>
                    <form action={handleDeleteAlbum}>
                        <input type="hidden" name="id" value={album.id} />
                        <button type="submit" className="text-red-500 font-bold text-sm hover:underline">Smazat</button>
                    </form>
                 </div>
               </div>
             ))
          )}
        </section>
      </div>
    </main>
  );
}