import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  REVALIDATE_SECRET: z.string().min(1),
  // Zde povolujeme development, production nebo test
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);