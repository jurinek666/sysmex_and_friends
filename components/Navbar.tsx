"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ArrowUp } from "lucide-react";

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

  const handleTopClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sysmex-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-white/10 group-hover:border-neon-cyan/50 transition-colors">
              <Image
                src="https://res.cloudinary.com/gear-gaming/image/upload/v1767024968/ChatGPT_Image_29._12._2025_17_15_51_xxs857.png"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tight leading-none group-hover:text-neon-cyan transition-colors">
                SYSMEX
              </span>
              <span className="text-xs text-gray-400 tracking-wider group-hover:text-white transition-colors">
                & FRIENDS
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-neon-cyan ${
                  isActive(link.href) ? "text-neon-cyan" : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Tlačítko TOP */}
            <button
              onClick={handleTopClick}
              className="flex items-center gap-2 px-5 py-2 bg-neon-cyan text-sysmex-950 font-black uppercase tracking-wider rounded-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] ml-4"
            >
              <span>TOP</span>
              <ArrowUp className="w-4 h-4" strokeWidth={3} />
            </button>
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-bold uppercase tracking-wider px-4 py-2 rounded-lg ${
                  isActive(link.href) ? "text-neon-cyan bg-white/5" : "text-gray-300 hover:bg-white/5"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <button
              onClick={handleTopClick}
              className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-neon-cyan text-sysmex-950 font-black uppercase tracking-wider rounded-lg mt-4"
            >
               <span>TOP</span>
               <ArrowUp className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}