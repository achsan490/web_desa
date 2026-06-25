"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, Eye, ChevronDown } from "lucide-react";
import { formatDate, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Complaint = {
  id: string;
  ticketNumber: string;
  name: string;
  nik: string;
  email: string | null;
  phone: string | null;
  category: string;
  description: string;
  status: string;
  adminNote: string | null;
  createdAt: Date;
};

const categoryLabels: Record<string, string> = {
  INFRASTRUKTUR: "Infrastruktur",
  PELAYANAN: "Pelayanan",
  KEAMANAN: "Keamanan",
  LINGKUNGAN: "Lingkungan",
  SOSIAL: "Sosial",
  LAINNYA: "Lainnya",
};

const statusOptions = ["PENDING", "PROCESSING", "DONE", "REJECTED"];

export default function AdminPengaduanClient({ initialData }: { initialData: Complaint[] }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const filtered = data.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ticketNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "SEMUA" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selected = data.find((d) => d.id === selectedId);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/pengaduan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminNote }),
      });
      if (res.ok) {
        setData((prev) =>
          prev.map((d) => d.id === id ? { ...d, status, adminNote } : d)
        );
        toast.success("Status pengaduan diperbarui");
        setSelectedId(null);
      } else toast.error("Gagal memperbarui.");
    } catch { toast.error("Terjadi kesalahan."); }
    finally { setUpdating(false); }
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            id="admin-pengaduan-search"
            placeholder="Cari nama atau nomor tiket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["SEMUA", ...statusOptions].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-medium transition-all whitespace-nowrap",
                statusFilter === s
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-400"
              )}
            >
              {s === "SEMUA" ? "Semua" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Tiket</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Pelapor</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Kategori</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Tanggal</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-400 py-12">Tidak ada pengaduan</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 rounded px-2 py-0.5">
                        {item.ticketNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.phone && <p className="text-xs text-gray-400">{item.phone}</p>}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs bg-blue-100 text-blue-700 rounded-lg px-2 py-0.5">
                        {categoryLabels[item.category] || item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`badge text-xs ${STATUS_COLORS[item.status]}`}>
                        {STATUS_LABELS[item.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => { setSelectedId(item.id); setAdminNote(item.adminNote || ""); }}
                          id={`admin-view-complaint-${item.id}`}
                          className="admin-action-btn hover:text-emerald-600"
                        >
                          <Eye className="h-4 w-4" />
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

      {/* Detail Modal */}
      {selectedId && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedId(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Detail Pengaduan</h3>
                <span className="text-xs font-mono text-gray-500">{selected.ticketNumber}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500 text-xs mb-0.5">Nama</p><p className="font-medium">{selected.name}</p></div>
                <div><p className="text-gray-500 text-xs mb-0.5">NIK</p><p className="font-mono">{selected.nik}</p></div>
                <div><p className="text-gray-500 text-xs mb-0.5">Kategori</p><p className="font-medium">{categoryLabels[selected.category]}</p></div>
                <div><p className="text-gray-500 text-xs mb-0.5">Tanggal</p><p className="font-medium">{formatDate(selected.createdAt)}</p></div>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Deskripsi Pengaduan</p>
                <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-4">{selected.description}</p>
              </div>

              <div>
                <label htmlFor="admin-note-input" className="form-label">Catatan Admin</label>
                <textarea
                  id="admin-note-input"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="Tulis catatan atau tanggapan..."
                  className="form-input resize-none"
                />
              </div>

              <div>
                <p className="form-label">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      id={`admin-status-${s.toLowerCase()}`}
                      disabled={updating}
                      onClick={() => handleUpdateStatus(selected.id, s)}
                      className={cn(
                        "rounded-xl px-4 py-2 text-sm font-medium transition-all disabled:opacity-50",
                        selected.status === s
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
