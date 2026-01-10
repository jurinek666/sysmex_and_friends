"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreateMember, adminUpdateMember } from "../_actions";
import { X } from "lucide-react";

interface Member {
  id: string;
  displayName: string;
  nickname: string | null;
  role: string | null;
  gender: string;
  bio: string | null;
  isActive: boolean;
}

interface MemberFormProps {
  member?: Member;
  onCancel?: () => void;
}

export function MemberForm({ member, onCancel }: MemberFormProps) {
  const isEdit = !!member;

  return (
    <ActionForm
      action={async (prevState, formData) => {
        if (isEdit) {
          formData.append("id", member.id);
          return await adminUpdateMember(formData);
        }
        return await adminCreateMember(formData);
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jméno (Display Name)</label>
          <input name="displayName" placeholder="Jan Novák" required defaultValue={member?.displayName} className="w-full p-2 border rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Přezdívka (Nickname)</label>
          <input name="nickname" placeholder="Honza" defaultValue={member?.nickname || undefined} className="w-full p-2 border rounded-xl" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input name="role" placeholder="Kapitán / Hudební expert" defaultValue={member?.role || undefined} className="w-full p-2 border rounded-xl" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pohlaví</label>
          <select name="gender" className="w-full p-2 border rounded-xl bg-white" defaultValue={member?.gender || "MALE"}>
            <option value="MALE">Muž</option>
            <option value="FEMALE">Žena</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">O členovi (Bio)</label>
          <textarea name="bio" rows={3} defaultValue={member?.bio || undefined} className="w-full p-2 border rounded-xl" />
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
