import { createClient } from "@/lib/supabase/server";
import { withRetry, logSupabaseError } from "@/lib/queries/utils";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
  const supabase = await createClient();
  
  // Nahrazeno prisma.post.findMany(...)
  const { data: posts, error } = await withRetry(async () => {
    return await supabase
      .from("Post")
      .select("*")
      .order("createdAt", { ascending: false });
  });

  if (error) {
    logSupabaseError("AdminPostsPage", error);
  }

  // Převedeme na náš typ a zajistíme, že to není null
  const safePosts = (posts || []) as Post[];

  return (
    <AdminLayout title="Admin • Články">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Nový článek</h2>
        <PostForm />
      </section>

      <PostList posts={safePosts} />
    </AdminLayout>
  );
}
