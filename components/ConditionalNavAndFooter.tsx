"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function ConditionalNavAndFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isLoginPage = pathname === "/login";
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