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

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* --- HERO SEKCE S BANNEREM --- */}
      <section className="relative w-full overflow-hidden border-b border-sysmex-900 bg-sysmex-900">
        
        {/* 1. Vrstva: Obrázek Banneru */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://res.cloudinary.com/gear-gaming/image/upload/v1767024968/ChatGPT_Image_29._12._2025_17_15_51_xxs857.png"
            alt="SYSMEX & Friends Banner"
            fill
            className="object-cover object-center opacity-90"
            priority
          />
          {/* 2. Vrstva: Tmavý gradient, aby byl text čitelný */}
          <div className="absolute inset-0 bg-gradient-to-b from-sysmex-900/80 via-sysmex-900/60 to-sysmex-900/90" />
        </div>

        {/* 3. Vrstva: Obsah */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
          {featuredPost ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-neon-cyan bg-sysmex-900/50 backdrop-blur-sm rounded-full border border-neon-cyan/30 shadow-neon-thin">
                🔥 Aktuálně
              </span>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg">
                {featuredPost.title}
              </h1>

              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href={`/clanky/${featuredPost.slug}`}
                  className="btn-readmore h-12 px-8 text-base shadow-glass-top hover:scale-105 transition-transform"
                >
                  Číst článek
                </Link>
                
                <Link
                  href="/clanky"
                  className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-white/20 bg-white/5 text-white font-bold backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition duration-200"
                >
                  Archiv článků
                </Link>
              </div>

              <p className="text-sm text-gray-400 font-medium">
                Publikováno{" "}
                {format(new Date(featuredPost.publishedAt), "d. MMMM yyyy", {
                  locale: cs,
                })}
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-700">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg">
                Vítejte v týmu
                <span className="block text-transparent bg-clip-text bg-gradient-neon mt-2">
                  SYSMEX & Friends
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mx-auto">
                Zatím tu není žádný hlavní článek, ale brzy se tu objeví novinky z našich kvízových bitev.
              </p>
              <Link
                href="/clanky"
                className="btn-readmore"
              >
                Přejít na články
              </Link>
            </div>
          )}
        </div>

        {/* Dekorativní linka dole */}
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-neon opacity-50" />
      </section>

      {/* --- SEKCE VÝSLEDKY (Zůstává na bílém, čistá) --- */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-4">
          <h2 className="text-3xl font-extrabold text-sysmex-900 tracking-tight">
            Poslední výsledky
          </h2>
          <Link
            href="/vysledky"
            className="text-sysmex-700 font-bold hover:text-neon-magenta transition-colors duration-200 mb-1"
          >
            Tabulka →
          </Link>
        </div>

        {latestResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center text-gray-500">
            Zatím nejsou zadané žádné výsledky.
          </div>
        ) : (
          <div className="space-y-5">
            {latestResults.map((r) => (
              <div
                key={r.id}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-scroll"
              >
                {/* Hover efekt - spodní linka */}
                <div className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-neon opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-neon-cyan/90 uppercase tracking-wide mb-1">
                      {format(new Date(r.date), "d. MMMM", { locale: cs })} • {r.season.name}
                    </div>
                    <div className="text-xl font-bold text-sysmex-900 group-hover:text-sysmex-700 transition-colors">
                      {r.venue} — {r.teamName}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                    <div className="text-center">
                      <span className="block text-xs text-gray-400 uppercase font-bold">Místo</span>
                      <span className={`block text-xl font-black ${
                        r.placement === 1 ? 'text-neon-gold drop-shadow-sm' : 
                        r.placement <= 3 ? 'text-sysmex-700' : 'text-gray-900'
                      }`}>
                        {r.placement}.
                      </span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="text-center">
                      <span className="block text-xs text-gray-400 uppercase font-bold">Body</span>
                      <span className="block text-xl font-black text-gray-900">
                        {r.score}
                      </span>
                    </div>
                  </div>
                </div>
                {r.note ? (
                  <p className="mt-4 text-sm text-gray-500 border-t border-gray-50 pt-3">
                    💡 {r.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}