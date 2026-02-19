import { createClient } from "@/lib/supabase/server";
import { getAllMembers } from "@/lib/queries/members";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MemberForm } from "./MemberForm";
import { MemberList } from "./MemberList";
import { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const supabase = await createClient();
  const members = await getAllMembers();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("email", { ascending: true });

  const safeProfiles = (profiles || []) as Profile[];

  return (
    <AdminLayout title="Admin • Tým">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Přidat člena</h2>
        <MemberForm profiles={safeProfiles} />
      </section>

      <MemberList members={members} profiles={safeProfiles} />
    </AdminLayout>
  );
}
