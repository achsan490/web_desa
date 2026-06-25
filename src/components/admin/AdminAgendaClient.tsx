"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, MapPin, Calendar, Clock, X } from "lucide-react";
import { formatDate, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Agenda = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: Date;
  startTime: string | null;
  endTime: string | null;
  status: string;
  isPublished: boolean;
  createdAt: Date;
};

const statusOptions = ["UPCOMING", "ONGOING", "DONE", "CANCELLED"];

export default function AdminAgendaClient({ initialData }: { initialData: Agenda[] }) {
  const router = useRouter();
  const [data, setData] = useState<Agenda[]>(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Agenda | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("UPCOMING");
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const filtered = data.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(search.toLowerCase())) ||
      (d.location && d.location.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "SEMUA" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setLocation("");
    setDate(new Date().toISOString().split("T")[0]);
    setStartTime("");
    setEndTime("");
    setStatus("UPCOMING");
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Agenda) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setLocation(item.location || "");
    setDate(new Date(item.date).toISOString().split("T")[0]);
    setStartTime(item.startTime || "");
    setEndTime(item.endTime || "");
    setStatus(item.status);
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) {
      toast.error("Judul dan Tanggal wajib diisi");
      return;
    }

    setSubmitting(true);
    const payload = {
      title,
      description,
      location,
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      status,
      isPublished,
    };

    try {
      if (editingItem) {
        // Edit mode
        const res = await fetch(`/api/agenda/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) =>
            prev.map((d) => (d.id === editingItem.id ? { ...json.agenda, date: new Date(json.agenda.date) } : d))
          );
          toast.success("Agenda berhasil diperbarui");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal memperbarui agenda");
        }
      } else {
        // Add mode
        const res = await fetch("/api/agenda", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) => [{ ...json.agenda, date: new Date(json.agenda.date) }, ...prev]);
          toast.success("Agenda baru berhasil ditambahkan");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal menambahkan agenda");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus agenda ini?")) return;

    try {
      const res = await fetch(`/api/agenda/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((d) => d.id !== id));
        toast.success("Agenda berhasil dihapus");
      } else {
        toast.error("Gagal menghapus agenda");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  const handleTogglePublish = async (item: Agenda) => {
    try {
      const res = await fetch(`/api/agenda/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });

      if (res.ok) {
        setData((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, isPublished: !d.isPublished } : d))
        );
        toast.success(item.isPublished ? "Agenda diarsipkan" : "Agenda dipublikasikan");
      } else {
        toast.error("Gagal mengubah status publikasi");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-1 gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="admin-agenda-search"
              placeholder="Cari agenda, lokasi, deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input text-sm py-2 px-3 border border-gray-200 rounded-xl max-w-[150px]"
          >
            <option value="SEMUA">Semua Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] || s}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Tambah Agenda
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Nama Agenda</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Waktu & Lokasi</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Publikasi</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-12">
                    Tidak ada agenda kegiatan ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 max-w-[280px]">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{item.description || "-"}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Clock className="h-3.5 w-3.5 text-emerald-600" />
                          <span>
                            {item.startTime ? item.startTime : "Harian"}
                            {item.endTime ? ` - ${item.endTime}` : ""}
                          </span>
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span className="truncate max-w-[200px]">{item.location}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`badge text-xs ${STATUS_COLORS[item.status]}`}>
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
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
                          title="Edit Agenda"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="admin-action-btn hover:text-red-600"
                          title="Hapus Agenda"
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
                {editingItem ? "Edit Agenda Kegiatan" : "Tambah Agenda Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="agenda-title" className="form-label">Nama / Judul Agenda</label>
                <input
                  type="text"
                  id="agenda-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Rapat Koordinasi RT/RW"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="agenda-description" className="form-label">Deskripsi Kegiatan</label>
                <textarea
                  id="agenda-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail pelaksanaan acara..."
                  className="form-input resize-none"
                />
              </div>

              <div>
                <label htmlFor="agenda-location" className="form-label">Lokasi Kegiatan</label>
                <input
                  type="text"
                  id="agenda-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Aula Kantor Desa"
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label htmlFor="agenda-date" className="form-label">Tanggal</label>
                  <input
                    type="date"
                    id="agenda-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="agenda-start-time" className="form-label">Jam Mulai</label>
                  <input
                    type="time"
                    id="agenda-start-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="form-input text-sm"
                    placeholder="Contoh: 09:00"
                  />
                </div>
                <div>
                  <label htmlFor="agenda-end-time" className="form-label">Jam Selesai</label>
                  <input
                    type="time"
                    id="agenda-end-time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="form-input text-sm"
                    placeholder="Contoh: 12:00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="agenda-status" className="form-label">Status Kegiatan</label>
                  <select
                    id="agenda-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-input text-sm"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s] || s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center pt-8">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="agenda-is-published"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2 text-sm font-semibold text-gray-700">Publikasikan</span>
                  </label>
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
