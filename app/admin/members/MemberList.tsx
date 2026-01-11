"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeleteMember } from "../_actions";
import { MemberForm } from "./MemberForm";
import { useState } from "react";
import { Edit2 } from "lucide-react";

interface Member {
  id: string;
  displayName: string;
  nickname: string | null;
  role: string | null;
  gender: string;
  bio: string | null;
  isActive: boolean;
}

interface MemberListProps {
  members: Member[];
}

export function MemberList({ members }: MemberListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingMember = editingId ? members.find(m => m.id === editingId) : null;

  if (editingMember) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Upravit člena</h2>
        <MemberForm member={editingMember} onCancel={() => setEditingId(null)} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {members.map((m) => (
        <div key={m.id} className="border p-4 rounded-xl bg-white flex justify-between items-start shadow-sm">
          <div>
            <div className="font-bold text-lg">{m.displayName}</div>
            {m.nickname && <div className="text-sm text-gray-500">&quot;{m.nickname}&quot;</div>}
            <div className="text-xs mt-2 bg-gray-100 inline-block px-2 py-1 rounded">{m.role || "Člen"}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingId(m.id)}
              className="text-cyan-600 hover:bg-cyan-50 px-2 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              Upravit
            </button>
            <DeleteFormButton
              action={async (formData) => await adminDeleteMember(formData)}
              itemId={m.id}
              itemName={m.displayName}
            />
          </div>
        </div>
      ))}
      {members.length === 0 && <div className="col-span-2 text-center text-gray-400 py-8">Zatím žádní členové.</div>}
    </div>
  );
}
