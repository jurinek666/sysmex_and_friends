import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";

interface Member {
  id: string;
  displayName: string;
  nickname: string | null;
  role: string | null;
  gender: string;
  bio: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getActiveMembers(): Promise<Member[]> {
  const supabase = await createClient();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Member")
      .select("*")
      .eq("isActive", true)
      .order("displayName", { ascending: true });
  });

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/queries/members.ts:15',message:'getActiveMembers result',data:{hasError:!!error,hasData:!!data,dataIsNull:data===null,dataLength:data?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  if (error) {
    logSupabaseError("getActiveMembers", error);
    return [];
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/queries/members.ts:20',message:'getActiveMembers returning',data:{returningNull:data===null,returningArray:Array.isArray(data),returnValue:data===null?'[]':data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  return data ?? [];
}