# Návrh rozšíření: Členská sekce (Team Member Portal)

Tento dokument popisuje architekturu pro zavedení členské sekce, která umožní členům týmu spravovat svou účast na kvízech a interagovat s obsahem (komentáře), odděleně od administrátorského rozhraní.

## 1. Databázová struktura (Supabase)

Je potřeba rozšířit stávající schéma o tabulky pro správu profilů, účasti a komentářů.

### Tabulka `profiles`
Tato tabulka propojuje Supabase Auth uživatele (`auth.users`) s aplikačními daty.

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  display_name text, -- Zobrazované jméno (např. přezdívka)
  avatar_url text,
  role text default 'member', -- 'member' | 'admin' (pro budoucí sjednocení práv)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
-- Každý může číst veřejné profily (pokud chceme zobrazovat kdo jde na kvíz)
-- Jen uživatel může editovat svůj profil
```

### Tabulka `event_participants` (Účast na kvízech)
Vazební tabulka mezi uživatelem a událostí (kvízem).

```sql
create table public.event_participants (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null, -- 'going', 'maybe', 'not_going'
  note text, -- např. "přijdu později"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, user_id) -- Jeden uživatel se nemůže přihlásit vícekrát
);
```

### Tabulka `comments` (Komentáře k článkům)
Pro diskuzi pod články.

```sql
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  parent_id uuid references public.comments(id), -- Pro vnořené odpovědi (volitelné)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 2. Autentizace a Role

### Oddělené přihlašování?
Doporučuji **jednotný přihlašovací systém** (Supabase Auth), ale s odděleným UI pro přesměrování.

*   **Admin:** `/admin/login` -> po přihlášení kontrola, zda má uživatel admin práva (např. v `public.profiles` nebo přes Supabase Custom Claims).
*   **Člen:** `/login` (nebo `/team/login`) -> po přihlášení přesměrování na `/dashboard` nebo `/tym`.

### Registrace
Registrace by měla být **na pozvánky** nebo vyžadovat **schválení adminem**, aby se do týmové sekce nedostal kdokoli z veřejnosti.
*   *Varianta A:* Admin vytvoří uživatele v Supabase dashboardu a pošle invite link.
*   *Varianta B:* Veřejná registrace, ale uživatel má status `pending` a nevidí nic, dokud ho admin neschválí.

## 3. Struktura cest (Routing)

Navrhuji vytvořit novou skupinu rout pro členy, aby se nemíchala s veřejnou částí (`app/(public)`) ani adminem (`app/admin`).

```
app/
├── (public)/       # Veřejné stránky (beze změny)
├── admin/          # Admin sekce (beze změny)
├── (members)/      # Nová členská sekce (chráněná middlewarem)
│   ├── dashboard/  # Přehled (nadcházející kvízy, novinky)
│   ├── profile/    # Nastavení profilu
│   ├── schedule/   # Kalendář s možností RSVP
│   └── layout.tsx  # Layout s navigací pro členy
└── login/          # Přihlašovací stránka
```

## 4. UI Komponenty

*   **Komentářová sekce:** Komponenta `CommentsSection`, která se vloží do `app/(public)/clanky/[slug]/page.tsx`. Bude zobrazovat komentáře všem, ale formulář pro přidání zobrazí jen přihlášeným.
*   **RSVP Tlačítko:** Komponenta `EventParticipation` v detailu kalendáře/události.
*   **Notifikace:** (Volitelné) Upozornění na Discord, když se někdo přihlásí/odhlásí.

## 5. Implementační kroky (Roadmapa)

1.  **Databáze:** Vytvořit tabulky `profiles`, `event_participants`, `comments` + nastavit RLS policies.
2.  **Auth Flow:** Upravit `middleware.ts` (proxy) pro ochranu `(members)` rout a vytvořit stránku `/login`.
3.  **Profil:** Implementovat vytvoření profilu po prvním přihlášení (pokud neexistuje).
4.  **Účast:** Implementovat logiku přihlašování na akce.
5.  **Komentáře:** Implementovat API a UI pro komentáře pod články.
