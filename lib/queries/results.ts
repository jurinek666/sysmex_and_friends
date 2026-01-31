import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";

export async function getLatestResults(limit = 5) {
  const supabase = await createClient();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Result")
      .select("*, season:Season(*)") // Načteme i propojenou sezónu
      .order("date", { ascending: false })
      .limit(limit);
  });

  if (error) {
    logSupabaseError("getLatestResults", error);
    return [];
  }
  
  return data || [];
}

export async function getResultsBySeasonCode(code?: string) {
  const supabase = await createClient();

  const { data, error } = await withRetry(async () => {
    let seasonId: string | undefined;

    if (code) {
      // Pokud filtrujeme podle kódu sezóny, musíme použít !inner join nebo filtr přes ID.
      // Nejbezpečnější cesta: najdeme ID sezóny a filtrujeme podle něj.
      const { data: season, error: seasonError } = await supabase
        .from("Season")
        .select("id")
        .eq("code", code)
        .single();

      if (seasonError) {
         // Pokud sezóna neexistuje (PGRST116), vrátíme prázdné pole, není to chyba k retry
         if (seasonError.code === 'PGRST116') {
             return { data: [], error: null };
         }
         return { data: null, error: seasonError };
      }
      seasonId = season.id;
    }

    let query = supabase
      .from("Result")
      .select("*, season:Season(*)")
      .order("date", { ascending: false });
    
    if (seasonId) {
      query = query.eq("seasonId", seasonId);
    }

    return await query;
  });
  
  if (error) {
    logSupabaseError("getResultsBySeasonCode", error);
    return [];
  }
  
  return data || [];
}

export async function getSeasons() {
  const supabase = await createClient();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Season")
      .select("*")
      .order("startDate", { ascending: false });
  });

  if (error) {
    logSupabaseError("getSeasons", error);
    return [];
  }
  
  return data || [];
}
