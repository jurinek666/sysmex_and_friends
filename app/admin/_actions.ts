"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ==========================================
// 1. ČLÁNKY (POSTS)
// ==========================================

export async function adminCreatePost(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title"));
  const slug = String(formData.get("slug"));
  const excerpt = String(formData.get("excerpt"));
  const content = String(formData.get("content"));
  const coverImageUrl = formData.get("coverImageUrl")?.toString() || null;
  const isFeatured = formData.get("isFeatured") === "on";

  await supabase.from("Post").insert({
    title,
    slug,
    excerpt,
    content,
    coverImageUrl,
    isFeatured,
  });

  revalidatePath("/admin/posts");
  revalidatePath("/clanky");
  revalidatePath("/");
}

export async function adminDeletePost(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  await supabase.from("Post").delete().eq("id", id);

  revalidatePath("/admin/posts");
  revalidatePath("/clanky");
  revalidatePath("/");
}

// ==========================================
// 2. VÝSLEDKY (RESULTS)
// ==========================================

export async function adminCreateResult(formData: FormData) {
  const supabase = await createClient();

  const seasonCode = String(formData.get("seasonCode"));
  const dateStr = String(formData.get("date"));
  const venue = String(formData.get("venue"));
  const teamName = String(formData.get("teamName"));
  const placement = Number(formData.get("placement"));
  const score = Number(formData.get("score"));
  const note = formData.get("note")?.toString() || null;

  const { data: season } = await supabase
    .from("Season")
    .select("id")
    .eq("code", seasonCode)
    .single();

  if (!season) {
    throw new Error(`Sezóna s kódem ${seasonCode} nebyla nalezena.`);
  }

  await supabase.from("Result").insert({
    date: new Date(dateStr).toISOString(),
    venue,
    teamName,
    placement,
    score,
    note,
    seasonId: season.id,
  });

  revalidatePath("/admin/results");
  revalidatePath("/vysledky");
  revalidatePath("/");
}

export async function adminDeleteResult(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  await supabase.from("Result").delete().eq("id", id);

  revalidatePath("/admin/results");
  revalidatePath("/vysledky");
  revalidatePath("/");
}

// ==========================================
// 3. TÝM (MEMBERS)
// ==========================================

export async function adminCreateMember(formData: FormData) {
  const supabase = await createClient();

  const displayName = String(formData.get("displayName"));
  const nickname = formData.get("nickname")?.toString() || null;
  const role = formData.get("role")?.toString() || null;
  const gender = String(formData.get("gender"));
  const bio = formData.get("bio")?.toString() || null;

  await supabase.from("Member").insert({
    displayName,
    nickname,
    role,
    gender,
    bio,
  });

  revalidatePath("/admin/members");
  revalidatePath("/tym");
  revalidatePath("/");
}

export async function adminDeleteMember(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  await supabase.from("Member").delete().eq("id", id);

  revalidatePath("/admin/members");
  revalidatePath("/tym");
  revalidatePath("/");
}

// ==========================================
// 4. PLAYLISTY (PLAYLISTS)
// ==========================================

export async function adminCreatePlaylist(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title"));
  const spotifyUrl = String(formData.get("spotifyUrl"));
  const description = formData.get("description")?.toString() || null;
  const isActive = formData.get("isActive") === "on";

  await supabase.from("Playlist").insert({
    title,
    spotifyUrl,
    description,
    isActive,
  });

  revalidatePath("/admin/playlists");
  revalidatePath("/");
}

export async function adminDeletePlaylist(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  await supabase.from("Playlist").delete().eq("id", id);

  revalidatePath("/admin/playlists");
  revalidatePath("/");
}

// ==========================================
// 5. GALERIE (ALBUMS) - NOVÉ
// ==========================================

export async function adminCreateAlbum(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title"));
  const dateStr = String(formData.get("dateTaken"));
  const cloudinaryFolder = String(formData.get("cloudinaryFolder"));
  const description = formData.get("description")?.toString() || null;
  const coverPublicId = formData.get("coverPublicId")?.toString() || null;

  await supabase.from("Album").insert({
    title,
    dateTaken: new Date(dateStr).toISOString(),
    cloudinaryFolder,
    description,
    coverPublicId,
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/galerie");
  revalidatePath("/");
}

export async function adminDeleteAlbum(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  await supabase.from("Album").delete().eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/galerie");
  revalidatePath("/");
}