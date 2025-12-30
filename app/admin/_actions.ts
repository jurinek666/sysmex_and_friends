"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Gender } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

// Konfigurace Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- POMOCNÉ FUNKCE ---

// Funkce pro extrakci URL z iframe kódu (pro Spotify)
function extractSrcFromIframe(input: string): string {
  if (!input) return "";
  // Pokud uživatel vložil jen URL, vrátíme ji
  if (input.startsWith("http")) return input;
  
  // Pokud vložil iframe tag, hledáme src="..."
  const match = input.match(/src="([^"]+)"/);
  return match ? match[1] : input; // Fallback na původní vstup
}

// Funkce pro získání public_id z Cloudinary URL
function extractPublicId(url: string): string {
  if (!url.includes("cloudinary.com")) return url;
  try {
    // Příklad: .../upload/v1234/slozka/obrazek.jpg -> slozka/obrazek
    const parts = url.split("/upload/");
    if (parts.length < 2) return url;
    
    const pathWithVersion = parts[1];
    // Odstraníme verzi (např. v1709...) pokud tam je, a příponu
    const pathParts = pathWithVersion.split("/");
    // Pokud první část začíná na 'v' a následují čísla, přeskočíme ji
    const startIndex = (pathParts[0].startsWith("v") && !isNaN(Number(pathParts[0].substring(1)))) ? 1 : 0;
    
    const publicIdWithExtension = pathParts.slice(startIndex).join("/");
    // Odstraníme příponu (.jpg, .png)
    return publicIdWithExtension.replace(/\.[^/.]+$/, "");
  } catch {
    return url;
  }
}

// ---------- Posts (Články) ----------
const PostCreateSchema = z.object({
  title: z.string().min(3, "Nadpis musí mít alespoň 3 znaky"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug musí být lowercase a-z, 0-9 nebo -"),
  excerpt: z.string().min(3, "Perex je povinný"),
  content: z.string().min(1, "Obsah nesmí být prázdný"),
  isFeatured: z.coerce.boolean().optional().default(false),
  coverImageUrl: z.string().optional().or(z.literal("")),
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

  try {
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
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Chyba: Slug (URL adresa) už pravděpodobně existuje." };
  }

  revalidatePath("/clanky");
  revalidatePath("/admin/posts");
  return { ok: true };
}

export async function adminUpdatePost(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return { ok: false, message: "Chybí ID." };

  const parsed = PostCreateSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    isFeatured: formData.get("isFeatured"),
    coverImageUrl: formData.get("coverImageUrl"),
  });

  if (!parsed.success) return { ok: false, message: "Chybná data." };

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        isFeatured: parsed.data.isFeatured,
        coverImageUrl: parsed.data.coverImageUrl || null,
      },
    });
  } catch {
    return { ok: false, message: "Chyba při úpravě." };
  }

  revalidatePath("/clanky");
  revalidatePath("/admin/posts");
  return { ok: true };
}

export async function adminDeletePost(formData: FormData) {
  const id = String(formData.get("id"));
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/clanky");
    revalidatePath("/admin/posts");
    return { ok: true };
  } catch {
    return { ok: false, message: "Nelze smazat." };
  }
}

// ---------- Playlists ----------
const PlaylistSchema = z.object({
  title: z.string().min(1),
  spotifyInput: z.string().min(1), // Může být iframe nebo URL
  description: z.string().max(200).optional().or(z.literal("")),
  isActive: z.coerce.boolean().optional().default(false),
});

export async function adminCreatePlaylist(formData: FormData) {
  const parsed = PlaylistSchema.safeParse({
    title: formData.get("title"),
    spotifyInput: formData.get("spotifyUrl"), // Ve formuláři se to jmenuje spotifyUrl
    description: formData.get("description"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) return { ok: false, message: "Chybí povinná pole." };

  const { title, spotifyInput, description, isActive } = parsed.data;
  
  // Vyčistíme URL
  const cleanUrl = extractSrcFromIframe(spotifyInput);

  try {
    if (isActive) {
      await prisma.playlist.updateMany({ where: { isActive: true }, data: { isActive: false } });
    }
    await prisma.playlist.create({
      data: {
        title,
        spotifyUrl: cleanUrl,
        description: description || null,
        isActive,
      },
    });
  } catch {
    return { ok: false, message: "Chyba při ukládání playlistu." };
  }

  revalidatePath("/admin/playlists");
  revalidatePath("/");
  return { ok: true };
}

export async function adminDeletePlaylist(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.playlist.delete({ where: { id } });
  revalidatePath("/admin/playlists");
  revalidatePath("/");
  return { ok: true };
}

// ---------- Galerie (Alba & Fotky) ----------

const AlbumSchema = z.object({
  title: z.string().min(2),
  dateTaken: z.string(),
  cloudinaryFolder: z.string().min(1),
});

export async function adminCreateAlbum(formData: FormData) {
  const parsed = AlbumSchema.safeParse({
    title: formData.get("title"),
    dateTaken: formData.get("dateTaken"),
    cloudinaryFolder: formData.get("cloudinaryFolder"),
  });

  if (!parsed.success) return { ok: false, message: "Chybná data alba." };

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
  try {
    await prisma.album.delete({ where: { id } }); // Pozor: smaže i fotky díky kaskádě v DB (pokud je nastavena), jinak error
    revalidatePath("/galerie");
    revalidatePath("/admin/gallery");
    return { ok: true };
  } catch {
    return { ok: false, message: "Nelze smazat album (asi obsahuje fotky a nemáš nastavenou kaskádu)." };
  }
}

// Hybridní upload fotky
export async function adminAddPhoto(formData: FormData) {
  const albumId = String(formData.get("albumId"));
  const caption = String(formData.get("caption") || "");
  const file = formData.get("file") as File | null;
  const urlInput = String(formData.get("urlInput") || "");

  const album = await prisma.album.findUnique({ where: { id: albumId } });
  if (!album) return { ok: false, message: "Album neexistuje." };

  let finalPublicId = "";

  try {
    // 1. Varianta: Upload souboru
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise<{ public_id: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: album.cloudinaryFolder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as any);
          }
        );
        import("stream").then(({ Readable }) => {
            const stream = Readable.from(buffer);
            stream.pipe(uploadStream);
        });
      });
      finalPublicId = result.public_id;
    } 
    // 2. Varianta: Vložení URL
    else if (urlInput.trim().length > 0) {
      finalPublicId = extractPublicId(urlInput);
    } else {
      return { ok: false, message: "Musíš vybrat soubor nebo vložit URL." };
    }

    // Uložení do DB
    await prisma.photo.create({
      data: {
        albumId,
        cloudinaryPublicId: finalPublicId,
        caption: caption || null,
      },
    });

  } catch (e) {
    console.error(e);
    return { ok: false, message: "Chyba při uploadu." };
  }

  revalidatePath(`/galerie/${albumId}`);
  revalidatePath(`/admin/gallery/${albumId}`);
  return { ok: true };
}

export async function adminDeletePhoto(formData: FormData) {
  const id = String(formData.get("id"));
  const photo = await prisma.photo.delete({ where: { id } });
  
  // Zde by šlo přidat i smazání z Cloudinary API, pokud bychom chtěli být důslední
  
  revalidatePath(`/galerie/${photo.albumId}`);
  revalidatePath(`/admin/gallery/${photo.albumId}`);
  return { ok: true };
}

// ---------- Members (Tým) ----------

const MemberSchema = z.object({
  displayName: z.string().min(1, "Jméno je povinné"),
  nickname: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"]).default("MALE"),
  role: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  isActive: z.coerce.boolean().optional().default(true),
});

export async function adminCreateMember(formData: FormData) {
  const parsed = MemberSchema.safeParse({
    displayName: formData.get("displayName"),
    nickname: formData.get("nickname"),
    gender: formData.get("gender"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Chybná data formuláře." };
  }

  try {
    await prisma.member.create({
      data: {
        displayName: parsed.data.displayName,
        nickname: parsed.data.nickname || null,
        gender: parsed.data.gender,
        role: parsed.data.role || null,
        bio: parsed.data.bio || null,
        isActive: parsed.data.isActive,
        specialties: [], // Zatím prázdné pole
      },
    });
  } catch {
    return { ok: false, message: "Chyba při vytváření člena (možná jméno už existuje)." };
  }

  revalidatePath("/tym");
  revalidatePath("/admin/members");
  return { ok: true };
}

export async function adminDeleteMember(formData: FormData) {
  const id = String(formData.get("id"));
  try {
    await prisma.member.delete({ where: { id } });
    revalidatePath("/tym");
    revalidatePath("/admin/members");
    return { ok: true };
  } catch {
    return { ok: false, message: "Chyba při mazání." };
  }
}

// ---------- Results (Výsledky) ----------

const ResultSchema = z.object({
  seasonCode: z.string().min(1),
  date: z.string().min(1),
  venue: z.string().min(1),
  teamName: z.string().min(1),
  placement: z.coerce.number().int().min(1),
  score: z.coerce.number().int().min(0),
  note: z.string().optional().or(z.literal("")),
});

export async function adminCreateResult(formData: FormData) {
  const parsed = ResultSchema.safeParse({
    seasonCode: formData.get("seasonCode"),
    date: formData.get("date"),
    venue: formData.get("venue"),
    teamName: formData.get("teamName"),
    placement: formData.get("placement"),
    score: formData.get("score"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Chybná data." };
  }

  // Najdeme sezónu podle kódu (např. "2023-2024")
  const season = await prisma.season.findUnique({ 
    where: { code: parsed.data.seasonCode } 
  });
  
  if (!season) {
    return { ok: false, message: "Sezóna s tímto kódem neexistuje." };
  }

  try {
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
  } catch {
    return { ok: false, message: "Chyba při ukládání výsledku." };
  }

  revalidatePath("/vysledky");
  revalidatePath("/admin/results");
  return { ok: true };
}

export async function adminDeleteResult(formData: FormData) {
  const id = String(formData.get("id"));
  try {
    await prisma.result.delete({ where: { id } });
    revalidatePath("/vysledky");
    revalidatePath("/admin/results");
    return { ok: true };
  } catch {
    return { ok: false, message: "Chyba při mazání." };
  }
}