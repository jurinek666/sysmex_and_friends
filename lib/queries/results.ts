import { createClient } from "@/lib/supabase/server";

export async function getLatestResults(limit = 5) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("Result")
    .select("*, season:Season(*)") // Načteme i propojenou sezónu
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }
  
  return data;
}

export async function getResultsBySeasonCode(code?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("Result")
    .select("*, season:Season(*)")
    .order("date", { ascending: false });

  if (code) {
    // Pokud filtrujeme podle kódu sezóny, musíme použít !inner join nebo filtr přes ID.
    // Nejbezpečnější cesta: najdeme ID sezóny a filtrujeme podle něj.
    const { data: season } = await supabase
      .from("Season")
      .select("id")
      .eq("code", code)
      .single();

    if (!season) return []; // Sezóna nenalezena
    
    query = query.eq("seasonId", season.id);
  }

  const { data, error } = await query;
  
  if (error) {
    return [];
  }
  
  return data;
}

export async function getSeasons() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("Season")
    .select("*")
    .order("startDate", { ascending: false });

  if (error) {
    return [];
  }
  
  return data;
}