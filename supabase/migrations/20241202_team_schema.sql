-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
-- Propojení s auth.users. Obsahuje veřejná data o uživateli.
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  display_name text,
  avatar_url text,
  role text default 'member' check (role in ('member', 'admin', 'moderator')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies pro Profiles
alter table public.profiles enable row level security;

-- Každý může číst profily (potřeba pro zobrazení autora komentáře/účastníka)
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

-- Uživatel může editovat jen svůj profil
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Trigger pro automatické vytvoření profilu po registraci
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'member'
  );
  return new;
end;
$$;

-- Drop trigger if exists to avoid duplication errors on re-run
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. EVENTS / CALENDAR (Pokud tabulka events ještě neexistuje v Public schématu)
-- Předpokládáme, že 'Event' už existuje nebo je spravován v 'calendar'.
-- Pokud ne, museli bychom ji vytvořit. Zde vytváříme jen vazební tabulku.


-- 3. EVENT PARTICIPANTS
-- Kdo se účastní jaké akce
create table if not exists public.event_participants (
  id uuid default gen_random_uuid() primary key,
  event_id uuid not null, -- FK by měl směřovat na tabulku events/calendar
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('going', 'maybe', 'not_going')),
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, user_id)
);

alter table public.event_participants enable row level security;

-- Každý vidí, kdo jde
create policy "Participants are viewable by everyone"
  on public.event_participants for select
  using ( true );

-- Přihlášený uživatel může vložit svůj záznam
create policy "Users can insert their own participation"
  on public.event_participants for insert
  with check ( auth.uid() = user_id );

-- Přihlášený uživatel může upravit svůj záznam
create policy "Users can update their own participation"
  on public.event_participants for update
  using ( auth.uid() = user_id );

-- Přihlášený uživatel může smazat svůj záznam
create policy "Users can delete their own participation"
  on public.event_participants for delete
  using ( auth.uid() = user_id );


-- 4. COMMENTS
-- Komentáře k příspěvkům (posts)
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_slug text not null, -- Vážeme na slug nebo ID postu. Zde slug pro jednoduchost, pokud Post nemá public ID.
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  parent_id uuid references public.comments(id), -- Pro vnořené odpovědi
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

-- Čtení komentářů povoleno všem
create policy "Comments are viewable by everyone"
  on public.comments for select
  using ( true );

-- Vkládání pouze pro přihlášené
-- Vkládání pouze pro přihlášené (musí být vlastní komentář)
create policy "Authenticated users can insert comments"
  on public.comments for insert
  with check ( auth.uid() = user_id );

-- Editace pouze vlastní komentář
create policy "Users can update own comments"
  on public.comments for update
  using ( auth.uid() = user_id );

-- Mazání pouze vlastní komentář (nebo admin - to se řeší přes service role key v aplikaci)
create policy "Users can delete own comments"
  on public.comments for delete
  using ( auth.uid() = user_id );
