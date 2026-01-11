"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function ConditionalNavAndFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only using pathname after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR, show Navbar/Footer (default behavior)
  // After mount, use actual pathname
  const isAdminPage = mounted && pathname?.startsWith("/admin");
  const isLoginPage = mounted && pathname === "/login";
  const shouldHideNavAndFooter = isAdminPage || isLoginPage;

  return (
    <>
      {!shouldHideNavAndFooter && <Navbar />}
      <div className="flex-grow">
        {children}
      </div>
      {!shouldHideNavAndFooter && <Footer />}
    </>
  );
}