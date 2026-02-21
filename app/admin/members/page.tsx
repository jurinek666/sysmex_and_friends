import { getAllMembers } from "@/lib/queries/members";
import { getAllProfiles } from "@/lib/queries/users";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MemberForm } from "./MemberForm";
import { MemberList } from "./MemberList";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const [members, profiles] = await Promise.all([
    getAllMembers(),
    getAllProfiles(),
  ]);

  return (
    <AdminLayout title="Admin • Tým">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Přidat člena</h2>
        <MemberForm profiles={profiles} />
      </section>

      <MemberList members={members} profiles={profiles} />
    </AdminLayout>
  );
}
