"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import { DesktopNavLink } from "./DesktopNavLink";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const pathname = usePathname();
  // Removed unused mousePosition
  const scrollPosition = useScrollPosition();
  const navRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Aktuality", href: "/#aktuality" },
    { name: "Výsledky", href: "/vysledky" },
    { name: "Týmová soupiska", href: "/tym" },
    { name: "Galerie", href: "/galerie" },
    { name: "Kalendář", href: "/kalendar" },
    { name: "Playlisty", href: "/#playlisty" },
  ];

  // Track hash changes for active link detection
  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };

    // Set initial hash
    updateHash();

    // Listen for hash changes
    window.addEventListener("hashchange", updateHash);
    
    // Also check on scroll (in case of programmatic scrolling to hash)
    const handleScroll = () => {
      // Small delay to allow scroll to complete
      setTimeout(updateHash, 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    // Extract hash from path (e.g., "#aktuality" from "/#aktuality")
    const hashFromPath = path.includes("#") ? path.split("#")[1] : null;
    
    // For hash-based links, check if pathname matches and hash matches
    if (hashFromPath) {
      const pathWithoutHash = path.split("#")[0];
      return pathname === pathWithoutHash && currentHash === `#${hashFromPath}`;
    }
    
    // For regular paths, use the original logic
    return pathname.startsWith(path);
  };

  // Scroll-based opacity and blur
  // Removed unused scrollBlur
  const isScrolled = scrollPosition > 50;

  // Handle click outside and Escape key to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-4 md:px-8 pt-6 md:pt-8">
      <motion.div
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl"
      >
        {/* FLOATING NAVBAR with Glassmorphism */}
        <motion.div
          animate={{
            opacity: 1,
            scale: isScrolled ? 0.98 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 overflow-visible"
          style={{
            background: "linear-gradient(90deg, #0B1E4B 0%, #1E4EA8 50%, #0B1E4B 100%)",
          }}
        >
          {/* Particle Effects Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-neon-cyan/30 blur-sm"
                initial={{
                  x: `${20 + i * 15}%`,
                  y: `${30 + i * 10}%`,
                  scale: 0,
                }}
                animate={{
                  x: [`${20 + i * 15}%`, `${25 + i * 15}%`, `${20 + i * 15}%`],
                  y: [`${30 + i * 10}%`, `${25 + i * 10}%`, `${30 + i * 10}%`],
                  scale: [0, 1, 0],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
            {/* Gradient orbs */}
            <motion.div
              className="absolute top-0 left-1/4 w-32 h-32 bg-neon-cyan/10 rounded-full blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 right-1/4 w-40 h-40 bg-neon-magenta/10 rounded-full blur-3xl"
              animate={{
                x: [0, -20, 0],
                y: [0, 15, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Animated Gradient Border */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `linear-gradient(90deg, 
                rgba(70,214,255,0.3) 0%, 
                rgba(255,79,216,0.3) 25%, 
                rgba(251,217,134,0.3) 50%, 
                rgba(255,79,216,0.3) 75%, 
                rgba(70,214,255,0.3) 100%)`,
              backgroundSize: "200% 100%",
              padding: "1px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* LOGO - Centered overlapping navbar */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2 
            }}
            className="absolute left-1/2 -translate-x-1/2 -mt-6 md:-mt-8 z-20"
          >
            <Link href="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
              <motion.div
                whileHover={{ 
                  scale: 1.15, 
                  rotate: [0, -5, 5, -5, 0],
                  boxShadow: "0 0 60px rgba(70,214,255,0.8), 0 0 100px rgba(70,214,255,0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
                className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full bg-white border-4 border-white/90 group-hover:border-neon-cyan transition-all shadow-[0_0_40px_rgba(70,214,255,0.5)] group-hover:shadow-[0_0_80px_rgba(70,214,255,0.9)] animate-glass-glow"
              >
                <Image
                  src="https://res.cloudinary.com/gear-gaming/image/upload/v1767027578/SYS_and_friends_logo_r6esig.png"
                  alt="SYSMEX & Friends Logo"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Holographic ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-transparent"
                  animate={{
                    borderColor: [
                      "rgba(70,214,255,0.8)",
                      "rgba(255,79,216,0.8)",
                      "rgba(251,217,134,0.8)",
                      "rgba(70,214,255,0.8)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </Link>
          </motion.div>

          <div className="relative flex items-center justify-end lg:justify-center h-16 md:h-20 px-6 md:px-10">
            {/* DESKTOP NAV - Left side */}
            <div className="hidden lg:flex items-center gap-3 flex-1 justify-end pr-8">
              {navLinks.slice(0, Math.ceil(navLinks.length / 2)).map((link, index) => (
                 <DesktopNavLink key={link.href} link={link} index={index} active={isActive(link.href)} />
              ))}
            </div>

            {/* Spacer for logo */}
            <div className="hidden lg:block w-32 md:w-40 flex-shrink-0"></div>

            {/* DESKTOP NAV - Right side */}
            <div className="hidden lg:flex items-center gap-3 flex-1 justify-start pl-8">
              {navLinks.slice(Math.ceil(navLinks.length / 2)).map((link, index) => (
                 <DesktopNavLink key={link.href} link={link} index={index + Math.ceil(navLinks.length / 2)} active={isActive(link.href)} />
              ))}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </motion.div>

        {/* MOBILE NAV with Glassmorphism */}
        <motion.div
          id="mobile-menu"
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden overflow-y-auto max-h-[85vh] w-full"
        >
          <motion.div
            className="mt-2 glass-nav rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
            initial={{ y: -20 }}
            animate={{ y: isOpen ? 0 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ 
                        x: isOpen ? 0 : -50, 
                        opacity: isOpen ? 1 : 0 
                      }}
                      transition={{ 
                        delay: isOpen ? 0.05 * index : 0, 
                        duration: 0.3 
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`
                          block px-5 py-3.5 rounded-lg font-black uppercase tracking-tight text-sm
                          transition-all duration-300
                          ${active
                            ? "text-white"
                            : "text-gray-300 hover:text-white"
                          }
                        `}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            relative overflow-hidden rounded-lg
                            ${active
                              ? "bg-gradient-to-r from-neon-cyan/30 via-neon-cyan/40 to-neon-magenta/30 border-2 border-neon-cyan shadow-[0_0_20px_rgba(70,214,255,0.6)]"
                              : "bg-white/5 border-2 border-transparent hover:border-neon-cyan/60 hover:bg-white/10"
                            }
                          `}
                        >
                          {active && (
                            <motion.div
                              className="absolute inset-0"
                              animate={{
                                background: [
                                  "linear-gradient(90deg, rgba(70,214,255,0.3), rgba(255,79,216,0.3))",
                                  "linear-gradient(90deg, rgba(255,79,216,0.3), rgba(251,217,134,0.3))",
                                  "linear-gradient(90deg, rgba(251,217,134,0.3), rgba(70,214,255,0.3))",
                                  "linear-gradient(90deg, rgba(70,214,255,0.3), rgba(255,79,216,0.3))",
                                ],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                          )}
                          <span className="relative z-10 block px-5 py-3.5">
                            {link.name}
                          </span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </nav>
  );
}
