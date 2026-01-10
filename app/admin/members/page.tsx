import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/admin/auth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MemberForm } from "./MemberForm";
import { MemberList } from "./MemberList";

export const dynamic = "force-dynamic";

// Definujeme typ pro člena, aby TypeScript nekřičel
interface Member {
  id: string;
  displayName: string;
  nickname: string | null;
  role: string | null;
  gender: string;
  bio: string | null;
  isActive: boolean;
}

export default async function AdminMembersPage() {
  await requireAuth();
  const supabase = await createClient();

  // Nahrazeno prisma.member.findMany(...)
  const { data: members } = await supabase
    .from("Member")
    .select("*")
    .order("createdAt", { ascending: false });

  // Převedeme na náš typ a zajistíme, že to není null
  const safeMembers = (members || []) as Member[];

  return (
    <AdminLayout title="Admin • Tým">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Přidat člena</h2>
        <MemberForm />
      </section>

      <MemberList members={safeMembers} />
    </AdminLayout>
  );
}