"use client";

import Link from "next/link";
import Image from "next/image";
import { format, differenceInMonths } from "date-fns";
import { cs } from "date-fns/locale";
import { Rss, ChevronDown, Loader2 } from "lucide-react";
import { PostSummary } from "@/lib/types";
import { useState } from "react";
import { loadMorePosts } from "@/app/actions";

interface RecentPostsSidebarProps {
  initialPosts: PostSummary[];
  selectedSlug: string | null;
}

const LIMIT = 20;

export function RecentPostsSidebar({
  initialPosts,
  selectedSlug,
}: RecentPostsSidebarProps) {
  const [posts, setPosts] = useState<PostSummary[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= LIMIT);

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const newPosts = await loadMorePosts(posts.length, LIMIT);
      if (newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      if (newPosts.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="w-full lg:w-2/5 xl:w-1/3 bg-[#020617] border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto flex flex-col min-h-[280px] max-h-[50vh] sm:max-h-[60vh] lg:max-h-none lg:min-h-0 lg:h-auto shrink-0 z-10 shadow-2xl">
        <div className="sticky top-0 bg-[#020617]/95 backdrop-blur-sm z-10 px-4 py-4 sm:px-6 sm:py-5 border-b border-white/10 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 shrink-0 text-center sm:text-left">
          <h2 className="font-bold text-lg sm:text-xl text-white flex items-center justify-center sm:justify-start gap-2">
            <Rss className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan shrink-0" />
            <span>Aktuality</span>
          </h2>
          {posts.length > 0 && (
            <div className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {posts.length} článků
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto overscroll-contain max-w-sm mx-auto lg:max-w-none lg:mx-0">
          {posts.map((post) => {
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

          {posts.length === 0 && (
            <div className="py-8 text-center text-gray-500 text-sm">
              Zatím žádné aktuality.
            </div>
          )}
        </div>

        {hasMore && (
          <div className="p-4 sm:p-6 text-center shrink-0">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoading}
              className="text-sm font-semibold text-neon-cyan hover:text-white hover:underline flex items-center justify-center gap-2 mx-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Načítání...</span>
                  </>
              ) : (
                  <>
                    <span>Načíst další</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
              )}
            </button>
          </div>
        )}
      </aside>
  );
}
