import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      {/* Kapsle navigace - přidal jsem pl-28 pro odsazení textu od loga */}
      <nav className="relative flex items-center gap-2 pr-2 pl-28 py-2 rounded-full border border-white/10 bg-sysmex-950/80 backdrop-blur-md shadow-2xl shadow-black/50 min-h-[60px]">
        
        {/* LOGO - Absolutní pozice, aby "rozbilo" mřížku a mohlo být obří */}
        <Link 
            href="/" 
            aria-label="Domů"
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-sysmex-900 flex items-center justify-center overflow-hidden border-4 border-sysmex-950 shadow-neon z-20 hover:scale-105 transition-transform duration-300"
        >
            <div className="relative w-full h-full p-4"> {/* Padding uvnitř loga, aby nebylo nalepené na kraj */}
                <Image
                    src="https://res.cloudinary.com/gear-gaming/image/upload/v1767027787/SYS_and_friends_logo_dark_dxtorn.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            
            {/* Lesklý efekt přes logo (volitelné) */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-full"></div>
        </Link>

        {/* Oddělovač (nyní hned za paddingem) */}
        <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>

        {/* Odkazy */}
        <div className="flex items-center gap-1">
            <NavLink href="/tym">Tým</NavLink>
            <NavLink href="/vysledky">Výsledky</NavLink>
            <NavLink href="/clanky">Články</NavLink>
        </div>

        {/* CTA Button */}
        <Link 
            href="/vysledky" 
            className="ml-2 px-6 py-2.5 rounded-full bg-white text-sysmex-950 text-sm font-bold hover:bg-neon-cyan transition-colors shadow-lg shadow-white/5 hidden sm:block"
        >
            Tabulka
        </Link>
      </nav>
    </div>
  );
}

// Pomocná komponenta pro odkazy (zůstává stejná, jen pro úplnost)
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-magenta opacity-0 group-hover:opacity-100 transition-opacity"></span>
    </Link>
  );
}