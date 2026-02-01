import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PostForm } from "./PostForm";
import { PostList } from "./PostList";
import { Post } from "@/lib/types";
import { withRetry } from "@/lib/queries/utils";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const supabase = await createClient();
  
  // Nahrazeno prisma.post.findMany(...)
  const result = await withRetry(async () => {
    return await supabase
      .from("Post")
      .select("*")
      .order("createdAt", { ascending: false });
  });

  // Převedeme na náš typ a zajistíme, že to není null
  const safePosts = (result.data || []) as Post[];

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
