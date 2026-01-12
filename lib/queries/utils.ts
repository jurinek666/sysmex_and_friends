/**
 * Utility funkce pro retry logiku při Supabase dotazech
 * Pomáhá řešit timeouty a dočasné síťové problémy
 */

const DEFAULT_RETRY_ATTEMPTS = 2;
const DEFAULT_RETRY_DELAY = 1000; // 1 sekunda

// Supabase error type
type SupabaseError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
} | null;

/**
 * Wrapper funkce pro Supabase dotazy s retry logikou
 * @param queryFn Funkce, která provede Supabase dotaz
 * @param retryAttempts Počet pokusů o opakování (default: 2)
 * @param retryDelay Zpoždění mezi pokusy v ms (default: 1000)
 * @returns Výsledek dotazu nebo null při selhání
 */
export async function withRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: SupabaseError }>,
  retryAttempts: number = DEFAULT_RETRY_ATTEMPTS,
  retryDelay: number = DEFAULT_RETRY_DELAY
): Promise<{ data: T | null; error: SupabaseError }> {
  let lastError: SupabaseError = null;
  
  for (let attempt = 0; attempt <= retryAttempts; attempt++) {
    try {
      const result = await queryFn();
      
      // Pokud není chyba, vrátíme výsledek
      if (!result.error) {
        return result;
      }
      
      // Pokud je chyba timeoutu nebo síťová chyba, zkusíme znovu
      const isRetryableError = 
        result.error?.message?.includes('timeout') ||
        result.error?.message?.includes('fetch failed') ||
        result.error?.message?.includes('ECONNRESET') ||
        result.error?.message?.includes('ETIMEDOUT') ||
        result.error?.code === 'UND_ERR_CONNECT_TIMEOUT';
      
      if (isRetryableError && attempt < retryAttempts) {
        lastError = result.error;
        // Počkáme před dalším pokusem
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }
      
      // Pokud není retryable nebo jsme vyčerpali pokusy, vrátíme chybu
      return result;
    } catch (error: unknown) {
      // Pokud je to timeout nebo síťová chyba, zkusíme znovu
      const errorObj = error as { message?: string; code?: string };
      const isRetryableError = 
        errorObj?.message?.includes('timeout') ||
        errorObj?.message?.includes('fetch failed') ||
        errorObj?.message?.includes('ECONNRESET') ||
        errorObj?.message?.includes('ETIMEDOUT') ||
        errorObj?.code === 'UND_ERR_CONNECT_TIMEOUT';
      
      if (isRetryableError && attempt < retryAttempts) {
        lastError = errorObj as SupabaseError;
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }
      
      // Pokud není retryable nebo jsme vyčerpali pokusy, vrátíme chybu
      return { data: null, error: errorObj as SupabaseError };
    }
  }
  
  return { data: null, error: lastError };
}

/**
 * Zlepšené logování chyb s více informacemi
 */
export function logSupabaseError(context: string, error: SupabaseError) {
  const errorInfo = {
    context,
    message: error?.message || 'Unknown error',
    code: error?.code || 'NO_CODE',
    details: error?.details || null,
    hint: error?.hint || null,
    timestamp: new Date().toISOString(),
  };
  
  console.error(`Error in ${context}:`, errorInfo);
  
  // Pokud je to timeout, logujeme jako warning místo error
  if (error?.message?.includes('timeout') || error?.code === 'UND_ERR_CONNECT_TIMEOUT') {
    console.warn(`⚠️  Timeout při připojování k Supabase v ${context}. Zkontrolujte síťové připojení.`);
  }
}
