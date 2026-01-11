import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/admin/auth";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "./PostForm";
import { PostList } from "./PostList";

export const dynamic = "force-dynamic";

// Definujeme typ pro článek podle databáze
interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
}

export default async function AdminPostsPage() {
  await requireAuth();
  const supabase = await createClient();
  
  // Nahrazeno prisma.post.findMany(...)
  const { data: posts } = await supabase
    .from("Post")
    .select("*")
    .order("createdAt", { ascending: false });

  // Převedeme na náš typ a zajistíme, že to není null
  const safePosts = (posts || []) as Post[];

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

      <h1 className="text-3xl font-bold mb-8">Admin • Články</h1>

      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Nový článek</h2>
        <PostForm />
      </section>

      <PostList posts={safePosts} />
    </div>
  );
}