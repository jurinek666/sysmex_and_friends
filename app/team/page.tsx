import Link from "next/link";
import { Metadata } from "next";
import { getActiveMembers, type Member } from "@/lib/queries/members";

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
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            NÁŠ <span className="text-neon-magenta">TÝM</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Mozky operace. Každý ví něco, nikdo neví všechno.
          </p>
        </div>
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
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
            <div 
              key={member.id} 
              className="bento-card group flex flex-col items-center text-center p-8 hover:border-neon-magenta/30 transition-all duration-500"
            >
              {/* Avatar / Fotka */}
              <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative w-full h-full rounded-full bg-sysmex-800 border-2 border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                   <span className="text-3xl font-black text-white/90">
                     {member.displayName.slice(0, 2).toUpperCase()}
                   </span>
                </div>
                
                {/* Odznak role (pokud existuje) */}
                {member.role && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-sysmex-950 border border-neon-magenta/50 rounded-full text-[10px] font-bold uppercase tracking-wider text-neon-magenta shadow-lg whitespace-nowrap">
                    {member.role}
                  </div>
                )}
              </div>

              {/* Jméno a Info */}
              <h3 className="text-xl font-bold text-white mb-1">
                {member.displayName}
              </h3>
              {member.nickname && (
                <p className="text-sm text-neon-cyan font-mono mb-3">
                  &quot;{member.nickname}&quot;
                </p>
              )}
              
              {/* Bio / Popis */}
              <p className="text-gray-400 text-sm leading-relaxed mt-2 line-clamp-3">
                {member.bio || "Tajemný člen týmu bez biografie."}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
} 