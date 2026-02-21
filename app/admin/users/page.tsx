import { getAllProfiles } from "@/lib/queries/users";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { UserList } from "./UserList";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const profiles = await getAllProfiles();

  // Propojení členů s profily: tabulka Member nemá sloupec profile_id (lze doplnit migrací).
  // This logic was empty in original file anyway
  const linkedMembers: Record<string, string> = {};

  return (
    <AdminLayout title="Admin • Uživatelé">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-8">
        <p className="text-gray-600 text-sm mb-4">
          Registrovaní uživatelé (členové týmu a správci). Můžete upravovat zobrazované jméno a roli. Smazání vyžaduje nastavení SUPABASE_SERVICE_ROLE_KEY.
        </p>
        <UserList users={profiles} linkedMembers={linkedMembers} />
      </section>
    </AdminLayout>
  );
}
