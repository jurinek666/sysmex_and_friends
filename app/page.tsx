import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getFeaturedPost } from "@/lib/queries/posts";
import { getLatestResults } from "@/lib/queries/results";

export const revalidate = 60;

export default async function Home() {
  const [featuredPost, latestResults] = await Promise.all([
    getFeaturedPost(),
    getLatestResults(3),
  ]);

  const latestResult = latestResults[0]; // Vezmeme jen nejnovější výsledek pro dashboard

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* BENTO GRID LAYOUT */}
      {/* Grid: Mobile 1 sloupce, Tablet 2, Desktop 3 nebo 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">

        {/* 1. HERO BLOCK (Velký text) - Span 2 sloupce */}
        <div className="col-span-1 md:col-span-2 row-span-2 bento-card p-8 md:p-12 flex flex-col justify-center relative group">
           {/* Ambientní záře na pozadí */}
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
               <Link href="/clanky" className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform">
                 Číst novinky
               </Link>
               <Link href="/tym" className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 font-semibold transition-colors">
                 Poznat tým
               </Link>
             </div>
           </div>
        </div>

        {/* 2. STAT CARD (Poslední výsledek) - Span 1 */}
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

        {/* 3. VISUAL CARD (Banner týmu) - Span 1, ale vysoká */}
        <div className="col-span-1 row-span-2 bento-card relative group min-h-[300px]">
           <Image
             src="https://res.cloudinary.com/gear-gaming/image/upload/v1767024968/ChatGPT_Image_29._12._2025_17_15_51_xxs857.png"
             alt="Tým Sysmex"
             fill
             className="object-cover transition-transform duration-700 group-hover:scale-110"
           />
           {/* Gradient overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-sysmex-950 via-transparent to-transparent opacity-80"></div>
           
           <div className="absolute bottom-0 left-0 p-6">
             <h3 className="text-white font-bold text-xl">Náš Tým</h3>
             <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
               Společně bojujeme o každou správnou odpověď.
             </p>
           </div>
        </div>

        {/* 4. FEATURED POST (Novinka) - Span 2 */}
        <div className="col-span-1 md:col-span-2 bento-card p-8 flex flex-col md:flex-row gap-8 items-center group hover:border-neon-magenta/50">
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
              {/* Zde by mohl být náhledový obrázek článku, kdybychom ho měli v DB */}
              <div className="w-full md:w-48 h-32 rounded-2xl bg-gradient-to-br from-sysmex-800 to-sysmex-900 flex items-center justify-center border border-white/5">
                 <span className="text-4xl">📝</span>
              </div>
            </>
          ) : (
             <div className="text-gray-500">Zatím žádný zvýrazněný článek.</div>
          )}
        </div>

      </div>
    </main>
  );
}