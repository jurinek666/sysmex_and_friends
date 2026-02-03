import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Titulek je povinný"),
  slug: z.string().min(1, "Slug je povinný"),
  excerpt: z.string().min(1, "Perex je povinný"),
  content: z.string().min(1, "Obsah je povinný"),
  coverImageUrl: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
});

export const resultSchema = z.object({
  seasonCode: z.string().min(1, "Kód sezóny je povinný"),
  date: z.string().min(1, "Datum je povinné"),
  venue: z.string().min(1, "Místo je povinné"),
  teamName: z.string().min(1, "Název týmu je povinný"),
  placement: z.coerce.number().int("Umístění musí být celé číslo").min(1, "Umístění musí být alespoň 1"),
  score: z.coerce.number().int("Skóre musí být celé číslo").min(0, "Skóre nemůže být záporné"),
  note: z.string().optional().nullable(),
  memberIds: z.array(z.string().uuid()).max(8, "Maximálně 8 členů na výsledek").optional().default([]),
});

export const memberSchema = z.object({
  displayName: z.string().min(1, "Jméno je povinné"),
  nickname: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  gender: z.enum(["M", "F", "Other"]).or(z.string().min(1)),
  bio: z.string().optional().nullable(),
});

export const playlistSchema = z.object({
  title: z.string().min(1, "Název je povinný"),
  spotifyUrl: z.string().url("Neplatná URL").min(1, "Spotify URL je povinná"),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(false),
});

export const albumSchema = z.object({
  title: z.string().min(1, "Název je povinný"),
  dateTaken: z.string().min(1, "Datum je povinné"),
  cloudinaryFolder: z.string().min(1, "Složka Cloudinary je povinná"),
  description: z.string().optional().nullable(),
  coverPublicId: z.string().optional().nullable(),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Název je povinný"),
  date: z.string().min(1, "Datum je povinné"),
  venue: z.string().min(1, "Místo je povinné"),
  description: z.string().optional().nullable(),
  isUpcoming: z.boolean().default(false),
});
