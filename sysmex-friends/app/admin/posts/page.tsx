import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminCreatePost, adminDeletePost } from "../_actions";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, slug: true, isFeatured: true, publishedAt: true },
  });

  // --- WRAPPERY PRO FIX TYPESCRIPTU ---
  // Tyto funkce "spolknou" návratovou hodnotu, aby byl formulář spokojený.
  
  async function handleCreatePost(formData: FormData) {
    "use server";
    await adminCreatePost(formData);
  }

  async function handleDeletePost(formData: FormData) {
    "use server";
    await adminDeletePost(formData);
  }
  // ------------------------------------

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin • Články</h1>
            <p className="text-gray-600 mt-2">Vytvoř nový článek nebo smaž existující.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="text-blue-600 font-semibold hover:underline">
              ← Admin
            </Link>
            <Link href="/clanky" className="text-blue-600 font-semibold hover:underline">
              Veřejné články →
            </Link>
          </div>
        </div>

        {/* Create */}
        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Nový článek</h2>
          {/* Použití wrapperu handleCreatePost */}
          <form action={handleCreatePost} className="mt-6 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Titulek</span>
                <input name="title" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2" placeholder="Např. Vítězný večer" />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Slug</span>
                <input name="slug" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2" placeholder="napr-vitezny-vecer" />
                <span className="text-xs text-gray-500">Pouze a-z, 0-9 a pomlčky, lowercase.</span>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Perex</span>
              <input name="excerpt" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2" placeholder="Krátké shrnutí článku…" />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Cover image URL (volitelné)</span>
              <input name="coverImageUrl" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2" placeholder="https://…" />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Obsah (Markdown)</span>
              <textarea name="content" required rows={10} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 font-mono" placeholder="# Nadpis\n\nText…" />
            </label>

            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="isFeatured" className="h-4 w-4" />
              <span className="text-sm font-semibold text-gray-700">Nastavit jako featured (Novinka na homepage)</span>
            </label>

            <button type="submit" className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
              Uložit
            </button>

            <p className="text-xs text-gray-500">
              Pozn.: Pokud nastavíš více featured článků, homepage vezme nejnovější.
            </p>
          </form>
        </section>

        {/* List */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Existující články</h2>

          {posts.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              Zatím tu není žádný článek.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {posts.map((p) => (
                <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="font-bold text-gray-900">
                        {p.title} {p.isFeatured ? <span className="text-xs ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-800">featured</span> : null}
                      </div>
                      <div className="text-sm text-gray-500">
                        /clanky/{p.slug}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/clanky/${p.slug}`} className="text-blue-600 font-semibold hover:underline">
                        Zobrazit
                      </Link>
                      {/* Použití wrapperu handleDeletePost */}
                      <form action={handleDeletePost}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="text-red-600 font-semibold hover:underline" type="submit">
                          Smazat
                        </button>
                      </form>
                    </div>
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