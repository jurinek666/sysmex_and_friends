"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeleteUser } from "../_actions";
import { UserForm } from "./UserForm";
import { useState } from "react";
import { Edit2 } from "lucide-react";
import type { ProfileRow } from "./page";

interface UserListProps {
  users: ProfileRow[];
  linkedMembers?: Record<string, string>;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Správce",
  member: "Uživatel",
  moderator: "Moderátor",
};

function roleLabel(role: string | null): string {
  return (role && ROLE_LABELS[role]) || "Uživatel";
}

export function UserList({ users, linkedMembers = {} }: UserListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingUser = editingId ? users.find((u) => u.id === editingId) : null;

  if (editingUser) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Upravit uživatele</h2>
        <UserForm user={editingUser} onCancel={() => setEditingId(null)} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {users.map((u) => (
        <div
          key={u.id}
          className="border border-gray-200 p-4 rounded-xl bg-gray-50 flex flex-wrap justify-between items-start gap-3"
        >
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">
              {u.display_name || u.email}
            </div>
            <div className="text-sm text-gray-500 truncate">{u.email}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-gray-200 text-gray-700">
                {roleLabel(u.role)}
              </span>
              {linkedMembers[u.id] && (
                <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                  Soupiska: {linkedMembers[u.id]}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setEditingId(u.id)}
              className="text-cyan-600 hover:bg-cyan-50 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Upravit
            </button>
            <DeleteFormButton
              action={async (formData) => await adminDeleteUser(null, formData)}
              itemId={u.id}
              itemName={u.display_name || u.email}
            />
          </div>
        </div>
      ))}
      {users.length === 0 && (
        <div className="col-span-2 text-center text-gray-500 py-8">
          Zatím žádní registrovaní uživatelé.
        </div>
      )}
    </div>
  );
}
