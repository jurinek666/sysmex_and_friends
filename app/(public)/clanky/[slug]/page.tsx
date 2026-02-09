import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { getPostBySlug } from "@/lib/queries/posts";
import { getComments } from "@/lib/queries/team";
import CommentSection from "@/components/team/CommentSection";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  // Setup Supabase Client for Server Component
  const supabase = await createClient();

  // Load comments using the server client
  const comments = await getComments(supabase, slug, "post");

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* NAVIGACE ZPĚT */}
        <div className="mb-8">
          <Link 
            href="/#aktuality" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-neon-cyan transition-colors"
          >
            ← Zpět do archivu
          </Link>
        </div>

        {/* OBRÁZEK */}
        {post.coverImageUrl ? (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden bg-gray-800">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        ) : (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden bg-gray-800 flex items-center justify-center text-gray-500">
            Žádný obrázek
          </div>
        )}

        {/* HLAVIČKA ČLÁNKU */}
        <header className="mb-12 text-center md:text-left border-b border-white/10 pb-10">
          <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
             <span className="px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-xs font-bold uppercase tracking-wider">
                {format(new Date(post.publishedAt), "d. MMMM yyyy", { locale: cs })}
             </span>
             {post.isFeatured && (
                <span className="px-3 py-1 rounded-full border border-neon-magenta/30 bg-neon-magenta/5 text-neon-magenta text-xs font-bold uppercase tracking-wider">
                  Featured
                </span>
             )}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
            {post.title}
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>
        </header>

        {/* OBSAH (MARKDOWN) */}
        <article className="bento-card p-8 md:p-12 bg-sysmex-900/20 mb-12">
          <div className="prose prose-lg prose-invert max-w-none 
            prose-headings:text-white prose-headings:font-bold 
            prose-a:text-neon-cyan prose-a:no-underline hover:prose-a:underline
            prose-strong:text-neon-gold
            prose-blockquote:border-l-neon-magenta prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:pr-4
            prose-code:text-neon-cyan prose-code:bg-black/30 prose-code:rounded prose-code:px-1
          ">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>

        {/* KOMENTÁŘE (NOVÉ) */}
        <CommentSection
            entityId={slug}
            entityType="post"
            initialComments={comments}
            isLoggedIn={!!user}
        />

        {/* PATIČKA ČLÁNKU */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
            <Link 
                href="/#aktuality"
                className="px-8 py-3 rounded-full bg-white/5 text-white font-bold hover:bg-white/10 border border-white/10 transition-all"
            >
                Zpět na přehled
            </Link>
        </div>

      </div>
    </main>
  );
}
