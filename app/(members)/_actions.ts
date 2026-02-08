"use server";

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache';
import { getParticipantsByEventId } from '@/lib/queries/team';
import { getGoingOrderedByCreatedAt, MAX_EVENT_PARTICIPANTS } from '@/lib/events';
import { getEventTitleById } from '@/lib/queries/events';
import { notifyPromotedToParticipant } from '@/lib/notifications';

export async function addComment(formData: FormData) {
    const content = formData.get("content") as string;
    // Backwards compatibility for postSlug
    const postSlug = formData.get("postSlug") as string;
    const entityId = (formData.get("entityId") as string) || postSlug;
    const entityType = (formData.get("entityType") as string) || "post";

    if (!content || !entityId) {
        return { error: "Chybí obsah nebo ID entity" };
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Musíte být přihlášen" };
    }

    const { error } = await supabase.from("comments").insert({
        entity_id: entityId,
        entity_type: entityType,
        // zpětná kompatibilita (sloupec NOT NULL).
        // Pro non-post entity (Event/Album) zde ukládáme entityId (UUID), abychom splnili constraint.
        post_slug: entityId,
        user_id: user.id,
        content: content
    });

    if (error) {
        console.error("Error inserting comment:", error);
        return { error: "Nepodařilo se uložit komentář." };
    }

    if (entityType === "post") {
        revalidatePath(`/clanky/${entityId}`);
    } else if (entityType === "album") {
        revalidatePath(`/galerie/${entityId}`);
    } else if (entityType === "event") {
        revalidatePath(`/kalendar`);
        revalidatePath(`/schedule`);
    }

    return { success: true };
}

export type UpdateProfileResult = { success: true } | { success: false; error: string };

export async function updateProfile(formData: FormData): Promise<UpdateProfileResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Musíte být přihlášen" };

    const displayName = (formData.get("display_name") as string)?.trim() ?? "";
    const avatarUrl = (formData.get("avatar_url") as string)?.trim() || null;

    const { error } = await supabase
        .from("profiles")
        .update({
            display_name: displayName || null,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Nepodařilo se uložit profil." };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
    return { success: true };
}

export type SetEventParticipationResult = { success: true } | { success: false; error: string };

export async function setEventParticipation(
    eventId: string,
    status: "going" | "maybe" | "not_going",
    note?: string | null
): Promise<SetEventParticipationResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Musíte být přihlášen" };

    // Před upsertem: první osmička "going" podle created_at
    const participantsBefore = await getParticipantsByEventId(supabase, eventId);
    const goingBefore = getGoingOrderedByCreatedAt(participantsBefore);
    const oldParticipantIds = goingBefore
        .slice(0, MAX_EVENT_PARTICIPANTS)
        .map((p) => p.user_id);

    const now = new Date().toISOString();
    const { error } = await supabase
        .from("event_participants")
        .upsert(
            {
                event_id: eventId,
                user_id: user.id,
                status,
                note: note?.trim() || null,
                updated_at: now,
            },
            { onConflict: "event_id,user_id" }
        );

    if (error) {
        console.error("Error setting participation:", error);
        return { success: false, error: "Nepodařilo se uložit účast." };
    }

    // Po upsertu: nová první osmička; kdo je nově v osmičce = přeřazení z náhradníků
    const participantsAfter = await getParticipantsByEventId(supabase, eventId);
    const goingAfter = getGoingOrderedByCreatedAt(participantsAfter);
    const newParticipantIds = goingAfter
        .slice(0, MAX_EVENT_PARTICIPANTS)
        .map((p) => p.user_id);
    const promotedIds = newParticipantIds.filter(
        (id) => !oldParticipantIds.includes(id)
    );

    if (promotedIds.length > 0) {
        const eventTitle = await getEventTitleById(supabase, eventId) ?? "";
        for (const userId of promotedIds) {
            await notifyPromotedToParticipant(supabase, userId, eventId, eventTitle);
        }
    }

    revalidatePath("/schedule");
    revalidatePath("/", "layout");
    return { success: true };
}

export async function markNotificationRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Musíte být přihlášen" };

    const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", notificationId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error marking notification read:", error);
        return { success: false, error: "Nepodařilo se označit jako přečtené." };
    }

    revalidatePath("/notifications");
    revalidatePath("/schedule");
    return { success: true };
}
