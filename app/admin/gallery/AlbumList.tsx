"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeleteAlbum } from "../_actions";
import { AlbumForm } from "./AlbumForm";
import { Folder, Calendar } from "lucide-react";
import { useState } from "react";
import { Edit2 } from "lucide-react";

interface Album {
  id: string;
  title: string;
  dateTaken: string;
  cloudinaryFolder: string;
  description: string | null;
  coverPublicId: string | null;
  photos?: Array<{ count: number }>;
}

interface AlbumListProps {
  albums: Album[];
}

export function AlbumList({ albums }: AlbumListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingAlbum = editingId ? albums.find(a => a.id === editingId) : null;

  if (editingAlbum) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Upravit album</h2>
        <AlbumForm album={editingAlbum} onCancel={() => setEditingId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {albums.map((album) => (
        <div key={album.id} className="border p-5 rounded-2xl bg-white flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4">
          <div>
            <div className="font-bold text-lg">{album.title}</div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(album.dateTaken).toLocaleDateString("cs-CZ")}
              </span>
              <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md">
                <Folder className="w-3 h-3" />
                {album.cloudinaryFolder}
              </span>
              <span>
                {album.photos?.[0]?.count ?? 0} fotek
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingId(album.id)}
              className="text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Upravit
            </button>
            <DeleteFormButton
              action={async (formData) => await adminDeleteAlbum(formData)}
              itemId={album.id}
              itemName={album.title}
            />
          </div>
        </div>
      ))}
      {albums.length === 0 && (
        <div className="text-center text-gray-400 py-12">Zatím žádná alba.</div>
      )}
    </div>
  );
}
