"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: "Aktuality", href: "/clanky" },
    { name: "Výsledky", href: "/vysledky" },
    { name: "Tým", href: "/tym" },
    { name: "Galerie", href: "/galerie" },
  ];

  const isActive = (path: string) => pathname.startsWith(path);


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sysmex-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-24 md:h-28">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-4 group" onClick={() => setIsOpen(false)}>
            <div className="relative w-20 h-20 overflow-hidden rounded-lg border border-white/10 group-hover:border-neon-cyan/50 transition-colors">
              <Image
                src="https://res.cloudinary.com/gear-gaming/image/upload/v1767027787/SYS_and_friends_logo_dark_dxtorn.png"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl text-white font-black tracking-tight leading-none group-hover:text-neon-cyan transition-colors">
                SYSMEX
              </span>
              <span className="text-base text-gray-400 tracking-wider group-hover:text-white transition-colors">
                & FRIENDS
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-6 py-3 rounded-xl font-black uppercase tracking-wider text-sm
                    transition-all duration-500 ease-out overflow-hidden
                    group/btn
                    ${
                      active
                        ? "text-white bg-gradient-to-r from-neon-cyan/20 via-neon-cyan/30 to-neon-magenta/20 border-2 border-neon-cyan shadow-[0_0_20px_rgba(70,214,255,0.6)] animate-[glow-pulse_2s_ease-in-out_infinite]"
                        : "text-gray-300 bg-white/5 border-2 border-transparent hover:border-neon-cyan/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(70,214,255,0.4)] hover:scale-105"
                    }
                    before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-neon-cyan/0 before:via-neon-cyan/30 before:to-neon-magenta/0
                    before:opacity-0 group-hover/btn:before:opacity-100 before:transition-opacity before:duration-500
                    after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent
                    after:translate-x-[-100%] group-hover/btn:after:translate-x-[100%] after:transition-transform after:duration-1000 after:ease-in-out
                  `}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="relative inline-block">
                      {link.name}
                      {active && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan animate-pulse"></span>
                      )}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {isOpen && (
        <div className="md:hidden bg-sysmex-950 border-t border-white/10 absolute w-full left-0 shadow-2xl">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-5 py-3 rounded-xl font-black uppercase tracking-wider text-base
                    transition-all duration-300
                    ${
                      active
                        ? "text-white bg-gradient-to-r from-neon-cyan/20 via-neon-cyan/30 to-neon-magenta/20 border-2 border-neon-cyan shadow-[0_0_20px_rgba(70,214,255,0.6)]"
                        : "text-gray-300 bg-white/5 border-2 border-transparent hover:border-neon-cyan/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(70,214,255,0.4)]"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}