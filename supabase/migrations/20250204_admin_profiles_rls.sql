-- Umožní administrátorům upravovat libovolný profil (role, display_name).
-- Funkce is_admin() ověří, zda je aktuální uživatel admin.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Politika: admin může updatovat jakýkoli řádek v profiles.
drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());
