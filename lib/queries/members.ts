import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";
import { Member } from "@/lib/types";

export async function getActiveMembers(): Promise<Member[]> {
  const supabase = await createClient();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("members")
      .select(`
        id,
        displayName:display_name,
        nickname,
        role,
        bio,
        avatarUrl:avatar_url
      `)
      .eq("is_active", true)
      .order("display_name", { ascending: true });
  });

  if (error) {
    logSupabaseError("getActiveMembers", error);
    return [];
  }
  
  return (data as unknown) as Member[] || [];
}
