"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, X, BarChart3 } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

type StatItem = {
  id: string;
  category: string;
  label: string;
  value: number;
  year: number;
};

const categoryMap: Record<string, string> = {
  POPULATION: "Umum / Ringkasan",
  GENDER: "Jenis Kelamin",
  EDUCATION: "Pendidikan",
  OCCUPATION: "Pekerjaan",
  RELIGION: "Agama",
  AGE: "Kelompok Usia",
};

export default function AdminStatistikClient({ initialData }: { initialData: StatItem[] }) {
  const [data, setData] = useState<StatItem[]>(initialData);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("SEMUA");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StatItem | null>(null);

  // Form states
  const [category, setCategory] = useState("POPULATION");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState(0);
  const [year, setYear] = useState(2025);
  const [submitting, setSubmitting] = useState(false);

  const filtered = data.filter((d) => {
    const matchSearch = d.label.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "SEMUA" || d.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setCategory("POPULATION");
    setLabel("");
    setValue(0);
    setYear(2025);
    setIsModalOpen(true);
  };

  const openEditModal = (item: StatItem) => {
    setEditingItem(item);
    setCategory(item.category);
    setLabel(item.label);
    setValue(item.value);
    setYear(item.year);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label) {
      toast.error("Label data wajib diisi");
      return;
    }

    setSubmitting(true);
    const payload = {
      category,
      label,
      value: Number(value),
      year: Number(year),
    };

    try {
      if (editingItem) {
        // Edit mode
        const res = await fetch(`/api/statistik/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) => prev.map((d) => (d.id === editingItem.id ? json.stat : d)));
          toast.success("Data statistik berhasil diperbarui");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal memperbarui data statistik");
        }
      } else {
        // Add mode
        const res = await fetch("/api/statistik", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) => [json.stat, ...prev]);
          toast.success("Parameter statistik baru ditambahkan");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal menambahkan parameter statistik");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data statistik ini?")) return;

    try {
      const res = await fetch(`/api/statistik/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((d) => d.id !== id));
        toast.success("Data statistik berhasil dihapus");
      } else {
        toast.error("Gagal menghapus data statistik");
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
              id="admin-statistik-search"
              placeholder="Cari label data..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-input text-sm py-2 px-3 border border-gray-200 rounded-xl max-w-[180px]"
          >
            <option value="SEMUA">Semua Kategori</option>
            {Object.entries(categoryMap).map(([key, val]) => (
              <option key={key} value={key}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Tambah Parameter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Label Data</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Kategori</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Nilai (Jumlah)</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Tahun Data</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-12">
                    Tidak ada parameter statistik ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-bold text-gray-900">{item.label}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-emerald-50 text-emerald-700 rounded-lg px-2.5 py-1 font-semibold">
                        {categoryMap[item.category] || item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-sm font-bold text-gray-900">
                      {formatNumber(item.value)}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {item.year}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="admin-action-btn hover:text-emerald-600"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="admin-action-btn hover:text-red-600"
                          title="Hapus"
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
                {editingItem ? "Edit Parameter Statistik" : "Tambah Parameter Statistik"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="stat-category" className="form-label">Kategori Infografis</label>
                <select
                  id="stat-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input text-sm"
                  disabled={!!editingItem}
                >
                  {Object.entries(categoryMap).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="stat-label" className="form-label">Label Data</label>
                <input
                  type="text"
                  id="stat-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Contoh: Laki-laki, SMA/Sederajat, Petani"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stat-value" className="form-label">Nilai (Jumlah Penduduk)</label>
                  <input
                    type="number"
                    id="stat-value"
                    min={0}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="form-input font-mono"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="stat-year" className="form-label">Tahun Pencatatan</label>
                  <input
                    type="number"
                    id="stat-year"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="form-input font-mono"
                    required
                  />
                </div>
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
