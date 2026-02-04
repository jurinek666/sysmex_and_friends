"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, User, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function MembersNav() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="flex flex-wrap items-center gap-4 border-b border-gray-800 pb-4 mb-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>
      <Link
        href="/profile"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
      >
        <User size={18} />
        Profil
      </Link>
      <Link
        href="/schedule"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
      >
        <Calendar size={18} />
        Kalendář
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-2 ml-auto px-4 py-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors"
      >
        <LogOut size={18} />
        Odhlásit
      </button>
    </nav>
  );
}
