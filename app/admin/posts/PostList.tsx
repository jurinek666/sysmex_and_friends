"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeletePost } from "../_actions";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
}

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="border p-5 rounded-2xl bg-white flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="font-bold text-lg mb-1">{post.title}</div>
            <div className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-2 py-1 rounded">/{post.slug}</div>
            {post.isFeatured && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">★ Featured</span>}
          </div>
          <DeleteFormButton
            action={async (formData) => await adminDeletePost(formData)}
            itemId={post.id}
            itemName={post.title}
          />
        </div>
      ))}
      {posts.length === 0 && <div className="text-center text-gray-400 py-12">Zatím žádné články.</div>}
    </div>
  );
}
