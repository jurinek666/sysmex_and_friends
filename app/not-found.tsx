import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Stránka nenalezena</h1>
        <p className="mt-2 text-gray-600">
          Požadovaný obsah neexistuje, nebo byl přesunut.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-white font-semibold hover:bg-blue-700 transition"
          >
            Domů
          </Link>
          <Link
            href="/posts"
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-gray-900 font-semibold hover:bg-gray-50 transition"
          >
            Články
          </Link>
        </div>
      </div>
    </main>
  );
}
