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
    <div className="bento-card p-6 flex flex-col group hover:border-neon-cyan/50 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Playlist</div>
        <div className="flex items-center gap-2">
          {playlists.length > 1 && (
            <span className="text-xs text-gray-500 font-mono">
              {currentIndex + 1} / {playlists.length}
            </span>
          )}
          <div className="text-2xl">🎵</div>
        </div>
      </div>

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
      <div className="space-y-3 flex-1 relative px-10 md:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlaylist.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-xl font-bold text-white">{currentPlaylist.title}</h3>
            {currentPlaylist.description && (
              <p className="text-sm text-gray-400 line-clamp-2">{currentPlaylist.description}</p>
            )}

            <div className="mt-4 w-full overflow-hidden rounded-lg">
              {currentPlaylist.spotifyUrl ? (
                <div className="w-full">
                  {currentPlaylist.spotifyUrl.includes('<iframe') ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: currentPlaylist.spotifyUrl }}
                      className="w-full [&>iframe]:w-full [&>iframe]:h-[352px] [&>iframe]:rounded-lg [&>iframe]:border-0 [&>iframe]:min-h-[352px]"
                    />
                  ) : (
                    <iframe
                      src={currentPlaylist.spotifyUrl}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="w-full h-[352px] rounded-lg border-0"
                    />
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic p-4 text-center">
                  Playlist není k dispozici
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator (optional) */}
      {playlists.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {playlists.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-neon-cyan"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Přejít na playlist ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
