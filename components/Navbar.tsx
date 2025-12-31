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
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-8 pt-4">
      <div className="max-w-5xl w-full bg-gradient-to-b from-sysmex-700/90 via-sysmex-900/95 to-sysmex-700/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between h-28 md:h-32 px-6 md:px-8">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-4 group" onClick={() => setIsOpen(false)}>
            <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full bg-white border-4 border-white/90 group-hover:border-neon-cyan/70 transition-all shadow-[0_0_30px_rgba(70,214,255,0.4)] group-hover:shadow-[0_0_40px_rgba(70,214,255,0.6)] group-hover:scale-105">
              <Image
                src="https://res.cloudinary.com/gear-gaming/image/upload/v1767027578/SYS_and_friends_logo_r6esig.png"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-lg font-black uppercase tracking-wider text-xs
                    transition-all duration-500 ease-out overflow-hidden
                    group/btn
                    ${
                      active
                        ? "text-white bg-gradient-to-r from-neon-cyan/20 via-neon-cyan/30 to-neon-magenta/20 border-2 border-neon-cyan shadow-[0_0_15px_rgba(70,214,255,0.5)]"
                        : "text-gray-300 bg-white/5 border-2 border-transparent hover:border-neon-cyan/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_10px_rgba(70,214,255,0.3)] hover:scale-105"
                    }
                    before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-neon-cyan/0 before:via-neon-cyan/30 before:to-neon-magenta/0
                    before:opacity-0 group-hover/btn:before:opacity-100 before:transition-opacity before:duration-500
                    after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent
                    after:translate-x-[-100%] group-hover/btn:after:translate-x-[100%] after:transition-transform after:duration-1000 after:ease-in-out
                  `}
                >
                  <span className="relative z-10">
                    {link.name}
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
        <div className="md:hidden bg-gradient-to-b from-sysmex-700/90 via-sysmex-900/95 to-sysmex-700/90 backdrop-blur-md border border-white/10 absolute w-full left-0 top-full mt-2 rounded-b-2xl shadow-2xl">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative px-4 py-2 rounded-lg font-black uppercase tracking-wider text-xs
                      transition-all duration-300
                      ${
                        active
                          ? "text-white bg-gradient-to-r from-neon-cyan/20 via-neon-cyan/30 to-neon-magenta/20 border-2 border-neon-cyan shadow-[0_0_15px_rgba(70,214,255,0.5)]"
                          : "text-gray-300 bg-white/5 border-2 border-transparent hover:border-neon-cyan/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_10px_rgba(70,214,255,0.3)]"
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
        </div>
      )}
    </nav>
  );
}