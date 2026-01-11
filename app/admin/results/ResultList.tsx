"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeleteResult } from "../_actions";
import { ResultForm } from "./ResultForm";
import { useState } from "react";
import { Edit2 } from "lucide-react";

interface Season {
  id: string;
  code: string;
  name: string;
}

interface Result {
  id: string;
  date: string;
  venue: string;
  teamName: string;
  placement: number;
  score: number;
  note: string | null;
  season: Season;
}

interface ResultListProps {
  results: Result[];
  seasons: Season[];
}

export function ResultList({ results, seasons }: ResultListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingResult = editingId ? results.find(r => r.id === editingId) : null;

  if (editingResult) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Upravit výsledek</h2>
        <ResultForm seasons={seasons} result={editingResult} onCancel={() => setEditingId(null)} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
          <tr>
            <th className="px-6 py-3">Datum</th>
            <th className="px-6 py-3">Místo</th>
            <th className="px-6 py-3">Umístění</th>
            <th className="px-6 py-3">Body</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {results.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                {new Date(r.date).toLocaleDateString("cs-CZ")}
              </td>
              <td className="px-6 py-4">{r.venue}</td>
              <td className="px-6 py-4 font-bold">
                {r.placement}. místo
              </td>
              <td className="px-6 py-4">{r.score} b.</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setEditingId(r.id)}
                    className="text-orange-600 hover:bg-orange-50 px-2 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Upravit
                  </button>
                  <DeleteFormButton
                    action={async (formData) => await adminDeleteResult(formData)}
                    itemId={r.id}
                    itemName={`${r.placement}. místo v ${r.venue}`}
                    className="text-red-600 hover:underline"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {results.length === 0 && <div className="p-8 text-center text-gray-400">Zatím žádné výsledky.</div>}
    </div>
  );
}
