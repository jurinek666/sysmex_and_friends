import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";
import { Member } from "@/lib/types";

export async function getActiveMembers(): Promise<Member[]> {
  const supabase = await createClient();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Member")
      .select("id, displayName, nickname, role, bio, avatarUrl")
      .eq("isActive", true)
      .order("displayName", { ascending: true });
  });

  if (error) {
    logSupabaseError("getActiveMembers", error);
    return [];
  }
  
  return (data as unknown) as Member[] || [];
}
