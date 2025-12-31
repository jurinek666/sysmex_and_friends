import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { adminCreateMember, adminDeleteMember } from "../_actions";
import { ArrowLeft } from "lucide-react";

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
        <form action={adminCreateMember} className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jméno (Display Name)</label>
                <input name="displayName" placeholder="Jan Novák" required className="w-full p-2 border rounded-xl" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Přezdívka (Nickname)</label>
                <input name="nickname" placeholder="Honza" className="w-full p-2 border rounded-xl" />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input name="role" placeholder="Kapitán / Hudební expert" className="w-full p-2 border rounded-xl" />
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Pohlaví</label>
                 <select name="gender" className="w-full p-2 border rounded-xl bg-white">
                    <option value="MALE">Muž</option>
                    <option value="FEMALE">Žena</option>
                 </select>
            </div>

            <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">O členovi (Bio)</label>
                 <textarea name="bio" rows={3} className="w-full p-2 border rounded-xl" />
            </div>

            <div className="md:col-span-2">
                <button type="submit" className="bg-cyan-600 text-white px-6 py-2 rounded-xl hover:bg-cyan-700 w-full">Přidat člena</button>
            </div>
        </form>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {safeMembers.map((m) => (
          <div key={m.id} className="border p-4 rounded-xl bg-white flex justify-between items-start shadow-sm">
            <div>
              <div className="font-bold text-lg">{m.displayName}</div>
              {m.nickname && <div className="text-sm text-gray-500">"{m.nickname}"</div>}
              <div className="text-xs mt-2 bg-gray-100 inline-block px-2 py-1 rounded">{m.role || "Člen"}</div>
            </div>
            <form action={adminDeleteMember}>
              <input type="hidden" name="id" value={m.id} />
              <button className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm font-medium transition-colors">Smazat</button>
            </form>
          </div>
        ))}
        {safeMembers.length === 0 && <div className="col-span-2 text-center text-gray-400 py-8">Zatím žádní členové.</div>}
      </div>
    </div>
  );
}