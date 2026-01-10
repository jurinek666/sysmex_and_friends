"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreateMember } from "../_actions";

export function MemberForm() {
  return (
    <ActionForm
      action={async (prevState, formData) => await adminCreateMember(formData)}
      successMessage="Člen byl úspěšně přidán"
      submitButtonText="Přidat člena"
      submitButtonClassName="bg-cyan-600 text-white px-6 py-2 rounded-xl hover:bg-cyan-700 w-full transition-colors disabled:opacity-50"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jméno (Display Name)</label>
          <input name="displayName" placeholder="Jan Novák" required className="w-full p-2 border rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Přezdívka (Nickname)</label>
          <input name="nickname" placeholder="Honza" className="w-full p-2 border rounded-xl" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input name="role" placeholder="Kapitán / Hudební expert" className="w-full p-2 border rounded-xl" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pohlaví</label>
          <select name="gender" className="w-full p-2 border rounded-xl bg-white">
            <option value="MALE">Muž</option>
            <option value="FEMALE">Žena</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">O členovi (Bio)</label>
          <textarea name="bio" rows={3} className="w-full p-2 border rounded-xl" />
        </div>
      </div>
    </ActionForm>
  );
}
