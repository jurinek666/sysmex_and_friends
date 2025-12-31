import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { adminCreateResult, adminDeleteResult } from "../_actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

// Definice typů pro TypeScript
interface Season {
  id: string;
  code: string;
  name: string;
}

interface Result {
  id: string;
  date: string; // Supabase vrací datum jako ISO string
  venue: string;
  teamName: string;
  placement: number;
  score: number;
  note: string | null;
  season: Season; // Relace na sezónu
}

export default async function AdminResultsPage() {
  const supabase = await createClient();

  // 1. Načteme výsledky včetně propojené sezóny
  // Ekvivalent prisma.include: { season: true }
  const { data: results } = await supabase
    .from("Result")
    .select("*, season:Season(*)")
    .order("date", { ascending: false })
    .limit(50);

  // 2. Načteme sezóny pro výběr ve formuláři
  const { data: seasons } = await supabase
    .from("Season")
    .select("*")
    .order("startDate", { ascending: false });

  // Ošetření null hodnot
  const safeResults = (results || []) as Result[];
  const safeSeasons = (seasons || []) as Season[];

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na nástěnku
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Admin • Výsledky</h1>

      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Zadat výsledek</h2>
        <form action={adminCreateResult} className="grid gap-4 md:grid-cols-2">
          
          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Sezóna</label>
             <select name="seasonCode" className="w-full p-2 border rounded-xl bg-white" required>
                {safeSeasons.map(s => (
                    <option key={s.id} value={s.code}>{s.name}</option>
                ))}
             </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
             <input name="date" type="date" required className="w-full p-2 border rounded-xl" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Místo (Venue)</label>
             <input name="venue" placeholder="U Lípy" required className="w-full p-2 border rounded-xl" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Název týmu</label>
             <input name="teamName" defaultValue="Sysmex" required className="w-full p-2 border rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Umístění</label>
                <input name="placement" type="number" min="1" required className="w-full p-2 border rounded-xl" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <input name="score" type="number" min="0" required className="w-full p-2 border rounded-xl" />
             </div>
          </div>

          <div className="md:col-span-2">
             <input name="note" placeholder="Poznámka (volitelné)" className="w-full p-2 border rounded-xl" />
          </div>

          <div className="md:col-span-2 pt-2">
            <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-xl hover:bg-orange-700 w-full transition-colors">
              Uložit výsledek
            </button>
          </div>
        </form>
      </section>

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
            {safeResults.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                    {/* Supabase vrací string, musíme převést na Date */}
                    {new Date(r.date).toLocaleDateString("cs-CZ")}
                </td>
                <td className="px-6 py-4">{r.venue}</td>
                <td className="px-6 py-4 font-bold">
                    {r.placement}. místo
                </td>
                <td className="px-6 py-4">{r.score} b.</td>
                <td className="px-6 py-4 text-right">
                  <form action={adminDeleteResult}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-red-600 hover:underline">Smazat</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {safeResults.length === 0 && <div className="p-8 text-center text-gray-400">Zatím žádné výsledky.</div>}
      </div>
    </div>
  );
}