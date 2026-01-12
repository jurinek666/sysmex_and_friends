"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreatePlaylist } from "../_actions";

export function PlaylistForm() {
  return (
    <ActionForm
      action={adminCreatePlaylist}
      successMessage="Playlist byl úspěšně vytvořen"
      submitButtonText="Uložit playlist"
      submitButtonClassName="w-full bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
    >
      <div className="space-y-4">
        <input name="title" placeholder="Název (např. Jaro 2024)" required className="w-full p-3 border rounded-xl" />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spotify Embed Code (nebo URL)</label>
          <input 
            name="spotifyUrl" 
            placeholder='<iframe ... src="..." ...' 
            required 
            className="w-full p-3 border rounded-xl font-mono text-sm bg-gray-50" 
          />
          <p className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded-lg">
            ℹ️ Na Spotify klikni na <strong>Tři tečky → Sdílet → Vložit playlist (Embed)</strong>. Zkopíruj celý kód a vlož ho sem.
          </p>
        </div>

        <textarea name="description" placeholder="Popisek (max 200 znaků)" maxLength={200} className="w-full p-3 border rounded-xl" />

        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input type="checkbox" name="isActive" className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
          <span className="font-medium">Aktivní (zobrazit tento playlist na webu)</span>
        </label>
      </div>
    </ActionForm>
  );
}
