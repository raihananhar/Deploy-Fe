"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    api
      .get("/article/")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      try {
        await api.delete(`/article/${id}`);
        alert("Artikel berhasil dipindahkan ke Trash!");
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id ? { ...post, status: "trash" } : post
          )
        );
      } catch (error) {
        alert("Gagal menghapus artikel!");
        console.error(error);
      }
    }
  };

  const renderTable = (status: string) => (
    <div className="overflow-auto">
      <table className="w-full border border-gray-300 shadow-md rounded-lg bg-white">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="p-4 text-center text-lg font-semibold w-1/3">
              Title
            </th>
            <th className="p-4 text-center text-lg font-semibold w-1/3">
              Category
            </th>
            <th className="p-4 text-center text-lg font-semibold w-1/3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.filter((post) => post.status === status).map((post) => (
            <tr key={post.id} className="border-b hover:bg-gray-100 transition">
              <td className="p-4 text-left text-gray-800 font-medium">
                {post.title}
              </td>
              <td className="p-4 text-left text-gray-700">{post.category}</td>
              <td className="p-4 flex justify-center items-center gap-2 flex-nowrap">
                <Link
                  href={`/articles/${post.id}?id=${post.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition min-w-max flex items-center gap-1"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition min-w-max flex items-center gap-1"
                >
                  🗑️ Delete
                </button>
                {status === "publish" && (
                  <Link
                    href={`/articles/preview?id=${post.id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition min-w-max flex items-center gap-1"
                  >
                    🔍 Preview
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <main className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Dashboard Artikel
        </h1>

        <Link
          href="/articles/new"
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mb-4 block text-center font-semibold"
        >
          ➕ Tambah Artikel
        </Link>

        <Tabs defaultValue="publish" className="w-full mt-4">
          <TabsList className="flex gap-4 border-b border-gray-300 p-2 overflow-x-auto">
            <TabsTrigger
              value="publish"
              className="px-4 py-2 text-gray-800 font-semibold bg-gray-200 hover:bg-gray-300 rounded-md transition"
            >
              Published
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="px-4 py-2 text-gray-800 font-semibold bg-gray-200 hover:bg-gray-300 rounded-md transition"
            >
              Drafts
            </TabsTrigger>
            <TabsTrigger
              value="trash"
              className="px-4 py-2 text-gray-800 font-semibold bg-gray-200 hover:bg-gray-300 rounded-md transition"
            >
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
