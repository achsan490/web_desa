"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, MapPin, Phone, Link as LinkIcon, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Potential = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string | null;
  location: string | null;
  contact: string | null;
  isPublished: boolean;
  createdAt: Date;
};

const categoryOptions = [
  { value: "WISATA", label: "Wisata" },
  { value: "UMKM", label: "UMKM" },
  { value: "PERTANIAN", label: "Pertanian" },
  { value: "PETERNAKAN", label: "Peternakan" },
  { value: "KERAJINAN", label: "Kerajinan" },
];

export default function AdminPotensiClient({ initialData }: { initialData: Potential[] }) {
  const [data, setData] = useState<Potential[]>(initialData);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("SEMUA");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Potential | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("WISATA");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const filtered = data.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      (d.location && d.location.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter === "SEMUA" || d.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setCategory("WISATA");
    setImage("");
    setLocation("");
    setContact("");
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Potential) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setImage(item.image || "");
    setLocation(item.location || "");
    setContact(item.contact || "");
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Judul dan Deskripsi wajib diisi");
      return;
    }

    setSubmitting(true);
    const payload = {
      title,
      description,
      category,
      image: image || null,
      location: location || null,
      contact: contact || null,
      isPublished,
    };

    try {
      if (editingItem) {
        // Edit mode
        const res = await fetch(`/api/potensi/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) =>
            prev.map((d) => (d.id === editingItem.id ? json.potential : d))
          );
          toast.success("Potensi desa berhasil diperbarui");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal memperbarui potensi desa");
        }
      } else {
        // Add mode
        const res = await fetch("/api/potensi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) => [json.potential, ...prev]);
          toast.success("Potensi desa baru berhasil ditambahkan");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal menambahkan potensi desa");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus potensi desa ini?")) return;

    try {
      const res = await fetch(`/api/potensi/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((d) => d.id !== id));
        toast.success("Potensi desa berhasil dihapus");
      } else {
        toast.error("Gagal menghapus potensi desa");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  const handleTogglePublish = async (item: Potential) => {
    try {
      const res = await fetch(`/api/potensi/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });

      if (res.ok) {
        setData((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, isPublished: !d.isPublished } : d))
        );
        toast.success(item.isPublished ? "Potensi diarsipkan" : "Potensi dipublikasikan");
      } else {
        toast.error("Gagal mengubah status publikasi");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  const getCategoryLabel = (val: string) => {
    return categoryOptions.find((c) => c.value === val)?.label || val;
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
              id="admin-potensi-search"
              placeholder="Cari potensi, lokasi, deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-input text-sm py-2 px-3 border border-gray-200 rounded-xl max-w-[160px]"
          >
            <option value="SEMUA">Semua Kategori</option>
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Tambah Potensi
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Potensi</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Kategori</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Lokasi & Kontak</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-12">
                    Tidak ada potensi desa ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <Image
                          src={item.image || "https://picsum.photos/seed/potensi/200/200"}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[240px]">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-1 max-w-[240px]">
                          {item.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-emerald-50 text-emerald-700 rounded-lg px-2.5 py-1 font-semibold">
                        {getCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        {item.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span>{item.location}</span>
                          </div>
                        )}
                        {item.contact && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            <span>{item.contact}</span>
                          </div>
                        )}
                        {!item.location && !item.contact && (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold border transition-all",
                          item.isPublished
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        {item.isPublished ? "Aktif" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="admin-action-btn hover:text-emerald-600"
                          title="Edit Potensi"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="admin-action-btn hover:text-red-600"
                          title="Hapus Potensi"
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingItem ? "Edit Potensi Desa" : "Tambah Potensi Desa"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="potensi-title" className="form-label">Nama Potensi / Produk / Wisata</label>
                <input
                  type="text"
                  id="potensi-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kopi Luwak Ciwidey"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="potensi-description" className="form-label">Deskripsi Potensi</label>
                <textarea
                  id="potensi-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Ceritakan tentang produk, daya tarik wisata, atau hasil pertanian ini..."
                  className="form-input resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="potensi-category" className="form-label">Kategori</label>
                  <select
                    id="potensi-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-input text-sm"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="potensi-contact" className="form-label">Kontak Pengelola / WA</label>
                  <input
                    type="text"
                    id="potensi-contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="potensi-location" className="form-label">Lokasi Pelaksanaan / Alamat UMKM</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="potensi-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Dusun III RT 02/RW 06"
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="potensi-image" className="form-label">URL Gambar Sampul</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="potensi-image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://res.cloudinary.com/... / https://picsum.photos/..."
                    className="form-input pl-10 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="potensi-is-published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="sr-only peer"
                    title="Publikasikan potensi desa"
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
