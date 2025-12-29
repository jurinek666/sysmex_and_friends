import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin</h1>
            <p className="text-gray-600 mt-2">
              Jednoduché interní rozhraní pro správu obsahu.
            </p>
          </div>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            ← Zpět na web
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/posts"
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow transition"
          >
            <div className="text-lg font-bold text-gray-900">Články</div>
            <div className="text-gray-600 mt-1">Vytváření, mazání, kontrola slugů.</div>
          </Link>

          <Link
            href="/admin/results"
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow transition"
          >
            <div className="text-lg font-bold text-gray-900">Výsledky</div>
            <div className="text-gray-600 mt-1">Přidání výsledků do sezóny.</div>
          </Link>

          <Link
            href="/admin/members"
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow transition"
          >
            <div className="text-lg font-bold text-gray-900">Tým</div>
            <div className="text-gray-600 mt-1">Přidání/odebrání členů.</div>
          </Link>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-bold text-gray-900">Poznámka</div>
            <p className="text-gray-600 mt-1">
              /admin je chráněné HTTP Basic Auth přes middleware. Nastav v Renderu
              proměnné <span className="font-mono">ADMIN_USER</span> a <span className="font-mono">ADMIN_PASSWORD</span>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
