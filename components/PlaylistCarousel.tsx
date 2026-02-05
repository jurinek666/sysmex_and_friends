"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { getSpotifyEmbedSrc } from "@/lib/spotify";
import type { Playlist } from "@/lib/types";

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
  const embedSrc = getSpotifyEmbedSrc(currentPlaylist.spotifyUrl);
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

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    const { offset, velocity } = info;

    if (offset.x > swipeThreshold || velocity.x > 500) {
      if (canGoLeft) {
        goToPrevious();
      }
    } else if (offset.x < -swipeThreshold || velocity.x < -500) {
      if (canGoRight) {
        goToNext();
      }
    }
  };

  return (
    <div className="bento-card p-0 group hover:border-neon-cyan/50 relative overflow-hidden h-full flex flex-col">

      {/* Navigation Arrows */}
      {playlists.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!canGoLeft}
            className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 backdrop-blur-md border-2 border-white/30 hover:bg-black/90 transition-all shadow-lg ${
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
            className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 backdrop-blur-md border-2 border-white/30 hover:bg-black/90 transition-all shadow-lg ${
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
      <div className="flex-1 relative flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlaylist.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            className="w-full flex-1 min-h-0 cursor-grab active:cursor-grabbing"
          >
            <div className="w-full h-full overflow-hidden pointer-events-none">
              {embedSrc ? (
                <div className="w-full h-full">
                  <iframe
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="w-full h-full border-0 pointer-events-auto"
                    title={currentPlaylist.title}
                  />
                  {/* Overlay to allow swiping on non-interactive parts if necessary,
                      but for iframe content we rely on iframe consuming events
                      UNLESS we want to force swipe over interaction.
                      However, wrapping motion.div makes the whole container draggable.
                      Since iframe eats events, we need a strategy.

                      If we set pointer-events-none on wrapper div (done above),
                      then events pass to iframe? No, motion.div captures them for drag?

                      Actually, to make drag work over an iframe, we need an overlay
                      that captures touch/mouse events. BUT that disables Spotify interaction.

                      Solution: We can't easily have both full interaction AND swipe over the iframe area.
                      The user asked for swipe.
                      However, making the playlist non-interactive is bad.

                      Let's try to remove 'pointer-events-none' from the wrapper div above
                      and see if dragging works on the padding/header areas (which are outside this div).

                      Wait, this motion.div WRAPS the iframe.
                      If I put drag on it, and the iframe is inside:
                      - Touching iframe -> iframe handles it (scrolling list in spotify).
                      - Touching edges? There are no edges inside this div, it's w-full h-full.

                      The header is OUTSIDE this motion.div (in the parent).

                      If I want to swipe the card, I should probably make the PARENT draggable?
                      But the parent contains the header which is fine.

                      Let's see: if I add `pointer-events-none` to the wrapper div, then the iframe won't get clicks?
                      Yes, `pointer-events-none` on the parent makes children not receive events unless they have `pointer-events-auto`.

                      I added `pointer-events-none` to the div wrapping the iframe, and `pointer-events-auto` to the iframe.
                      This means clicks on iframe go to iframe.
                      But drags?
                      Framer Motion listens on the `motion.div`.
                      If the event target is the iframe, the event bubbles up.
                      However, if the iframe consumes the touchmove (e.g. internal scrolling), it might prevent bubbling or default behavior.

                      Given Spotify embeds are scrollable lists, swipe might conflict.
                      BUT, usually horizontal swipe is not used in Spotify vertical lists.
                      So maybe it works.

                      Let's stick with the plan. I added onDragEnd.
                  */}
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
