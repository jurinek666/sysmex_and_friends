import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";
import type { Member } from "@/lib/types";

// Re-export shared type to ensure consistency
export type { Member };

export async function getActiveMembers(): Promise<Member[]> {
  const supabase = await createClient();
  
  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("Member")
      .select("id, displayName, nickname, role, bio, gender, isActive, avatarUrl, profile_id")
      .eq("isActive", true)
      .order("displayName", { ascending: true });
  });

  if (error) {
    logSupabaseError("getActiveMembers", error);
    return [];
  }
  
  // Map snake_case profile_id to camelCase profileId if needed,
  // but since we are just passing data, we need to ensure the Type matches the DB response.
  // The DB returns profile_id. The Type expects profileId?
  // Prisma usually maps this. Supabase returns exactly what is in DB.
  // So if Type has `profileId`, but DB has `profile_id`, we need to map it OR update Type to match DB.
  // In `lib/types.ts` I added `profileId`.
  // Let's check `lib/types.ts` convention. Most use camelCase.
  // But Supabase returns snake_case.
  // I should probably update the query to alias: `profileId:profile_id`.

  // Re-writing the query with alias
  return (data?.map(m => ({
      ...m,
      profileId: m.profile_id
  })) || []) as Member[];
}
