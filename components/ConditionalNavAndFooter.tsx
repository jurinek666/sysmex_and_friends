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

  return (
    <>
      {!isAdminPage && <Navbar />}
      <div className="flex-grow">
        {children}
      </div>
      {!isAdminPage && <Footer />}
    </>
  );
}