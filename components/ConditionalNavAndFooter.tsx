"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function ConditionalNavAndFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always render Navbar/Footer to prevent hydration mismatch
  // CSS will hide them on admin/login pages using data-admin-page and data-login-page attributes
  return (
    <>
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </>
  );
}