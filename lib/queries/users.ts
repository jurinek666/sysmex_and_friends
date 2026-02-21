import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "./utils";
import { Profile } from "@/lib/types";

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await withRetry(async () => {
    return await supabase
      .from("profiles")
      .select(`
        id,
        email,
        display_name,
        avatar_url,
        role,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false });
  });

  if (error) {
    logSupabaseError("getAllProfiles", error);
    return [];
  }

  return (data || []) as Profile[];
}
