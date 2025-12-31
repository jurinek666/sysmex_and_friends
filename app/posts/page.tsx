import Link from "next/link";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getRecentPosts } from "@/lib/queries/posts";

export const revalidate = 60;

export default async function PostsPage() {
  const posts = await getRecentPosts(50);

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* HLAVIČKA SEKCE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            KRONIKA <span className="text-neon-cyan">TÝMU</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Reporty ze zápasů, analýzy proher a legendární momenty, které se (ne)staly.
          </p>
        </div>
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Zpět na základnu
        </Link>
      </div>

      {/* GRID ČLÁNKŮ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full bento-card p-12 text-center border-dashed border-gray-700">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white">Zatím žádné záznamy</h3>
            <p className="text-gray-500 mt-2">Náš kronikář asi zaspal. Zkus to později.</p>
          </div>
        ) : (
          posts.map((p) => (
            <Link
              key={p.id}
              href={`/posts/${p.slug}`}
              className="bento-card group flex flex-col h-full p-6 no-underline"
            >
              {/* Datum a Tag */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-neon-cyan/80 uppercase tracking-wider bg-neon-cyan/10 px-2 py-1 rounded">
                  {format(new Date(p.publishedAt), "d. MMM yyyy", { locale: cs })}
                </span>
                {p.isFeatured && (
                  <span className="text-xs font-bold text-neon-magenta animate-pulse">
                    ★ TOP
                  </span>
                )}
              </div>

              {/* Titulek */}
              <h2 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-neon-cyan transition-colors">
                {p.title}
              </h2>

              {/* Perex */}
              <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                {p.excerpt}
              </p>

              {/* Patička karty */}
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Číst záznam</span>
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-neon-cyan group-hover:text-black transition-all">
                  →
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}