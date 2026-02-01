import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";

export async function getUpcomingEvents(limit = 5) {
  const supabase = await createClient();
  
  const now = new Date().toISOString();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Event")
      .select("id, title, date, venue, description")
      .eq("isUpcoming", true)
      .gte("date", now)
      .order("date", { ascending: true })
      .limit(limit);
  });

  if (error) {
    logSupabaseError("getUpcomingEvents", error);
    return [];
  }
  
  return data || [];
}
