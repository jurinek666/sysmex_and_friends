import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getAlbum } from "@/lib/queries/albums";
import { AlbumGallery } from "@/components/galerie/AlbumGallery";
import { Images } from "lucide-react";
import { getComments } from "@/lib/queries/team";
import CommentSection from "@/components/team/CommentSection";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  "gear-gaming";

function getCloudinaryUrl(publicId: string, width = 800) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AlbumDetailPage(props: PageProps) {
  const { id } = await props.params;
  const album = await getAlbum(id);

  if (!album) return notFound();
  const coverId = (album.coverPublicId || "").trim();

  // Load comments
  const supabase = await createClient();
  const comments = await getComments(supabase, id, "album");
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="relative min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Neon accent pruh */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-neon-cyan via-neon-magenta to-transparent" />

      {/* HLAVIČKA ALBA */}
      <header className="relative mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <Link
                href="/galerie"
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                ← Zpět do galerie
              </Link>
              <span className="text-neon-gold text-sm font-mono tracking-wider">
                {format(new Date(album.dateTaken), "d. MMMM yyyy", { locale: cs })}
              </span>
              <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                <Images className="w-4 h-4" strokeWidth={2} />
                <span className="font-medium">{album.photos.length} fotek</span>
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-1">
              {album.title}
            </h1>
            {album.description && (
              <p className="mt-4 text-gray-400 text-lg max-w-2xl leading-relaxed">
                {album.description}
              </p>
            )}
          </div>
        </div>

        {/* Cover / hero obrázek (pokud je vyplněný coverPublicId) */}
        {coverId && (
          <div className="mt-8 -mx-4 md:mx-0">
            <div className="relative w-full aspect-[21/9] max-h-[320px] rounded-2xl overflow-hidden border border-white/10 bg-sysmex-900">
              <Image
                src={getCloudinaryUrl(coverId, 1600)}
                alt={`Obálka alba ${album.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sysmex-950/80 via-transparent to-transparent" />
            </div>
          </div>
        )}
      </header>

      {/* GRID FOTEK + LIGHTBOX */}
      {album.photos.length === 0 ? (
        <div className="py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
          <Images className="w-16 h-16 mx-auto mb-4 text-gray-600" strokeWidth={1.5} />
          <p className="text-lg">V tomto albu zatím nejsou žádné fotky.</p>
          <Link href="/galerie" className="mt-4 inline-block text-neon-cyan hover:underline text-sm">
            Zpět na galerii
          </Link>
        </div>
      ) : (
        <AlbumGallery
          photos={album.photos}
          cloudName={CLOUD_NAME}
          albumTitle={album.title}
        />
      )}

      {/* KOMENTÁŘE */}
      <div className="mt-20 border-t border-white/10 pt-10">
        <CommentSection
          entityId={id}
          entityType="album"
          initialComments={comments}
          isLoggedIn={!!user}
        />
      </div>
    </main>
  );
}
