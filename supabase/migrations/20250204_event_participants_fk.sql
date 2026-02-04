-- FK: event_participants.event_id -> Event(id)
-- Název tabulky událostí v DB může být "Event" (uvozovky) nebo "event".
-- Pokud migrace selže, ověř v Supabase SQL: select tablename from pg_tables where schemaname = 'public';
alter table public.event_participants
  add constraint event_participants_event_id_fkey
  foreign key (event_id)
  references public."Event"(id)
  on delete cascade;
