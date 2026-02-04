"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User as UserIcon } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/queries/team";
import { Profile } from "@/lib/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const userProfile = await getCurrentUserProfile(supabase);
        setProfile((userProfile as unknown) as Profile);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        Načítám profil...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">Vítej v týmu!</h1>
        {profile ? (
          <p className="text-gray-400">
            Přihlášen jako{" "}
            <span className="text-neon-cyan">
              {profile.display_name || profile.email}
            </span>
          </p>
        ) : (
          <p className="text-gray-400">Profil se připravuje...</p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserIcon className="text-neon-magenta" />
            Můj Profil
          </h2>
          {profile ? (
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-gray-500 uppercase">
                  Jméno
                </span>
                <span className="text-lg">{profile.display_name || "-"}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase">
                  Email
                </span>
                <span className="text-lg">{profile.email}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase">
                  Role
                </span>
                <span className="inline-block px-2 py-1 rounded text-xs bg-gray-800 border border-gray-700 mt-1">
                  {profile.role}
                </span>
              </div>
            </div>
          ) : (
            <p>Profil nenalezen.</p>
          )}
          <div className="mt-6">
            <Link
              href="/profile"
              className="text-sm text-neon-cyan hover:underline"
            >
              Upravit profil →
            </Link>
          </div>
        </section>

        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-neon-gold">
            Nadcházející kvízy
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Zde uvidíš seznam nejbližších akcí a budeš moci potvrdit účast.
          </p>
          <Link
            href="/schedule"
            className="inline-block px-4 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan/30 transition-colors"
          >
            Otevřít kalendář →
          </Link>
        </section>
      </div>
    </div>
  );
}
