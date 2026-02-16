"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { motion, useSpring, AnimatePresence, useReducedMotion } from "framer-motion";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [jiggleKey, setJiggleKey] = useState(0);
  const lastScrollY = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  // Create spring animation for smooth jiggle effect
  const springConfig = { stiffness: 400, damping: 10 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide button based on scroll position
      if (currentScrollY > 500) {
        if (!isVisible) {
          setIsVisible(true);
        }
        
        // Trigger jiggle on every scroll movement (simulating restless child)
        // Only if reduced motion is NOT requested
        if (!shouldReduceMotion && Math.abs(currentScrollY - lastScrollY.current) > 50) {
          // Increment key to trigger re-animation
          setJiggleKey(prev => prev + 1);
          
          // Random small movements to simulate attention-seeking behavior
          const randomX = (Math.random() - 0.5) * 15;
          const randomY = (Math.random() - 0.5) * 15;
          x.set(randomX);
          y.set(randomY);
          
          // Reset to original position
          setTimeout(() => {
            x.set(0);
            y.set(0);
          }, 300);
        }
      } else {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible, x, y, shouldReduceMotion]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          style={{ x, y }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            key={jiggleKey}
            onClick={scrollToTop}
            whileHover={!shouldReduceMotion ? {
              scale: 1.15,
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.4 }
            } : { scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            animate={!shouldReduceMotion ? {
              y: [0, -8, 0],
            } : {}}
            transition={!shouldReduceMotion ? {
              y: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            } : {}}
            className="group relative flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-magenta text-white font-black rounded-2xl shadow-[0_0_30px_rgba(70,214,255,0.6)] hover:shadow-[0_0_50px_rgba(70,214,255,0.9)] transition-shadow overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-sysmex-950"
            aria-label="Scroll to top"
          >
            {/* Animated background glow - disable on reduced motion */}
            {!shouldReduceMotion && (
              <span className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-white/40 to-neon-magenta/0 animate-pulse opacity-50" />
            )}

            {/* Rotating border effect - disable on reduced motion */}
            {!shouldReduceMotion && (
              <span className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-spin-slow" style={{ animationDuration: "3s" }} />
            )}

            {/* Arrow Icon */}
            <ArrowUp className="relative z-10 w-6 h-6 mb-0.5" strokeWidth={3} />

            {/* "TOP" text */}
            <span className="relative z-10 text-[9px] font-black tracking-wider leading-none">
              TOP
            </span>

            {/* Particle effect on hover - disable on reduced motion */}
            {!shouldReduceMotion && (
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full animate-ping" />
              </span>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
