export type MemberCardMember = {
  displayName: string;
  nickname?: string | null;
  role?: string | null;
  bio?: string | null;
};

type MemberCardProps = {
  member: MemberCardMember;
  variant: "compact" | "full";
};

export function MemberCard({ member, variant }: MemberCardProps) {
  const initials = member.displayName.slice(0, 2).toUpperCase();

  if (variant === "compact") {
    return (
      <div className="relative overflow-hidden flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-b from-sysmex-900 to-sysmex-950 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-300 group/item hover:border-neon-magenta/40 hover:shadow-[0_0_16px_-4px_rgba(255,79,216,0.35)] hover:-translate-y-0.5">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan via-neon-magenta to-transparent" />
        <div className="relative w-16 h-16 mb-3">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full blur opacity-20 group-hover/item:opacity-40 transition-opacity" />
          <div className="relative w-full h-full rounded-full bg-sysmex-800 border-2 border-white/10 flex items-center justify-center overflow-hidden ring-2 ring-neon-magenta/30 group-hover/item:ring-neon-magenta/60 group-hover/item:scale-105 transition-all">
            <span className="text-lg font-black text-white/90">{initials}</span>
          </div>
        </div>
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
          {member.displayName}
        </h3>
        {member.nickname && (
          <p className="text-xs text-neon-cyan font-mono line-clamp-1">
            &quot;{member.nickname}&quot;
          </p>
        )}
      </div>
    );
  }

  // variant === "full" (stránka /tym, tmavé téma)
  return (
    <div className="bento-card group flex flex-col items-center text-center p-5 md:p-8 hover:border-neon-magenta/50 hover:shadow-[0_0_25px_-8px_rgba(255,79,216,0.25)] transition-all duration-500">
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
        <div className="relative w-full h-full rounded-full bg-sysmex-800 border-2 border-white/10 flex items-center justify-center overflow-hidden ring-2 ring-neon-magenta/30 group-hover:ring-neon-magenta/60 group-hover:scale-105 transition-all duration-300">
          <span className="text-3xl font-black text-white/90">{initials}</span>
        </div>
        {member.role && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-neon-magenta/15 border border-neon-magenta/50 rounded-full text-[10px] font-bold uppercase tracking-wider text-neon-magenta shadow-lg whitespace-nowrap">
            {member.role}
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{member.displayName}</h3>
      {member.nickname && (
        <p className="text-sm text-neon-cyan font-mono mb-3">
          &quot;{member.nickname}&quot;
        </p>
      )}
      <p className="text-gray-400 text-sm leading-relaxed mt-2 line-clamp-3">
        {member.bio || "Tajemný člen týmu bez biografie."}
      </p>
    </div>
  );
}
