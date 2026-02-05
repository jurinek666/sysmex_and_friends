import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";
import { Event } from "@/lib/types";

export async function getUpcomingEvents(limit = 5): Promise<Event[]> {
  const supabase = await createClient();
  
  const now = new Date().toISOString();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("events")
      .select(`
        id,
        title,
        date,
        venue,
        description,
        isUpcoming:is_upcoming
      `)
      .eq("is_upcoming", true)
      .gte("date", now)
      .order("date", { ascending: true })
      .limit(limit);
  });

  if (error) {
    logSupabaseError("getUpcomingEvents", error);
    return [];
  }
  
  return (data || []) as Event[];
}

/** Všechny nadcházející akce pro stránku kalendáře (bez filtru isUpcoming, vyšší limit). */
export async function getEventsForCalendar(limit = 100): Promise<Event[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("events")
      .select(`
        id,
        title,
        date,
        venue,
        description,
        isUpcoming:is_upcoming
      `)
      .gte("date", now)
      .order("date", { ascending: true })
      .limit(limit);
  });

  if (error) {
    logSupabaseError("getEventsForCalendar", error);
    return [];
  }

  return (data || []) as Event[];
}
