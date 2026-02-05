import { SupabaseClient } from "@supabase/supabase-js";
import { Comment, EventParticipant, Profile } from "@/lib/types";

// --- COMMENTS ---
// DB tabulka comments má pouze post_slug (ne entity_id/entity_type). Pro komentáře u akcí/alb je potřeba migrace.

export async function getComments(supabase: SupabaseClient, entityId: string, entityType: 'post' | 'event' | 'album' = 'post'): Promise<Comment[]> {
  if (entityType !== 'post') {
    // Komentáře k akcím/albům vyžadují v DB sloupce entity_id, entity_type – zatím vracíme prázdné pole
    return [];
  }
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq("post_slug", entityId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return (data as unknown) as Comment[];
}

// --- PARTICIPANTS ---

export async function getParticipantsByEventId(supabase: SupabaseClient, eventId: string): Promise<EventParticipant[]> {
  const { data, error } = await supabase
    .from("event_participants")
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching participants:", error);
    return [];
  }

  return (data as unknown) as EventParticipant[];
}

// --- PROFILE ---

export async function getCurrentUserProfile(supabase: SupabaseClient): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (error || !data) return null;
    return (data as unknown) as Profile;
}
