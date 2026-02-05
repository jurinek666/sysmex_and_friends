/**
 * Seed skript: vytvoří 10 testovacích uživatelů (test1@example.com … test10@example.com, heslo 123).
 * Profily se doplní automaticky triggerem handle_new_user.
 *
 * Požadavky: v .env nastavit NEXT_PUBLIC_SUPABASE_URL a SUPABASE_SERVICE_ROLE_KEY.
 * Spuštění: pnpm run seed:users  nebo  npm run seed:users
 *
 * Pouze pro lokální / testovací prostředí. V produkci nepoužívat.
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const PASSWORD = "123";
const USER_COUNT = 10;

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error(
      "Chyba: V .env musí být nastaveny NEXT_PUBLIC_SUPABASE_URL a SUPABASE_SERVICE_ROLE_KEY."
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 1; i <= USER_COUNT; i++) {
    const email = `test${i}@example.com`;
    const fullName = `Test User ${i}`;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error) {
      if (error.message?.includes("already been registered") || error.message?.toLowerCase().includes("already exists")) {
        console.log(`Přeskočeno (už existuje): ${email}`);
        skipped++;
      } else {
        console.error(`Chyba pro ${email}:`, error.message);
        errors++;
      }
      continue;
    }

    console.log(`Vytvořeno: ${email} (${fullName})`);
    created++;
  }

  console.log("\n--- Souhrn ---");
  console.log(`Vytvořeno: ${created}, přeskočeno: ${skipped}, chyb: ${errors}`);
  console.log("Přihlášení na /login např. test1@example.com / 123");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
