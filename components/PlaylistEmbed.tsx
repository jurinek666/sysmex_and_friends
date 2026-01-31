"use client";

import { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PlaylistEmbedProps {
  spotifyUrl: string;
  className?: string;
}

export function PlaylistEmbed({ spotifyUrl, className }: PlaylistEmbedProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className={cn("w-full h-full bg-white/5 animate-pulse rounded-lg", className)} />;
  }

  if (spotifyUrl.includes('<iframe')) {
    // Handling iframe string. We need to apply styles to the container and maybe deep selector for iframe
    return (
      <div
        dangerouslySetInnerHTML={{ __html: spotifyUrl }}
        className={cn(
            "w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 [&>iframe]:rounded-lg",
            className
        )}
      />
    );
  }

  return (
    <iframe
      src={spotifyUrl}
      width="100%"
      height="100%"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className={cn("w-full h-full border-0 rounded-lg", className)}
    />
  );
}
