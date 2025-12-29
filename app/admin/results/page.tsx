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

  // --- WRAPPERY PRO FIX TYPESCRIPTU ---
  async function handleCreateResult(formData: FormData) {
    "use server";
    await adminCreateResult(formData);
  }

  async function handleDeleteResult(formData: FormData) {
    "use server";
    await adminDeleteResult(formData);
  }
  // ------------------------------------

  return (
    <main className="min-h-screen bg-white pb-20 text-gray-900">
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
              Veřejná tabulka →
            </Link>
          </div>
        </div>

        {/* Create Form */}
        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Nový výsledek</h2>
          <form action={handleCreateResult} className="mt-6 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Datum</span>
                <input
                  name="date"
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Sezóna</span>
                <select
                  name="seasonId"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white px-3 py-2"
                >
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Místo konání (Hospoda)</span>
                <input
                  name="venue"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Název týmu</span>
                <input
                  name="teamName"
                  type="text"
                  defaultValue="SYSMEX"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white px-3 py-2"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Umístění (číslo)</span>
                <input
                  name="placement"
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Skóre (číslo, volitelné)</span>
                <input
                  name="score"
                  type="number"
                  step="0.5"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white px-3 py-2"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Poznámka (volitelné)</span>
              <input
                name="note"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white px-3 py-2"
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Uložit výsledek
            </button>
          </form>
        </section>

        {/* Results List */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Posledních 50 výsledků</h2>

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
                    <form action={handleDeleteResult}>
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