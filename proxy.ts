import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/lib/env'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // DŮLEŽITÉ: Musíme zavolat getUser, aby se obnovil Auth token,
  // i když data o uživateli v tomto kroku nepoužijeme.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;

  // Ochrana admin sekce - redirect na login pokud není přihlášen
  if (!user && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Ochrana členské sekce (app/(members))
  // Poznámka: Next.js Route Groups jako (members) se v URL neobjevují,
  // takže chráníme cesty, které v ní jsou (např. /tym/dashboard)
  // Zde předpokládáme, že členská sekce bude začínat prefixem /tym (mimo veřejný /tym - pozor na kolize!)
  // Dle zadání "app/(members)/dashboard" bude na URL "/dashboard" nebo "/tym/dashboard".
  // PRO JEDNODUCHOST: Pokud cesta obsahuje 'dashboard' nebo 'profil', vyžadujeme auth.

  if (!user && (pathname.startsWith('/tym/dashboard') || pathname.startsWith('/tym/profil'))) {
      return NextResponse.redirect(new URL('/login', request.url));
  }

  // Pokud je uživatel přihlášen a jde na login, pošleme ho na dashboard
  if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/tym/dashboard', request.url));
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplikuj proxy na všechny cesty kromě statických souborů
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
