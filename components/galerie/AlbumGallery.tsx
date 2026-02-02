"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface Photo {
  id: string;
  cloudinaryPublicId: string;
  caption: string | null;
}

interface AlbumGalleryProps {
  photos: Photo[];
  cloudName: string;
  albumTitle: string;
}

function buildUrl(cloudName: string, publicId: string, width: number) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

export function AlbumGallery({ photos, cloudName, albumTitle }: AlbumGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      setIndex((i) => {
        const n = (i ?? 0) + delta;
        if (n < 0) return photos.length - 1;
        if (n >= photos.length) return 0;
        return n;
      });
    },
    [index, photos.length]
  );

  const close = useCallback(() => setIndex(null), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, go]);

  const photo = index !== null ? photos[index] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-sysmex-900 border border-white/5 hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(70,214,255,0.3)] text-left"
          >
            <Image
              src={buildUrl(cloudName, p.cloudinaryPublicId, 800)}
              alt={p.caption || `Fotka ${i + 1} z alba ${albumTitle}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              {p.caption ? (
                <p className="text-white text-sm font-medium line-clamp-2">{p.caption}</p>
              ) : (
                <p className="text-white/70 text-sm">Klikni pro zvětšení</p>
              )}
            </div>
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-lg">⊕</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {photo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Náhled fotky"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors"
            aria-label="Zavřít"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-colors"
            aria-label="Předchozí"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-colors"
            aria-label="Další"
          >
            ›
          </button>

          <div
            className="relative max-w-6xl max-h-[90vh] w-full mx-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={buildUrl(cloudName, photo.cloudinaryPublicId, 1920)}
              alt={photo.caption || `Fotka ${index! + 1} z alba ${albumTitle}`}
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />
            {photo.caption && (
              <p className="mt-4 text-white/90 text-center max-w-2xl">{photo.caption}</p>
            )}
            <p className="mt-2 text-white/50 text-sm">
              {index! + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
