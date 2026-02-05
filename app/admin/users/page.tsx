import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/admin/auth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { UserList } from "./UserList";

export const dynamic = "force-dynamic";

export interface ProfileRow {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export default async function AdminUsersPage() {
  await requireAuth();
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, display_name, avatar_url, role, created_at, updated_at")
    .order("created_at", { ascending: false });

  const list = (profiles || []) as ProfileRow[];

  return (
    <AdminLayout title="Admin • Uživatelé">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-8">
        <p className="text-gray-600 text-sm mb-4">
          Registrovaní uživatelé (členové týmu a správci). Můžete upravovat zobrazované jméno a roli. Smazání vyžaduje nastavení SUPABASE_SERVICE_ROLE_KEY.
        </p>
        <UserList users={list} />
      </section>
    </AdminLayout>
  );
}
