import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminCreateResult, adminDeleteResult } from "../_actions";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  const [seasons, results] = await Promise.all([
    prisma.season.findMany({ orderBy: { startDate: "desc" }, select: { id: true, code: true, name: true } }),
    prisma.result.findMany({
      orderBy: { date: "desc" },
      take: 50,
      select: { id: true, date: true, venue: true, teamName: true, placement: true, score: true, note: true, season: { select: { code: true } } },
    }),
  ]);

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin • Výsledky</h1>
            <p className="text-gray-600 mt-2">Přidání výsledků do vybrané sezóny.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="text-blue-600 font-semibold hover:underline">
              ← Admin
            </Link>
            <Link href="/vysledky" className="text-blue-600 font-semibold hover:underline">
              Veřejné výsledky →
            </Link>
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Nový výsledek</h2>
          {seasons.length === 0 ? (
            <p className="mt-4 text-gray-600">Neexistuje žádná sezóna. Nejprve ji přidej přes seed nebo ručně v DB.</p>
          ) : (
            <form action={adminCreateResult} className="mt-6 grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Sezóna</span>
                <select name="seasonCode" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2">
                  {seasons.map((s) => (
                    <option key={s.id} value={s.code}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Datum</span>
                  <input type="date" name="date" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2" />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Místo</span>
                  <input name="venue" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2" placeholder="Např. Restaurace U Medvěda" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Tým</span>
                  <input name="teamName" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2" placeholder="SYSMEX & Friends" />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Poznámka (volitelné)</span>
                  <input name="note" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2" placeholder="Krátký komentář…" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Umístění</span>
                  <input type="number" name="placement" min={1} required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2" />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Skóre</span>
                  <input type="number" name="score" min={0} required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2" />
                </label>
              </div>

              <button type="submit" className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                Přidat
              </button>
            </form>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Posledních 50 výsledků</h2>

          {results.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              Zatím žádné výsledky.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {results.map((r) => (
                <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="font-bold text-gray-900">
                        {new Date(r.date).toLocaleDateString("cs-CZ")} — {r.venue}
                      </div>
                      <div className="text-sm text-gray-500">
                        {r.season.code} • {r.teamName} • umístění {r.placement} • skóre {r.score}
                      </div>
                      {r.note ? <p className="mt-2 text-gray-600">{r.note}</p> : null}
                    </div>
                    <form action={adminDeleteResult}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="text-red-600 font-semibold hover:underline" type="submit">
                        Smazat
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
