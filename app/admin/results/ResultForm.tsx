"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreateResult, adminUpdateResult } from "../_actions";
import { X } from "lucide-react";
import { useState } from "react";
import type { Member } from "@/lib/queries/members";
import type { Result, Season } from "@/lib/types";

interface ResultFormProps {
  seasons: Season[];
  members: Member[];
  result?: Result;
  onCancel?: () => void;
}

const MAX_MEMBERS = 8;

export function ResultForm({ seasons, members, result, onCancel }: ResultFormProps) {
  const isEdit = !!result;
  const dateValue = result?.date ? result.date.split("T")[0] : "";
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(() => result?.memberIds ?? []);

  return (
    <ActionForm
      action={async (prevState, formData) => {
        if (isEdit) {
          formData.append("id", result.id);
          return await adminUpdateResult(prevState, formData);
        }
        return await adminCreateResult(prevState, formData);
      }}
      successMessage={isEdit ? "Výsledek byl úspěšně upraven" : "Výsledek byl úspěšně uložen"}
      submitButtonText={isEdit ? "Uložit změny" : "Uložit výsledek"}
      submitButtonClassName="bg-orange-600 text-white px-6 py-2 rounded-xl hover:bg-orange-700 w-full transition-colors disabled:opacity-50"
      onSuccess={onCancel}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {isEdit && (
          <div className="md:col-span-2 bg-orange-50 border border-orange-200 text-orange-800 px-4 py-2 rounded-xl text-sm">
            Upravujete výsledek: <strong>{result.placement}. místo v {result.venue}</strong>
          </div>
        )}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sezóna</label>
          <select name="seasonCode" className="w-full p-2 border rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required defaultValue={result?.season?.code}>
            {seasons.map(s => (
              <option key={s.id} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
          <input name="date" type="date" required defaultValue={dateValue} className="w-full p-2 border rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Místo (Venue)</label>
          <input name="venue" placeholder="U Lípy" required defaultValue={result?.venue} className="w-full p-2 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Název týmu</label>
          <input name="teamName" defaultValue={result?.teamName || "Sysmex"} required className="w-full p-2 border rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Umístění</label>
            <input name="placement" type="number" min="1" required defaultValue={result?.placement} className="w-full p-2 border rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <input name="score" type="number" min="0" required defaultValue={result?.score} className="w-full p-2 border rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          </div>
        </div>

        <div className="md:col-span-2">
          <input name="note" placeholder="Poznámka (volitelné)" defaultValue={result?.note || undefined} className="w-full p-2 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sestava (max {MAX_MEMBERS} členů)</label>
          <div className="flex flex-wrap gap-3 p-3 border rounded-xl bg-gray-50 border-gray-200">
            {members.length === 0 ? (
              <span className="text-sm text-gray-500">Žádní aktivní členové.</span>
            ) : (
              members.map((member) => {
                const isChecked = selectedMemberIds.includes(member.id);
                const disabled = !isChecked && selectedMemberIds.length >= MAX_MEMBERS;
                return (
                  <label
                    key={member.id}
                    className={`flex items-center gap-2 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="checkbox"
                      name="memberIds"
                      value={member.id}
                      checked={isChecked}
                      disabled={disabled}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMemberIds((prev) => (prev.length < MAX_MEMBERS ? [...prev, member.id] : prev));
                        } else {
                          setSelectedMemberIds((prev) => prev.filter((id) => id !== member.id));
                        }
                      }}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-800">{member.displayName}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {onCancel && (
          <div className="md:col-span-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-200 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Zrušit úpravu
            </button>
          </div>
        )}
      </div>
    </ActionForm>
  );
}
