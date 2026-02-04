import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ResultForm } from "./ResultForm";
import { ResultList } from "./ResultList";
import { getActiveMembers } from "@/lib/queries/members";

export const dynamic = "force-dynamic";

interface Season {
  id: string;
  code: string;
  name: string;
}

type ResultMemberRow = { member_id: string; sort_order?: number; Member?: { id: string; displayName: string } };

interface Result {
  id: string;
  date: string;
  venue: string;
  teamName: string;
  placement: number;
  score: number;
  note: string | null;
  season: Season;
  ResultMember?: ResultMemberRow[] | null;
  memberIds?: string[];
}

function mapResultToMemberIds(r: Result): Result {
  const rows = (r.ResultMember ?? []) as ResultMemberRow[];
  const memberIds = [...rows]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((row) => row.Member?.id ?? row.member_id)
    .filter(Boolean);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ResultMember: _, ...rest } = r;
  return { ...rest, memberIds };
}

export default async function AdminResultsPage() {
  const supabase = await createClient();

  const { data: resultsRaw } = await supabase
    .from("Result")
    .select("*, season:Season(*), ResultMember(member_id, sort_order, Member(id, displayName))")
    .order("date", { ascending: false })
    .limit(50);

  const [{ data: seasons }, members] = await Promise.all([
    supabase.from("Season").select("*").order("startDate", { ascending: false }),
    getActiveMembers(),
  ]);

  const safeResults = ((resultsRaw || []) as Result[]).map(mapResultToMemberIds);
  const safeSeasons = (seasons || []) as Season[];

  return (
    <AdminLayout title="Admin • Výsledky">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Zadat výsledek</h2>
        <ResultForm seasons={safeSeasons} members={members} />
      </section>

      <ResultList results={safeResults} seasons={safeSeasons} members={members} />
    </AdminLayout>
  );
}