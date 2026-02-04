"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface PostItem {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
}

interface PostsCarouselProps {
  posts: PostItem[];
}

const AUTOPLAY_MS = 7000;

export function PostsCarousel({ posts }: PostsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const safePosts = useMemo(() => posts ?? [], [posts]);

  useEffect(() => {
    if (safePosts.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safePosts.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(interval);
  }, [safePosts.length]);

  if (!safePosts.length) {
    return (
      <div className="bento-card p-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Aktuality</h2>
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Novinky</span>
        </div>
        <div className="text-gray-500 text-sm italic">Zatím žádné články.</div>
      </div>
    );
  }

  const currentPost = safePosts[currentIndex];
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < safePosts.length - 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      if (prev < safePosts.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  };

  return (
    <div className="bento-card px-5 py-6 md:px-12 md:py-8 flex flex-col gap-6 relative overflow-hidden group hover:border-neon-cyan/50">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Aktuality</h2>
        <div className="flex items-center gap-3">
          {safePosts.length > 1 && (
            <span className="text-xs text-gray-500 font-mono">
              {currentIndex + 1} / {safePosts.length}
            </span>
          )}
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Novinky</span>
        </div>
      </div>

      {safePosts.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!canGoLeft}
            className={`hidden md:block absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 backdrop-blur-md border-2 border-white/30 hover:bg-black/90 transition-all shadow-lg ${
              canGoLeft
                ? "text-white hover:text-neon-cyan hover:border-neon-cyan cursor-pointer hover:scale-110"
                : "text-gray-600 cursor-not-allowed opacity-50"
            }`}
            aria-label="Předchozí článek"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            disabled={!canGoRight}
            className={`hidden md:block absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 backdrop-blur-md border-2 border-white/30 hover:bg-black/90 transition-all shadow-lg ${
              canGoRight
                ? "text-white hover:text-neon-cyan hover:border-neon-cyan cursor-pointer hover:scale-110"
                : "text-gray-600 cursor-not-allowed opacity-50"
            }`}
            aria-label="Další článek"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div className="relative px-0 md:px-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPost.slug}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6 items-center"
          >
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {currentPost.title}
              </h3>
              {currentPost.excerpt ? (
                <p className="text-gray-400 text-sm md:text-base line-clamp-3">
                  {currentPost.excerpt}
                </p>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Krátké shrnutí se připravuje.
                </p>
              )}
              <Link
                href={`/clanky/${currentPost.slug}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform"
              >
                ČTI DÁLE...
              </Link>
            </div>

            <div className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-sysmex-800 to-sysmex-900">
              {currentPost.coverImageUrl ? (
                <Image
                  src={currentPost.coverImageUrl}
                  alt={currentPost.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  📰
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {safePosts.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {safePosts.map((_, index) => (
            <button
              key={`post-dot-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-neon-cyan"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Přejít na článek ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
