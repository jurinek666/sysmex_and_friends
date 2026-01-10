"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeleteResult } from "../_actions";

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
}

export function ResultList({ results }: ResultListProps) {
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
              <td className="px-6 py-4 text-right">
                <DeleteFormButton
                  action={async (formData) => await adminDeleteResult(formData)}
                  itemId={r.id}
                  itemName={`${r.placement}. místo v ${r.venue}`}
                  className="text-red-600 hover:underline"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {results.length === 0 && <div className="p-8 text-center text-gray-400">Zatím žádné výsledky.</div>}
    </div>
  );
}
