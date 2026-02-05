"use client";

import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Member } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TeamRosterProps {
  initialMembers: Member[];
}

export function TeamRoster({ initialMembers }: TeamRosterProps) {
  const [activeId, setActiveId] = useState<string | null>(
    initialMembers.length > 0 ? initialMembers[0].id : null
  );

  // If no members, show nothing or placeholder (handled by parent usually)
  if (!initialMembers.length) return null;

  return (
    <LayoutGroup>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)] grid-flow-dense">
        {initialMembers.map((member) => {
          const isActive = member.id === activeId;

          return (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              className={cn(
                "rounded-3xl border border-sysmex-800 bg-sysmex-900/40 backdrop-blur-sm overflow-hidden relative group",
                isActive
                  ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 order-first lg:order-none lg:[grid-column-start:2] lg:[grid-row-start:1]"
                  : "col-span-1 row-span-1 cursor-pointer hover:border-neon-magenta/50 transition-colors"
              )}
              onClick={() => !isActive && setActiveId(member.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {isActive ? (
                <ActiveMemberCard member={member} />
              ) : (
                <SmallMemberCard member={member} />
              )}
            </motion.div>
          );
        })}

        {/* Join Us Card - Always at the end */}
        <motion.div
            layout
            className="col-span-1 sm:col-span-2 lg:col-span-4 rounded-3xl border border-neon-magenta/30 bg-gradient-to-br from-sysmex-900 to-sysmex-950 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group mt-4"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/10 to-transparent opacity-50 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-6">
                <div className="hidden md:flex w-16 h-16 rounded-2xl bg-neon-magenta items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-neon-magenta/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                    </svg>
                </div>
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black italic uppercase text-white tracking-tight mb-1">
                        Chceš se přidat?
                    </h3>
                    <p className="text-neon-magenta/80 font-medium">
                        Hledáme další mozky pro naše pub quizové tažení.
                    </p>
                </div>
            </div>
            <a
                href="mailto:info@sysmex-friends.cz"
                className="relative z-10 bg-neon-magenta text-white px-10 py-4 rounded-xl font-black text-sm hover:scale-105 transition-transform uppercase tracking-widest shadow-lg shadow-neon-magenta/20"
            >
                Kontaktuj nás
            </a>
        </motion.div>
      </div>
    </LayoutGroup>
  );
}

function ActiveMemberCard({ member }: { member: Member }) {
  const initials = member.displayName.slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center text-center p-8 sm:p-12 relative z-10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neon-magenta/10 to-neon-cyan/10 opacity-50" />

      {/* Avatar */}
      <div className="relative mb-8 group-hover:scale-105 transition-transform duration-500">
        <div className="absolute inset-0 bg-neon-magenta blur-[40px] opacity-20" />
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-sysmex-950 border-4 border-neon-magenta flex items-center justify-center overflow-hidden shadow-[0_0_30px_-10px_rgba(255,79,216,0.5)]">
           {member.avatarUrl ? (
                <Image
                  src={member.avatarUrl}
                  alt={member.displayName}
                  fill
                  sizes="(max-width: 640px) 160px, 192px"
                  className="object-cover"
                />
           ) : (
               <span className="text-5xl sm:text-6xl font-black text-white">{initials}</span>
           )}
        </div>
        {member.role && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-sysmex-950 border border-neon-magenta/50 text-neon-magenta text-[10px] sm:text-xs font-bold px-4 sm:px-6 py-2 rounded-full uppercase tracking-[0.2em] whitespace-nowrap shadow-xl">
                {member.role}
            </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg">
        <motion.h2 layoutId={`name-${member.id}`} className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
            {member.displayName}
        </motion.h2>

        {member.nickname && (
            <motion.p layoutId={`nick-${member.id}`} className="font-mono text-neon-cyan text-xl sm:text-2xl italic mb-6">
                &quot;{member.nickname}&quot;
            </motion.p>
        )}

        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-base sm:text-lg leading-relaxed mx-auto"
        >
            {member.bio || "Tajemný člen týmu, o kterém se vypráví legendy, ale nikdo je nezná."}
        </motion.p>
      </div>

      {/* Decorations */}
      <div className="absolute top-0 left-0 p-6 text-neon-magenta/20 font-mono text-xs select-none">
        ID: {member.id.slice(0, 8).toUpperCase()}
      </div>
      <div className="absolute bottom-0 right-0 p-6 text-neon-cyan/20 font-mono text-xs select-none">
        STATUS: ACTIVE
      </div>
    </motion.div>
  );
}

function SmallMemberCard({ member }: { member: Member }) {
  const initials = member.displayName.slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center text-center p-6"
    >
      <div className="relative w-20 h-20 rounded-full bg-sysmex-950 border-2 border-sysmex-700 group-hover:border-neon-magenta flex items-center justify-center text-xl font-bold text-gray-400 group-hover:text-white transition-all mb-4 overflow-hidden">
        {member.avatarUrl ? (
             <Image
               src={member.avatarUrl}
               alt={member.displayName}
               fill
               sizes="80px"
               className="object-cover"
             />
        ) : (
            <span>{initials}</span>
        )}
      </div>

      <motion.h3 layoutId={`name-${member.id}`} className="text-lg font-bold text-gray-200 group-hover:text-neon-magenta transition-colors">
        {member.displayName}
      </motion.h3>

      {member.nickname && (
        <motion.p layoutId={`nick-${member.id}`} className="font-mono text-neon-cyan/70 text-xs mt-1">
            &quot;{member.nickname}&quot;
        </motion.p>
      )}
    </motion.div>
  );
}
