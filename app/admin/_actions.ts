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
    const { error } = await supabase.from("Post").insert({
      id,
      ...validated,
      publishedAt: now,
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
      .from("Post")
      .update({
        ...validated,
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
    revalidatePath("/clanky");
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
      .from("Season")
      .select("id")
      .eq("code", validated.seasonCode)
      .single();

    if (seasonError || !season) {
      throw new Error(`Sezóna s kódem ${validated.seasonCode} nebyla nalezena.`);
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    // Omit seasonCode and memberIds from insert object (not columns on Result)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { seasonCode, memberIds, ...insertData } = validated;

    const { error } = await supabase.from("Result").insert({
      id,
      ...insertData,
      date: new Date(validated.date).toISOString(),
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

    if (memberIds.length > 0) {
      const { error: rmError } = await supabase.from("ResultMember").insert(
        memberIds.map((memberId, index) => ({
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
      .from("Season")
      .select("id")
      .eq("code", validated.seasonCode)
      .single();

    if (seasonError || !season) {
      throw new Error(`Sezóna s kódem ${validated.seasonCode} nebyla nalezena.`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { seasonCode, memberIds, ...updateData } = validated;

    const { error } = await supabase
      .from("Result")
      .update({
        ...updateData,
        date: new Date(validated.date).toISOString(),
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

    const { error: deleteRmError } = await supabase.from("ResultMember").delete().eq("result_id", id);
    if (deleteRmError) {
      const dbError = new Error(deleteRmError.message || 'ResultMember delete error') as SupabaseError;
      dbError.code = deleteRmError.code;
      dbError.details = deleteRmError.details;
      dbError.hint = deleteRmError.hint;
      throw dbError;
    }

    if (memberIds.length > 0) {
      const { error: rmError } = await supabase.from("ResultMember").insert(
        memberIds.map((memberId, index) => ({
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

    const rawData = {
      displayName: formData.get("displayName")?.toString() || "",
      nickname: formData.get("nickname")?.toString() || null,
      role: formData.get("role")?.toString() || null,
      gender: formData.get("gender")?.toString() || "",
      bio: formData.get("bio")?.toString() || null,
    };

    const validated = memberSchema.parse(rawData);

    const id = randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from("Member").insert({
      id,
      ...validated,
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
    revalidatePath("/tym");
    revalidatePath("/");
  });
}

export async function adminUpdateMember(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const rawData = {
      displayName: formData.get("displayName")?.toString() || "",
      nickname: formData.get("nickname")?.toString() || null,
      role: formData.get("role")?.toString() || null,
      gender: formData.get("gender")?.toString() || "",
      bio: formData.get("bio")?.toString() || null,
    };

    const validated = memberSchema.parse(rawData);

    const { error } = await supabase
      .from("Member")
      .update({
        ...validated,
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
    revalidatePath("/tym");
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
    const { error } = await supabase.from("Playlist").insert({
      id,
      ...validated,
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

    const rawData = {
      title: formData.get("title")?.toString() || "",
      spotifyUrl: formData.get("spotifyUrl")?.toString() || "",
      description: formData.get("description")?.toString() || null,
      isActive: formData.get("isActive") === "on",
    };

    const validated = playlistSchema.parse(rawData);

    const { error } = await supabase
      .from("Playlist")
      .update({
        ...validated,
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
    const { error } = await supabase.from("Album").insert({
      id,
      ...validated,
      dateTaken: new Date(validated.dateTaken).toISOString(),
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
      .from("Album")
      .update({
        ...validated,
        dateTaken: new Date(validated.dateTaken).toISOString(),
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
    revalidatePath(`/galerie/${id}`);
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
    
    const { error } = await supabase.from("Event").insert({
      id,
      ...validated,
      date: eventDate,
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
      .from("Event")
      .update({
        ...validated,
        date: eventDate,
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
