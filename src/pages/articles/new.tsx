"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/router";

export default function NewArticle() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: "draft",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/article/", formData);
      alert("Artikel berhasil ditambahkan!");
      router.push("/");
    } catch (error) {
      alert("Gagal menambahkan artikel!");
      console.error(error);
    }
  };

  return (
    <main className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Tambah Artikel Baru</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Judul"
            value={formData.title}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          />
          <textarea
            name="content"
            placeholder="Isi artikel"
            value={formData.content}
            onChange={handleChange}
            required
            className="border p-3 h-40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          />
          <input
            type="text"
            name="category"
            placeholder="Kategori"
            value={formData.category}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          >
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
            ✅ Simpan Artikel
          </button>
        </form>
      </div>
    </main>
  );
}