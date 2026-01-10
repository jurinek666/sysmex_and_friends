"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeleteMember } from "../_actions";

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
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {members.map((m) => (
        <div key={m.id} className="border p-4 rounded-xl bg-white flex justify-between items-start shadow-sm">
          <div>
            <div className="font-bold text-lg">{m.displayName}</div>
            {m.nickname && <div className="text-sm text-gray-500">"{m.nickname}"</div>}
            <div className="text-xs mt-2 bg-gray-100 inline-block px-2 py-1 rounded">{m.role || "Člen"}</div>
          </div>
          <DeleteFormButton
            action={async (formData) => await adminDeleteMember(formData)}
            itemId={m.id}
            itemName={m.displayName}
          />
        </div>
      ))}
      {members.length === 0 && <div className="col-span-2 text-center text-gray-400 py-8">Zatím žádní členové.</div>}
    </div>
  );
}
