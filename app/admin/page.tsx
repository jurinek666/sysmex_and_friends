import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogOut } from "lucide-react";

// Server Action pro odhlášení
async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/"); // Přesměruje na úvodní stránku webu
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50 pt-32 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Hlavička Dashboardu */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vítej v administraci 👋</h1>
            <p className="text-gray-500 mt-1">
              Přihlášen jako: <span className="font-mono text-blue-600 font-medium">{user?.email}</span>
            </p>
          </div>
          
          <form action={signOut} className="mt-4 md:mt-0">
            <button className="flex items-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 px-5 py-2.5 rounded-xl font-medium transition-colors border border-red-100">
              <LogOut className="w-4 h-4" />
              Odhlásit se
            </button>
          </form>
        </header>

        {/* Rozcestník */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard 
            href="/admin/posts" 
            title="📝 Články" 
            desc="Správa aktualit a blogových příspěvků." 
            color="hover:border-blue-400 group-hover:text-blue-600"
          />
          <AdminCard 
            href="/admin/gallery" 
            title="📸 Galerie" 
            desc="Nahrávání fotek a správa alb." 
            color="hover:border-purple-400 group-hover:text-purple-600"
          />
          <AdminCard 
            href="/admin/playlists" 
            title="🎵 Playlisty" 
            desc="Spotify embedy a hudební seznamy." 
            color="hover:border-green-400 group-hover:text-green-600"
          />
          <AdminCard 
            href="/admin/results" 
            title="🏆 Výsledky" 
            desc="Zadávání výsledků kvízů." 
            color="hover:border-orange-400 group-hover:text-orange-600"
          />
           <AdminCard 
            href="/admin/members" 
            title="👥 Tým" 
            desc="Správa členů týmu." 
            color="hover:border-cyan-400 group-hover:text-cyan-600"
          />
        </div>
      </div>
    </div>
  );
}

function AdminCard({ href, title, desc, color }: { href: string, title: string, desc: string, color: string }) {
  return (
    <Link href={href} className={`block p-6 bg-white rounded-xl shadow-sm border transition-all hover:shadow-md group ${color}`}>
      <h2 className={`text-xl font-bold text-gray-800 transition-colors ${color.split(' ')[1]}`}>{title}</h2>
      <p className="text-gray-500 mt-2 text-sm">{desc}</p>
    </Link>
  )
}