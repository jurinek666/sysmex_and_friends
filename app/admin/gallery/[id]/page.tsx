import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminAddPhoto, adminDeletePhoto } from "../../_actions";
import { ArrowLeft, Upload, Link as LinkIcon, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

// Pomocná funkce pro získání URL obrázku (pokud nemáme nastavený CldImage v adminu)
function getImageUrl(publicId: string) {
  if (publicId.startsWith("http")) return publicId;
  // Fallback: Pokud nemáme cloud name v env pro klienta, musíme doufat, že je publicId kompletní URL
  // nebo použijeme serverovou proměnnou (což v Client Component nejde, ale toto je Server Component).
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return publicId; // Error state
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_400/${publicId}`;
}

type Props = {
    params: Promise<{ id: string }>; // V Next.js 15+ je params Promise
};

export default async function AdminAlbumPage(props: Props) {
  const params = await props.params;
  const album = await prisma.album.findUnique({
    where: { id: params.id },
    include: { photos: { orderBy: { createdAt: "desc" } } },
  });

  if (!album) return <div>Album nenalezeno</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link href="/admin/gallery" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Zpět na seznam alb
      </Link>

      <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
      <p className="text-gray-500 mb-8 font-mono text-sm bg-gray-100 inline-block px-2 py-1 rounded">
        Složka: {album.cloudinaryFolder}
      </p>

      {/* Formulář pro přidání fotky */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Přidat fotku</h2>
        <form action={adminAddPhoto} className="space-y-4">
          <input type="hidden" name="albumId" value={album.id} />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Možnost A: Upload */}
            <div className="border border-dashed border-gray-300 p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 font-semibold mb-2 text-blue-700">
                <Upload className="w-4 h-4" /> Nahrát soubor
              </div>
              <input type="file" name="file" accept="image/*" className="w-full text-sm" />
              <p className="text-xs text-gray-500 mt-2">Max 10MB. Nahraje se na Cloudinary.</p>
            </div>

            {/* Možnost B: URL */}
            <div className="border border-dashed border-gray-300 p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 font-semibold mb-2 text-purple-700">
                <LinkIcon className="w-4 h-4" /> Nebo vložit odkaz
              </div>
              <input 
                name="urlInput" 
                placeholder="https://res.cloudinary.com/..." 
                className="w-full p-2 border rounded text-sm" 
              />
              <p className="text-xs text-gray-500 mt-2">Pokud už fotku máš na cloudu, vlož sem URL.</p>
            </div>
          </div>

          <div>
             <input 
                name="caption" 
                placeholder="Popisek fotky (volitelné)" 
                className="w-full p-2 border rounded-xl" 
              />
          </div>

          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 w-full">
            Přidat do alba
          </button>
        </form>
      </section>

      {/* Grid fotek */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {album.photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border">
            {/* Obrázek */}
            <div className="relative w-full h-full">
                <Image 
                    src={getImageUrl(photo.cloudinaryPublicId)}
                    alt={photo.caption || "Fotka"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                />
            </div>
            
            {/* Overlay s akcemi */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                {photo.caption && (
                    <p className="text-white text-xs truncate mb-2">{photo.caption}</p>
                )}
                <form action={adminDeletePhoto}>
                    <input type="hidden" name="id" value={photo.id} />
                    <button className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 w-full flex justify-center items-center gap-2 text-xs">
                        <Trash2 className="w-3 h-3" /> Smazat
                    </button>
                </form>
            </div>
          </div>
        ))}
      </div>

      {album.photos.length === 0 && (
         <div className="text-center py-12 text-gray-400">
            Album je zatím prázdné.
         </div>
      )}
    </div>
  );
}