import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      {/* Kapsle navigace */}
      <nav className="flex items-center gap-1 p-2 rounded-full border border-white/10 bg-sysmex-950/80 backdrop-blur-md shadow-2xl shadow-black/50">
        
        {/* Logo Icon - klikatelné na domů */}
        <Link href="/" className="relative w-10 h-10 rounded-full bg-sysmex-900 flex items-center justify-center overflow-hidden border border-white/5 hover:border-neon-cyan/50 transition-colors">
            <Image
                src="https://res.cloudinary.com/gear-gaming/image/upload/v1767027787/SYS_and_friends_logo_dark_dxtorn.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
            />
        </Link>

        {/* Oddělovač */}
        <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>

        {/* Odkazy */}
        <div className="flex items-center">
            <NavLink href="/tym">Tým</NavLink>
            <NavLink href="/vysledky">Výsledky</NavLink>
            <NavLink href="/clanky">Články</NavLink>
        </div>

        {/* CTA Button (na konci) */}
        <Link 
            href="/vysledky" 
            className="ml-2 px-5 py-2 rounded-full bg-white text-sysmex-950 text-sm font-bold hover:bg-neon-cyan transition-colors"
        >
            Tabulka
        </Link>
      </nav>
    </div>
  );
}

// Pomocná komponenta pro odkazy
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      {/* Tečka při hoveru */}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-magenta opacity-0 group-hover:opacity-100 transition-opacity"></span>
    </Link>
  );
}