import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MemberForm } from "./MemberForm";
import { MemberList } from "./MemberList";
import { Member, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("members")
    .select(`
      id,
      displayName:display_name,
      nickname,
      role,
      gender,
      bio,
      avatarUrl:avatar_url,
      isActive:is_active,
      profileId:profile_id,
      createdAt:created_at,
      updatedAt:updated_at
    `)
    .order("created_at", { ascending: false });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("email", { ascending: true });

  const safeMembers = (members || []) as Member[];
  const safeProfiles = (profiles || []) as Profile[];

  return (
    <AdminLayout title="Admin • Tým">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Přidat člena</h2>
        <MemberForm profiles={safeProfiles} />
      </section>

      <MemberList members={safeMembers} profiles={safeProfiles} />
    </AdminLayout>
  );
}
