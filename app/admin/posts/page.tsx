import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { adminCreatePost, adminDeletePost } from "../_actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

// Definujeme typ pro článek podle databáze
interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
}

export default async function AdminPostsPage() {
  const supabase = await createClient();
  
  // Nahrazeno prisma.post.findMany(...)
  const { data: posts } = await supabase
    .from("Post")
    .select("*")
    .order("createdAt", { ascending: false });

  // Převedeme na náš typ a zajistíme, že to není null
  const safePosts = (posts || []) as Post[];

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na nástěnku
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Admin • Články</h1>

      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Nový článek</h2>
        <form action={adminCreatePost} className="space-y-4">
          <input name="title" placeholder="Nadpis" required className="w-full p-3 border rounded-xl" />
          <input name="slug" placeholder="slug-url-adresy" required className="w-full p-3 border rounded-xl font-mono text-sm bg-gray-50" />
          <textarea name="excerpt" placeholder="Krátký úvod (perex)" required rows={3} className="w-full p-3 border rounded-xl" />
          
          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 space-y-1">
            <p className="font-bold mb-2">💡 Formátování textu (Markdown):</p>
            <ul className="grid grid-cols-2 gap-2">
              <li><code># Nadpis 1</code></li>
              <li><code>## Nadpis 2</code></li>
              <li><code>**Tučný text**</code></li>
              <li><code>*Kurzíva*</code></li>
              <li><code>- Odrážka</code></li>
              <li><code>[Text](https://...)</code></li>
            </ul>
          </div>
          
          <textarea name="content" placeholder="Hlavní text článku..." required rows={10} className="w-full p-3 border rounded-xl font-mono text-sm" />
          <input name="coverImageUrl" placeholder="URL úvodního obrázku (volitelné)" className="w-full p-3 border rounded-xl" />
          
          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
            <input type="checkbox" name="isFeatured" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
            <span className="font-medium">Hlavní článek (zobrazit velký na úvodu)</span>
          </label>

          <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium transition-colors">Publikovat článek</button>
        </form>
      </section>

      <div className="space-y-4">
        {safePosts.map((post) => (
          <div key={post.id} className="border p-5 rounded-2xl bg-white flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="font-bold text-lg mb-1">{post.title}</div>
              <div className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-2 py-1 rounded">/{post.slug}</div>
              {post.isFeatured && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">★ Featured</span>}
            </div>
            <form action={adminDeletePost}>
              <input type="hidden" name="id" value={post.id} />
              <button className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">Smazat</button>
            </form>
          </div>
        ))}
        {safePosts.length === 0 && <div className="text-center text-gray-400 py-12">Zatím žádné články.</div>}
      </div>
    </div>
  );
}