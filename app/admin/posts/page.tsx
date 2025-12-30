import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminCreatePost, adminDeletePost } from "../_actions";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin • Články</h1>

      {/* Formulář */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Nový článek</h2>
        <form action={adminCreatePost} className="space-y-4">
          <input name="title" placeholder="Nadpis" required className="w-full p-2 border rounded" />
          <input name="slug" placeholder="slug-url-adresy" required className="w-full p-2 border rounded font-mono text-sm" />
          <textarea name="excerpt" placeholder="Krátký úvod (perex)" required rows={3} className="w-full p-2 border rounded" />
          
          {/* Markdown nápověda */}
          <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 space-y-1">
            <p className="font-bold">Formátování textu (Markdown):</p>
            <ul className="grid grid-cols-2 gap-2">
              <li><code># Nadpis 1</code>, <code>## Nadpis 2</code></li>
              <li><code>**Tučný text**</code></li>
              <li><code>*Kurzíva*</code></li>
              <li><code>- Odrážka seznamu</code></li>
              <li><code>[Text odkazu](https://...)</code></li>
            </ul>
          </div>
          
          <textarea name="content" placeholder="Hlavní text článku..." required rows={10} className="w-full p-2 border rounded font-mono" />
          <input name="coverImageUrl" placeholder="URL úvodního obrázku (volitelné)" className="w-full p-2 border rounded" />
          
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" className="w-4 h-4" />
            <span className="text-sm">Hlavní článek (Featured)</span>
          </label>

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">Publikovat</button>
        </form>
      </section>

      {/* Seznam */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-xl bg-white flex justify-between items-center">
            <div>
              <div className="font-bold">{post.title}</div>
              <div className="text-xs text-gray-500">/{post.slug}</div>
            </div>
            <form action={adminDeletePost}>
              <input type="hidden" name="id" value={post.id} />
              <button className="text-red-600 hover:underline text-sm font-semibold">Smazat</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}