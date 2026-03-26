import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { ThumbsUp, Share2 } from "lucide-react";
import { getPostBySlug, getRecentPosts, getFeaturedPost } from "@/lib/queries/posts";
import { Post } from "@/lib/types";
import { RecentPostsSidebar } from "@/components/RecentPostsSidebar";

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
      <RecentPostsSidebar
        initialPosts={recentPosts}
        selectedSlug={selectedSlug}
      />
    </main>
  );
}
