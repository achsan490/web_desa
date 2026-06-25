"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate, NEWS_CATEGORIES } from "@/lib/utils";
import { cn } from "@/lib/utils";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  publishedAt: Date | null;
  views: number;
  author: { name: string };
};

export default function AdminBeritaClient({ initialNews }: { initialNews: NewsItem[] }) {
  const [news, setNews] = useState(initialNews);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("SEMUA");
  const router = useRouter();

  const filtered = news.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "SEMUA" || n.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/berita/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      });
      if (res.ok) {
        setNews((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, isPublished: !current, publishedAt: !current ? new Date() : n.publishedAt } : n
          )
        );
        toast.success(`Berita ${!current ? "dipublish" : "disembunyikan"}`);
      }
    } catch { toast.error("Gagal mengubah status."); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus berita ini?")) return;
    try {
      const res = await fetch(`/api/berita/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNews((prev) => prev.filter((n) => n.id !== id));
        toast.success("Berita berhasil dihapus");
      }
    } catch { toast.error("Gagal menghapus."); }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      PEMERINTAHAN: "bg-blue-100 text-blue-700",
      PENDIDIKAN: "bg-yellow-100 text-yellow-700",
      KESEHATAN: "bg-emerald-100 text-emerald-700",
      UMKM: "bg-orange-100 text-orange-700",
      PERTANIAN: "bg-lime-100 text-lime-700",
      INFRASTRUKTUR: "bg-gray-100 text-gray-700",
      KEGIATAN: "bg-purple-100 text-purple-700",
    };
    return colors[cat] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            id="admin-berita-search"
            placeholder="Cari berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <select
          id="admin-berita-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="form-input max-w-48"
        >
          <option value="SEMUA">Semua Kategori</option>
          {NEWS_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <Link href="/admin/berita/tambah" id="admin-berita-tambah-btn" className="btn-primary whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Tambah Berita
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Judul</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Kategori</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Penulis</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Tanggal</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Views</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-gray-400 py-12">Tidak ada berita</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">{item.title}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={`badge text-xs ${getCategoryColor(item.category)}`}>
                        {NEWS_CATEGORIES.find((c) => c.value === item.category)?.label || item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-gray-500">{item.author.name}</td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-gray-500">
                      {item.publishedAt ? formatDate(item.publishedAt) : "-"}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-sm text-gray-500">{item.views}</td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleTogglePublish(item.id, item.isPublished)}
                        className={cn(
                          "badge text-xs cursor-pointer hover:opacity-80 transition-opacity",
                          item.isPublished ? "badge-emerald" : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {item.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/berita/${item.slug}`}
                          target="_blank"
                          className="admin-action-btn hover:text-blue-600"
                          title="Lihat"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/berita/${item.id}/edit`}
                          className="admin-action-btn hover:text-amber-600"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="admin-action-btn hover:text-red-600"
                          title="Hapus"
                          id={`admin-delete-news-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
