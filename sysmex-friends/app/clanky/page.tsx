import Link from "next/link";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getRecentPosts } from "@/lib/queries/posts";

export const revalidate = 60;

export default async function ClankyPage() {
  const posts = await getRecentPosts(50);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Články</h1>
            <p className="mt-2 text-gray-600">
              Novinky, reporty a další informace.
            </p>
          </div>
          <Link
            href="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Zpět na úvod
          </Link>
        </div>

        <div className="mt-10 grid gap-4">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              Zatím nejsou žádné články.
            </div>
          ) : (
            posts.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      <Link href={`/clanky/${p.slug}`} className="hover:underline">
                        {p.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-gray-600">{p.excerpt}</p>
                    <p className="mt-3 text-sm text-gray-500">
                      {format(new Date(p.publishedAt), "d. MMMM yyyy", {
                        locale: cs,
                      })}
                      {p.isFeatured ? " • 🔥 zvýrazněno" : ""}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Link
                      href={`/clanky/${p.slug}`}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
                    >
                      Čti více
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
