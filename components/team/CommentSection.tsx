"use client";

import { useState } from "react";
import { addComment } from "@/app/(members)/_actions";
import { Comment } from "@/lib/types";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { User } from "lucide-react";
import Image from "next/image";

interface CommentSectionProps {
  entityId?: string;
  entityType?: 'post' | 'event' | 'album';
  /** @deprecated use entityId instead */
  postSlug?: string;
  initialComments: Comment[];
  isLoggedIn: boolean;
  compact?: boolean;
}

export default function CommentSection({ postSlug, entityId, entityType = 'post', initialComments, isLoggedIn, compact = false }: CommentSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Resolve ID
  const finalId = entityId || postSlug || "";

  // Optimistický update by byl fajn, ale pro jednoduchost zatím refreshneme po akci

  async function handleSubmit(formData: FormData) {
      setSubmitting(true);
      // Přidáme ID a Type
      formData.append("entityId", finalId);
      formData.append("entityType", entityType);

      const result = await addComment(formData);

      if (result.success) {
          setContent("");
          // V reálné app bychom buď revalidovali path nebo fetchli nové komentáře
          // Tady spoléháme na server action revalidatePath, ale musíme refreshnout router nebo reloadnout
          window.location.reload();
      } else {
          alert(result.error);
      }
      setSubmitting(false);
  }

  if (compact && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 mt-4"
      >
        <User className="w-4 h-4" />
        Zobrazit komentáře ({comments.length})
      </button>
    );
  }

  return (
    <div className={`mx-auto ${compact ? 'mt-4 border-t border-white/10 pt-4' : 'mt-16 max-w-2xl'}`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white border-l-4 border-neon-cyan pl-4`}>
          Komentáře ({comments.length})
        </h3>
        {compact && (
          <button onClick={() => setIsExpanded(false)} className="text-sm text-gray-500 hover:text-white">
            Skrýt
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-6 mb-8">
        {comments.length === 0 ? (
            <p className="text-gray-500 italic text-sm">Zatím žádné komentáře.</p>
        ) : (
            comments.map((comment) => (
                <div key={comment.id} className={`${compact ? 'bg-transparent p-0' : 'bg-gray-900/50 p-6 rounded-xl border border-gray-800'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        {comment.profile?.avatar_url ? (
                            <Image src={comment.profile.avatar_url} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                <User size={16} className="text-gray-400" />
                            </div>
                        )}
                        <div>
                            <span className="block font-bold text-white text-sm">
                                {comment.profile?.display_name || "Neznámý uživatel"}
                            </span>
                            <span className="block text-xs text-gray-500">
                                {format(new Date(comment.created_at), "d. M. yyyy HH:mm", { locale: cs })}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm">{comment.content}</p>
                </div>
            ))
        )}
      </div>

      {/* FORM */}
      {isLoggedIn ? (
        <form action={handleSubmit} className={`${compact ? '' : 'bg-gray-900 p-6 rounded-xl border border-gray-700'}`}>
          {!compact && <label className="block text-sm font-medium text-gray-300 mb-2">Napsat komentář</label>}
          <textarea
            name="content"
            rows={compact ? 2 : 4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-1 focus:ring-neon-cyan outline-none mb-4 text-sm"
            placeholder="Tvůj názor..."
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className={`bg-neon-cyan text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 ${compact ? 'px-4 py-1.5 text-sm' : 'px-6 py-2'}`}
          >
            {submitting ? "Odesílám..." : "Odeslat komentář"}
          </button>
        </form>
      ) : (
        <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-800 text-center">
            <p className="text-gray-400 mb-2 text-sm">Pro přidání komentáře se musíš přihlásit.</p>
            <a href="/login" className="inline-block px-4 py-1.5 border border-white/20 hover:bg-white/10 rounded-full transition-colors text-xs font-bold uppercase">
                Přihlásit se
            </a>
        </div>
      )}
    </div>
  );
}
