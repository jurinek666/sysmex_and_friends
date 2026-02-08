import { z } from "zod";

/**
 * Centralizovaná validace env proměnných.
 * Pozn.: Držíme jen to, co je opravdu nutné pro běh aplikace.
 * Ostatní je optional, aby šel projekt spustit i v dev režimu bez Cloudinary.
 */
const envSchema = z.object({
  // Supabase (povinné)
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, "Supabase URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase Anon Key is required"),
  // Service role – volitelné; nutné pro mazání uživatelů v admin sekci
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Cloudinary (volitelné – použiješ až při napojení galerie / uploadů)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),

  // Secret pro případné revalidate endpointy (volitelné; prázdný řetězec = jako by nebyl nastaven)
  REVALIDATE_SECRET: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z.string().min(1).optional()
  ),

  // Google Gemini API – pro AI na stránce O nás (volitelné)
  GOOGLE_API_KEY: z.string().min(1).optional(),

  // Google Analytics (gtag) – měřicí ID (volitelné)
  NEXT_PUBLIC_GA_ID: z.string().min(1).optional(),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

let parsedEnv: z.infer<typeof envSchema>;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const missing = error.issues.map((issue) => issue.path.join(".")).join(", ");
    console.error(
      `❌ Invalid environment variables: ${missing}`
    );
    console.error(
      `If you are deploying to Render, please set these variables in the Environment tab of your service settings.`
    );
    throw new Error("Invalid environment variables");
  }
  throw error;
}

export const env = parsedEnv;
