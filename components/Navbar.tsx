// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUp } from "lucide-react";

// ✅ Změna na Named Export (odebráno 'default')
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Aktuality", href: "/clanky" },
    { name: "Výsledky", href: "/vysledky" },
    { name: "Tým", href: "/tym" },
    { name: "Galerie", href: "/galerie" },
  ];

  const isActive = (path: string) => pathname === path;

  const handleTopClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-sysmex-950/90 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
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

            <button
              onClick={handleTopClick}
              className="flex items-center gap-2 px-5 py-2 bg-neon-cyan text-sysmex-950 font-black uppercase tracking-wider rounded-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <span>TOP</span>
              <ArrowUp className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-sysmex-950 border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-bold uppercase tracking-wider ${
                isActive(link.href) ? "text-neon-cyan" : "text-gray-300"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleTopClick}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-neon-cyan text-sysmex-950 font-black uppercase tracking-wider rounded-lg mt-2"
          >
             <span>TOP</span>
             <ArrowUp className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
      )}
    </nav>
  );
}