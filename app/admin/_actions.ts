"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Gender } from "@prisma/client";

// ---------- Posts ----------
const PostCreateSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug musí být lowercase a-z, 0-9 nebo -"),
  excerpt: z.string().min(3),
  content: z.string().min(1),
  isFeatured: z.coerce.boolean().optional().default(false),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
});

export async function adminCreatePost(formData: FormData) {
  const parsed = PostCreateSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    isFeatured: formData.get("isFeatured"),
    coverImageUrl: formData.get("coverImageUrl"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" | ") };
  }

  const { title, slug, excerpt, content, isFeatured, coverImageUrl } = parsed.data;

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      isFeatured,
      coverImageUrl: coverImageUrl || null,
      publishedAt: new Date(),
    },
  });

  revalidatePath("/clanky");
  revalidatePath("/", "layout");
  revalidatePath("/admin/posts");
  return { ok: true };
}

export async function adminDeletePost(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return { ok: false, message: "Chybí id" };

  await prisma.post.delete({ where: { id } });
  revalidatePath("/clanky");
  revalidatePath("/", "layout");
  revalidatePath("/admin/posts");
  return { ok: true };
}

// ---------- Results ----------
const ResultCreateSchema = z.object({
  seasonCode: z.string().min(1),
  date: z.string().min(1),
  venue: z.string().min(1),
  teamName: z.string().min(1),
  placement: z.coerce.number().int().min(1),
  score: z.coerce.number().int().min(0),
  note: z.string().optional().or(z.literal("")),
});

export async function adminCreateResult(formData: FormData) {
  const parsed = ResultCreateSchema.safeParse({
    seasonCode: formData.get("seasonCode"),
    date: formData.get("date"),
    venue: formData.get("venue"),
    teamName: formData.get("teamName"),
    placement: formData.get("placement"),
    score: formData.get("score"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" | ") };
  }

  const season = await prisma.season.findUnique({ where: { code: parsed.data.seasonCode } });
  if (!season) return { ok: false, message: "Sezóna s tímto code neexistuje" };

  await prisma.result.create({
    data: {
      seasonId: season.id,
      date: new Date(parsed.data.date),
      venue: parsed.data.venue,
      teamName: parsed.data.teamName,
      placement: parsed.data.placement,
      score: parsed.data.score,
      note: parsed.data.note || null,
    },
  });

  revalidatePath("/vysledky");
  revalidatePath("/", "layout");
  revalidatePath("/admin/results");
  return { ok: true };
}

export async function adminDeleteResult(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return { ok: false, message: "Chybí id" };

  await prisma.result.delete({ where: { id } });
  revalidatePath("/vysledky");
  revalidatePath("/", "layout");
  revalidatePath("/admin/results");
  return { ok: true };
}

// ---------- Members ----------
const MemberCreateSchema = z.object({
  displayName: z.string().min(1),
  nickname: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"]).default("MALE"),
  role: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  isActive: z.coerce.boolean().optional().default(true),
});

export async function adminCreateMember(formData: FormData) {
  const parsed = MemberCreateSchema.safeParse({
    displayName: formData.get("displayName"),
    nickname: formData.get("nickname"),
    gender: formData.get("gender"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" | ") };
  }

  await prisma.member.create({
    data: {
      displayName: parsed.data.displayName,
      nickname: parsed.data.nickname || null,
      gender: parsed.data.gender as Gender,
      role: parsed.data.role || null,
      bio: parsed.data.bio || null,
      isActive: parsed.data.isActive,
      specialties: [],
    },
  });

  revalidatePath("/tym");
  revalidatePath("/admin/members");
  return { ok: true };
}

export async function adminDeleteMember(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return { ok: false, message: "Chybí id" };

  await prisma.member.delete({ where: { id } });
  revalidatePath("/tym");
  revalidatePath("/admin/members");
  return { ok: true };
}

import { v2 as cloudinary } from "cloudinary";

// Konfigurace Cloudinary (použije proměnné z .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------- Galerie / Alba ----------

const AlbumCreateSchema = z.object({
  title: z.string().min(3),
  dateTaken: z.string(), // Datum z inputu type="date"
  cloudinaryFolder: z.string().min(1), // Složka na Cloudinary (např. "vanoce-2023")
});

export async function adminCreateAlbum(formData: FormData) {
  const parsed = AlbumCreateSchema.safeParse({
    title: formData.get("title"),
    dateTaken: formData.get("dateTaken"),
    cloudinaryFolder: formData.get("cloudinaryFolder"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Chybná data formuláře." };
  }

  await prisma.album.create({
    data: {
      title: parsed.data.title,
      dateTaken: new Date(parsed.data.dateTaken),
      cloudinaryFolder: parsed.data.cloudinaryFolder,
    },
  });

  revalidatePath("/galerie");
  revalidatePath("/admin/gallery");
  return { ok: true };
}

export async function adminDeleteAlbum(formData: FormData) {
  const id = String(formData.get("id"));
  
  // Poznámka: Zde bychom ideálně měli smazat i fotky na Cloudinary, 
  // ale pro bezpečí zatím smažeme jen záznam v DB.
  try {
    await prisma.album.delete({ where: { id } });
    revalidatePath("/galerie");
    revalidatePath("/admin/gallery");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: "Nelze smazat album (možná obsahuje fotky)." };
  }
}

// Upload fotky
export async function adminUploadPhoto(formData: FormData) {
  const albumId = String(formData.get("albumId"));
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { ok: false, message: "Žádný soubor." };
  }

  // Najdeme album, abychom věděli, do jaké složky nahrávat
  const album = await prisma.album.findUnique({ where: { id: albumId } });
  if (!album) return { ok: false, message: "Album nenalezeno." };

  try {
    // 1. Převedeme File na Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Nahrajeme na Cloudinary (pomocí Promise wrapperu)
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: album.cloudinaryFolder, // Složka alba na Cloudinary
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      // Odešleme data
      const { Readable } = require("stream");
      const stream = Readable.from(buffer);
      stream.pipe(uploadStream);
    });

    // 3. Uložíme odkaz do DB
    await prisma.photo.create({
      data: {
        albumId: album.id,
        cloudinaryPublicId: result.public_id, // TOTO je ten odkaz, ne soubor
        caption: file.name, // Jako popisek dáme název souboru
      },
    });

    revalidatePath(`/galerie/${album.id}`);
    revalidatePath(`/admin/gallery/${album.id}`);
    return { ok: true };

  } catch (error) {
    console.error("Upload error:", error);
    return { ok: false, message: "Chyba při nahrávání na Cloudinary." };
  }
}

export async function adminDeletePhoto(formData: FormData) {
    const id = String(formData.get("id"));
    // Opět: Prozatím mažeme jen z DB reference
    await prisma.photo.delete({ where: { id } });
    // Revalidace (musíme zjistit albumId, ale pro zjednodušení revalidujeme cestu)
    revalidatePath("/galerie"); 
    return { ok: true };
}