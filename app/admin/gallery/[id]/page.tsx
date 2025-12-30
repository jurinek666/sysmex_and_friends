import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminUploadPhoto, adminDeletePhoto } from "../../_actions";

const CLOUD_NAME = "gear-gaming"; // Tvůj cloud name pro náhledy

export default async function AdminAlbumDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const album = await prisma.album.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });

  if (!album) return notFound();

  async function handleUpload(formData: FormData) {
    "use server";
    await adminUploadPhoto(formData);
  }

  async function handleDelete(formData: FormData) {
    "use server";
    await adminDeletePhoto(formData);
  }

  return (
    <main className="min-h-screen bg-white pb-20 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Navigace */}
        <div className="mb-8">
            <Link href="/admin/gallery" className="text-blue-600 font-bold hover:underline">← Zpět na seznam alb</Link>
        </div>

        <div className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{album.title}</h1>
                <p className="text-gray-500">Složka: {album.cloudinaryFolder} • {album.photos.length} fotek</p>
            </div>
        </div>

        {/* Upload Sekce */}
        <section className="mb-12 p-6 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/50">
            <h3 className="font-bold text-lg mb-4 text-blue-900">Nahrát novou fotku</h3>
            {/* Jednoduchý formulář pro upload jednoho souboru */}
            <form action={handleUpload} className="flex gap-4 items-center">
                <input type="hidden" name="albumId" value={album.id} />
                <input 
                    type="file" 
                    name="file" 
                    accept="image/*" 
                    required
                    aria-label="Vyberte soubor k nahrání"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-100 file:text-blue-700
                      hover:file:bg-blue-200"
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition">
                    Nahrát
                </button>
            </form>
            <p className="text-xs text-gray-400 mt-2">Prozatím nahrávej fotky po jedné. (Limit Next.js server actions je cca 4MB na soubor).</p>
        </section>

        {/* Grid fotek */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {album.photos.map((photo: typeof album.photos[0]) => (
                <div key={photo.id} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <Image 
                        src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_scale,w_300/${photo.cloudinaryPublicId}`}
                        alt="Náhled"
                        fill
                        className="object-cover"
                    />
                    {/* Delete overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <form action={handleDelete}>
                            <input type="hidden" name="id" value={photo.id} />
                            <button type="submit" className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700">
                                Smazat
                            </button>
                        </form>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </main>
  );
}