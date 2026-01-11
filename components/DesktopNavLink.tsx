"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface NavLinkProps {
  link: { name: string; href: string };
  index: number;
  active: boolean;
}

export function DesktopNavLink({ link, index, active }: NavLinkProps) {
  const linkRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-50, 50], [5, -5]);
  const rotateY = useTransform(springX, [-50, 50], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!linkRef.current) return;
      const rect = linkRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const maxDistance = 100;

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        x.set(distanceX * strength * 0.3);
        y.set(distanceY * strength * 0.3);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      ref={linkRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <Link
        href={link.href}
        className="group/link relative block"
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`
            relative px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-black uppercase tracking-tight text-xs md:text-sm
            transition-all duration-300 overflow-hidden
            transform-gpu perspective-1000
            ${active
              ? "text-white"
              : "text-gray-300 hover:text-white"
            }
          `}
        >
          {/* Holographic background for active */}
          {active && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              animate={{
                background: [
                  "linear-gradient(135deg, rgba(70,214,255,0.4), rgba(255,79,216,0.3))",
                  "linear-gradient(135deg, rgba(255,79,216,0.4), rgba(251,217,134,0.3))",
                  "linear-gradient(135deg, rgba(251,217,134,0.4), rgba(70,214,255,0.3))",
                  "linear-gradient(135deg, rgba(70,214,255,0.4), rgba(255,79,216,0.3))",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}

          {/* Holographic border for active */}
          {active && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2"
              animate={{
                borderColor: [
                  "rgba(70,214,255,0.8)",
                  "rgba(255,79,216,0.8)",
                  "rgba(251,217,134,0.8)",
                  "rgba(70,214,255,0.8)",
                ],
                boxShadow: [
                  "0 0 20px rgba(70,214,255,0.6), inset 0 0 20px rgba(70,214,255,0.2)",
                  "0 0 20px rgba(255,79,216,0.6), inset 0 0 20px rgba(255,79,216,0.2)",
                  "0 0 20px rgba(251,217,134,0.6), inset 0 0 20px rgba(251,217,134,0.2)",
                  "0 0 20px rgba(70,214,255,0.6), inset 0 0 20px rgba(70,214,255,0.2)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}

          {/* Hover gradient background */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/30 to-neon-magenta/20 opacity-0 group-hover/link:opacity-100 rounded-xl"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Shimmer effect on hover */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/link:translate-x-full rounded-xl"
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          />

          {/* Text with holographic effect for active */}
          <span className={`relative z-10 block ${active ? "animate-holographic" : ""}`}>
            {link.name}
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
