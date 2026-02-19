import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/lib/types";

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }

  return (data as unknown) as Profile[];
}
