import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Helper funkce pro kontrolu přihlášení a role na admin stránkách.
 * Pokud uživatel není přihlášen, přesměruje na /login.
 * Pokud nemá roli admin, přesměruje na členský dashboard.
 */
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin-login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return { supabase, user };
}
