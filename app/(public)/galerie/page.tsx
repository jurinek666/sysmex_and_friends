import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Images } from "lucide-react";
import { getAlbumsWithRandomCoverPhotos } from "@/lib/queries/albums";

export const revalidate = 300;

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  "gear-gaming";

function getCloudinaryUrl(publicId: string, width = 400) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

interface Album {
  id: string;
  title: string;
  dateTaken: string;
  cloudinaryFolder: string;
  _count: {
    photos: number;
  };
  randomCoverPublicId?: string | null;
}

export default async function GaleriePage() {
  const rawAlbums = await getAlbumsWithRandomCoverPhotos(30);
  const albums = (rawAlbums || []) as Album[];

  return (
    <main className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-sysmex-900 to-sysmex-950">
      {/* Neon accent pruh */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-neon-cyan via-neon-magenta to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
      {/* HLAVIČKA */}
      <header className="relative mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              <span className="text-neon-cyan">GALERIE</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl">
              Alba a fotky z akcí.
            </p>
          </div>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-colors w-fit"
          >
            ← Zpět na úvod
          </Link>
        </div>
      </header>

      {/* GRID ALB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.length === 0 ? (
          <div className="col-span-full bento-card p-12 text-center border-dashed border-white/10 text-gray-500">
            <Images className="w-16 h-16 mx-auto mb-4 text-gray-600" strokeWidth={1.5} />
            <p className="text-lg">Zatím nejsou žádná alba.</p>
            <Link href="/" className="mt-4 inline-block text-neon-cyan hover:underline text-sm font-medium">
              Zpět na úvod
            </Link>
          </div>
        ) : (
          albums.map((a, index) => {
            const isCyan = index % 2 === 0;
            const hoverBorder = isCyan ? "hover:border-neon-cyan/50" : "hover:border-neon-magenta/50";
            const coverId = a.randomCoverPublicId?.trim();

            return (
              <Link
                key={a.id}
                href={`/galerie/${a.id}`}
                className={`group block bento-card p-0 overflow-hidden transition-all duration-300 ${hoverBorder} hover:shadow-neon`}
              >
                <div className="aspect-square rounded-t-3xl overflow-hidden bg-gradient-to-br from-sysmex-800 to-sysmex-950 border-b border-white/5 relative">
                  {coverId ? (
                    <Image
                      src={getCloudinaryUrl(coverId, 400)}
                      alt={a.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Images className="w-12 h-12 text-gray-600" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-white line-clamp-1 group-hover:text-neon-cyan transition-colors">
                    {a.title}
                  </h2>
                  <div className="mt-1 text-sm text-gray-400">
                    {format(new Date(a.dateTaken), "d. MMMM yyyy", { locale: cs })}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Fotek: <span className="font-semibold text-gray-400">{a._count?.photos ?? "–"}</span>
                  </div>
                  {a.cloudinaryFolder ? (
                    <div className="mt-2 text-xs text-gray-500 font-mono truncate">
                      {a.cloudinaryFolder}
                    </div>
                  ) : null}
                  <span className="mt-3 inline-block text-sm text-neon-cyan font-medium group-hover:underline">
                    Zobrazit album →
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
      </div>
    </main>
  );
}
