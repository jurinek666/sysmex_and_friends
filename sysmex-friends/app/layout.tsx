import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 👇 Import komponent
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SYSMEX & Friends",
  description: "Oficiální stránky kvízového týmu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="h-full"> {/* Přidáno h-full pro sticky footer */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 flex flex-col min-h-full`}
      >
        <Navbar />
        
        {/* Hlavní obsah se roztáhne, aby vytlačil footer dolů */}
        <div className="flex-grow">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}