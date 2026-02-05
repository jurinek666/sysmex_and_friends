"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { updateProfile, type UpdateProfileResult } from "@/app/(members)/_actions";
import type { Profile } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

interface ProfileFormProps {
  profile: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<UpdateProfileResult | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage(null);
    const result = await updateProfile(formData);
    setMessage(result);
    setPending(false);
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na nástěnku
        </Link>
      </div>
      <form
        action={handleSubmit}
        className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email (přihlašovací účet)
          </label>
          <input
            type="text"
            value={profile.email}
            readOnly
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label
            htmlFor="display_name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Zobrazované jméno
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            defaultValue={profile.display_name ?? ""}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-neon-cyan focus:border-transparent outline-none"
            placeholder="Přezdívka nebo jméno"
          />
        </div>
        <div>
          <label
            htmlFor="avatar_url"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            URL avataru (volitelné)
          </label>
          <input
            id="avatar_url"
            name="avatar_url"
            type="url"
            defaultValue={profile.avatar_url ?? ""}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-neon-cyan focus:border-transparent outline-none"
            placeholder="https://..."
          />
          {profile.avatar_url && (
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xs text-gray-500">Náhled:</span>
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800 border border-gray-700">
                <Image
                  src={profile.avatar_url}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
        {message && (
          <p
            className={
              message.success
                ? "text-neon-cyan text-sm"
                : "text-red-400 text-sm"
            }
          >
            {message.success ? "Profil uložen." : message.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 rounded-lg bg-neon-cyan text-black font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50"
        >
          {pending ? "Ukládám..." : "Uložit profil"}
        </button>
      </form>
    </div>
  );
}
