"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Aktuality", href: "/clanky" },
    { name: "Výsledky", href: "/vysledky" },
    { name: "Týmová soupiska", href: "/tym" },
    { name: "Galerie", href: "/galerie" },
    { name: "Kalendář", href: "/kalendar" },
    { name: "Playlisty", href: "/playlisty" },
  ];

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-8 pt-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-[60%] relative"
      >
        {/* Logo positioned absolutely on the left, centered vertically */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Link href="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-full bg-white border-4 border-white/90 group-hover:border-neon-cyan transition-all shadow-[0_0_30px_rgba(70,214,255,0.4)] group-hover:shadow-[0_0_50px_rgba(70,214,255,0.8)]"
            >
              <Image
                src="https://res.cloudinary.com/gear-gaming/image/upload/v1767027578/SYS_and_friends_logo_r6esig.png"
                alt="SYSMEX & Friends Logo"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </Link>
        </div>
        
        {/* White rectangle starting from center of logo, extending right */}
        <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] ml-[50%]">
          <div className="flex items-center justify-end h-14 md:h-16 px-6 md:px-10">
            

            {/* DESKTOP NAV with 3D hover effects */}
            <div className="hidden lg:flex items-center gap-3">
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <Link
                      href={link.href}
                      className="group/link relative block"
                    >
                      <motion.div
                        whileHover={{ 
                          scale: 1.05,
                          rotateX: 5,
                          rotateY: -5,
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className={`
                          relative px-5 py-3 rounded-xl font-black uppercase tracking-tight text-sm
                          transition-all duration-300 overflow-hidden
                          transform-gpu perspective-1000
                          ${
                            active
                              ? "text-white bg-gradient-to-br from-neon-cyan/40 via-neon-magenta/30 to-neon-cyan/40 border-2 border-neon-cyan shadow-[0_0_30px_rgba(70,214,255,0.8),inset_0_0_20px_rgba(70,214,255,0.3)]"
                              : "text-gray-300 bg-white/5 border-2 border-transparent hover:border-neon-cyan/70 hover:text-white hover:bg-white/10 hover:shadow-[0_0_25px_rgba(70,214,255,0.6)]"
                          }
                        `}
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {/* Animated gradient background on hover */}
                        <span className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/50 to-neon-magenta/20 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500 animate-gradient-flow" />
                        
                        {/* Shimmer effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover/link:translate-x-[200%] transition-transform duration-1000 skew-x-12" />
                        
                        {/* Text with 3D effect */}
                        <span className="relative z-10 block" style={{ transform: "translateZ(20px)" }}>
                          {link.name}
                        </span>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

             {/* MOBILE MENU TOGGLE */}
             <motion.button
               whileTap={{ scale: 0.9 }}
               className="lg:hidden text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
               onClick={() => setIsOpen(!isOpen)}
               aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
             >
               {isOpen ? <X size={24} /> : <Menu size={24} />}
             </motion.button>
          </div>
        </div>

         {/* MOBILE NAV with slide animation */}
         <motion.div
           initial={false}
           animate={{
             height: isOpen ? "auto" : 0,
             opacity: isOpen ? 1 : 0,
           }}
           transition={{ duration: 0.3, ease: "easeInOut" }}
           className="lg:hidden overflow-hidden"
         >
           <div className="mt-2 ml-[50%] bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl">
            <div className="px-6 py-4">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: isOpen ? 0.05 * index : 0, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        className={`
                          block px-5 py-3.5 rounded-lg font-black uppercase tracking-tight text-sm
                          transition-all duration-300
                          ${
                            active
                              ? "text-white bg-gradient-to-r from-neon-cyan/30 via-neon-cyan/40 to-neon-magenta/30 border-2 border-neon-cyan shadow-[0_0_20px_rgba(70,214,255,0.6)]"
                              : "text-gray-300 bg-white/5 border-2 border-transparent hover:border-neon-cyan/60 hover:bg-white/10 hover:text-white"
                          }
                        `}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </nav>
  );
}