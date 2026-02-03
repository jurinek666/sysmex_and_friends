const SPOTIFY_HOSTS = new Set(["open.spotify.com", "embed.spotify.com"]);

export function getSpotifyEmbedSrc(
  input: string | null | undefined
): string | null {
  if (!input) return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  const iframeSrcMatch = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  const candidate = iframeSrcMatch ? iframeSrcMatch[1] : trimmed;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:") return null;
    if (!SPOTIFY_HOSTS.has(url.hostname)) return null;

    if (url.hostname === "embed.spotify.com") {
      url.hostname = "open.spotify.com";
      if (!url.pathname.startsWith("/embed")) {
        url.pathname = `/embed${url.pathname}`;
      }
    } else if (url.hostname === "open.spotify.com") {
      if (!url.pathname.startsWith("/embed")) {
        const normalizedPath = url.pathname.startsWith("/")
          ? url.pathname.slice(1)
          : url.pathname;
        url.pathname = `/embed/${normalizedPath}`;
      }
    }

    if (!url.searchParams.has("utm_source")) {
      url.searchParams.set("utm_source", "generator");
    }

    return url.toString();
  } catch {
    return null;
  }
}
