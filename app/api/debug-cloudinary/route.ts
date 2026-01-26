import { NextRequest } from "next/server";
import { debugFolderMethods } from "@/lib/cloudinary";

/**
 * GET /api/debug-cloudinary?folder=01_leden
 *
 * Vrací, kolik obrázků vrátí každá metoda vyhledání složky v Cloudinary.
 * Pouze v NODE_ENV=development (v produkci 404).
 *
 * Příklad: /api/debug-cloudinary?folder=01_leden
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }
  const folder = req.nextUrl.searchParams.get("folder") || "";
  const result = await debugFolderMethods(folder);
  return Response.json(result);
}
