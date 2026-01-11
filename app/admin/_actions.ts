"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/admin/auth";
import { randomUUID } from "crypto";

// Helper pro error handling
type ActionResult = { success: true } | { success: false; error: string };

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
      if ((error as any).code) {
        errorMessage += ` (kód: ${(error as any).code})`;
      }
      // Include hint if available
      if ((error as any).hint) {
        errorMessage += ` - ${(error as any).hint}`;
      }
    } else if (error && typeof error === 'object') {
      // Try to extract message from Supabase error object
      if ('message' in error && typeof (error as any).message === 'string') {
        errorMessage = (error as any).message;
        if ((error as any).code) {
          errorMessage += ` (kód: ${(error as any).code})`;
        }
        if ((error as any).hint) {
          errorMessage += ` - ${(error as any).hint}`;
        }
        if ((error as any).details) {
          errorMessage += ` - ${(error as any).details}`;
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

export async function adminCreatePost(formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/posts");
    revalidatePath("/clanky");
    revalidatePath("/");
  });
}

export async function adminUpdatePost(formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/posts");
    revalidatePath("/clanky");
    revalidatePath("/");
  });
}

export async function adminDeletePost(formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Post").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
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

export async function adminCreateResult(formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/results");
    revalidatePath("/vysledky");
    revalidatePath("/");
  });
}

export async function adminUpdateResult(formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/results");
    revalidatePath("/vysledky");
    revalidatePath("/");
  });
}

export async function adminDeleteResult(formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Result").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
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

export async function adminCreateMember(formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/members");
    revalidatePath("/tym");
    revalidatePath("/");
  });
}

export async function adminUpdateMember(formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/members");
    revalidatePath("/tym");
    revalidatePath("/");
  });
}

export async function adminDeleteMember(formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Member").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/playlists");
    revalidatePath("/");
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function adminUpdatePlaylist(_prevState: any, formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/playlists");
    revalidatePath("/");
  });
}

export async function adminDeletePlaylist(formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Playlist").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/playlists");
    revalidatePath("/");
  });
}

// ==========================================
// 5. GALERIE (ALBUMS) - NOVÉ
// ==========================================

export async function adminCreateAlbum(formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/galerie");
    revalidatePath("/");
  });
}

export async function adminUpdateAlbum(formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/galerie");
    revalidatePath("/");
  });
}

export async function adminDeleteAlbum(formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Album").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
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

export async function adminCreateEvent(formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/calendar");
    revalidatePath("/kalendar");
    revalidatePath("/");
  });
}

export async function adminUpdateEvent(formData: FormData): Promise<ActionResult> {
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
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/calendar");
    revalidatePath("/kalendar");
    revalidatePath("/");
  });
}

export async function adminDeleteEvent(formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Event").delete().eq("id", id);

    if (error) {
      const dbError = new Error(error.message || 'Database error');
      (dbError as any).code = error.code;
      (dbError as any).details = error.details;
      (dbError as any).hint = error.hint;
      throw dbError;
    }

    revalidatePath("/admin/calendar");
    revalidatePath("/kalendar");
    revalidatePath("/");
  });
}