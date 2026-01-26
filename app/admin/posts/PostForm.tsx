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

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Nadpis <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            placeholder="Nadpis"
            required
            defaultValue={post?.title}
            className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            name="slug"
            placeholder="slug-url-adresy"
            required
            defaultValue={post?.slug}
            className="w-full p-3 border rounded-xl font-mono text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Perex (Krátký úvod) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            placeholder="Krátký úvod (perex)"
            required
            rows={3}
            defaultValue={post?.excerpt}
            className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm text-blue-800 space-y-3">
          <p className="font-bold text-base mb-3">💡 Formátování textu (Markdown):</p>
          
          <div>
            <p className="font-semibold mb-2 text-blue-900">Základní formátování:</p>
            <ul className="space-y-1.5 ml-2">
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">**tučný text**</code> → <strong>tučný text</strong></li>
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">*kurzíva*</code> → <em>kurzíva</em></li>
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">***tučné a kurzíva***</code> → <strong><em>tučné a kurzíva</em></strong></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2 text-blue-900">Nadpisy:</p>
            <ul className="space-y-1.5 ml-2">
              <li><code className="bg-blue-100 px-2 py-0.5 rounded"># Nadpis 1</code> (největší)</li>
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">## Nadpis 2</code></li>
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">### Nadpis 3</code></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2 text-blue-900">Odkazy a obrázky:</p>
            <ul className="space-y-1.5 ml-2">
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">[Text odkazu](https://url.cz)</code></li>
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">![Popis obrázku](https://url.cz/obrazek.jpg)</code></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2 text-blue-900">Seznamy:</p>
            <ul className="space-y-1.5 ml-2">
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">- Odrážkový seznam</code></li>
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">1. Číslovaný seznam</code></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2 text-blue-900">Ostatní:</p>
            <ul className="space-y-1.5 ml-2">
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">{"> "}Citace</code> (začít řádkem s &gt;)</li>
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">`kód`</code> (inline kód)</li>
              <li><code className="bg-blue-100 px-2 py-0.5 rounded">---</code> (vodorovná čára)</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-blue-200">
            <p className="text-xs text-blue-700 italic">
              💡 Tip: Pro lepší čitelnost nechte prázdný řádek mezi odstavci. Mezery a velikost písma se automaticky upraví při zobrazení.
            </p>
          </div>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Hlavní text <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Hlavní text článku..."
            required
            rows={10}
            defaultValue={post?.content}
            className="w-full p-3 border rounded-xl font-mono text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL úvodního obrázku
          </label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            placeholder="URL úvodního obrázku (volitelné)"
            defaultValue={post?.coverImageUrl || undefined}
            className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
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
