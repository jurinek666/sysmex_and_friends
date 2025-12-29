import Link from "next/link";
import { getActiveMembers } from "@/lib/queries/members";

export const revalidate = 300;

export default async function TymPage() {
  const members = await getActiveMembers();

  return (
    <main className="min-h-screen bg-white px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Tým</h1>
            <p className="mt-2 text-gray-600">Aktivní členové a jejich role.</p>
          </div>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            ← Zpět na úvod
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              Zatím nejsou žádní členové.
            </div>
          ) : (
            members.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    {m.displayName.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {m.displayName}
                      {m.nickname ? (
                        <span className="text-gray-500 font-semibold">
                          {" "}
                          ({m.nickname})
                        </span>
                      ) : null}
                    </div>
                    {m.role ? <div className="text-sm text-gray-600">{m.role}</div> : null}
                    {m.specialties?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.specialties.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {m.bio ? <p className="mt-3 text-sm text-gray-600">{m.bio}</p> : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
