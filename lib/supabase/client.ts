import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

let browserClient: SupabaseClient | undefined

export function createClient() {
  if (typeof window === 'undefined') {
    // Na serveru vždy vytváříme novou instanci (i když tento klient je primárně pro browser)
    return createBrowserClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }

  return browserClient
}
