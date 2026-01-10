import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/admin/auth";
import { ArrowLeft } from "lucide-react";
import { AlbumForm } from "./AlbumForm";
import { AlbumList } from "./AlbumList";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAuth();
  const supabase = await createClient();

  // Nahrazeno prisma.album.findMany(...)
  const { data: albums } = await supabase
    .from("Album")
    .select("*, photos(count)") // Získáme i počet fotek
    .order("dateTaken", { ascending: false });

  // Fallback pro případ chyby nebo null
  const safeAlbums = albums || [];

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

      <h1 className="text-3xl font-bold mb-8">Admin • Galerie</h1>

      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Vytvořit nové album</h2>
        <AlbumForm />
      </section>

      <AlbumList albums={safeAlbums} />
    </div>
  );
}