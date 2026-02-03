import Link from "next/link";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { BarChart3 } from "lucide-react";
import { getResultsBySeasonCode, getSeasons } from "@/lib/queries/results";

export const revalidate = 60;

function getPlacementBadgeClass(placement: number) {
  if (placement === 1) return "bg-[#F1C84B] text-black shadow-[0_0_15px_rgba(241,200,75,0.5)]";
  if (placement === 2) return "bg-[#B9C0CC] text-black";
  if (placement === 3) return "bg-[#C46B2C] text-black";
  return "bg-slate-700 text-white";
}

function teamNameToPills(teamName: string) {
  const trimmed = (teamName || "").trim();
  if (!trimmed) return [];
  return trimmed.split(/,\s*/).map((s) => s.trim()).filter(Boolean);
}

export default async function VysledkyPage() {
  const [seasons, allResults] = await Promise.all([
    getSeasons(),
    getResultsBySeasonCode(),
  ]);

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
            Cesta za vítězstvím je dlážděná vědomostmi, pivem a občas i čistým štěstím.
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
                <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              </div>

              <div className="space-y-6">
                {seasonGroup.results.map((r: typeof seasonGroup.results[number]) => {
                  const participants = "participants" in r && Array.isArray(r.participants) && r.participants.length > 0
                    ? (r.participants as { displayName: string }[]).map((p) => p.displayName)
                    : teamNameToPills(r.teamName);
                  return (
                    <div
                      key={r.id}
                      className="group bento-card p-6 border border-white/10 hover:border-neon-cyan/30 transition-all duration-300"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-3 flex items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-xs uppercase font-bold text-gray-400">Datum</span>
                            <span className="text-lg font-bold text-white">
                              {format(new Date(r.date), "d. M. yyyy", { locale: cs })}
                            </span>
                          </div>
                          <div
                            className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 min-w-[70px] ${getPlacementBadgeClass(r.placement)}`}
                          >
                            <span className="text-[10px] uppercase font-black opacity-80 leading-none">Místo</span>
                            <span className="text-2xl font-black leading-none">{r.placement}.</span>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="flex flex-col">
                            <span className="text-xs uppercase font-bold text-gray-400">Celkem bodů</span>
                            <span className="text-2xl font-black text-neon-cyan">{r.score}</span>
                          </div>
                        </div>
                        <div className="md:col-span-5">
                          <span className="text-xs uppercase font-bold text-gray-400 block mb-2">Sestava dne</span>
                          <div className="flex flex-wrap gap-2">
                            {participants.length > 0 ? (
                              participants.map((name, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold border border-white/10 text-gray-300"
                                >
                                  {name}
                                </span>
                              ))
                            ) : (
                              <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold border border-white/10 text-gray-400">
                                {r.teamName || "–"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                          <button
                            type="button"
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all group-hover:scale-110 border border-white/10"
                            aria-label="Statistiky"
                          >
                            <BarChart3 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
