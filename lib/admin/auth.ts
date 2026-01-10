import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Helper funkce pro kontrolu přihlášení na admin stránkách
 * Pokud uživatel není přihlášen, přesměruje na /login
 */
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return { supabase, user };
}
