"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreateAlbum, adminUpdateAlbum } from "../_actions";
import { Folder } from "lucide-react";
import { X } from "lucide-react";

interface Album {
  id: string;
  title: string;
  dateTaken: string;
  cloudinaryFolder: string;
  description: string | null;
  coverPublicId: string | null;
}

interface AlbumFormProps {
  album?: Album;
  onCancel?: () => void;
}

export function AlbumForm({ album, onCancel }: AlbumFormProps) {
  const isEdit = !!album;
  // Extract date part only, avoiding timezone offset issues
  const dateValue = album?.dateTaken ? album.dateTaken.split('T')[0] : '';

  return (
    <ActionForm
      action={async (prevState, formData) => {
        if (isEdit) {
          formData.append("id", album.id);
          return await adminUpdateAlbum(formData);
        }
        return await adminCreateAlbum(formData);
      }}
      successMessage={isEdit ? "Album bylo úspěšně upraveno" : "Album bylo úspěšně vytvořeno"}
      submitButtonText={isEdit ? "Uložit změny" : "Vytvořit album"}
      submitButtonClassName="w-full bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 font-medium transition-colors disabled:opacity-50"
      onSuccess={onCancel}
    >
      <div className="space-y-4">
        {isEdit && (
          <div className="bg-purple-50 border border-purple-200 text-purple-800 px-4 py-2 rounded-xl text-sm">
            Upravujete album: <strong>{album.title}</strong>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Název alba</label>
            <input 
              name="title" 
              placeholder="Např. Vánoční večírek" 
              required 
              defaultValue={album?.title}
              className="w-full p-3 border rounded-xl" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum akce</label>
            <input 
              type="date" 
              name="dateTaken" 
              required 
              defaultValue={dateValue}
              className="w-full p-3 border rounded-xl" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cloudinary složka <span className="text-gray-400 font-normal">(přesný název složky v cloudu)</span>
          </label>
          <div className="relative">
            <Folder className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              name="cloudinaryFolder" 
              placeholder="např. 2024-vanocni-vecirek" 
              required 
              defaultValue={album?.cloudinaryFolder}
              className="w-full p-3 pl-10 border rounded-xl font-mono text-sm" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Popis (volitelné)</label>
          <textarea 
            name="description" 
            rows={2} 
            defaultValue={album?.description || undefined}
            className="w-full p-3 border rounded-xl" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Public ID (volitelné)</label>
          <input 
            name="coverPublicId" 
            placeholder="cloudinary public id" 
            defaultValue={album?.coverPublicId || undefined}
            className="w-full p-3 border rounded-xl font-mono text-sm" 
          />
        </div>

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
