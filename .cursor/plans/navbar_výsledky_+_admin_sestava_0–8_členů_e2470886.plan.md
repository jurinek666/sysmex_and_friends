---
name: Navbar výsledky + admin sestava 0–8 členů
overview: Opravit odkaz Výsledky v navbaru na /vysledky; v adminu přidat výběr 0–8 členů týmu u každého výsledku, rozšířit DB o vazební tabulku a zobrazovat sestavu na stránce výsledků.
todos:
  - id: todo-1770136283623-u5pqp7iy5
    content: "prověř proveditlenost plánu po změně v "
    status: pending
isProject: false
---

# Navbar výsledky + admin: seznam členů týmu (0–8) u výsledku

## 1. Odkaz v navbaru

- V [components/Navbar.tsx](components/Navbar.tsx) změnit odkaz „Výsledky“ z `/#vysledky` na `/vysledky` (stejně jako u Kalendář, Galerie, Týmová soupiska).

---

## 2. Databáze (Supabase)

Propojení výsledku s 0–8 členy týmu: **vazební tabulka** (many-to-many mezi Result a Member).

### Nová tabulka `ResultMember`

- `result_id` (uuid, FK → Result.id, ON DELETE CASCADE)
- `member_id` (uuid, FK → Member.id)
- `sort_order` (smallint, volitelné – pořadí v sestavě)
- Primární klíč: `(result_id, member_id)`
- Omezení: max 8 řádků na jeden `result_id` (lze v aplikaci, nebo CHECK + trigger v DB)

**SQL pro Supabase (Dashboard → SQL Editor):**

```sql
create table if not exists "ResultMember" (
  "result_id" uuid not null references "Result"(id) on delete cascade,
  "member_id" uuid not null references "Member"(id) on delete restrict,
  "sort_order" smallint default 0,
  primary key ("result_id", "member_id")
);

create index if not exists "ResultMember_result_id_idx" on "ResultMember"("result_id");
create index if not exists "ResultMember_member_id_idx" on "ResultMember"("member_id");

-- volitelně: max 8 členů na výsledek (trigger nebo kontrola v aplikaci)
```

Migrační složka v repu není – změnu je potřeba provést ručně v Supabase (nebo doplnit soubor do `supabase/migrations/` a spustit `supabase db push` pokud ho používáte).

---

## 3. Schéma a validace

- V [lib/schemas.ts](lib/schemas.ts) rozšířit `resultSchema`: přidat volitelné pole  
`memberIds: z.array(z.string().uuid()).max(8).optional().default([])`  
(nebo bez default, podle toho, jak budete předávat z formuláře).
- Formulář bude posílat `memberIds` jako více hodnot (např. `getAll("memberIds")`).

---

## 4. Admin: formulář výsledku

- [app/admin/results/ResultForm.tsx](app/admin/results/ResultForm.tsx):
  - Načíst **seznam aktivních členů** (např. `getActiveMembers()` – bude potřeba předat členy z page nebo načíst v client komponentě přes fetch/server action).
  - Přidat UI **výběr 0–8 členů** (multi-select nebo checkboxy u jmen), max 8.
  - Při vytváření: žádný předvybraný.
  - Při editaci: předvybrat členy přiřazené k danému výsledku (viz níže načtení výsledku s členy).
  - Do formuláře odesílat pole `memberIds`: např. skryté inputy `name="memberIds" value={memberId}` pro každé vybrané ID, nebo jeden input s JSON – v action pak `formData.getAll("memberIds")` a zvalidovat.
- [app/admin/results/page.tsx](app/admin/results/page.tsx):
  - Načíst výsledky včetně vazby na členy:  
  `select("*, season:Season(*), result_members:ResultMember(member_id, Member(displayName))")`  
  (nebo podle skutečného názvu relace v Supabase – např. `ResultMember(result_id, member_id, Member(id, displayName))`).
  - Předat do ResultList / ResultForm při editaci i pole `memberIds` (nebo celý objekt s `result_members`), aby formulář mohl předvybrat členy.
- Typ `Result`: rozšířit o `memberIds?: string[]` nebo `result_members?: { member_id: string; Member?: { displayName: string } }[]` podle toho, jak data z Supabase vrátíte.

---

## 5. Admin: server actions

- [app/admin/_actions.ts](app/admin/_actions.ts):
  - **adminCreateResult**: z `rawData` / formData přečíst `memberIds` (getAll("memberIds")), zvalidovat max 8 UUID. Po úspěšném `Result.insert` vložit řádky do `ResultMember`: pro každé `memberId` z pole insert `{ result_id: id, member_id: memberId, sort_order: index }`.
  - **adminUpdateResult**: po update `Result` smazat u daného `result_id` všechny řádky v `ResultMember`, pak vložit nové z `memberIds` (stejně jako u create).
  - **adminDeleteResult**: díky `ON DELETE CASCADE` na `ResultMember.result_id` se řádky smažou automaticky; není potřeba měnit delete action.

---

## 6. Načítání výsledků s členy (veřejná stránka + admin)

- [lib/queries/results.ts](lib/queries/results.ts):
  - V `getResultsBySeasonCode` a `getLatestResults` rozšířit select o vazbu na členy, např.:  
  `.select("*, season:Season(*), result_members:ResultMember(member_id, sort_order, Member(id, displayName))")`  
  (název relace může být `ResultMember` nebo dle konvence Supabase `result_members` – záleží na pojmenování tabulky a FKs).
  - Vrátit výsledky tak, aby každý result měl pole členů (např. `participants: { id, displayName }[]`) odvozené z `result_members` + `Member`, seřazené podle `sort_order`.
- Admin [app/admin/results/page.tsx](app/admin/results/page.tsx): načíst výsledky se stejnou vazbou, aby při editaci bylo možné předvybrat členy.

---

## 7. Zobrazení sestavy na stránce výsledků

- [app/vysledky/page.tsx](app/vysledky/page.tsx):
  - Data už budou obsahovat účastníky z DB (pokud dotaz vrátí `participants` nebo `result_members` + mapování na jména).
  - V kartě výsledku v sekci „Sestava dne“:
    - Pokud existuje pole účastníků z DB (např. `r.participants?.length > 0`), zobrazit pills z `participants.map(p => p.displayName)`.
    - Jinak fallback na stávající chování: `teamNameToPills(r.teamName)` (rozdělení podle čárky).
  - Tím zůstane zpětná kompatibilita pro výsledky bez přiřazených členů.

---

## Shrnutí souborů


| Soubor                                                               | Změna                                                                     |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [components/Navbar.tsx](components/Navbar.tsx)                       | Výsledky: `href="/vysledky"`                                              |
| Supabase                                                             | Nová tabulka `ResultMember` (SQL výše)                                    |
| [lib/schemas.ts](lib/schemas.ts)                                     | resultSchema: volitelné `memberIds` (max 8)                               |
| [app/admin/results/ResultForm.tsx](app/admin/results/ResultForm.tsx) | Výběr 0–8 členů (multi-select/checkboxy), odeslání `memberIds`            |
| [app/admin/results/page.tsx](app/admin/results/page.tsx)             | Načíst výsledky včetně ResultMember + Member, předat členy do formuláře   |
| [app/admin/_actions.ts](app/admin/_actions.ts)                       | Create/Update result: zápis/mazání řádků v `ResultMember` dle `memberIds` |
| [lib/queries/results.ts](lib/queries/results.ts)                     | Select včetně ResultMember + Member, vrácení účastníků u každého výsledku |
| [app/vysledky/page.tsx](app/vysledky/page.tsx)                       | „Sestava dne“: preferovat účastníky z DB, jinak `teamName` (pills)        |


---

## Pořadí implementace

1. Navbar: odkaz Výsledky na `/vysledky`.
2. DB: vytvořit tabulku `ResultMember` v Supabase.
3. Schema: přidat `memberIds` do `resultSchema`.
4. Queries: rozšířit načítání výsledků o členy; vrátit strukturu s účastníky.
5. Actions: v create/update výsledku syncovat `ResultMember` z `memberIds`.
6. Admin page: načíst výsledky s členy, předat do formuláře.
7. ResultForm: načíst členy (props nebo fetch), multi-select max 8, odesílat `memberIds`.
8. Vysledky page: zobrazit sestavu z účastníků z DB, jinak z `teamName`.

---

## Ověření

- Klik na „Výsledky“ v menu vede na `/vysledky`.
- V adminu u nového/upraveného výsledku lze vybrat 0–8 členů; po uložení se v DB objeví řádky v `ResultMember`.
- Na `/vysledky` se u výsledků s přiřazenými členy zobrazí jejich jména v „Sestava dne“; u starých výsledků bez přiřazení zůstane zobrazení z `teamName`.

