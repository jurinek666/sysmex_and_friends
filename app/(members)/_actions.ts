"use server";

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'
import { revalidatePath } from 'next/cache';

export async function addComment(formData: FormData) {
    const content = formData.get("content") as string;
    const postSlug = formData.get("postSlug") as string;

    if (!content || !postSlug) {
        return { error: "Chybí obsah nebo ID příspěvku" };
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() { return cookieStore.getAll() },
            setAll(cookiesToSet) {
                 // Server Action context
                 try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                 } catch (err) {
                     // ignore
                     console.error(err)
                 }
            },
          },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Musíte být přihlášen" };
    }

    const { error } = await supabase.from("comments").insert({
        post_slug: postSlug,
        user_id: user.id,
        content: content
    });

    if (error) {
        console.error("Error inserting comment:", error);
        return { error: "Nepodařilo se uložit komentář." };
    }

    revalidatePath(`/clanky/${postSlug}`);
    return { success: true };
}

function getMembersSupabase() {
    return (async () => {
        const cookieStore = await cookies();
        return createServerClient(
            env.NEXT_PUBLIC_SUPABASE_URL,
            env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                        } catch (err) {
                            console.error(err)
                        }
                    },
                },
            }
        );
    })();
}

export type UpdateProfileResult = { success: true } | { success: false; error: string };

export async function updateProfile(formData: FormData): Promise<UpdateProfileResult> {
    const supabase = await getMembersSupabase();
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
    const supabase = await getMembersSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Musíte být přihlášen" };

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

    revalidatePath("/schedule");
    revalidatePath("/", "layout");
    return { success: true };
}
