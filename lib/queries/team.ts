import { SupabaseClient } from "@supabase/supabase-js";
import { Comment, EventParticipant, Profile } from "@/lib/types";

// --- COMMENTS ---

export async function getComments(supabase: SupabaseClient, entityId: string, entityType: 'post' | 'event' | 'album' = 'post'): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq("entity_id", entityId)
    .eq("entity_type", entityType)
    .order("created_at", { ascending: true });

  if (error) {
    // Fallback for legacy comments (where entity_type might be null or missing, though migration should handle it)
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
