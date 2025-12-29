import Link from "next/link";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getAlbums } from "@/lib/queries/albums";

export const revalidate = 300;

export default async function GaleriePage() {
  const albums = await getAlbums();

  return (
    <main className="min-h-screen bg-white px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Galerie</h1>
            <p className="mt-2 text-gray-600">Alba a fotky z akcí.</p>
          </div>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            ← Zpět na úvod
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              Zatím nejsou žádná alba.
            </div>
          ) : (
            albums.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="text-lg font-bold text-gray-900">{a.title}</div>
                <div className="mt-1 text-sm text-gray-500">
                  {format(new Date(a.dateTaken), "d. MMMM yyyy", { locale: cs })}
                </div>
                <div className="mt-3 text-sm text-gray-700">
                  Fotek: <span className="font-semibold">{a.photos.length}</span>
                </div>
                {a.cloudinaryFolder ? (
                  <div className="mt-3 text-xs text-gray-500">
                    Cloudinary složka: <span className="font-mono">{a.cloudinaryFolder}</span>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
