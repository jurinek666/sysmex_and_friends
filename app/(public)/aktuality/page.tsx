import Link from "next/link";
import Image from "next/image";
import { format, differenceInMonths } from "date-fns";
import { cs } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { ThumbsUp, Share2, Rss, ChevronDown } from "lucide-react";
import { getPostBySlug, getRecentPosts, getFeaturedPost } from "@/lib/queries/posts";
import { Post } from "@/lib/types";

export const revalidate = 60;

function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function AktualityPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;
  const [recentPosts, featuredPost] = await Promise.all([
    getRecentPosts(20),
    getFeaturedPost(),
  ]);

  const targetSlug =
    slug ?? featuredPost?.slug ?? recentPosts[0]?.slug ?? null;

  // Optimization: If the target slug matches the featured post (which we already have),
  // reuse it to avoid an extra database call.
  let selectedPost: Post | null = null;
  if (targetSlug) {
    if (featuredPost && featuredPost.slug === targetSlug) {
      selectedPost = featuredPost;
    } else {
      selectedPost = await getPostBySlug(targetSlug);
    }
  }
  const selectedSlug = selectedPost?.slug ?? null;

  return (
    <main className="min-h-screen pt-20 sm:pt-24 md:pt-28 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
      {/* Hlavní oblast */}
      <section className="lg:flex-1 lg:min-w-0 overflow-x-hidden lg:overflow-y-auto bg-sysmex-950 relative w-full lg:w-3/5 xl:w-2/3 shrink-0 lg:shrink">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-sysmex-700/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="w-full max-w-full mx-auto px-4 py-6 sm:px-6 sm:py-8 md:py-10 lg:px-12 lg:py-16 relative z-10 text-center lg:text-left">
          {selectedPost ? (
            <>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-sysmex-800/50 text-neon-cyan border border-sysmex-700/50">
                  Novinky
                </span>
                <span className="text-gray-400 text-xs sm:text-sm font-medium">
                  {format(new Date(selectedPost.publishedAt), "d. MMMM yyyy", {
                    locale: cs,
                  })}
                </span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-gray-400 text-xs sm:text-sm font-medium">
                  {estimateReadingMinutes(selectedPost.content)} min čtení
                </span>
              </div>

              <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-6 sm:mb-8 text-white">
                {selectedPost.title}
              </h1>

              {selectedPost.coverImageUrl && (
                <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-10 shadow-2xl shadow-black/50 border border-white/5 group relative -mx-4 sm:mx-0">
                  <Image
                    src={selectedPost.coverImageUrl}
                    alt={selectedPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 896px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              <div className="prose prose-base sm:prose-lg prose-invert max-w-full overflow-hidden text-slate-300 break-words
                prose-headings:text-white prose-headings:font-bold
                prose-a:text-neon-cyan prose-a:no-underline hover:prose-a:underline prose-a:break-all
                prose-strong:text-neon-gold
                prose-blockquote:border-l-neon-cyan prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:pr-4
                prose-img:max-w-full prose-img:h-auto prose-img:mx-auto
                prose-pre:overflow-x-auto prose-pre:max-w-full prose-pre:mx-auto lg:prose-pre:mx-0
                text-center lg:text-left
              ">
                <p className="lead font-medium text-base sm:text-lg md:text-xl text-white mb-4 sm:mb-6">
                  {selectedPost.excerpt}
                </p>
                <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
              </div>

              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between items-center gap-4">
                <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6">
                  <button
                    type="button"
                    className="flex items-center gap-2 py-2 min-h-[44px] text-gray-400 hover:text-neon-cyan active:text-neon-cyan transition-colors touch-manipulation"
                  >
                    <ThumbsUp className="w-5 h-5 shrink-0" />
                    <span className="text-sm sm:text-base">To se mi líbí</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 py-2 min-h-[44px] text-gray-400 hover:text-neon-cyan active:text-neon-cyan transition-colors touch-manipulation"
                  >
                    <Share2 className="w-5 h-5 shrink-0" />
                    <span className="text-sm sm:text-base">Sdílet</span>
                  </button>
                </div>
                <Link
                  href="/"
                  className="py-2 min-h-[44px] flex items-center text-neon-cyan hover:text-white hover:underline active:text-white font-medium transition-colors touch-manipulation"
                >
                  ← Zpět na hlavní stránku
                </Link>
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 text-lg">
                Zatím žádné publikované články.
              </p>
              <Link
                href="/"
                className="inline-block mt-4 text-neon-cyan hover:underline"
              >
                ← Zpět na úvod
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Sidebar – seznam aktualit */}
      <aside className="w-full lg:w-2/5 xl:w-1/3 bg-[#020617] border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto flex flex-col min-h-[280px] max-h-[50vh] sm:max-h-[60vh] lg:max-h-none lg:min-h-0 lg:h-auto shrink-0 z-10 shadow-2xl">
        <div className="sticky top-0 bg-[#020617]/95 backdrop-blur-sm z-10 px-4 py-4 sm:px-6 sm:py-5 border-b border-white/10 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 shrink-0 text-center sm:text-left">
          <h2 className="font-bold text-lg sm:text-xl text-white flex items-center justify-center sm:justify-start gap-2">
            <Rss className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan shrink-0" />
            <span>Aktuality</span>
          </h2>
          {recentPosts.length > 0 && (
            <div className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {recentPosts.length} článků
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto overscroll-contain max-w-sm mx-auto lg:max-w-none lg:mx-0">
          {recentPosts.map((post) => {
            const isSelected = post.slug === selectedSlug;
            const isOld =
              differenceInMonths(new Date(), new Date(post.publishedAt)) >= 1;

            return (
              <Link
                key={post.id}
                href={`/aktuality?slug=${post.slug}`}
                className={`block group ${
                  isSelected ? "relative" : ""
                }`}
              >
                {isSelected && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sysmex-700 to-neon-cyan rounded-2xl opacity-75 blur" />
                )}
                <article
                  className={`relative flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl shadow-sm border transition-all active:scale-[0.99] touch-manipulation min-h-[72px] ${
                    isSelected
                      ? "bg-sysmex-900 border-white/5"
                      : "bg-sysmex-900/80 border-white/5 hover:bg-sysmex-900 hover:border-neon-cyan/30 active:bg-sysmex-900"
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shrink-0 rounded-lg overflow-hidden bg-slate-800">
                    {post.coverImageUrl ? (
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        width={96}
                        height={96}
                        sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-active:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-gray-500">
                        📰
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    {isSelected && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                        <span className="text-xs font-bold text-neon-cyan uppercase">
                          Právě čtete
                        </span>
                      </div>
                    )}
                    {isOld && !isSelected && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          ARCHIV
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(post.publishedAt), "MMMM yyyy", {
                            locale: cs,
                          })}
                        </span>
                      </div>
                    )}
                    {!isSelected && !isOld && (
                      <div className="text-xs text-gray-400 mb-1">
                        {format(new Date(post.publishedAt), "d. MMMM yyyy", {
                          locale: cs,
                        })}
                      </div>
                    )}
                    <h3 className="font-bold text-sm sm:text-base text-white leading-tight mb-0.5 sm:mb-1 group-hover:text-neon-cyan group-active:text-neon-cyan transition-colors line-clamp-2 sm:line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })}

          {recentPosts.length === 0 && (
            <div className="py-8 text-center text-gray-500 text-sm">
              Zatím žádné aktuality.
            </div>
          )}
        </div>

        {recentPosts.length >= 20 && (
          <div className="p-4 sm:p-6 text-center shrink-0">
            <button
              type="button"
              className="text-sm font-semibold text-neon-cyan hover:text-white hover:underline flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <span>Načíst další</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </main>
  );
}
