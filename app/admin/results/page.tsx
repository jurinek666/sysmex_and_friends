import { getAllResults, getSeasons } from "@/lib/queries/results";
import { getActiveMembers } from "@/lib/queries/members";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ResultForm } from "./ResultForm";
import { ResultList } from "./ResultList";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  const [results, seasons, members] = await Promise.all([
    getAllResults(50),
    getSeasons(),
    getActiveMembers(),
  ]);

  const resultsWithIds = results.map((r) => ({
    ...r,
    memberIds: r.participants.map((p) => p.id),
  }));

  return (
    <AdminLayout title="Admin • Výsledky">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Zadat výsledek</h2>
        <ResultForm seasons={seasons} members={members} />
      </section>

      <ResultList results={resultsWithIds} seasons={seasons} members={members} />
    </AdminLayout>
  );
}
