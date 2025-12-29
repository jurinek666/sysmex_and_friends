"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const threshold = 8;
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`ngg-nav ${scrolled ? "ngg-nav--scrolled" : ""}`}>
      <div className="ngg-nav__inner">
        {/* Brand = BACK HOME */}
        <Link href="/" className="ngg-nav__brand" aria-label="Back home">
          <span className="ngg-nav__mark" aria-hidden="true" />
          <span className="ngg-nav__title">SYSMEX &amp; Friends</span>
        </Link>

        <nav className="ngg-nav__links" aria-label="Hlavní navigace">
          {/* TOP (CTA) */}
          <Link href="/" className="ngg-nav__cta">
            TOP
          </Link>
          <Link href="/vysledky" className="ngg-nav__link">
            VÝSLEDKY
          </Link>
          <Link href="/tym" className="ngg-nav__link">
            TÝM
          </Link>
          <Link href="/galerie" className="ngg-nav__link">
            GALERIE
          </Link>
        </nav>
      </div>

      {/* Animated gradient “signature” line */}
      <div className="ngg-nav__glow" aria-hidden="true" />
    </header>
  );
}
