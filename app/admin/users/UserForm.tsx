"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminUpdateProfile } from "../_actions";
import { X } from "lucide-react";
import type { ProfileRow } from "./page";

interface UserFormProps {
  user: ProfileRow;
  onCancel: () => void;
}

const ROLE_OPTIONS = [
  { value: "member", label: "Uživatel" },
  { value: "admin", label: "Správce" },
  { value: "moderator", label: "Moderátor" },
] as const;

export function UserForm({ user, onCancel }: UserFormProps) {
  return (
    <ActionForm
      action={async (prevState, formData) => {
        formData.append("id", user.id);
        return await adminUpdateProfile(prevState, formData);
      }}
      successMessage="Profil byl uložen"
      submitButtonText="Uložit změny"
      submitButtonClassName="bg-cyan-600 text-white px-6 py-2 rounded-xl hover:bg-cyan-700 transition-colors disabled:opacity-50"
      onSuccess={onCancel}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 bg-cyan-50 border border-cyan-200 text-cyan-800 px-4 py-2 rounded-xl text-sm">
          Upravujete: <strong>{user.email}</strong>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email (jen pro čtení)</label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="w-full p-2 border rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zobrazované jméno</label>
          <input
            name="display_name"
            defaultValue={user.display_name ?? ""}
            placeholder="Jan Novák"
            className="w-full p-2 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            defaultValue={user.role ?? "member"}
            className="w-full p-2 border rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-cyan-500"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
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
      </div>
    </ActionForm>
  );
}
