import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";
import { Event } from "@/lib/types";

/** Vrátí název události podle id (pro notifikace). */
export async function getEventTitleById(
  supabase: SupabaseClient,
  eventId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("Event")
    .select("title")
    .eq("id", eventId)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { title: string }).title ?? null;
}

export async function getUpcomingEvents(limit = 5) {
  const supabase = await createClient();
  
  const now = new Date().toISOString();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Event")
      .select(`
        id,
        title,
        date,
        venue,
        description,
        isUpcoming
      `)
      .eq("isUpcoming", true)
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
      .from("Event")
      .select(`
        id,
        title,
        date,
        venue,
        description,
        isUpcoming
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
