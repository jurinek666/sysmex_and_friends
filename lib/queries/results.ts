import { createClient } from "@/lib/supabase/server";
import { withRetry } from "./utils";

export async function getLatestResults(limit = 5) {
  const supabase = await createClient();
  
  const result = await withRetry(async () => {
    return await supabase
      .from("Result")
      .select("*, season:Season(*)") // Načteme i propojenou sezónu
      .order("date", { ascending: false })
      .limit(limit);
  });

  if (result.error) {
    return [];
  }
  
  return result.data || [];
}

export async function getResultsBySeasonCode(code?: string) {
  const supabase = await createClient();

  const result = await withRetry(async () => {
    if (code) {
      // Pokud filtrujeme podle kódu sezóny, použijeme !inner join
      return await supabase
        .from("Result")
        .select("*, season:Season!inner(*)")
        .eq("season.code", code)
        .order("date", { ascending: false });
    }

    return await supabase
      .from("Result")
      .select("*, season:Season(*)")
      .order("date", { ascending: false });
  });
  
  if (result.error) {
    return [];
  }
  
  return result.data || [];
}

export async function getSeasons() {
  const supabase = await createClient();
  
  const result = await withRetry(async () => {
    return await supabase
      .from("Season")
      .select("*")
      .order("startDate", { ascending: false });
  });

  if (result.error) {
    return [];
  }
  
  return result.data || [];
}
