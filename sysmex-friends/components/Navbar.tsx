import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="ngg-nav">
      <div className="ngg-nav__inner">
        {/* LEVÁ ČÁST: Logo */}
        <Link href="/" className="ngg-nav__brand group">
          <div className="relative h-10 w-auto aspect-[4/1]">
             <Image
                src="https://res.cloudinary.com/gear-gaming/image/upload/v1767027787/SYS_and_friends_logo_dark_dxtorn.png"
                alt="SYSMEX & Friends Logo"
                fill
                className="object-contain object-left"
                priority
             />
          </div>
        </Link>

        {/* PRAVÁ ČÁST: Odkazy a tlačítko */}
        <div className="ngg-nav__links">
          <Link href="/tym" className="ngg-nav__link hidden sm:inline-flex">
            Náš tým
          </Link>
          <Link href="/vysledky" className="ngg-nav__link hidden sm:inline-flex">
            Výsledky
          </Link>
          <Link href="/galerie" className="ngg-nav__link hidden sm:inline-flex">
            Galerie
          </Link>
          
          {/* CTA Tlačítko */}
          <Link href="/clanky" className="ngg-nav__cta ml-2">
            Články
          </Link>
        </div>
      </div>
      
      {/* Spodní zářící linka */}
      <div className="ngg-nav__glow" />
    </nav>
  );
}