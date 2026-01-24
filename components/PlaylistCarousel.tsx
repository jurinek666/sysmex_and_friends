"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Playlist {
  id: string;
  title: string;
  description: string | null;
  spotifyUrl: string;
  isActive: boolean;
  createdAt: string;
}

interface PlaylistCarouselProps {
  playlists: Playlist[];
}

export function PlaylistCarousel({ playlists }: PlaylistCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!playlists || playlists.length === 0) {
    return (
      <div className="bento-card p-6 flex flex-col group hover:border-neon-cyan/50">
        <div className="flex justify-between items-start mb-4">
          <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Playlist</div>
          <div className="text-2xl">🎵</div>
        </div>
        <div className="text-gray-500 text-sm italic p-4 text-center">
          Zatím nejsou žádné playlisty.
        </div>
      </div>
    );
  }

  const currentPlaylist = playlists[currentIndex];
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < playlists.length - 1;

  const goToPrevious = () => {
    if (canGoLeft) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (canGoRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="bento-card p-0 group hover:border-neon-cyan/50 relative overflow-hidden">

      {/* Navigation Arrows */}
      {playlists.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!canGoLeft}
            className={`absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 backdrop-blur-md border-2 border-white/30 hover:bg-black/90 transition-all shadow-lg ${
              canGoLeft
                ? "text-white hover:text-neon-cyan hover:border-neon-cyan cursor-pointer hover:scale-110"
                : "text-gray-600 cursor-not-allowed opacity-50"
            }`}
            aria-label="Předchozí playlist"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            disabled={!canGoRight}
            className={`absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 backdrop-blur-md border-2 border-white/30 hover:bg-black/90 transition-all shadow-lg ${
              canGoRight
                ? "text-white hover:text-neon-cyan hover:border-neon-cyan cursor-pointer hover:scale-110"
                : "text-gray-600 cursor-not-allowed opacity-50"
            }`}
            aria-label="Další playlist"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Playlist Content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlaylist.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-[360px] md:h-[420px]"
          >
            <div className="w-full h-full overflow-hidden">
              {currentPlaylist.spotifyUrl ? (
                <div className="w-full h-full">
                  {currentPlaylist.spotifyUrl.includes('<iframe') ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: currentPlaylist.spotifyUrl }}
                      className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                    />
                  ) : (
                    <iframe
                      src={currentPlaylist.spotifyUrl}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="w-full h-full border-0"
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
