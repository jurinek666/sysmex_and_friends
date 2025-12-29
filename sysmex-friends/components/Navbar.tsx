import Link from "next/link";
import { Trophy, Users, Newspaper, Image, Home } from "lucide-react";

export function Navbar() {
  const navItems = [
    { label: "Domů", href: "/", icon: Home },
    { label: "Články", href: "/clanky", icon: Newspaper },
    { label: "Výsledky", href: "/vysledky", icon: Trophy },
    { label: "Tým", href: "/tym", icon: Users },
    { label: "Galerie", href: "/galerie", icon: Image },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <span className="bg-blue-600 text-white p-1 rounded-lg">SF</span>
            <span className="hidden sm:block">SYSMEX & Friends</span>
          </Link>

          {/* Menu pro desktop i mobile (zjednodušené) */}
          <div className="flex gap-1 md:gap-6 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors whitespace-nowrap"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}