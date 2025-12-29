import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

export const revalidate = 60; // Přegenerovat stránku maximálně jednou za minutu (ISR)

export default async function Home() {
  // 1. Načtení hlavního článku (ten, co má isFeatured: true)
  const featuredPost = await prisma.post.findFirst({
    where: { isFeatured: true },
    orderBy: { publishedAt: "desc" },
  });

  // 2. Načtení 3 posledních výsledků
  const latestResults = await prisma.result.findMany({
    take: 3,
    orderBy: { date: "desc" },
    include: { season: true }, // Připojíme i info o sezóně, kdyby bylo třeba
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* --- HERO SEKCE (Hlavní článek) --- */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          {featuredPost ? (
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                🔥 Novinka
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                {featuredPost.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="pt-4">
                <Link
                  href={`/clanky/${featuredPost.slug}`}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  Číst celý článek
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">
              Zatím tu není žádný hlavní článek.
            </div>
          )}
        </div>
      </section>

      {/* --- VÝSLEDKY --- */}
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            📊 Poslední výsledky
          </h2>
          <Link
            href="/vysledky"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Zobrazit vše &rarr;
          </Link>
        </div>

        <div className="grid gap-4">
          {latestResults.map((result) => (
            <div
              key={result.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="mb-4 md:mb-0">
                <div className="text-sm text-gray-500 mb-1">
                  {format(new Date(result.date), "d. MMMM yyyy", {
                    locale: cs,
                  })} • {result.venue}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {result.teamName}
                </h3>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Umístění
                  </div>
                  <div className={`text-2xl font-black ${
                    result.placement === 1 ? 'text-yellow-500' :
                    result.placement === 2 ? 'text-gray-400' :
                    result.placement === 3 ? 'text-amber-700' : 'text-gray-900'
                  }`}>
                    {result.placement}.
                  </div>
                </div>
                
                <div className="text-center px-6 border-l border-gray-100">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Body
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.score}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {latestResults.length === 0 && (
            <p className="text-gray-500 text-center py-10">
              Zatím žádné výsledky k zobrazení.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}