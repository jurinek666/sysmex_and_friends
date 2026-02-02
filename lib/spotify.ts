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
    return url.toString();
  } catch {
    return null;
  }
}
