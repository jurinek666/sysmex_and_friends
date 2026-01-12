import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { getPostBySlug } from "@/lib/queries/posts";

export const revalidate = 60;

export default async function ClanekDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params; // Next.js 15 requires awaiting params if using generic layout
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  // Extract image URLs from markdown content - try multiple patterns
  const imageUrlRegex1 = /!\[.*?\]\((.*?)\)/g;
  const imageUrlRegex2 = /<img[^>]+src=["']([^"']+)["']/gi;
  const imageUrlRegex3 = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const imageUrls: string[] = [];
  
  // Try standard markdown image syntax
  let match;
  while ((match = imageUrlRegex1.exec(post.content)) !== null) {
    imageUrls.push(match[1]);
  }
  
  // Try HTML img tags
  imageUrlRegex1.lastIndex = 0;
  while ((match = imageUrlRegex2.exec(post.content)) !== null) {
    imageUrls.push(match[1]);
  }
  
  // Try alternative markdown syntax
  imageUrlRegex2.lastIndex = 0;
  while ((match = imageUrlRegex3.exec(post.content)) !== null) {
    imageUrls.push(match[2]);
  }

  // Check for image-related keywords in content
  const hasImageKeywords = /image|img|photo|obrázek|foto/i.test(post.content);

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* NAVIGACE ZPĚT */}
        <div className="mb-8">
          <Link 
            href="/posts" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-neon-cyan transition-colors"
          >
            ← Zpět do archivu
          </Link>
        </div>

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
        {/* Používáme prose-invert pro dark mode a vlastní styly pro barvy */}
        <article className="bento-card p-8 md:p-12 bg-sysmex-900/20">
          <div className="prose prose-xl prose-invert max-w-none 
            prose-headings:text-white prose-headings:font-bold 
            prose-p:text-gray-200 prose-p:leading-relaxed
            prose-h1:text-white prose-h1:mt-10 prose-h1:mb-6
            prose-h2:text-white prose-h2:mt-8 prose-h2:mb-5
            prose-h3:text-white prose-h3:mt-7 prose-h3:mb-4
            prose-a:text-neon-cyan prose-a:no-underline hover:prose-a:underline
            prose-strong:text-neon-gold
            prose-blockquote:border-l-neon-magenta prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:my-6
            prose-code:text-neon-cyan prose-code:bg-black/30 prose-code:rounded prose-code:px-1
            prose-ul:my-6 prose-ol:my-6
            prose-li:my-3
            prose-img:my-8
          ">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ src, alt }) => {
                  if (!src) return null;
                  
                  return (
                    <div className="relative w-full my-4 rounded-lg overflow-hidden" style={{ minHeight: '200px' }}>
                      <Image
                        src={src}
                        alt={alt || ''}
                        fill
                        className="object-contain rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                      />
                    </div>
                  );
                }
              }}
            >{post.content}</ReactMarkdown>
          </div>
        </article>

        {/* PATIČKA ČLÁNKU */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
            <Link 
                href="/posts"
                className="px-8 py-3 rounded-full bg-white/5 text-white font-bold hover:bg-white/10 border border-white/10 transition-all"
            >
                Zpět na přehled
            </Link>
        </div>

      </div>
    </main>
  );
}