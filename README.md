import { z } from "zod";

const isBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NODE_ENV === "test";

const baseSchema = {
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, "Supabase URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase Anon Key is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),

  REVALIDATE_SECRET: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z.string().min(1).optional()
  ),

  GOOGLE_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_GA_ID: z.string().min(1).optional(),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
};

const envSchema = z.object(baseSchema);

let parsedEnv;

if (isBuildPhase) {
  // During Docker/Next build → allow missing values
  parsedEnv = envSchema.partial().parse(process.env);
} else {
  // Runtime → enforce required variables
  parsedEnv = envSchema.parse(process.env);
}

export const env = parsedEnv;