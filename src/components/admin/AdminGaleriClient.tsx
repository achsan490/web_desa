"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Link as LinkIcon, Image as ImageIcon, Video, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: string;
  category: string | null;
  isPublished: boolean;
  createdAt: Date;
};

const typeOptions = ["PHOTO", "VIDEO"];
const categoryOptions = ["KEGIATAN", "PEMBANGUNAN", "UMKM", "SOSIAL", "LAINNYA"];

export default function AdminGaleriClient({ initialData }: { initialData: GalleryItem[] }) {
  const [data, setData] = useState<GalleryItem[]>(initialData);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("SEMUA");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("PHOTO");
  const [category, setCategory] = useState("KEGIATAN");
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const filtered = data.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(search.toLowerCase())) ||
      (d.category && d.category.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === "SEMUA" || d.type === typeFilter;
    return matchSearch && matchType;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setUrl("");
    setType("PHOTO");
    setCategory("KEGIATAN");
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setUrl(item.url);
    setType(item.type);
    setCategory(item.category || "KEGIATAN");
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      toast.error("Judul dan URL Media wajib diisi");
      return;
    }

    setSubmitting(true);
    const payload = {
      title,
      description,
      url,
      type,
      category,
      isPublished,
    };

    try {
      if (editingItem) {
        // Edit mode
        const res = await fetch(`/api/galeri/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) =>
            prev.map((d) => (d.id === editingItem.id ? json.item : d))
          );
          toast.success("Media galeri diperbarui");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal memperbarui media");
        }
      } else {
        // Add mode
        const res = await fetch("/api/galeri", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) => [json.item, ...prev]);
          toast.success("Media baru berhasil ditambahkan");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal menambahkan media");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus media ini?")) return;

    try {
      const res = await fetch(`/api/galeri/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((d) => d.id !== id));
        toast.success("Media berhasil dihapus");
      } else {
        toast.error("Gagal menghapus media");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/galeri/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });

      if (res.ok) {
        setData((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, isPublished: !d.isPublished } : d))
        );
        toast.success(item.isPublished ? "Media diarsipkan" : "Media dipublikasikan");
      } else {
        toast.error("Gagal mengubah status publikasi");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-1 gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="admin-galeri-search"
              placeholder="Cari judul, kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input text-sm py-2 px-3 border border-gray-200 rounded-xl max-w-[150px]"
          >
            <option value="SEMUA">Semua Tipe</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t === "PHOTO" ? "Foto" : "Video"}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Tambah Media
        </button>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            Tidak ada media galeri ditemukan
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col group relative"
            >
              {/* Media Thumbnail Preview */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  sizes="(max-w-700px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition duration-300"
                  unoptimized
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white rounded-lg px-2 py-0.5 backdrop-blur-sm flex items-center gap-1">
                    {item.type === "PHOTO" ? <ImageIcon className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                    {item.type === "PHOTO" ? "Foto" : "Video"}
                  </span>
                  {item.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white rounded-lg px-2 py-0.5">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Media Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2">{item.description || "Tidak ada deskripsi"}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-lg border transition",
                      item.isPublished
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-gray-50 text-gray-400 border-gray-100"
                    )}
                  >
                    {item.isPublished ? "Aktif" : "Draft"}
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingItem ? "Edit Media Galeri" : "Tambah Media Galeri"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="galeri-title" className="form-label">Judul Media</label>
                <input
                  type="text"
                  id="galeri-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Peresmian Jembatan Baru"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="galeri-description" className="form-label">Deskripsi Media</label>
                <textarea
                  id="galeri-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Keterangan singkat mengenai foto/video ini..."
                  className="form-input resize-none"
                />
              </div>

              <div>
                <label htmlFor="galeri-url" className="form-label">URL Media Gambar/Video (Cloudinary)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="galeri-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/... / https://picsum.photos/..."
                    className="form-input pl-10 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="galeri-type" className="form-label">Tipe Media</label>
                  <select
                    id="galeri-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="form-input text-sm"
                  >
                    {typeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t === "PHOTO" ? "Foto" : "Video"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="galeri-category" className="form-label">Kategori</label>
                  <select
                    id="galeri-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-input text-sm"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="galeri-is-published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-2 text-sm font-semibold text-gray-700">Tampilkan di Publik</span>
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
                  disabled={submitting}
                  className="rounded-xl px-4 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
