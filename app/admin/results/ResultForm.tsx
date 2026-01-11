"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreateResult } from "../_actions";

interface Season {
  id: string;
  code: string;
  name: string;
}

interface ResultFormProps {
  seasons: Season[];
}

export function ResultForm({ seasons }: ResultFormProps) {
  return (
    <ActionForm
      action={async (prevState, formData) => await adminCreateResult(formData)}
      successMessage="Výsledek byl úspěšně uložen"
      submitButtonText="Uložit výsledek"
      submitButtonClassName="bg-orange-600 text-white px-6 py-2 rounded-xl hover:bg-orange-700 w-full transition-colors disabled:opacity-50"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sezóna</label>
          <select name="seasonCode" className="w-full p-2 border rounded-xl bg-white" required>
            {seasons.map(s => (
              <option key={s.id} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
          <input name="date" type="date" required className="w-full p-2 border rounded-xl" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Místo (Venue)</label>
          <input name="venue" placeholder="U Lípy" required className="w-full p-2 border rounded-xl" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Název týmu</label>
          <input name="teamName" defaultValue="Sysmex" required className="w-full p-2 border rounded-xl" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Umístění</label>
            <input name="placement" type="number" min="1" required className="w-full p-2 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <input name="score" type="number" min="0" required className="w-full p-2 border rounded-xl" />
          </div>
        </div>

        <div className="md:col-span-2">
          <input name="note" placeholder="Poznámka (volitelné)" className="w-full p-2 border rounded-xl" />
        </div>
      </div>
    </ActionForm>
  );
}
