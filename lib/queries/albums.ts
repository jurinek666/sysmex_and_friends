import { createClient } from "@/lib/supabase/server";
import { fetchImageIdsByFolder } from "@/lib/cloudinary";
import { withRetry, logSupabaseError } from "./utils";

export async function getAlbums() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/queries/albums.ts:4',message:'getAlbums entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const supabase = await createClient();
  
  // Načteme alba a počet fotek. 
  // 'photos(count)' vrátí pole objektů [{ count: N }]
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/queries/albums.ts:11',message:'Before query execution - trying photos',data:{tableName:'Album',selectClause:'*, photos(count)',relationshipName:'photos'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  let { data, error } = await withRetry(async () => {
    return await supabase
      .from("Album")
      .select("*, photos(count)")
      .order("dateTaken", { ascending: false });
  });

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/queries/albums.ts:21',message:'First attempt result',data:{hasError:!!error,errorCode:error?.code,errorMessage:error?.message,errorHint:error?.hint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  // Test alternative relationship name if first attempt fails
  if (error && error?.hint?.includes('Photo')) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/queries/albums.ts:26',message:'Trying Photo (capitalized) relationship',data:{relationshipName:'Photo'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const result2 = await withRetry(async () => {
      return await supabase
        .from("Album")
        .select("*, Photo(count)")
        .order("dateTaken", { ascending: false });
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/queries/albums.ts:32',message:'Second attempt result',data:{hasError:!!result2.error,errorCode:result2.error?.code,errorMessage:result2.error?.message,hasData:!!result2.data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (!result2.error) {
      data = result2.data;
      error = null;
    }
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/queries/albums.ts:20',message:'After query execution',data:{hasError:!!error,errorCode:error?.code,errorMessage:error?.message,errorDetails:error?.details,errorHint:error?.hint,hasData:!!data,dataLength:data?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  if (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/queries/albums.ts:23',message:'Error detected - full error object',data:{error:JSON.stringify(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    logSupabaseError("getAlbums", error);
    return [];
  }

  // Transformujeme data do formátu, který očekává komponenta (styl Prisma)
  // Prisma vrací: _count: { photos: number }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((album: any) => ({
    ...album,
    _count: {
      photos: album.photos?.[0]?.count ?? 0
    }
  }));
}

export async function getAlbum(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Album")
    .select("*, photos(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  // Sjednocení tvaru: photos nebo Photo z Supabase
  const raw = data as { photos?: unknown[]; Photo?: unknown[] };
  data.photos = Array.isArray(raw.photos) ? raw.photos : (Array.isArray(raw.Photo) ? raw.Photo : []);

  // Načtení fotek z Cloudinary podle cloudinaryFolder, pokud je vyplněné a Cloudinary vrátí výsledky
  const folder = (data.cloudinaryFolder || "").trim();
  if (folder) {
    const fromCloud = await fetchImageIdsByFolder(folder);
    if (fromCloud.length > 0) {
      data.photos = fromCloud.map((r, i) => ({
        id: r.public_id,
        cloudinaryPublicId: r.public_id,
        caption: null,
        sortOrder: i,
      }));
    }
  }

  // Seřadíme fotky podle sortOrder
  data.photos.sort((a: { sortOrder?: number }, b: { sortOrder?: number }) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return data;
}