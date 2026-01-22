import Link from "next/link";
import Image from "next/image";
import { format, isToday, isTomorrow, differenceInDays } from "date-fns";
import { cs } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { getFeaturedPost } from "@/lib/queries/posts";
import { getLatestResults } from "@/lib/queries/results";
import { getAllPlaylists } from "@/lib/queries/playlists";
import { getActiveMembers } from "@/lib/queries/members";
import { getAlbums } from "@/lib/queries/albums";
import { getUpcomingEvents } from "@/lib/queries/events";
import { PlaylistCarousel } from "@/components/PlaylistCarousel";

export const revalidate = 60;

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string | null;
  isUpcoming: boolean;
  createdAt: string;
  updatedAt: string;
}

export default async function Home() {
  const [featuredPost, latestResults, allPlaylists, members, albums, upcomingEvents] = await Promise.all([
    getFeaturedPost(),
    getLatestResults(3),
    getAllPlaylists(),
    getActiveMembers(),
    getAlbums(),
    getUpcomingEvents(5),
  ]);

  const latestResult = latestResults[0]; 

  return (
    <main className="min-h-screen pt-36 md:pt-44 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">

        {/* 1. HERO BLOCK */}
        <div className="col-span-1 md:col-span-2 row-span-2 bento-card p-8 md:p-12 flex flex-col justify-center relative group overflow-hidden">
           {/* Background Image */}
           <Image
             src="https://res.cloudinary.com/gear-gaming/image/upload/v1767024968/ChatGPT_Image_29._12._2025_17_15_51_xxs857.png"
             alt="Tým Sysmex"
             fill
             className="object-cover opacity-50"
             priority
           />
           
           {/* Gradient blur overlay */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 blur-[100px] rounded-full group-hover:bg-neon-cyan/20 transition-all duration-700 z-[5]"></div>
           
           {/* Overlay shape pod text */}
           <div className="absolute inset-0 bg-sysmex-950 opacity-[0.55] z-10"></div>
           
           <div className="relative z-20 space-y-6">
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
             
             <p className="text-lg text-white font-bold max-w-md">
               Oficiální centrála našeho kvízového týmu. Statistiky, články a síně slávy na jednom místě.
             </p>

             <div className="flex flex-wrap gap-4 pt-4">
               <Link href="/clanky" className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform">
                 Číst novinky
               </Link>
               <Link href="/tym" className="px-6 py-3 rounded-xl bg-white/20 border-2 border-white/40 hover:bg-white/30 hover:border-white/60 font-bold text-white backdrop-blur-sm transition-all">
                 Poznat tým
               </Link>
             </div>
           </div>
        </div>

        {/* 2. PLAYLIST CAROUSEL */}
        {allPlaylists && allPlaylists.length > 0 && (
          <PlaylistCarousel playlists={allPlaylists} />
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
                 <Link href={`/clanky/${featuredPost.slug}`} className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all mt-2">
                    Číst dál <span>→</span>
                 </Link>
              </div>
              {featuredPost.coverImageUrl ? (
                <div className="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden border border-white/5">
                  <Image
                    src={featuredPost.coverImageUrl}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 192px"
                  />
                </div>
              ) : (
                <div className="w-full md:w-48 h-32 rounded-2xl bg-gradient-to-br from-sysmex-800 to-sysmex-900 flex items-center justify-center border border-white/5">
                  <span className="text-4xl">📝</span>
                </div>
              )}
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
              href="/tym"
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 font-semibold text-sm transition-colors"
            >
              Zobrazit všechny →
            </Link>
          </div>
          
          {members && members.length > 0 ? (
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
              {albums.slice(0, 4).map((album) => (
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

        {/* 7. CALENDAR CARD */}
        <div className="col-span-3 bento-card p-8 group hover:border-neon-gold/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-neon-gold" strokeWidth={2} />
                Kalendář
              </h2>
              <p className="text-gray-400 text-sm">Nadcházející termíny kvízů a akcí.</p>
            </div>
            <Link 
              href="/kalendar" 
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 font-semibold text-sm transition-colors"
            >
              Zobrazit všechny →
            </Link>
          </div>
          
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {upcomingEvents.map((event: Event, index: number) => {
                const eventDate = new Date(event.date);
                const isEventToday = isToday(eventDate);
                const isEventTomorrow = isTomorrow(eventDate);
                const daysUntil = differenceInDays(eventDate, new Date());
                
                return (
                  <div
                    key={event.id}
                    className={`rounded-lg p-4 transition-all border ${
                      index === 0 
                        ? "bg-neon-gold/10 border-neon-gold/50 hover:border-neon-gold/80" 
                        : "bg-white/5 border-white/5 hover:border-neon-gold/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-mono ${
                            index === 0 ? "text-neon-gold" : "text-gray-400"
                          }`}>
                            {format(eventDate, "d. M. yyyy", { locale: cs })}
                          </span>
                          <span className={`text-xs font-mono ${
                            index === 0 ? "text-neon-gold" : "text-gray-500"
                          }`}>
                            {format(eventDate, "HH:mm", { locale: cs })}
                          </span>
                        </div>
                        <h3 className={`text-lg font-bold mb-1 ${
                          index === 0 ? "text-white" : "text-white"
                        }`}>
                          {event.title}
                        </h3>
                        {event.venue && (
                          <p className="text-sm text-gray-400">{event.venue}</p>
                        )}
                      </div>
                      {(isEventToday || isEventTomorrow || daysUntil <= 7) && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          isEventToday 
                            ? "bg-neon-gold text-black" 
                            : isEventTomorrow
                            ? "bg-neon-cyan/20 text-neon-cyan"
                            : "bg-white/10 text-white"
                        }`}>
                          {isEventToday ? "Dnes" : isEventTomorrow ? "Zítra" : `Za ${daysUntil} dní`}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Calendar className="w-16 h-16 text-neon-gold/50 mx-auto mb-4" strokeWidth={1.5} />
              <p>Zatím nejsou naplánované žádné termíny.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}