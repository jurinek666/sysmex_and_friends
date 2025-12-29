import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { getPostBySlug } from "@/lib/queries/posts";

export const revalidate = 60;

export default async function ClanekDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/clanky" className="text-blue-600 font-semibold hover:underline">
            ← Zpět na články
          </Link>
          <Link href="/" className="text-gray-600 hover:underline">
            Úvod
          </Link>
        </div>

        <header className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{post.title}</h1>
              <p className="mt-2 text-gray-600">{post.excerpt}</p>
              <p className="mt-4 text-sm text-gray-500">
                Publikováno{" "}
                {format(new Date(post.publishedAt), "d. MMMM yyyy", { locale: cs })}
                {post.isFeatured ? " • 🔥 zvýrazněno" : ""}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm prose prose-gray max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </section>
      </div>
    </main>
  );
}
