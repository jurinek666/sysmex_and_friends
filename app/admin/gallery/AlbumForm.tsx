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
          return await adminUpdateAlbum(prevState, formData);
        }
        return await adminCreateAlbum(prevState, formData);
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
              className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum akce</label>
            <input 
              type="date" 
              name="dateTaken" 
              required 
              defaultValue={dateValue}
              className="w-full p-3 border rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Složka v Cloudinary (identifikátor)
          </label>
          <div className="relative">
            <Folder className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              name="cloudinaryFolder" 
              placeholder="01_leden nebo galerie/01_leden" 
              required 
              defaultValue={album?.cloudinaryFolder}
              className="w-full p-3 pl-10 border rounded-xl font-mono text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <strong>Jak vyplnit:</strong><br />
            • <strong>Dynamic režim</strong> (Media Library): název složky či cesta, např. <code>01_leden</code> nebo <code>galerie/01_leden</code>.<br />
            • <strong>Fixed režim</strong>: prefix cesty v public_id, např. <code>01_leden</code> když máte <code>01_leden/foto.jpg</code>.<br />
            • <strong>Záložně</strong>: pokud složka nevrátí obrázky, zkusí se načíst obrázky s tímto <strong>tagem</strong> (napište přesně ten tag, který mají v Cloudinary).<br />
            Bez úvodního lomítka; u názvů složek se rozlišuje velikost písmen. V dev módu: <code>/api/debug-cloudinary</code> ověří připojení (connection) a <code>?folder=01_leden</code> ukáže, která metoda vyhledání funguje.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Popis (volitelné)</label>
          <textarea 
            name="description" 
            rows={2} 
            defaultValue={album?.description || undefined}
            className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Public ID (volitelné)</label>
          <input 
            name="coverPublicId" 
            placeholder="cloudinary public id" 
            defaultValue={album?.coverPublicId || undefined}
            className="w-full p-3 border rounded-xl font-mono text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
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
