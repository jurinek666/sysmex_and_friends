"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeletePlaylist } from "../_actions";

interface Playlist {
  id: string;
  title: string;
  spotifyUrl: string;
  description: string | null;
  isActive: boolean;
}

interface PlaylistListProps {
  playlists: Playlist[];
}

export function PlaylistList({ playlists }: PlaylistListProps) {
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
          <DeleteFormButton
            action={adminDeletePlaylist}
            itemId={p.id}
            itemName={p.title}
          />
        </div>
      ))}
      {playlists.length === 0 && <div className="text-center text-gray-400 py-12">Zatím žádné playlisty.</div>}
    </div>
  );
}
