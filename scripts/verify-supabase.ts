import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Chybí Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL nebo NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(url, key);

async function verify() {
  console.log('Testuji připojení k Supabase...');
  try {
    // Zkusíme jednoduchý dotaz na tabulku 'Post'.
    // Používáme head: true, abychom nestahovali data, jen ověřili přístup a počet.
    const { data, error, count } = await supabase
      .from('Post')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Chyba při dotazu na Supabase:', error.message);
      console.error('Code:', error.code);
      console.error('Details:', error.details);
      process.exit(1);
    }

    console.log('Připojení k Supabase bylo ÚSPĚŠNÉ!');
    console.log(`Počet nalezených záznamů v tabulce 'Post': ${count}`);

  } catch (err) {
    console.error('Neočekávaná chyba skriptu:', err);
    process.exit(1);
  }
}

verify();
