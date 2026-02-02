import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getRecentPosts } from "@/lib/queries/posts";

export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getRecentPosts(100);

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Články a aktuality
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Sledujte nejnovější dění v našem týmu, reporty ze závodů a zajímavosti ze světa motorsportu.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/clanky/${post.slug}`}
              className="group flex flex-col h-full bg-sysmex-900/20 border border-white/5 hover:border-neon-cyan/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(0,255,255,0.15)]"
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-64 overflow-hidden">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                    <span className="text-4xl">🏁</span>
                  </div>
                )}

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white">
                  {format(new Date(post.publishedAt), "d. MMMM yyyy", { locale: cs })}
                </div>

                {/* Featured Badge */}
                {post.isFeatured && (
                  <div className="absolute top-4 right-4 bg-neon-magenta/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg shadow-neon-magenta/20">
                    FEATURED
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-6">
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-400 line-clamp-3 mb-6 flex-grow">
                  {post.excerpt}
                </p>

                <div className="flex items-center text-neon-cyan font-bold text-sm uppercase tracking-wider">
                  Číst více
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 bg-sysmex-900/20 rounded-2xl border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-2">Zatím zde nejsou žádné články</h3>
            <p className="text-gray-400">Brzy přidáme nové aktuality ze světa závodění.</p>
          </div>
        )}
      </div>
    </main>
  );
}
