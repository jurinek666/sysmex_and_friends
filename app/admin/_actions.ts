"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/admin/auth";
import { randomUUID } from "crypto";
import {
  postSchema,
  resultSchema,
  memberSchema,
  playlistSchema,
  albumSchema,
  eventSchema
} from "@/lib/schemas";
import { ZodError } from "zod";

// Helper pro error handling
type ActionResult = { success: true } | { success: false; error: string };

// Supabase error interface
interface SupabaseError extends Error {
  code?: string;
  details?: string;
  hint?: string;
  message: string;
}

// Helper to check if error is a Next.js redirect error
function isRedirectError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  // Next.js redirect errors have a digest property with "NEXT_REDIRECT"
  const digest = (error as { digest?: string }).digest;
  return typeof digest === 'string' && digest.includes('NEXT_REDIRECT');
}

async function handleAction<T>(
  action: () => Promise<T>
): Promise<ActionResult> {
  try {
    await action();
    return { success: true };
  } catch (error) {
    // Re-throw redirect errors so they can propagate and perform the redirect
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      // Format Zod errors
      const errorMessage = error.issues.map(e => e.message).join(", ");
      return { success: false, error: errorMessage };
    }

    // Handle Supabase errors (they have a 'message' property but aren't Error instances)
    let errorMessage = "Nastala neznámá chyba";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Include code if available
      const supabaseError = error as SupabaseError;
      if (supabaseError.code) {
        errorMessage += ` (kód: ${supabaseError.code})`;
      }
      // Include hint if available
      if (supabaseError.hint) {
        errorMessage += ` - ${supabaseError.hint}`;
      }
    } else if (error && typeof error === 'object') {
      // Try to extract message from Supabase error object
      const errorObj = error as { message?: string; code?: string; hint?: string; details?: string };
      if ('message' in error && typeof errorObj.message === 'string') {
        errorMessage = errorObj.message;
        if (errorObj.code) {
          errorMessage += ` (kód: ${errorObj.code})`;
        }
        if (errorObj.hint) {
          errorMessage += ` - ${errorObj.hint}`;
        }
        if (errorObj.details) {
          errorMessage += ` - ${errorObj.details}`;
        }
      } else {
        // Fallback: stringify the error
        errorMessage = JSON.stringify(error);
      }
    }
    console.error("Admin action error:", error);
    return { success: false, error: errorMessage };
  }
}

// ==========================================
// 1. ČLÁNKY (POSTS)
// ==========================================

export async function adminCreatePost(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const rawData = {
      title: formData.get("title")?.toString() || "",
      slug: formData.get("slug")?.toString() || "",
      excerpt: formData.get("excerpt")?.toString() || "",
      content: formData.get("content")?.toString() || "",
      coverImageUrl: formData.get("coverImageUrl")?.toString() || null,
      isFeatured: formData.get("isFeatured") === "on",
    };

    const validated = postSchema.parse(rawData);

    const id = randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from("posts").insert({
      id,
      title: validated.title,
      slug: validated.slug,
      excerpt: validated.excerpt,
      content: validated.content,
      cover_image_url: validated.coverImageUrl,
      is_featured: validated.isFeatured,
      published_at: now,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/posts");
    revalidatePath("/clanky");
    revalidatePath("/");
  });
}

export async function adminUpdatePost(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const id = String(formData.get("id"));

    const rawData = {
      title: formData.get("title")?.toString() || "",
      slug: formData.get("slug")?.toString() || "",
      excerpt: formData.get("excerpt")?.toString() || "",
      content: formData.get("content")?.toString() || "",
      coverImageUrl: formData.get("coverImageUrl")?.toString() || null,
      isFeatured: formData.get("isFeatured") === "on",
    };

    const validated = postSchema.parse(rawData);

    const { error } = await supabase
      .from("posts")
      .update({
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt,
        content: validated.content,
        cover_image_url: validated.coverImageUrl,
        is_featured: validated.isFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/posts");
    revalidatePath("/clanky");
    revalidatePath("/");
  });
}

export async function adminDeletePost(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/posts");
    revalidatePath("/clanky");
    revalidatePath("/");
  });
}

// ==========================================
// 2. VÝSLEDKY (RESULTS)
// ==========================================

export async function adminCreateResult(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const rawData = {
      seasonCode: formData.get("seasonCode")?.toString() || "",
      date: formData.get("date")?.toString() || "",
      venue: formData.get("venue")?.toString() || "",
      teamName: formData.get("teamName")?.toString() || "",
      placement: formData.get("placement")?.toString() || "0",
      score: formData.get("score")?.toString() || "0",
      note: formData.get("note")?.toString() || null,
      memberIds: formData.getAll("memberIds").filter((v): v is string => typeof v === "string"),
    };

    const validated = resultSchema.parse(rawData);

    const { data: season, error: seasonError } = await supabase
      .from("seasons")
      .select("id")
      .eq("code", validated.seasonCode)
      .single();

    if (seasonError || !season) {
      throw new Error(`Sezóna s kódem ${validated.seasonCode} nebyla nalezena.`);
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    const { error } = await supabase.from("results").insert({
      id,
      date: new Date(validated.date).toISOString(),
      venue: validated.venue,
      team_name: validated.teamName,
      placement: validated.placement,
      score: validated.score,
      note: validated.note,
      season_id: season.id,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    if (validated.memberIds.length > 0) {
      const { error: rmError } = await supabase.from("result_members").insert(
        validated.memberIds.map((memberId, index) => ({
          result_id: id,
          member_id: memberId,
          sort_order: index,
        }))
      );
      if (rmError) {
        const dbError = new Error(rmError.message || 'ResultMember insert error') as SupabaseError;
        dbError.code = rmError.code;
        dbError.details = rmError.details;
        dbError.hint = rmError.hint;
        throw dbError;
      }
    }

    revalidatePath("/admin/results");
    revalidatePath("/vysledky");
    revalidatePath("/");
  });
}

export async function adminUpdateResult(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const rawData = {
      seasonCode: formData.get("seasonCode")?.toString() || "",
      date: formData.get("date")?.toString() || "",
      venue: formData.get("venue")?.toString() || "",
      teamName: formData.get("teamName")?.toString() || "",
      placement: formData.get("placement")?.toString() || "0",
      score: formData.get("score")?.toString() || "0",
      note: formData.get("note")?.toString() || null,
      memberIds: formData.getAll("memberIds").filter((v): v is string => typeof v === "string"),
    };

    const validated = resultSchema.parse(rawData);

    const { data: season, error: seasonError } = await supabase
      .from("seasons")
      .select("id")
      .eq("code", validated.seasonCode)
      .single();

    if (seasonError || !season) {
      throw new Error(`Sezóna s kódem ${validated.seasonCode} nebyla nalezena.`);
    }

    const { error } = await supabase
      .from("results")
      .update({
        date: new Date(validated.date).toISOString(),
        venue: validated.venue,
        team_name: validated.teamName,
        placement: validated.placement,
        score: validated.score,
        note: validated.note,
        season_id: season.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    const { error: deleteRmError } = await supabase.from("result_members").delete().eq("result_id", id);
    if (deleteRmError) {
      const dbError = new Error(deleteRmError.message || 'ResultMember delete error') as SupabaseError;
      dbError.code = deleteRmError.code;
      dbError.details = deleteRmError.details;
      dbError.hint = deleteRmError.hint;
      throw dbError;
    }

    if (validated.memberIds.length > 0) {
      const { error: rmError } = await supabase.from("result_members").insert(
        validated.memberIds.map((memberId, index) => ({
          result_id: id,
          member_id: memberId,
          sort_order: index,
        }))
      );
      if (rmError) {
        const dbError = new Error(rmError.message || 'ResultMember insert error') as SupabaseError;
        dbError.code = rmError.code;
        dbError.details = rmError.details;
        dbError.hint = rmError.hint;
        throw dbError;
      }
    }

    revalidatePath("/admin/results");
    revalidatePath("/vysledky");
    revalidatePath("/");
  });
}

export async function adminDeleteResult(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("results").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/results");
    revalidatePath("/vysledky");
    revalidatePath("/");
  });
}

// ==========================================
// 3. TÝM (MEMBERS)
// ==========================================

export async function adminCreateMember(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const profileId = formData.get("profile_id")?.toString() || null;

    const rawData = {
      displayName: formData.get("displayName")?.toString() || "",
      nickname: formData.get("nickname")?.toString() || null,
      role: formData.get("role")?.toString() || null,
      gender: formData.get("gender")?.toString() || "",
      bio: formData.get("bio")?.toString() || null,
      profile_id: profileId,
      avatarUrl: formData.get("avatarUrl")?.toString() || null,
    };

    // If linked to profile, force sync data from profile
    if (profileId) {
       const { data: profile } = await supabase.from("profiles").select("display_name, avatar_url").eq("id", profileId).single();
       if (profile) {
         if (profile.display_name) rawData.displayName = profile.display_name;
         if (profile.avatar_url) rawData.avatarUrl = profile.avatar_url;
       }
    }

    const validated = memberSchema.parse(rawData);

    const id = randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from("members").insert({
      id,
      display_name: validated.displayName,
      nickname: validated.nickname,
      role: validated.role,
      gender: validated.gender,
      bio: validated.bio,
      profile_id: validated.profile_id,
      avatar_url: validated.avatarUrl,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/members");
    revalidatePath("/tym");
    revalidatePath("/");
  });
}

export async function adminUpdateMember(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));
    const profileId = formData.get("profile_id")?.toString() || null;

    const rawData = {
      displayName: formData.get("displayName")?.toString() || "",
      nickname: formData.get("nickname")?.toString() || null,
      role: formData.get("role")?.toString() || null,
      gender: formData.get("gender")?.toString() || "",
      bio: formData.get("bio")?.toString() || null,
      profile_id: profileId,
      avatarUrl: formData.get("avatarUrl")?.toString() || null,
    };

    // If linked to profile, force sync data from profile
    if (profileId) {
       const { data: profile } = await supabase.from("profiles").select("display_name, avatar_url").eq("id", profileId).single();
       if (profile) {
         if (profile.display_name) rawData.displayName = profile.display_name;
         if (profile.avatar_url) rawData.avatarUrl = profile.avatar_url;
       }
    }

    const validated = memberSchema.parse(rawData);

    const { error } = await supabase
      .from("members")
      .update({
        display_name: validated.displayName,
        nickname: validated.nickname,
        role: validated.role,
        gender: validated.gender,
        bio: validated.bio,
        profile_id: validated.profile_id,
        avatar_url: validated.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/members");
    revalidatePath("/tym");
    revalidatePath("/");
  });
}

export async function adminDeleteMember(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/members");
    revalidatePath("/tym");
    revalidatePath("/");
  });
}

// ==========================================
// 4. PLAYLISTY (PLAYLISTS)
// ==========================================

export async function adminCreatePlaylist(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const rawData = {
      title: formData.get("title")?.toString() || "",
      spotifyUrl: formData.get("spotifyUrl")?.toString() || "",
      description: formData.get("description")?.toString() || null,
      isActive: formData.get("isActive") === "on",
    };

    const validated = playlistSchema.parse(rawData);

    const id = randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from("playlists").insert({
      id,
      title: validated.title,
      spotify_url: validated.spotifyUrl,
      description: validated.description,
      is_active: validated.isActive,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/playlists");
    revalidatePath("/");
  });
}

export async function adminUpdatePlaylist(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const rawData = {
      title: formData.get("title")?.toString() || "",
      spotifyUrl: formData.get("spotifyUrl")?.toString() || "",
      description: formData.get("description")?.toString() || null,
      isActive: formData.get("isActive") === "on",
    };

    const validated = playlistSchema.parse(rawData);

    const { error } = await supabase
      .from("playlists")
      .update({
        title: validated.title,
        spotify_url: validated.spotifyUrl,
        description: validated.description,
        is_active: validated.isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/playlists");
    revalidatePath("/");
  });
}

export async function adminDeletePlaylist(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("playlists").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/playlists");
    revalidatePath("/");
  });
}

// ==========================================
// 5. GALERIE (ALBUMS) - NOVÉ
// ==========================================

export async function adminCreateAlbum(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const rawData = {
      title: formData.get("title")?.toString() || "",
      dateTaken: formData.get("dateTaken")?.toString() || "",
      cloudinaryFolder: formData.get("cloudinaryFolder")?.toString() || "",
      description: formData.get("description")?.toString() || null,
      coverPublicId: formData.get("coverPublicId")?.toString() || null,
    };

    const validated = albumSchema.parse(rawData);

    const id = randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from("albums").insert({
      id,
      title: validated.title,
      date_taken: new Date(validated.dateTaken).toISOString(),
      cloudinary_folder: validated.cloudinaryFolder,
      description: validated.description,
      cover_public_id: validated.coverPublicId,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/galerie");
    revalidatePath(`/galerie/${id}`);
    revalidatePath("/");
  });
}

export async function adminUpdateAlbum(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const rawData = {
      title: formData.get("title")?.toString() || "",
      dateTaken: formData.get("dateTaken")?.toString() || "",
      cloudinaryFolder: formData.get("cloudinaryFolder")?.toString() || "",
      description: formData.get("description")?.toString() || null,
      coverPublicId: formData.get("coverPublicId")?.toString() || null,
    };

    const validated = albumSchema.parse(rawData);

    const { error } = await supabase
      .from("albums")
      .update({
        title: validated.title,
        date_taken: new Date(validated.dateTaken).toISOString(),
        cloudinary_folder: validated.cloudinaryFolder,
        description: validated.description,
        cover_public_id: validated.coverPublicId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/galerie");
    revalidatePath(`/galerie/${id}`);
    revalidatePath("/");
  });
}

export async function adminDeleteAlbum(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("albums").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/galerie");
    revalidatePath("/");
  });
}

// ==========================================
// 6. KALENDÁŘ (EVENTS)
// ==========================================

export async function adminCreateEvent(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const rawData = {
      title: formData.get("title")?.toString() || "",
      date: formData.get("date")?.toString() || "",
      venue: formData.get("venue")?.toString() || "",
      description: formData.get("description")?.toString() || null,
      isUpcoming: formData.get("isUpcoming") === "on",
    };

    const validated = eventSchema.parse(rawData);

    const id = randomUUID();
    const now = new Date().toISOString();
    
    // Convert datetime-local to ISO string
    const eventDate = new Date(validated.date).toISOString();
    
    const { error } = await supabase.from("events").insert({
      id,
      title: validated.title,
      date: eventDate,
      venue: validated.venue,
      description: validated.description,
      is_upcoming: validated.isUpcoming,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/calendar");
    revalidatePath("/kalendar");
    revalidatePath("/");
  });
}

export async function adminUpdateEvent(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const rawData = {
      title: formData.get("title")?.toString() || "",
      date: formData.get("date")?.toString() || "",
      venue: formData.get("venue")?.toString() || "",
      description: formData.get("description")?.toString() || null,
      isUpcoming: formData.get("isUpcoming") === "on",
    };

    const validated = eventSchema.parse(rawData);

    // Convert datetime-local to ISO string
    const eventDate = new Date(validated.date).toISOString();

    const { error } = await supabase
      .from("events")
      .update({
        title: validated.title,
        date: eventDate,
        venue: validated.venue,
        description: validated.description,
        is_upcoming: validated.isUpcoming,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/calendar");
    revalidatePath("/kalendar");
    revalidatePath("/");
  });
}

export async function adminDeleteEvent(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/calendar");
    revalidatePath("/kalendar");
    revalidatePath("/");
  });
}

// ==========================================
// REGISTROVANÍ UŽIVATELÉ (PROFILES)
// ==========================================

export async function adminUpdateProfile(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));
    const displayName = (formData.get("display_name") as string)?.trim() || null;
    const role = (formData.get("role") as string)?.trim() || null;
    if (role && !["member", "admin", "moderator"].includes(role)) {
      return { success: false, error: "Neplatná role. Povolené: member, admin, moderator." };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        role: role || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      const dbError = new Error(error.message || "Chyba databáze") as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/users");
    revalidatePath("/", "layout");
  });
}

export async function adminDeleteUser(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    await requireAuth();
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminClient = createAdminClient();
    if (!adminClient) {
      return { success: false, error: "Smazání uživatele vyžaduje nastavení SUPABASE_SERVICE_ROLE_KEY v .env." };
    }

    const id = String(formData.get("id"));
    const { error } = await adminClient.auth.admin.deleteUser(id);

    if (error) {
      const dbError = new Error(error.message || "Chyba při mazání") as SupabaseError;
      dbError.code = error.code;
      throw dbError;
    }

    revalidatePath("/admin/users");
    revalidatePath("/", "layout");
  });
}
