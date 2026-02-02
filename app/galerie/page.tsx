import Link from "next/link";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getAlbums } from "@/lib/queries/albums";

export const revalidate = 300;

// Definujeme typ pro Album, abychom předešli chybám při buildu
interface Album {
  id: string;
  title: string;
  dateTaken: string; // Supabase vrací datum jako string
  cloudinaryFolder: string;
  _count: {
    photos: number;
  };
}

export default async function GaleriePage() {
  // Načteme data a přetypujeme je, aby TypeScript věděl, co má v 'a' čekat
  const rawAlbums = await getAlbums();
  const albums = (rawAlbums || []) as Album[];

  return (
    <main className="min-h-screen bg-white px-6 pt-32 md:pt-36 pb-14">
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
              <Link
                key={a.id}
                href={`/galerie/${a.id}`}
                className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="text-lg font-bold text-gray-900 group-hover:text-blue-700">{a.title}</div>
                <div className="mt-1 text-sm text-gray-500">
                  {format(new Date(a.dateTaken), "d. MMMM yyyy", { locale: cs })}
                </div>
                <div className="mt-3 text-sm text-gray-700">
                  Fotek: <span className="font-semibold">{a._count?.photos ?? "–"}</span>
                </div>
                {a.cloudinaryFolder ? (
                  <div className="mt-3 text-xs text-gray-500">
                    Složka: <span className="font-mono text-gray-700">{a.cloudinaryFolder}</span>
                  </div>
                ) : null}
                <span className="mt-3 inline-block text-sm text-blue-600 font-medium">
                  Zobrazit album →
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
