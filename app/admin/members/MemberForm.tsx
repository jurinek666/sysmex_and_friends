"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreateMember, adminUpdateMember } from "../_actions";
import { X } from "lucide-react";
import type { Member, Profile } from "@/lib/types";

interface MemberFormProps {
  member?: Member;
  profiles?: Profile[];
  onCancel?: () => void;
}

export function MemberForm({ member, profiles = [], onCancel }: MemberFormProps) {
  const isEdit = !!member;

  return (
    <ActionForm
      action={async (prevState, formData) => {
        if (isEdit) {
          formData.append("id", member.id);
          return await adminUpdateMember(prevState, formData);
        }
        return await adminCreateMember(prevState, formData);
      }}
      successMessage={isEdit ? "Člen byl úspěšně upraven" : "Člen byl úspěšně přidán"}
      submitButtonText={isEdit ? "Uložit změny" : "Přidat člena"}
      submitButtonClassName="bg-cyan-600 text-white px-6 py-2 rounded-xl hover:bg-cyan-700 w-full transition-colors disabled:opacity-50"
      onSuccess={onCancel}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {isEdit && (
          <div className="md:col-span-2 bg-cyan-50 border border-cyan-200 text-cyan-800 px-4 py-2 rounded-xl text-sm">
            Upravujete člena: <strong>{member.displayName}</strong>
          </div>
        )}

        <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-1">Propojení s uživatelem</label>
          <p className="text-xs text-gray-500 mb-2">Pokud vyberete uživatele, jméno a avatar se automaticky přepíší podle profilu.</p>
          <select
            name="profile_id"
            defaultValue={member?.profileId || ""}
            className="w-full p-2 border rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="">-- Žádné propojení --</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>
                {p.email} ({p.display_name || "Bez jména"})
              </option>
            ))}
          </select>
          {member?.avatarUrl && (
             <div className="mt-2 text-xs text-gray-500">
               Člen má nastavený externí avatar z profilu.
             </div>
          )}
          <input type="hidden" name="avatarUrl" value={member?.avatarUrl || ""} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jméno (Display Name)</label>
          <input name="displayName" placeholder="Jan Novák" required defaultValue={member?.displayName} className="w-full p-2 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Přezdívka (Nickname)</label>
          <input name="nickname" placeholder="Honza" defaultValue={member?.nickname || undefined} className="w-full p-2 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input name="role" placeholder="Kapitán / Hudební expert" defaultValue={member?.role || undefined} className="w-full p-2 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pohlaví</label>
          <select name="gender" className="w-full p-2 border rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" defaultValue={member?.gender || "MALE"}>
            <option value="MALE">Muž</option>
            <option value="FEMALE">Žena</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">O členovi (Bio)</label>
          <textarea name="bio" rows={3} defaultValue={member?.bio || undefined} className="w-full p-2 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
        </div>

        {onCancel && (
          <div className="md:col-span-2">
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
