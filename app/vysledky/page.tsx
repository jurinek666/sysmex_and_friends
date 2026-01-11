import Link from "next/link";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getResultsBySeasonCode, getSeasons } from "@/lib/queries/results";

export const revalidate = 60;

export default async function VysledkyPage() {
  const [seasons, allResults] = await Promise.all([
    getSeasons(),
    getResultsBySeasonCode(),
  ]);

  // Group results by season
  const seasonsData = seasons.map((season) => ({
    season,
    results: allResults.filter((r) => r.season.id === season.id),
  }));

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* HLAVIČKA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            TABULKA <span className="text-neon-cyan">VÝSLEDKŮ</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Historie našich bitev. Vítězství, prohry a všechno mezi tím.
          </p>
        </div>
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Zpět na základnu
        </Link>
      </div>

      <div className="space-y-16">
        {seasonsData.length === 0 ? (
          <div className="bento-card p-12 text-center text-gray-500">
            Zatím nejsou zadané žádné výsledky.
          </div>
        ) : (
          seasonsData.map((seasonGroup: typeof seasonsData[number]) => (
            <section key={seasonGroup.season.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                  {seasonGroup.season.name}
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></span>
              </div>

              <div className="bento-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-sysmex-900/50 text-xs uppercase tracking-wider text-gray-400">
                        <th className="p-4 font-semibold">Datum</th>
                        <th className="p-4 font-semibold">Místo konání</th>
                        <th className="p-4 font-semibold">Tým</th>
                        <th className="p-4 font-semibold text-center">Umístění</th>
                        <th className="p-4 font-semibold text-right">Skóre</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {seasonGroup.results.map((r: typeof seasonGroup.results[number]) => (
                        <tr 
                          key={r.id} 
                          className="group hover:bg-white/5 transition-colors duration-200"
                        >
                          <td className="p-4 text-gray-300 font-mono text-sm whitespace-nowrap">
                            {format(new Date(r.date), "d. M. yyyy", { locale: cs })}
                          </td>
                          <td className="p-4 text-white font-medium">
                            {r.venue}
                            {r.note && (
                              <span className="ml-2 inline-block w-2 h-2 rounded-full bg-neon-cyan/50" title={r.note} />
                            )}
                          </td>
                          <td className="p-4 text-gray-400 text-sm">
                            {r.teamName}
                          </td>
                          <td className="p-4 text-center">
                            <span 
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                                ${r.placement === 1 ? 'bg-neon-gold text-black shadow-[0_0_15px_rgba(251,217,134,0.4)]' : 
                                  r.placement === 2 ? 'bg-gray-300 text-black' :
                                  r.placement === 3 ? 'bg-orange-300 text-black' :
                                  'text-gray-500 bg-white/5'}
                              `}
                            >
                              {r.placement}.
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono text-neon-cyan font-bold">
                            {r.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
