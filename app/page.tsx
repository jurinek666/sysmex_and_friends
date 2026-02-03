import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Users } from "lucide-react";
import { getRecentPosts } from "@/lib/queries/posts";
import { getLatestResults } from "@/lib/queries/results";
import { getAllPlaylists } from "@/lib/queries/playlists";
import { getActiveMembers } from "@/lib/queries/members";
import { getAlbumsWithRandomCoverPhotos } from "@/lib/queries/albums";
import { getUpcomingEvents } from "@/lib/queries/events";
import { PlaylistCarousel } from "@/components/PlaylistCarousel";
import { PostsCarousel } from "@/components/PostsCarousel";
import { Hero } from "@/components/Hero";
import { MemberCard } from "@/components/team/MemberCard";
import { getPlacementTone } from "@/lib/ui/resultPlacementStyles";

export const revalidate = 60;

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "gear-gaming";

function getCloudinaryUrl(publicId: string, width = 400) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

export default async function Home() {
  const [recentPosts, latestResults, allPlaylists, members, albums, upcomingEvents] = await Promise.all([
    getRecentPosts(6),
    getLatestResults(5),
    getAllPlaylists(),
    getActiveMembers(),
    getAlbumsWithRandomCoverPhotos(4),
    getUpcomingEvents(5),
  ]);

  const upcomingEvent = upcomingEvents[0] ?? null;

  return (
    <main className="min-h-screen pt-32 md:pt-40 pb-20">
      <Hero upcomingEvent={upcomingEvent} />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(180px,auto)]">

        {/* 0. AKTUALITY */}
        <div id="aktuality" className="col-span-1 md:col-span-2 mt-6 md:mt-8">
          <PostsCarousel posts={recentPosts} />
        </div>

        {/* 2. PLAYLIST CAROUSEL */}
        {allPlaylists && allPlaylists.length > 0 && (
          <div id="playlisty" className="h-full">
            <PlaylistCarousel playlists={allPlaylists} />
          </div>
        )}

        {/* 3. RESULTS CARD */}
        <div
          id="vysledky"
          className="col-span-1 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-sysmex-900 to-sysmex-950 p-8 flex flex-col justify-between group hover:border-neon-gold/50 hover:shadow-[0_0_20px_-8px_rgba(251,217,134,0.25)] transition-all duration-300"
        >
           <div className="flex justify-between items-start">
             <div>
               <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Poslední výsledky</div>
               <div className="text-xs text-gray-500 mt-1">Top 5</div>
             </div>
             <Link
               href="/vysledky"
               className="text-xs font-semibold text-neon-gold hover:text-white hover:underline"
             >
               Zobrazit všechny ›
             </Link>
           </div>
           
           {latestResults && latestResults.length > 0 ? (
             <div className="mt-5 space-y-3">
               {latestResults.map((result) => (
                 <div
                   key={result.id}
                   className={`rounded-xl border px-4 py-3 text-sm text-gray-200 ${getPlacementTone(result.placement, "dark")}`}
                 >
                   <div className="flex items-center justify-between gap-3">
                     <div className="font-bold text-white">
                       {result.placement}. místo
                     </div>
                     <div className="text-xs font-mono text-gray-400">
                       {format(new Date(result.date), "d. M.", { locale: cs })}
                     </div>
                   </div>
                   <div className="mt-1 text-xs text-gray-400">{result.venue}</div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="mt-auto text-gray-500 italic">Žádná data</div>
           )}
        </div>

        {/* 5. TEAM LIST CARD — Varianta A (Neon roster) */}
        <div
          id="tym"
          className="col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-sysmex-900 to-sysmex-950 p-8 group hover:border-neon-magenta/50 hover:shadow-[0_0_20px_-8px_rgba(255,79,216,0.3)] transition-all duration-300"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan via-neon-magenta to-transparent" />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-start gap-3">
              <Users className="w-8 h-8 text-neon-magenta shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  Náš <span className="text-neon-magenta">Tým</span>
                </h2>
                <p className="text-gray-400 text-sm">Mozky operace. Každý ví něco, nikdo neví všechno.</p>
              </div>
            </div>
            <Link
              href="/tym"
              className="px-4 py-2 rounded-lg border border-neon-magenta/40 bg-neon-magenta/10 text-neon-magenta font-semibold text-sm hover:bg-neon-magenta/20 transition-colors shrink-0"
            >
              Zobrazit všechny →
            </Link>
          </div>

          {members && members.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {members.slice(0, 10).map((member) => (
                <MemberCard key={member.id} member={member} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 py-8">
              <Users className="w-12 h-12 mb-3 opacity-50 text-gray-400" strokeWidth={1.5} />
              <p>Zatím tu nikdo není. Tým je asi na baru.</p>
            </div>
          )}
        </div>

        {/* 6. GALLERY CARD */}
        <div id="galerie" className="col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-sysmex-900 to-sysmex-950 p-8 group hover:border-neon-cyan/50 hover:shadow-[0_0_20px_-8px_rgba(70,214,255,0.25)] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Galerie</h2>
              <p className="text-gray-400 text-sm">Alba a fotky z akcí.</p>
            </div>
            <Link 
              href="/galerie" 
              className="px-4 py-2 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan font-semibold text-sm hover:bg-neon-cyan/20 transition-colors"
            >
              Zobrazit všechny →
            </Link>
          </div>
          
          {albums && albums.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albums.slice(0, 4).map((album) => (
                <Link
                  key={album.id}
                  href={`/galerie/${album.id}`}
                  className="group/item rounded-lg bg-sysmex-900/60 hover:bg-sysmex-900/80 p-4 transition-all border border-white/10 hover:border-neon-cyan/30"
                >
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-sysmex-800 to-sysmex-950 mb-3 flex items-center justify-center border border-white/5 group-hover/item:border-neon-cyan/30 transition-colors relative overflow-hidden">
                    {"randomCoverPublicId" in album && album.randomCoverPublicId ? (
                      <Image
                        src={getCloudinaryUrl(album.randomCoverPublicId)}
                        alt={album.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-4xl">FOTO</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                    {album.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{format(new Date(album.dateTaken), "d. M. yyyy", { locale: cs })}</span>
                    <span className="font-semibold text-gray-300">{album._count?.photos || 0} fotek</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">Zatím nejsou žádná alba.</div>
          )}
        </div>


        </div>
      </div>
    </main>
  );
}




