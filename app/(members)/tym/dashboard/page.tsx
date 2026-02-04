"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/queries/team";
import { Profile } from "@/lib/types";

export default function MemberDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        // Pass the client-side supabase instance
        const userProfile = await getCurrentUserProfile(supabase);
        // Pokud nemáme profil, ale jsme přihlášeni (auth.user existuje),
        // znamená to, že se trigger ještě neprovedl nebo selhal.
        // Prozatím zobrazíme loading nebo základní info.
        setProfile((userProfile as unknown) as Profile);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Načítám profil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vítej v týmu!</h1>
            {profile ? (
                <p className="text-gray-400">Přihlášen jako <span className="text-neon-cyan">{profile.display_name || profile.email}</span></p>
            ) : (
                <p className="text-gray-400">Profil se připravuje...</p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors"
          >
            <LogOut size={18} />
            Odhlásit
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* OSOBNÍ DATA */}
          <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserIcon className="text-neon-magenta" />
              Můj Profil
            </h2>
            {profile ? (
                <div className="space-y-4">
                    <div>
                        <span className="block text-xs text-gray-500 uppercase">Jméno</span>
                        <span className="text-lg">{profile.display_name || "-"}</span>
                    </div>
                    <div>
                        <span className="block text-xs text-gray-500 uppercase">Email</span>
                        <span className="text-lg">{profile.email}</span>
                    </div>
                     <div>
                        <span className="block text-xs text-gray-500 uppercase">Role</span>
                        <span className="inline-block px-2 py-1 rounded text-xs bg-gray-800 border border-gray-700 mt-1">
                            {profile.role}
                        </span>
                    </div>
                </div>
            ) : (
                <p>Profil nenalezen.</p>
            )}
             <div className="mt-6">
                <button className="text-sm text-gray-500 cursor-not-allowed" disabled>Upravit profil (Coming Soon)</button>
             </div>
          </section>

          {/* NOVINKY / AKCE */}
          <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
             <h2 className="text-xl font-bold mb-4 text-neon-gold">Nadcházející kvízy</h2>
             <p className="text-gray-400 text-sm mb-4">Zde uvidíš seznam nejbližších akcí a budeš moci potvrdit účast.</p>

             {/* Placeholder pro Event list */}
             <div className="p-4 bg-gray-950/50 rounded-lg border border-dashed border-gray-700 text-center text-gray-500">
                Žádné nadcházející akce (nebo modul ve vývoji)
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
