"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/admin/auth";
import { randomUUID } from "crypto";

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

    const title = String(formData.get("title"));
    const slug = String(formData.get("slug"));
    const excerpt = String(formData.get("excerpt"));
    const content = String(formData.get("content"));
    const coverImageUrl = formData.get("coverImageUrl")?.toString() || null;
    const isFeatured = formData.get("isFeatured") === "on";

    const id = randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from("Post").insert({
      id,
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      isFeatured,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    if (error) {
      // Convert Supabase error to Error instance for proper handling
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/posts");
    revalidatePath("/posts");
    revalidatePath("/");
  });
}

export async function adminUpdatePost(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const id = String(formData.get("id"));
    const title = String(formData.get("title"));
    const slug = String(formData.get("slug"));
    const excerpt = String(formData.get("excerpt"));
    const content = String(formData.get("content"));
    const coverImageUrl = formData.get("coverImageUrl")?.toString() || null;
    const isFeatured = formData.get("isFeatured") === "on";

    const { error } = await supabase
      .from("Post")
      .update({
        title,
        slug,
        excerpt,
        content,
        coverImageUrl,
        isFeatured,
        updatedAt: new Date().toISOString(),
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
    revalidatePath("/posts");
    revalidatePath("/");
  });
}

export async function adminDeletePost(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Post").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/posts");
    revalidatePath("/posts");
    revalidatePath("/");
  });
}

// ==========================================
// 2. VÝSLEDKY (RESULTS)
// ==========================================

export async function adminCreateResult(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const seasonCode = String(formData.get("seasonCode"));
    const dateStr = String(formData.get("date"));
    const venue = String(formData.get("venue"));
    const teamName = String(formData.get("teamName"));
    const placement = Number(formData.get("placement"));
    const score = Number(formData.get("score"));
    const note = formData.get("note")?.toString() || null;

    const { data: season, error: seasonError } = await supabase
      .from("Season")
      .select("id")
      .eq("code", seasonCode)
      .single();

    if (seasonError || !season) {
      throw new Error(`Sezóna s kódem ${seasonCode} nebyla nalezena.`);
    }

    const id = randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from("Result").insert({
      id,
      date: new Date(dateStr).toISOString(),
      venue,
      teamName,
      placement,
      score,
      note,
      seasonId: season.id,
      createdAt: now,
      updatedAt: now,
    });

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

export async function adminUpdateResult(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const id = String(formData.get("id"));
    const seasonCode = String(formData.get("seasonCode"));
    const dateStr = String(formData.get("date"));
    const venue = String(formData.get("venue"));
    const teamName = String(formData.get("teamName"));
    const placement = Number(formData.get("placement"));
    const score = Number(formData.get("score"));
    const note = formData.get("note")?.toString() || null;

    const { data: season, error: seasonError } = await supabase
      .from("Season")
      .select("id")
      .eq("code", seasonCode)
      .single();

    if (seasonError || !season) {
      throw new Error(`Sezóna s kódem ${seasonCode} nebyla nalezena.`);
    }

    const { error } = await supabase
      .from("Result")
      .update({
        date: new Date(dateStr).toISOString(),
        venue,
        teamName,
        placement,
        score,
        note,
        seasonId: season.id,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id);

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

export async function adminDeleteResult(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Result").delete().eq("id", id);

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

    const displayName = String(formData.get("displayName"));
    const nickname = formData.get("nickname")?.toString() || null;
    const role = formData.get("role")?.toString() || null;
    const gender = String(formData.get("gender"));
    const bio = formData.get("bio")?.toString() || null;

    const id = randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from("Member").insert({
      id,
      displayName,
      nickname,
      role,
      gender,
      bio,
      createdAt: now,
      updatedAt: now,
    });

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/members");
    revalidatePath("/team");
    revalidatePath("/");
  });
}

export async function adminUpdateMember(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const id = String(formData.get("id"));
    const displayName = String(formData.get("displayName"));
    const nickname = formData.get("nickname")?.toString() || null;
    const role = formData.get("role")?.toString() || null;
    const gender = String(formData.get("gender"));
    const bio = formData.get("bio")?.toString() || null;

    const { error } = await supabase
      .from("Member")
      .update({
        displayName,
        nickname,
        role,
        gender,
        bio,
        updatedAt: new Date().toISOString(),
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
    revalidatePath("/team");
    revalidatePath("/");
  });
}

export async function adminDeleteMember(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Member").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error') as SupabaseError;
      dbError.code = error.code;
      dbError.details = error.details;
      dbError.hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/members");
    revalidatePath("/team");
    revalidatePath("/");
  });
}

// ==========================================
// 4. PLAYLISTY (PLAYLISTS)
// ==========================================

export async function adminCreatePlaylist(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const title = String(formData.get("title"));
    const spotifyUrl = String(formData.get("spotifyUrl"));
    const description = formData.get("description")?.toString() || null;
    const isActive = formData.get("isActive") === "on";

    const id = randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from("Playlist").insert({
      id,
      title,
      spotifyUrl,
      description,
      isActive,
      createdAt: now,
      updatedAt: now,
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
    const title = String(formData.get("title"));
    const spotifyUrl = String(formData.get("spotifyUrl"));
    const description = formData.get("description")?.toString() || null;
    const isActive = formData.get("isActive") === "on";

    const { error } = await supabase
      .from("Playlist")
      .update({
        title,
        spotifyUrl,
        description,
        isActive,
        updatedAt: new Date().toISOString(),
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

    const { error } = await supabase.from("Playlist").delete().eq("id", id);

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

    const title = String(formData.get("title"));
    const dateStr = String(formData.get("dateTaken"));
    const cloudinaryFolder = String(formData.get("cloudinaryFolder"));
    const description = formData.get("description")?.toString() || null;
    const coverPublicId = formData.get("coverPublicId")?.toString() || null;

    const id = randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from("Album").insert({
      id,
      title,
      dateTaken: new Date(dateStr).toISOString(),
      cloudinaryFolder,
      description,
      coverPublicId,
      createdAt: now,
      updatedAt: now,
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
    revalidatePath("/");
  });
}

export async function adminUpdateAlbum(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const id = String(formData.get("id"));
    const title = String(formData.get("title"));
    const dateStr = String(formData.get("dateTaken"));
    const cloudinaryFolder = String(formData.get("cloudinaryFolder"));
    const description = formData.get("description")?.toString() || null;
    const coverPublicId = formData.get("coverPublicId")?.toString() || null;

    const { error } = await supabase
      .from("Album")
      .update({
        title,
        dateTaken: new Date(dateStr).toISOString(),
        cloudinaryFolder,
        description,
        coverPublicId,
        updatedAt: new Date().toISOString(),
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
    revalidatePath("/");
  });
}

export async function adminDeleteAlbum(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Album").delete().eq("id", id);

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

    const title = String(formData.get("title"));
    const dateStr = String(formData.get("date"));
    const venue = String(formData.get("venue"));
    const description = formData.get("description")?.toString() || null;
    const isUpcoming = formData.get("isUpcoming") === "on";

    const id = randomUUID();
    const now = new Date().toISOString();
    
    // Convert datetime-local to ISO string
    const eventDate = new Date(dateStr).toISOString();
    
    const { error } = await supabase.from("Event").insert({
      id,
      title,
      date: eventDate,
      venue,
      description,
      isUpcoming,
      createdAt: now,
      updatedAt: now,
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
    const title = String(formData.get("title"));
    const dateStr = String(formData.get("date"));
    const venue = String(formData.get("venue"));
    const description = formData.get("description")?.toString() || null;
    const isUpcoming = formData.get("isUpcoming") === "on";

    // Convert datetime-local to ISO string
    const eventDate = new Date(dateStr).toISOString();

    const { error } = await supabase
      .from("Event")
      .update({
        title,
        date: eventDate,
        venue,
        description,
        isUpcoming,
        updatedAt: new Date().toISOString(),
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

    const { error } = await supabase.from("Event").delete().eq("id", id);

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
