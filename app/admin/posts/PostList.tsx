"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeletePost } from "../_actions";
import { PostForm } from "./PostForm";
import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Post } from "@/lib/types";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingPost = editingId ? posts.find(p => p.id === editingId) : null;

  if (editingPost) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Upravit článek</h2>
        <PostForm post={editingPost} onCancel={() => setEditingId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="border p-5 rounded-2xl bg-white flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="font-bold text-lg mb-1">{post.title}</div>
            <div className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-2 py-1 rounded">/{post.slug}</div>
            {!post.isPublished && <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold">Nepublikováno</span>}
            {post.isFeatured && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">★ Featured</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingId(post.id)}
              className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Upravit
            </button>
            <DeleteFormButton
              action={async (formData) => await adminDeletePost(null, formData)}
              itemId={post.id}
              itemName={post.title}
            />
          </div>
        </div>
      ))}
      {posts.length === 0 && <div className="text-center text-gray-400 py-12">Zatím žádné články.</div>}
    </div>
  );
}
