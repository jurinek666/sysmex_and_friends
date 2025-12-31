import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getFeaturedPost } from "@/lib/queries/posts";
import { getLatestResults } from "@/lib/queries/results";
import { getActivePlaylist } from "@/lib/queries/playlists";
import { getActiveMembers } from "@/lib/queries/members";
import { getAlbums } from "@/lib/queries/albums";

export const revalidate = 60;

export default async function Home() {
  const [featuredPost, latestResults, activePlaylist, members, albums] = await Promise.all([
    getFeaturedPost(),
    getLatestResults(3),
    getActivePlaylist(),
    getActiveMembers(),
    getAlbums(),
  ]);

  const latestResult = latestResults[0]; 

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">

        {/* 1. HERO BLOCK */}
        <div className="col-span-1 md:col-span-2 row-span-2 bento-card p-8 md:p-12 flex flex-col justify-center relative group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 blur-[100px] rounded-full group-hover:bg-neon-cyan/20 transition-all duration-700"></div>
           
           <div className="relative z-10 space-y-6">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-xs font-bold uppercase tracking-wider w-fit">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                </span>
               Online
             </div>
             
             <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[0.9]">
               SYSMEX <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-magenta">
                 & FRIENDS
               </span>
             </h1>
             
             <p className="text-lg text-gray-400 max-w-md">
               Oficiální centrála našeho kvízového týmu. Statistiky, články a síně slávy na jednom místě.
             </p>

             <div className="flex flex-wrap gap-4 pt-4">
               <Link href="/posts" className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform">
                 Číst novinky
               </Link>
               <Link href="/team" className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 font-semibold transition-colors">
                 Poznat tým
               </Link>
             </div>
           </div>
        </div>

        {/* 2. PLAYLIST CARD */}
        {activePlaylist && (
          <div className="bento-card p-6 flex flex-col group hover:border-neon-cyan/50">
            <div className="flex justify-between items-start mb-4">
              <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Playlist</div>
              <div className="text-2xl">🎵</div>
            </div>
            
            <div className="space-y-3 flex-1">
              <h3 className="text-xl font-bold text-white">{activePlaylist.title}</h3>
              {activePlaylist.description && (
                <p className="text-sm text-gray-400 line-clamp-2">{activePlaylist.description}</p>
              )}
              
              <div className="mt-4 w-full overflow-hidden rounded-lg">
                {activePlaylist.spotifyUrl ? (
                  <div className="w-full">
                    {activePlaylist.spotifyUrl.includes('<iframe') ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: activePlaylist.spotifyUrl }}
                        className="w-full [&>iframe]:w-full [&>iframe]:h-[352px] [&>iframe]:rounded-lg [&>iframe]:border-0 [&>iframe]:min-h-[352px]"
                      />
                    ) : (
                      <iframe
                        src={activePlaylist.spotifyUrl}
                        width="100%"
                        height="352"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="w-full h-[352px] rounded-lg border-0"
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm italic p-4 text-center">Playlist není k dispozici</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. STAT CARD */}
        <div className="bento-card p-6 flex flex-col justify-between group hover:border-neon-gold/50">
           <div className="flex justify-between items-start">
             <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Poslední hra</div>
             <div className="text-2xl">🏆</div>
           </div>
           
           {latestResult ? (
             <div className="mt-4">
               <div className="text-3xl font-black text-white">{latestResult.placement}. místo</div>
               <div className="text-sm text-gray-400 mt-1">{latestResult.venue}</div>
               <div className="mt-4 flex items-center gap-3">
                  <div className="px-2 py-1 rounded bg-white/10 text-xs font-mono">{latestResult.score} bodů</div>
                  <div className="text-xs text-gray-500">{format(new Date(latestResult.date), "d. M.", { locale: cs })}</div>
               </div>
             </div>
           ) : (
             <div className="mt-auto text-gray-500 italic">Žádná data</div>
           )}
        </div>

        {/* 4. FEATURED POST */}
        <div className="col-span-3 bento-card p-8 flex flex-col md:flex-row gap-8 items-center group hover:border-neon-magenta/50">
          {featuredPost ? (
            <>
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-2 text-neon-magenta text-sm font-bold uppercase">
                    <span>🔥 Top Článek</span>
                    <span className="w-12 h-px bg-neon-magenta/50"></span>
                 </div>
                 <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-neon-magenta transition-colors">
                    {featuredPost.title}
                 </h2>
                 <p className="text-gray-400 line-clamp-2">
                    {featuredPost.excerpt}
                 </p>
                 <Link href={`/posts/${featuredPost.slug}`} className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all mt-2">
                    Číst dál <span>→</span>
                 </Link>
              </div>
              <div className="w-full md:w-48 h-32 rounded-2xl bg-gradient-to-br from-sysmex-800 to-sysmex-900 flex items-center justify-center border border-white/5">
                 <span className="text-4xl">📝</span>
              </div>
            </>
          ) : (
             <div className="text-gray-500">Zatím žádný zvýrazněný článek.</div>
          )}
        </div>

        {/* 5. TEAM LIST CARD */}
        <div className="col-span-3 bento-card p-8 group hover:border-neon-magenta/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Náš Tým</h2>
              <p className="text-gray-400 text-sm">Mozky operace. Každý ví něco, nikdo neví všechno.</p>
            </div>
            <Link 
              href="/team" 
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 font-semibold text-sm transition-colors"
            >
              Zobrazit všechny →
            </Link>
          </div>
          
          {members.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {members.slice(0, 10).map((member) => (
                <div 
                  key={member.id} 
                  className="flex flex-col items-center text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group/item"
                >
                  <div className="relative w-16 h-16 mb-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full blur opacity-20 group-hover/item:opacity-40 transition-opacity"></div>
                    <div className="relative w-full h-full rounded-full bg-sysmex-800 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                      <span className="text-lg font-black text-white/90">
                        {member.displayName.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    {member.role && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-sysmex-950 border border-neon-magenta/50 rounded-full text-[8px] font-bold uppercase text-neon-magenta">
                        {member.role}
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                    {member.displayName}
                  </h3>
                  {member.nickname && (
                    <p className="text-xs text-neon-cyan font-mono line-clamp-1">
                      &quot;{member.nickname}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">Zatím tu nikdo není. Tým je asi na baru.</div>
          )}
        </div>

        {/* 6. GALLERY CARD */}
        <div className="col-span-3 bento-card p-8 group hover:border-neon-cyan/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Galerie</h2>
              <p className="text-gray-400 text-sm">Alba a fotky z akcí.</p>
            </div>
            <Link 
              href="/galerie" 
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 font-semibold text-sm transition-colors"
            >
              Zobrazit všechny →
            </Link>
          </div>
          
          {albums && albums.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albums.slice(0, 4).map((album: any) => (
                <Link
                  key={album.id}
                  href={`/galerie/${album.id}`}
                  className="group/item rounded-lg bg-white/5 hover:bg-white/10 p-4 transition-all border border-white/5 hover:border-neon-cyan/30"
                >
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-sysmex-800 to-sysmex-900 mb-3 flex items-center justify-center border border-white/5 group-hover/item:border-neon-cyan/30 transition-colors">
                    <span className="text-4xl">📷</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                    {album.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{format(new Date(album.dateTaken), "d. M. yyyy", { locale: cs })}</span>
                    <span className="font-semibold">{album._count?.photos || 0} fotek</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">Zatím nejsou žádná alba.</div>
          )}
        </div>

      </div>
    </main>
  );
}