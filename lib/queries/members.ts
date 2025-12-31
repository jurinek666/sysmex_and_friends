import { createClient } from "@/lib/supabase/server";

export async function getActiveMembers() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("Member")
    .select("*")
    .eq("isActive", true)
    .order("displayName", { ascending: true });

  if (error) {
    console.error("Error fetching members:", error);
    return [];
  }
  
  return data;
}