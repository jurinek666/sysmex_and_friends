import { AdminLayout } from "@/components/admin/AdminLayout";
import { PostForm } from "./PostForm";
import { PostList } from "./PostList";
import { getAllPosts } from "@/lib/queries/posts";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <AdminLayout title="Admin • Články">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Nový článek</h2>
        <PostForm />
      </section>

      <PostList posts={posts} />
    </AdminLayout>
  );
}
