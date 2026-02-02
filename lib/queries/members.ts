import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";

export interface Member {
  id: string;
  displayName: string;
  nickname: string | null;
  role: string | null;
  gender?: string;
  bio: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getActiveMembers(): Promise<Member[]> {
  const supabase = await createClient();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Member")
      .select("id, displayName, nickname, role, bio")
      .eq("isActive", true)
      .order("displayName", { ascending: true });
  });

  if (error) {
    logSupabaseError("getActiveMembers", error);
    return [];
  }
  
  return data ?? [];
}