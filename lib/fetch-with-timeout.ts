/**
 * Fetch wrapper s timeoutem pro volání ze serveru (např. Supabase na Renderu).
 * Při ETIMEDOUT nebo pomalé síti request skončí po timeoutMs místo nekonečného čekání.
 */
const DEFAULT_TIMEOUT_MS = 20_000;

export function createFetchWithTimeout(timeoutMs = DEFAULT_TIMEOUT_MS) {
  return (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const signal =
      init?.signal ?? AbortSignal.timeout(timeoutMs);
    return fetch(input, { ...init, signal });
  };
}

export const fetchWithTimeout = createFetchWithTimeout();
