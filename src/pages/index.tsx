"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  category: string;
  status: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    api.get("/article/")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fungsi Hapus Artikel (Pindah ke Trash)
  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      try {
        await api.delete(`/article/${id}`);
        alert("Artikel berhasil dipindahkan ke Trash!");
        setPosts(posts.map(post => post.id === id ? { ...post, status: "trash" } : post));
      } catch (error) {
        alert("Gagal menghapus artikel!");
        console.error(error);
      }
    }
  };

  // Fungsi Render Tabel untuk Published, Drafts, dan Trashed
  const renderTable = (status: string) => (
    <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden bg-white">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="p-3 text-left">Title</th>
          <th className="p-3 text-left">Category</th>
          <th className="p-3 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {posts.filter(post => post.status === status).map((post) => (
          <tr key={post.id} className="border-b hover:bg-gray-100 transition">
            <td className="p-3 text-black font-medium">{post.title}</td>
            <td className="p-3 text-black font-medium">{post.category}</td>
            <td className="p-3 flex gap-2">
              <Link href={`/articles/${post.id}?id=${post.id}`} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition">
                ✏️ Edit
              </Link>
              <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
                🗑️ Delete
              </button>
              {status === "publish" && (
                <Link href={`/articles/preview?id=${post.id}`} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition">
                  🔍 Preview
                </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <main className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Dashboard Artikel</h1>

        {/* Tombol Tambah Artikel */}
        <Link href="/articles/new" className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mb-4 block text-center">
          ➕ Tambah Artikel
        </Link>

        {/* Tabs untuk Published, Drafts, Trashed */}
        <Tabs defaultValue="publish" className="w-full mt-4">
          <TabsList className="flex gap-4 border-b border-gray-300 p-2">
            <TabsTrigger value="publish" className="px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition font-semibold">
              Published
            </TabsTrigger>
            <TabsTrigger value="draft" className="px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition font-semibold">
              Drafts
            </TabsTrigger>
            <TabsTrigger value="trash" className="px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition font-semibold">
              Trashed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="publish">{renderTable("publish")}</TabsContent>
          <TabsContent value="draft">{renderTable("draft")}</TabsContent>
          <TabsContent value="trash">{renderTable("trash")}</TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
