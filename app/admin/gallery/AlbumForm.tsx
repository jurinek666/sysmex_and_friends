"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreateAlbum } from "../_actions";
import { Folder } from "lucide-react";

export function AlbumForm() {
  return (
    <ActionForm
      action={async (prevState, formData) => await adminCreateAlbum(formData)}
      successMessage="Album bylo úspěšně vytvořeno"
      submitButtonText="Vytvořit album"
      submitButtonClassName="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Název alba</label>
            <input name="title" placeholder="Např. Vánoční večírek" required className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum akce</label>
            <input type="date" name="dateTaken" required className="w-full p-3 border rounded-xl" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cloudinary složka <span className="text-gray-400 font-normal">(přesný název složky v cloudu)</span>
          </label>
          <div className="relative">
            <Folder className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input name="cloudinaryFolder" placeholder="např. 2024-vanocni-vecirek" required className="w-full p-3 pl-10 border rounded-xl font-mono text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Popis (volitelné)</label>
          <textarea name="description" rows={2} className="w-full p-3 border rounded-xl" />
        </div>
      </div>
    </ActionForm>
  );
}
