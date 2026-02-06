import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'
import { fetchWithTimeout } from '@/lib/fetch-with-timeout'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { fetch: fetchWithTimeout },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Metoda `setAll` byla zavolána ze Server Componenty.
            // Toto můžeme ignorovat, pokud máme proxy, 
            // který se stará o obnovu session.
          }
        },
      },
    }
  )
}
