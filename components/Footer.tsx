import Link from "next/link";

// ✅ Používáme pojmenovaný export (Named Export)
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-32 bg-sysmex-950 pb-12 pt-16 overflow-hidden">
      {/* Laser line dekorace */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent shadow-[0_0_15px_rgba(70,214,255,0.5)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">
              SYSMEX <span className="text-neon-cyan">&</span> FRIENDS
            </h2>
            <p className="text-sysmex-100/50 max-w-lg mx-auto text-sm leading-relaxed">
              Databáze našich úspěchů, pádů a vypitých piv. 
              Oficiální stránky kvízového týmu, který ví všechno.
            </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12">
          <FooterLink href="/team">Náš tým</FooterLink>
          <FooterLink href="/vysledky">Výsledky</FooterLink>
          <FooterLink href="/#aktuality">Kronika</FooterLink>
          <FooterLink href="/galerie">Galerie</FooterLink>
        </nav>

        <div className="w-full max-w-2xl border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>&copy; {currentYear} Sysmex & Friends. Všechna práva vyhrazena.</p>
          <p className="flex items-center gap-1">
            Built with <span className="text-red-500">♥</span> & Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-sm font-bold text-gray-400 hover:text-neon-magenta transition-colors duration-300 tracking-wide uppercase"
    >
      {children}
    </Link>
  );
}