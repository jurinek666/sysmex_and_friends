import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminCreateMember, adminDeleteMember } from "../_actions";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const members = await prisma.member.findMany({
    orderBy: { displayName: "asc" },
    select: { id: true, displayName: true, nickname: true, gender: true, role: true, isActive: true },
  });

  // --- WRAPPERY PRO FIX TYPESCRIPTU ---
  // Tyto funkce "spolknou" návratovou hodnotu (ok/message), 
  // takže si formulář nebude stěžovat.
  
  async function handleCreateMember(formData: FormData) {
    "use server";
    await adminCreateMember(formData);
  }

  async function handleDeleteMember(formData: FormData) {
    "use server";
    await adminDeleteMember(formData);
  }
  // ------------------------------------

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin • Tým</h1>
            <p className="text-gray-600 mt-2">Přidání/odebrání členů.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="text-blue-600 font-semibold hover:underline">
              ← Admin
            </Link>
            <Link href="/tym" className="text-blue-600 font-semibold hover:underline">
              Veřejný tým →
            </Link>
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Nový člen</h2>
          {/* Zde použijeme náš wrapper handleCreateMember místo přímo adminCreateMember */}
          <form action={handleCreateMember} className="mt-6 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Jméno</span>
                <input
                  name="displayName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Přezdívka (nepovinné)</span>
                <input
                  name="nickname"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Pohlaví</span>
                <select
                  name="gender"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="MALE">Muž</option>
                  <option value="FEMALE">Žena</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Role (např. Kapitán)</span>
                <input
                  name="role"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Bio (krátký popis)</span>
              <textarea
                name="bio"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Aktivní člen (zobrazovat na webu)
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Přidat člena
            </button>
          </form>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Seznam členů ({members.length})</h2>
          {members.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              Zatím žádní členové.
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="font-bold text-gray-900">
                        {m.displayName}{m.nickname ? ` (${m.nickname})` : ""}
                        {!m.isActive ? <span className="text-xs ml-2 px-2 py-1 rounded-full bg-gray-200 text-gray-700">neaktivní</span> : null}
                      </div>
                      <div className="text-sm text-gray-500">
                        {m.gender}{m.role ? ` • ${m.role}` : ""}
                      </div>
                    </div>
                    {/* Zde použijeme wrapper handleDeleteMember */}
                    <form action={handleDeleteMember}>
                      <input type="hidden" name="id" value={m.id} />
                      <button className="text-red-600 font-semibold hover:underline" type="submit">
                        Smazat
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}