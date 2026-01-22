"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreatePlaylist } from "../_actions";
import { X } from "lucide-react";

interface Playlist {
  id: string;
  title: string;
  spotifyUrl: string;
  description: string | null;
  isActive: boolean;
}

interface PlaylistFormProps {
  playlist?: Playlist;
  onCancel?: () => void;
}

export function PlaylistForm({ playlist, onCancel }: PlaylistFormProps) {
  const isEdit = !!playlist;

  return (
    <ActionForm
      action={adminCreatePlaylist}
      successMessage="Playlist byl úspěšně vytvořen"
      submitButtonText="Uložit playlist"
      submitButtonClassName="w-full bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
      onSuccess={onCancel}
    >
      <div className="space-y-4">
        {isEdit && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-xl text-sm">
            Upravujete playlist: <strong>{playlist.title}</strong>
          </div>
        )}
        <input 
          name="title" 
          placeholder="Název (např. Jaro 2024)" 
          required 
          defaultValue={playlist?.title}
          className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spotify Embed Code (nebo URL)</label>
          <input 
            name="spotifyUrl" 
            placeholder='<iframe ... src="..." ...' 
            required 
            defaultValue={playlist?.spotifyUrl}
            className="w-full p-3 border rounded-xl font-mono text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
          />
          <p className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded-lg">
            ℹ️ Na Spotify klikni na <strong>Tři tečky → Sdílet → Vložit playlist (Embed)</strong>. Zkopíruj celý kód a vlož ho sem.
          </p>
        </div>

        <textarea 
          name="description" 
          placeholder="Popisek (max 200 znaků)" 
          maxLength={200} 
          defaultValue={playlist?.description || undefined}
          className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
        />

        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input 
            type="checkbox" 
            name="isActive" 
            defaultChecked={playlist?.isActive}
            className="w-5 h-5 text-green-600 rounded focus:ring-green-500" 
          />
          <span className="font-medium">Aktivní (zobrazit tento playlist na webu)</span>
        </label>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Zrušit úpravu
          </button>
        )}
      </div>
    </ActionForm>
  );
}
