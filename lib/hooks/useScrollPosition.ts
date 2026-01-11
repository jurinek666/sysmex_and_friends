"use client";

import { useState, useEffect } from "react";

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updateScrollPosition = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", updateScrollPosition);
    updateScrollPosition(); // Set initial value

    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
    };
  }, []);

  return scrollPosition;
}
