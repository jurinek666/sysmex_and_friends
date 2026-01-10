"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreatePost, adminUpdatePost } from "../_actions";
import { X } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  isFeatured: boolean;
}

interface PostFormProps {
  post?: Post;
  onCancel?: () => void;
}

export function PostForm({ post, onCancel }: PostFormProps) {
  const isEdit = !!post;

  return (
    <ActionForm
      action={async (prevState, formData) => {
        if (isEdit) {
          formData.append("id", post.id);
          return await adminUpdatePost(formData);
        }
        return await adminCreatePost(formData);
      }}
      successMessage={isEdit ? "Článek byl úspěšně upraven" : "Článek byl úspěšně vytvořen"}
      submitButtonText={isEdit ? "Uložit změny" : "Publikovat článek"}
      submitButtonClassName="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
      onSuccess={onCancel}
    >
      <div className="space-y-4">
        {isEdit && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-xl text-sm">
            Upravujete článek: <strong>{post.title}</strong>
          </div>
        )}
        <input 
          name="title" 
          placeholder="Nadpis" 
          required 
          defaultValue={post?.title}
          className="w-full p-3 border rounded-xl" 
        />
        <input 
          name="slug" 
          placeholder="slug-url-adresy" 
          required 
          defaultValue={post?.slug}
          className="w-full p-3 border rounded-xl font-mono text-sm bg-gray-50" 
        />
        <textarea 
          name="excerpt" 
          placeholder="Krátký úvod (perex)" 
          required 
          rows={3} 
          defaultValue={post?.excerpt}
          className="w-full p-3 border rounded-xl" 
        />
        
        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 space-y-1">
          <p className="font-bold mb-2">💡 Formátování textu (Markdown):</p>
          <ul className="grid grid-cols-2 gap-2">
            <li><code># Nadpis 1</code></li>
            <li><code>## Nadpis 2</code></li>
            <li><code>**Tučný text**</code></li>
            <li><code>*Kurzíva*</code></li>
            <li><code>- Odrážka</code></li>
            <li><code>[Text](https://...)</code></li>
          </ul>
        </div>
        
        <textarea 
          name="content" 
          placeholder="Hlavní text článku..." 
          required 
          rows={10} 
          defaultValue={post?.content}
          className="w-full p-3 border rounded-xl font-mono text-sm" 
        />
        <input 
          name="coverImageUrl" 
          placeholder="URL úvodního obrázku (volitelné)" 
          defaultValue={post?.coverImageUrl || undefined}
          className="w-full p-3 border rounded-xl" 
        />
        
        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input 
            type="checkbox" 
            name="isFeatured" 
            defaultChecked={post?.isFeatured}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
          />
          <span className="font-medium">Hlavní článek (zobrazit velký na úvodu)</span>
        </label>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Zrušit úpravu
          </button>
        )}
      </div>
    </ActionForm>
  );
}
