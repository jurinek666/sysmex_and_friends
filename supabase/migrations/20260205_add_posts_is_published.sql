ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "isPublished" boolean DEFAULT true NOT NULL;
-- Zpětná kompatibilita: existující články s publishedAt zůstanou publikované
UPDATE "Post" SET "isPublished" = true WHERE "publishedAt" IS NOT NULL;
UPDATE "Post" SET "isPublished" = false WHERE "publishedAt" IS NULL;
