"use client";

import { useState } from "react";
import { addComment } from "@/app/(members)/_actions";
import { Comment } from "@/lib/types";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { User } from "lucide-react";
import Image from "next/image";

interface CommentSectionProps {
  postSlug: string;
  initialComments: Comment[];
  isLoggedIn: boolean;
}

export default function CommentSection({ postSlug, initialComments, isLoggedIn }: CommentSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Optimistický update by byl fajn, ale pro jednoduchost zatím refreshneme po akci

  async function handleSubmit(formData: FormData) {
      setSubmitting(true);
      // Přidáme slug
      formData.append("postSlug", postSlug);

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

  return (
    <div className="mt-16 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-neon-cyan pl-4">
        Komentáře ({comments.length})
      </h3>

      {/* LIST */}
      <div className="space-y-6 mb-12">
        {comments.length === 0 ? (
            <p className="text-gray-500 italic">Zatím žádné komentáře. Buď první!</p>
        ) : (
            comments.map((comment) => (
                <div key={comment.id} className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                        {comment.profile?.avatar_url ? (
                            <Image src={comment.profile.avatar_url} alt="" width={32} height={32} className="w-8 h-8 rounded-full" />
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
                                {format(new Date(comment.created_at), "d. MMMM yyyy HH:mm", { locale: cs })}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                </div>
            ))
        )}
      </div>

      {/* FORM */}
      {isLoggedIn ? (
        <form action={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">Napsat komentář</label>
          <textarea
            name="content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-1 focus:ring-neon-cyan outline-none mb-4"
            placeholder="Tvůj názor..."
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
          >
            {submitting ? "Odesílám..." : "Odeslat komentář"}
          </button>
        </form>
      ) : (
        <div className="bg-gray-900/30 p-8 rounded-xl border border-gray-800 text-center">
            <p className="text-gray-400 mb-4">Pro přidání komentáře se musíš přihlásit.</p>
            <a href="/login" className="inline-block px-6 py-2 border border-white/20 hover:bg-white/10 rounded-full transition-colors">
                Přihlásit se
            </a>
        </div>
      )}
    </div>
  );
}
