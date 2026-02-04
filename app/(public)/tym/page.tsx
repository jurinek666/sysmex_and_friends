import Link from "next/link";
import { Metadata } from "next";
import { getActiveMembers } from "@/lib/queries/members";
import { MemberCard } from "@/components/team/MemberCard";

export const metadata: Metadata = {
  title: "Tým | SYSMEX & Friends Quiz Team",
  description: "Seznam členů kvízového týmu SYSMEX & Friends",
};

export const revalidate = 60;

export default async function TeamPage() {
  const members = await getActiveMembers();

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* HLAVIČKA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            NÁŠ <span className="text-neon-magenta">TÝM</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Mozky operace. Každý ví něco, nikdo neví všechno.
          </p>
        </div>
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-neon-magenta transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Zpět na základnu
        </Link>
      </div>

      {/* GRID ČLENŮ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.length === 0 ? (
          <div className="col-span-full bento-card p-12 text-center text-gray-500">
            Zatím tu nikdo není. Tým je asi na baru.
          </div>
        ) : (
          members.map((member) => (
            <MemberCard key={member.id} member={member} variant="full" />
          ))
        )}
      </div>
    </main>
  );
} 