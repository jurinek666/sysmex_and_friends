import Link from "next/link";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getResultsBySeasonCode, getSeasons } from "@/lib/queries/results";

export const revalidate = 60;

export default async function VysledkyPage({
  searchParams,
}: {
  searchParams?: { season?: string };
}) {
  const seasonCode = searchParams?.season;
  const [seasons, results] = await Promise.all([
    getSeasons(),
    getResultsBySeasonCode(seasonCode),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Výsledky</h1>
            <p className="mt-2 text-gray-600">Přehled soutěžních výsledků.</p>
          </div>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            ← Zpět na úvod
          </Link>
        </div>

        {/* Filtr sezóny */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/vysledky"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              !seasonCode
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            }`}
          >
            Vše
          </Link>

          {seasons.map((s) => (
            <Link
              key={s.id}
              href={`/vysledky?season=${encodeURIComponent(s.code)}`}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                seasonCode === s.code
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
              }`}
            >
              {s.name}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-4">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              Zatím nejsou žádné výsledky.
            </div>
          ) : (
            results.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(r.date), "d. MMMM yyyy", { locale: cs })} •{" "}
                      {r.season.name}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {r.venue} — {r.teamName}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Umístění:</span>{" "}
                      <span className="font-semibold">{r.placement}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Skóre:</span>{" "}
                      <span className="font-semibold">{r.score}</span>
                    </div>
                  </div>
                </div>
                {r.note ? <p className="mt-3 text-gray-600">{r.note}</p> : null}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
