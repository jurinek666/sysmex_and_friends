import { createClient } from "@/lib/supabase/server";

export async function getUpcomingEvents(limit = 5) {
  const supabase = await createClient();
  
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("Event")
    .select("*")
    .eq("isUpcoming", true)
    .gte("date", now)
    .order("date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
  
  return data || [];
}
