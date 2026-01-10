import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/admin/auth";
import { ArrowLeft } from "lucide-react";
import { ResultForm } from "./ResultForm";
import { ResultList } from "./ResultList";

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
  await requireAuth();
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
        <ResultForm seasons={safeSeasons} />
      </section>

      <ResultList results={safeResults} />
    </div>
  );
}