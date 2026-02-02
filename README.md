# SYSMEX & Friends

Technická dokumentace webové aplikace pro tým Sysmex & Friends.

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Jazyk:** TypeScript
- **Databáze & Auth:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Package Manager:** npm

## 📋 Požadavky

- Node.js 20.9+ (LTS)
- npm (součást Node.js)

## 🚀 Instalace a spuštění (Lokálně)

1. **Instalace závislostí**
   ```bash
   npm install
   ```

2. **Konfigurace prostředí**
   Vytvořte soubor `.env` v kořenovém adresáři. Aplikace vyžaduje pro základní běh připojení k Supabase.

   Příklad `.env`:
   ```env
   # Supabase (Povinné)
   NEXT_PUBLIC_SUPABASE_URL="https://vase-project-id.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="vas-anon-key"

   # Cloudinary (Volitelné – pro funkčnost galerie)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""

   # Cron endpoint (povinné pro /api/cron/link-medic)
   CRON_SECRET="silny-tajny-retezec"
   ```

3. **Spuštění vývojového serveru**
   ```bash
   npm run dev
   ```
   Aplikace bude dostupná na [http://localhost:3000](http://localhost:3000) (nebo na portu specifikovaném v konzoli).

## 📜 Dostupné skripty

- `npm run dev` – Spustí lokální vývojový server.
- `npm run build` – Vytvoří optimalizovaný produkční build.
- `npm run start` – Spustí produkční server (vyžaduje předchozí build).
- `npm run lint` – Spustí kontrolu kódu pomocí ESLint.
- `npm run check` – Spustí kompletní kontrolu kvality (Lint + TypeScript Typecheck + Build test). **Doporučeno spouštět před pushnutím.**

## 📂 Struktura projektu

- `app/` – Hlavní kód aplikace (App Router).
  - `app/admin/` – Administrační sekce (chráněná).
  - `app/api/` – API endpointy (včetně cron jobů).
- `proxy.ts` – Proxy/middleware vrstva pro Supabase session a ochranu `/admin`.
- `components/` – Znovupoužitelné React komponenty.
- `lib/` – Pomocné knihovny a utility.
  - `lib/queries/` – Funkce pro čtení dat ze Supabase.
  - `lib/types.ts` – Sdílené TypeScript definice (zdroj pravdy pro typy).
  - `lib/env.ts` – Validace environment proměnných pomocí Zod.
- `public/` – Statické soubory.

## 🔐 Administrace

Administrační rozhraní se nachází na `/admin`.
- **Přístup:** Vyžaduje přihlášení uživatele (Supabase Auth).
- **Ochrana:** Zajištěna pomocí `proxy.ts` (přesměrování na login) a `app/admin/layout.tsx` (kontrola server-side).

## ☁️ Deployment (Render)

Aplikace je primárně určena pro nasazení na [Render.com](https://render.com).

**Postup nasazení:**
1. Propojit repozitář s Render službou (Web Service).
2. Nastavit **Build Command**: `npm install && npm run build`.
3. Nastavit **Start Command**: `npm run start`.
4. V sekci **Environment** nastavit proměnné definované v `.env` (Supabase URL, Keys, Cloudinary).

## ✅ Code Quality & Workflow

Projekt používá **ESLint** a **TypeScript** v striktním režimu.
Před commitem spusťte `npm run check` pro ověření, že změny nerozbily build nebo typy.

Pozn.: Next.js 16 varuje před `middleware.ts`. Používáme proto `proxy.ts` se stejným chováním.

## ⏱ Cron: Link Medic

Endpoint `GET /api/cron/link-medic` vyžaduje hlavičku:
`Authorization: Bearer <CRON_SECRET>`

Všechny routy a API endpointy jsou typované. Nové databázové dotazy by měly využívat sdílené typy z `lib/types.ts` a ošetřovat chyby pomocí wrapperů (např. `withRetry`).
