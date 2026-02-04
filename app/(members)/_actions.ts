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
