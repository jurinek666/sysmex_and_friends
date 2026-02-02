import { NextRequest } from "next/server";
import { debugFolderMethods, testCloudinaryConnection } from "@/lib/cloudinary";

/**
 * GET /api/debug-cloudinary
 * GET /api/debug-cloudinary?folder=01_leden
 *
 * - connection: test připojení (usage API) – ověří env a platnost API klíčů.
 * - config: zda jsou vyplněny CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET.
 * - resources_root: počet obrázků z resources() bez prefixu (0–5). Když connection=ok a tohle 0, účet nemá obrázky nebo nemáme práva.
 * - results: při ?folder=X počet obrázků pro každou metodu (složka/tag).
 *
 * Pouze v NODE_ENV=development (v produkci 404).
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }
  const folder = req.nextUrl.searchParams.get("folder") || "";
  const [connection, debug] = await Promise.all([
    testCloudinaryConnection(),
    debugFolderMethods(folder),
  ]);
  return Response.json({ connection, ...debug });
}
