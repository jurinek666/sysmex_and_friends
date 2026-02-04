"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeletePlaylist } from "../_actions";
import { PlaylistForm } from "./PlaylistForm";
import { useState } from "react";
import { Edit2 } from "lucide-react";
import type { Playlist } from "@/lib/types";

interface PlaylistListProps {
  playlists: Playlist[];
}

export function PlaylistList({ playlists }: PlaylistListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingPlaylist = editingId ? playlists.find(p => p.id === editingId) : null;

  if (editingPlaylist) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Upravit playlist</h2>
        <PlaylistForm playlist={editingPlaylist} onCancel={() => setEditingId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {playlists.map((p) => (
        <div key={p.id} className={`border p-5 rounded-2xl bg-white flex justify-between items-center shadow-sm ${p.isActive ? 'border-green-500 ring-1 ring-green-500' : ''}`}>
          <div>
            <div className="font-bold text-lg flex items-center gap-2">
              {p.title}
              {p.isActive && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase tracking-wide">Active</span>}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-md mt-1">{p.spotifyUrl}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingId(p.id)}
              className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Upravit
            </button>
            <DeleteFormButton
              action={async (formData) => await adminDeletePlaylist(null, formData)}
              itemId={p.id}
              itemName={p.title}
            />
          </div>
        </div>
      ))}
      {playlists.length === 0 && <div className="text-center text-gray-400 py-12">Zatím žádné playlisty.</div>}
    </div>
  );
}
