/**
 * Server-side pomocné funkce pro Cloudinary API.
 * Načítání obrázků podle složky (Asset Folder / public_id prefix) nebo podle tagu.
 *
 * Cloudinary má dva režimy složek:
 * - **Dynamic (Asset Folder)**: složky v Media Library = asset_folder.
 * - **Fixed (legacy)**: složka = cesta v public_id.
 *
 * Postup: 1) resources_by_asset_folder, 2) Search asset_folder= / asset_folder:.../*,
 * 3) Search folder= / folder:.../*, 3b) Search public_id:...*, 4) resources(prefix) s "X" i "X/",
 * 5) resources_by_tag (záložní – stejný identifikátor lze použít jako tag, když složka nefunguje).
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const cloudinary = require("cloudinary").v2;

export interface CloudinaryResource {
  public_id: string;
}

function toList(
  result:
    | { resources?: { public_id: string; resource_type?: string }[]; assets?: { public_id: string; resource_type?: string }[] }
    | null
    | undefined
): CloudinaryResource[] {
  const raw = (result?.resources || result?.assets || []) as { public_id: string; resource_type?: string }[];
  return raw
    .filter((r) => (r.resource_type || "image") === "image")
    .map((r) => ({ public_id: r.public_id }));
}

/**
 * Načte public_id obrázků z Cloudinary podle názvu složky.
 * Cloud name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME nebo CLOUDINARY_CLOUD_NAME.
 * Dále CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
 * Při chybě nebo chybějící konfiguraci vrací [].
 *
 * Zadej přesný název složky jako v Media Library, např. 01_leden.
 */
export async function fetchImageIdsByFolder(folderInput: string): Promise<CloudinaryResource[]> {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const p = (folderInput || "").trim().replace(/^\/+/, "");
  if (!p || !cloudName || !apiKey || !apiSecret) return [];

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  let list: CloudinaryResource[] = [];

  // 1) resources_by_asset_folder – pro režim Dynamic (Asset Folder v Media Library)
  try {
    const r = await cloudinary.api.resources_by_asset_folder(p, { max_results: 500 });
    list = toList(r);
  } catch {
    // Není podporováno (fixed mode) nebo chyba – pokračujeme dál
  }

  // 2) Search API: asset_folder= a asset_folder:.../* – rovněž pro Dynamic
  if (list.length === 0) {
    for (const expr of [`asset_folder=${p}`, `asset_folder:${p}/*`]) {
      if (list.length > 0) break;
      try {
        const q = cloudinary.search.expression(expr).max_results(500);
        const r = await q.execute();
        list = toList(r);
      } catch {
        // ignor
      }
    }
  }

  // 3) Search API: folder= a folder:.../* – pro režim Fixed (legacy), složka = cesta v public_id
  if (list.length === 0) {
    for (const expr of [`folder=${p}`, `folder:${p}/*`]) {
      if (list.length > 0) break;
      try {
        const q = cloudinary.search.expression(expr).max_results(500);
        const r = await q.execute();
        list = toList(r);
      } catch {
        // ignor
      }
    }
  }

  // 3b) Search: public_id začíná zadaným řetězcem (prefix) – funguje v obou režimech
  if (list.length === 0) {
    try {
      const q = cloudinary.search.expression(`public_id:${p}*`).max_results(500);
      const r = await q.execute();
      list = toList(r);
    } catch {
      // ignor
    }
  }

  // 4) resources s prefix – pro Fixed nebo když public_id začíná tímto řetězcem
  // Zkoušíme jak "01_leden" tak "01_leden/" (některé účty ukládají s lomítkem)
  if (list.length === 0) {
    for (const prefix of [p, p + "/"]) {
      if (list.length > 0) break;
      try {
        const r = await cloudinary.api.resources({
          resource_type: "image",
          type: "upload",
          prefix,
          max_results: 500,
        });
        list = toList(r);
      } catch {
        // ignor
      }
    }
  }

  // 5) resources_by_tag – záložní: pokud složka nevrátí nic, zkusíme hodnotu jako tag
  // (v poli „Složka v Cloudinary“ lze tedy uvést i tag, např. 01_leden, když obrázky mají ten tag)
  if (list.length === 0) {
    try {
      const r = await cloudinary.api.resources_by_tag(p, { max_results: 500, resource_type: "image" });
      list = toList(r);
    } catch {
      // ignor
    }
  }

  return list;
}

/** Výsledek pro jednu metodu: počet nebo "error" když volání selhalo. */
type DebugCount = number | "error";

/**
 * Ověří připojení k Cloudinary: správnost env a platnost API klíčů.
 * Volá cloudinary.api.usage() – při úspěchu jsou credentials v pořádku.
 */
export async function testCloudinaryConnection(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName)
    return { ok: false, error: "Chybí NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME nebo CLOUDINARY_CLOUD_NAME" };
  if (!apiKey) return { ok: false, error: "Chybí CLOUDINARY_API_KEY" };
  if (!apiSecret) return { ok: false, error: "Chybí CLOUDINARY_API_SECRET" };

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  try {
    await cloudinary.api.usage();
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

export interface DebugFolderResult {
  config: { hasCloudName: boolean; hasApiKey: boolean; hasApiSecret: boolean };
  /** Hodnota ?folder= po oříznutí (pro ověření, co se hledalo). */
  folder_requested: string;
  /** Počet assetů z resources() bez prefixu (0–5). Když connection ok a tohle 0, účet nemá obrázky nebo nemáme práva listovat. */
  resources_root: DebugCount;
  /** Ukázka public_id z kořene (prvních 5) – uvidíte skutečnou strukturu a jak zadat prefix/složku. */
  sample_public_ids: string[];
  /** Skutečné chybové hlášky u metod, které hodily výjimku. */
  errors: Record<string, string>;
  results: {
    by_asset_folder: DebugCount;
    search_asset_folder: DebugCount;
    search_folder: DebugCount;
    search_public_id: DebugCount;
    prefix: DebugCount;
    prefix_slash: DebugCount;
    by_tag: DebugCount;
  };
}

/**
 * Pro diagnostiku: spustí každou metodu zvlášť a vrátí počet nalezených obrázků (nebo "error").
 * Pouze pro vývoj – ověřte NODE_ENV před voláním.
 */
export async function debugFolderMethods(folderInput: string): Promise<DebugFolderResult> {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const p = (folderInput || "").trim().replace(/^\/+/, "");

  const err = (e: unknown) => (e instanceof Error ? e.message : String(e));

  const out: DebugFolderResult = {
    config: {
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
    },
    folder_requested: p,
    resources_root: "error",
    sample_public_ids: [],
    errors: {},
    results: {
      by_asset_folder: "error",
      search_asset_folder: "error",
      search_folder: "error",
      search_public_id: "error",
      prefix: "error",
      prefix_slash: "error",
      by_tag: "error",
    },
  };

  if (!cloudName || !apiKey || !apiSecret) return out;

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  // resources_root: můžeme vůbec vypsat nějaké assety? (bez prefixu/složky)
  try {
    const r = await cloudinary.api.resources({ resource_type: "image", type: "upload", max_results: 5 });
    const list = toList(r);
    out.resources_root = list.length;
    out.sample_public_ids = list.slice(0, 5).map((x) => x.public_id);
  } catch (e) {
    out.resources_root = "error";
    out.errors.resources_root = err(e);
  }

  if (!p) return out;

  try {
    const r = await cloudinary.api.resources_by_asset_folder(p, { max_results: 500 });
    out.results.by_asset_folder = toList(r).length;
  } catch (e) {
    out.results.by_asset_folder = "error";
    out.errors.by_asset_folder = err(e);
  }

  try {
    const q = cloudinary.search.expression(`asset_folder=${p}`).max_results(500);
    const r = await q.execute();
    out.results.search_asset_folder = toList(r).length;
  } catch (e) {
    out.results.search_asset_folder = "error";
    out.errors.search_asset_folder = err(e);
  }

  try {
    const q = cloudinary.search.expression(`folder=${p}`).max_results(500);
    const r = await q.execute();
    out.results.search_folder = toList(r).length;
  } catch (e) {
    out.results.search_folder = "error";
    out.errors.search_folder = err(e);
  }

  try {
    const q = cloudinary.search.expression(`public_id:${p}*`).max_results(500);
    const r = await q.execute();
    out.results.search_public_id = toList(r).length;
  } catch (e) {
    out.results.search_public_id = "error";
    out.errors.search_public_id = err(e);
  }

  try {
    const r = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: p,
      max_results: 500,
    });
    out.results.prefix = toList(r).length;
  } catch (e) {
    out.results.prefix = "error";
    out.errors.prefix = err(e);
  }

  try {
    const r = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: p + "/",
      max_results: 500,
    });
    out.results.prefix_slash = toList(r).length;
  } catch (e) {
    out.results.prefix_slash = "error";
    out.errors.prefix_slash = err(e);
  }

  try {
    const r = await cloudinary.api.resources_by_tag(p, { max_results: 500, resource_type: "image" });
    out.results.by_tag = toList(r).length;
  } catch (e) {
    out.results.by_tag = "error";
    out.errors.by_tag = err(e);
  }

  return out;
}
