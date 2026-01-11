"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreatePost } from "../_actions";

export function PostForm() {
  return (
    <ActionForm
      action={async (prevState, formData) => await adminCreatePost(formData)}
      successMessage="Článek byl úspěšně vytvořen"
      submitButtonText="Publikovat článek"
      submitButtonClassName="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
    >
      <div className="space-y-4">
        <input name="title" placeholder="Nadpis" required className="w-full p-3 border rounded-xl" />
        <input name="slug" placeholder="slug-url-adresy" required className="w-full p-3 border rounded-xl font-mono text-sm bg-gray-50" />
        <textarea name="excerpt" placeholder="Krátký úvod (perex)" required rows={3} className="w-full p-3 border rounded-xl" />
        
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
        
        <textarea name="content" placeholder="Hlavní text článku..." required rows={10} className="w-full p-3 border rounded-xl font-mono text-sm" />
        <input name="coverImageUrl" placeholder="URL úvodního obrázku (volitelné)" className="w-full p-3 border rounded-xl" />
        
        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input type="checkbox" name="isFeatured" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
          <span className="font-medium">Hlavní článek (zobrazit velký na úvodu)</span>
        </label>
      </div>
    </ActionForm>
  );
}
