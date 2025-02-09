"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

interface Post {
  title: string;
  content: string;
  category: string;
}

export default function PreviewArticle() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (id) {
      api.get(`/article/${id}`)
        .then((res) => setPost(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!post) return <p className="p-8 text-center text-gray-600">Loading...</p>;

  return (
    <main className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Kategori: {post.category}</p>
        <article className="border p-6 rounded-lg bg-white shadow-md text-gray-700 leading-relaxed  whitespace-pre-wrap">
          <p>{post.content}</p>
        </article>
      </div>
    </main>
  );
}
