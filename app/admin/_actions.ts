"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/admin/auth";

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
    const errorMessage = error instanceof Error ? error.message : "Nastala neznámá chyba";
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

    const { error } = await supabase.from("Post").insert({
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      isFeatured,
    });

    if (error) throw error;

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
      })
      .eq("id", id);

    if (error) throw error;

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

    if (error) throw error;

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

    const { error } = await supabase.from("Result").insert({
      date: new Date(dateStr).toISOString(),
      venue,
      teamName,
      placement,
      score,
      note,
      seasonId: season.id,
    });

    if (error) throw error;

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
      })
      .eq("id", id);

    if (error) throw error;

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

    if (error) throw error;

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

    const { error } = await supabase.from("Member").insert({
      displayName,
      nickname,
      role,
      gender,
      bio,
    });

    if (error) throw error;

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
      })
      .eq("id", id);

    if (error) throw error;

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

    if (error) throw error;

    revalidatePath("/admin/members");
    revalidatePath("/tym");
    revalidatePath("/");
  });
}

// ==========================================
// 4. PLAYLISTY (PLAYLISTS)
// ==========================================

export async function adminCreatePlaylist(formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();

    const title = String(formData.get("title"));
    const spotifyUrl = String(formData.get("spotifyUrl"));
    const description = formData.get("description")?.toString() || null;
    const isActive = formData.get("isActive") === "on";

    const { error } = await supabase.from("Playlist").insert({
      title,
      spotifyUrl,
      description,
      isActive,
    });

    if (error) throw error;

    revalidatePath("/admin/playlists");
    revalidatePath("/");
  });
}

export async function adminUpdatePlaylist(formData: FormData): Promise<ActionResult> {
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
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/playlists");
    revalidatePath("/");
  });
}

export async function adminDeletePlaylist(formData: FormData): Promise<ActionResult> {
  return handleAction(async () => {
    const { supabase } = await requireAuth();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("Playlist").delete().eq("id", id);

    if (error) throw error;

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

    const { error } = await supabase.from("Album").insert({
      title,
      dateTaken: new Date(dateStr).toISOString(),
      cloudinaryFolder,
      description,
      coverPublicId,
    });

    if (error) throw error;

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
      })
      .eq("id", id);

    if (error) throw error;

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

    if (error) throw error;

    revalidatePath("/admin/gallery");
    revalidatePath("/galerie");
    revalidatePath("/");
  });
}