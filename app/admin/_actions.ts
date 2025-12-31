"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Gender } from "@prisma/client";

// ==========================================
// 1. ČLÁNKY (POSTS)
// ==========================================

export async function adminCreatePost(formData: FormData) {
  const title = String(formData.get("title"));
  const slug = String(formData.get("slug"));
  const excerpt = String(formData.get("excerpt"));
  const content = String(formData.get("content"));
  const coverImageUrl = formData.get("coverImageUrl")?.toString() || null;
  const isFeatured = formData.get("isFeatured") === "on"; // Checkbox vrací "on" nebo null

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      isFeatured,
    },
  });

  // Aktualizujeme cache na místech, kde se články zobrazují
  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  revalidatePath("/");
}

export async function adminDeletePost(formData: FormData) {
  const id = String(formData.get("id"));

  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  revalidatePath("/");
}

// ==========================================
// 2. VÝSLEDKY (RESULTS)
// ==========================================

export async function adminCreateResult(formData: FormData) {
  const seasonCode = String(formData.get("seasonCode"));
  const date = new Date(String(formData.get("date")));
  const venue = String(formData.get("venue"));
  const teamName = String(formData.get("teamName"));
  const placement = Number(formData.get("placement"));
  const score = Number(formData.get("score"));
  const note = formData.get("note")?.toString() || null;

  // Nejprve musíme najít sezónu podle kódu, abychom získali její ID
  const season = await prisma.season.findUnique({
    where: { code: seasonCode },
  });

  if (!season) {
    throw new Error(`Sezóna s kódem ${seasonCode} nebyla nalezena.`);
  }

  await prisma.result.create({
    data: {
      date,
      venue,
      teamName,
      placement,
      score,
      note,
      seasonId: season.id,
    },
  });

  revalidatePath("/admin/results");
  revalidatePath("/results");
  revalidatePath("/");
}

export async function adminDeleteResult(formData: FormData) {
  const id = String(formData.get("id"));

  await prisma.result.delete({
    where: { id },
  });

  revalidatePath("/admin/results");
  revalidatePath("/results");
  revalidatePath("/");
}

// ==========================================
// 3. TÝM (MEMBERS)
// ==========================================

export async function adminCreateMember(formData: FormData) {
  const displayName = String(formData.get("displayName"));
  const nickname = formData.get("nickname")?.toString() || null;
  const role = formData.get("role")?.toString() || null;
  const gender = String(formData.get("gender")) as Gender; // "MALE" nebo "FEMALE"
  const bio = formData.get("bio")?.toString() || null;

  await prisma.member.create({
    data: {
      displayName,
      nickname,
      role,
      gender,
      bio,
    },
  });

  revalidatePath("/admin/members");
  revalidatePath("/team");
  revalidatePath("/");
}

export async function adminDeleteMember(formData: FormData) {
  const id = String(formData.get("id"));

  await prisma.member.delete({
    where: { id },
  });

  revalidatePath("/admin/members");
  revalidatePath("/team");
  revalidatePath("/");
}