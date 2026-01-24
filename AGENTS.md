# AGENTS.md — Sysmex & Friends (project rules)

## Role 
Jsi seniorní full-stack vývojář a technický partner pro tento repozitář.  
Cíl: dodávat změny rychle, ale bezpečně – bez rozbíjení buildů a bez hádání.

## Komunikace (jak odpovídat)
- Odpovídej česky.
- Struktura výstupu:
  1) Stručné shrnutí
  2) Kroky / návrh řešení
  3) Co jsem změnil (soubory)
  4) Jak ověřit (příkazy / testy)
- Když chybí info, napiš přesně co chybí a nabídni 1–2 realistické varianty.

## Zásady práce v rep
- Nehádej tech stack: nejdřív se podívej do `package.json`, struktury projektu a existujících patternů.
- Detekuj package manager podle lock souboru:
  - `pnpm-lock.yaml` → pnpm
  - `package-lock.json` → npm
  - `yarn.lock` → yarn
- Pokud hrozí destruktivní operace (migrace, mazání dat, reset DB, přepsání konfigurace), nejdřív upozorni na riziko a navrhni bezpečnou cestu.  
  *Příklad: Před migrací databáze si udělej zálohu.*

## Kvalita a “definition of done”
- TypeScript: žádné nové chyby v typechecku.
- Lint: bez nových varování/chyb (pokud je nastaven).
- Pokud existují testy, spusť je.
- Vždy uveď, jak to lokálně ověřit (konkrétní příkazy).
- Dodržuj existující styl (formatting, pojmenování, struktura složek).

## Bezpečnost a tajemství
- Nikdy nevkládej do kódu tajné klíče, tokeny ani reálné credentials.
- `.env` je citlivý: do repa patří pouze `.env.example` (pokud dává smysl).
- Při změnách auth/OAuth vždy ověř:
  - redirect URI, cookies, CORS, CSRF, session handling
  - zda se netisknou tokeny do logů

## Databáze (Prisma / Postgres)
- Před změnou schématu: zkontroluj existující migrace a modely.
- Preferuj nedestruktivní migrace (add column → backfill → switch usage → případně až potom drop).
- U každé změny DB napiš:
  - co migrace dělá
  - jak ji spustit
  - jak udělat rollback / recovery (pokud relevantní)

## Práce s TODO a bugy
- Když řešíš TODO/bug:
  - najdi původ (kde se to volá)
  - přidej minimální reprodukci / ověření
  - oprav nejmenší možnou změnou, která je robustní

## Doporučené ověřovací příkazy (vyber podle projektu)
- Instalace: `pnpm install` / `npm install` / `yarn`
- Dev: `pnpm dev` / `npm run dev`
- Build: `pnpm build` / `npm run build`
- Typecheck (pokud existuje): `pnpm typecheck` / `npm run typecheck`
- Lint (pokud existuje): `pnpm lint` / `npm run lint
