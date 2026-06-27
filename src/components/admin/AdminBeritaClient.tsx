"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, Search, X, UploadCloud } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate, NEWS_CATEGORIES } from "@/lib/utils";
import { cn } from "@/lib/utils";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("PEMERINTAHAN");
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = news.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "SEMUA" || n.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setImage("");
    setCategory("PEMERINTAHAN");
    setIsPublished(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setExcerpt(item.excerpt || "");
    setContent(item.content);
    setImage(item.image || "");
    setCategory(item.category);
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok && json.url) {
        setImage(json.url);
        toast.success("Gambar berhasil diunggah!");
      } else {
        toast.error(json.error || "Gagal mengunggah gambar.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengunggah.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Judul dan Isi Berita wajib diisi");
      return;
    }

    setSubmitting(true);
    const payload = { title, excerpt, content, image: image || null, category, isPublished };

    try {
      if (editingItem) {
        const res = await fetch(`/api/berita/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          setNews((prev) =>
            prev.map((n) => (n.id === editingItem.id ? { ...n, ...json.news, author: n.author } : n))
          );
          toast.success("Berita berhasil diperbarui");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal memperbarui berita");
        }
      } else {
        const res = await fetch("/api/berita", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          setNews((prev) => [{ ...json.news, author: { name: "Saya" } }, ...prev]);
          toast.success("Berita berhasil ditambahkan");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal menambahkan berita");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <button
          onClick={openAddModal}
          id="admin-berita-tambah-btn"
          className="btn-primary whitespace-nowrap flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Berita
        </button>
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
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                          </div>
                        )}
                        <p className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">{item.title}</p>
                      </div>
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
                        <button
                          onClick={() => openEditModal(item)}
                          className="admin-action-btn hover:text-amber-600"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingItem ? "Edit Berita" : "Tambah Berita Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Cover Image Upload */}
              <div>
                <label className="form-label">Foto Sampul Berita</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="berita-file-upload"
                />
                {image ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <div className="relative w-full aspect-video">
                      <Image src={image} alt="Preview" fill className="object-cover" unoptimized />
                    </div>
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <label
                      htmlFor="berita-file-upload"
                      className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-xs font-semibold text-gray-700 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white transition border border-gray-200 flex items-center gap-1.5"
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      Ganti Foto
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="berita-file-upload"
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition",
                      uploadingImage
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-gray-200 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50"
                    )}
                  >
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-emerald-600 font-medium">Mengunggah...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <UploadCloud className="h-8 w-8" />
                        <p className="text-sm font-medium">Klik untuk unggah foto sampul</p>
                        <p className="text-xs">PNG, JPG, WEBP (maks. 10MB)</p>
                      </div>
                    )}
                  </label>
                )}
              </div>

              <div>
                <label htmlFor="berita-title" className="form-label">Judul Berita <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="berita-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Desa Sukamaju Raih Penghargaan Nasional"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="berita-excerpt" className="form-label">Ringkasan (Excerpt)</label>
                <textarea
                  id="berita-excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Ringkasan singkat yang tampil di halaman daftar berita..."
                  className="form-input resize-none"
                />
              </div>

              <div>
                <label htmlFor="berita-content" className="form-label">Isi Berita <span className="text-red-500">*</span></label>
                <textarea
                  id="berita-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Tulis isi berita secara lengkap di sini..."
                  className="form-input resize-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="berita-category" className="form-label">Kategori</label>
                <select
                  id="berita-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                >
                  {NEWS_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="berita-is-published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-2 text-sm font-semibold text-gray-700">Publikasikan Sekarang</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="rounded-xl px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Tambah Berita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

