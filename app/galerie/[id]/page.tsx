import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getAlbum } from "@/lib/queries/albums";

export const revalidate = 300;

// Tvůj Cloud Name
const CLOUD_NAME = "gear-gaming";

// Pomocná funkce pro generování URL z Cloudinary
function getCloudinaryUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_800/${publicId}`;
}

// 1. Definujeme typy pro data z databáze
interface Photo {
  id: string;
  cloudinaryPublicId: string;
  caption: string | null;
}

interface Album {
  id: string;
  title: string;
  dateTaken: string; // Supabase vrací datum jako string
  photos: Photo[];
}

// Next.js 15+ očekává, že params je Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AlbumDetailPage(props: PageProps) {
  // Await params
  const { id } = await props.params;
  
  // Načteme data (zatím jako 'any')
  const rawAlbum = await getAlbum(id);

  if (!rawAlbum) return notFound();

  // 2. Přetypujeme data na náš interface
  const album = rawAlbum as Album;

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* HLAVIČKA ALBA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/galerie"
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              ← Zpět do galerie
            </Link>
            <span className="text-neon-gold text-sm font-mono tracking-wider">
               {format(new Date(album.dateTaken), "d. MMMM yyyy", { locale: cs })}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {album.title}
          </h1>
        </div>
      </div>

      {/* GRID FOTEK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {album.photos.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-gray-800 rounded-3xl">
            V tomto albu zatím nejsou žádné fotky.
          </div>
        ) : (
          album.photos.map((photo, index) => (
            <div 
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-sysmex-900 border border-white/5 hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(70,214,255,0.3)]"
            >
              <Image
                src={getCloudinaryUrl(photo.cloudinaryPublicId)}
                alt={photo.caption || `Fotka ${index + 1} z alba ${album.title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay s popiskem */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                {photo.caption && (
                  <p className="text-white text-sm font-medium line-clamp-2">
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </main>
  );
}