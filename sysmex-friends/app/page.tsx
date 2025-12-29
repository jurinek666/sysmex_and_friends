import Link from "next/link";
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
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* --- HERO SEKCE (Hlavní článek) --- */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          {featuredPost ? (
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                🔥 Novinka
              </span>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                {featuredPost.title}
              </h1>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center justify-center gap-3">
                <Link
                  href={`/clanky/${featuredPost.slug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition"
                >
                  Čti více
                </Link>
                <Link
                  href="/clanky"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-900 font-semibold hover:bg-gray-50 transition"
                >
                  Všechny články
                </Link>
              </div>

              <p className="text-sm text-gray-500">
                Publikováno{" "}
                {format(new Date(featuredPost.publishedAt), "d. MMMM yyyy", {
                  locale: cs,
                })}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                SYSMEX & Friends
              </h1>
              <p className="text-lg text-gray-600">
                Zatím tu není žádný zvýrazněný článek. Přidej první novinku do databáze.
              </p>
              <Link
                href="/clanky"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition"
              >
                Přejít na články
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* --- SEKCE VÝSLEDKY --- */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Poslední výsledky</h2>
          <Link
            href="/vysledky"
            className="text-blue-600 font-semibold hover:underline"
          >
            Zobrazit vše →
          </Link>
        </div>

        {latestResults.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
            Zatím nejsou žádné výsledky.
          </div>
        ) : (
          <div className="space-y-4">
            {latestResults.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
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
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
