import type { SupabaseClient } from "@supabase/supabase-js";

const NOTIFICATION_TYPE_EVENT_PROMOTED = "event_promoted";

/**
 * Zaznamená in-app notifikaci pro uživatele, že byl přeřazen z náhradníků mezi účastníky události.
 * Volá se ze server action po změně účasti (když někdo odhlásí a uvolní místo).
 */
export async function notifyPromotedToParticipant(
  supabase: SupabaseClient,
  userId: string,
  eventId: string,
  eventTitle: string
): Promise<void> {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type: NOTIFICATION_TYPE_EVENT_PROMOTED,
    event_id: eventId,
    event_title: eventTitle || null,
  });

  if (error) {
    console.error("Error inserting promotion notification:", error);
  }
}
