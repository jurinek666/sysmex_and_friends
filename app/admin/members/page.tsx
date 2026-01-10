import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/admin/auth";
import { ArrowLeft } from "lucide-react";
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
    <div className="max-w-4xl mx-auto px-6 py-24">
      
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na nástěnku
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Admin • Tým</h1>

      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Přidat člena</h2>
        <MemberForm />
      </section>

      <MemberList members={safeMembers} />
    </div>
  );
}