"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, Eye, Download, Printer, ChevronDown, FileText } from "lucide-react";
import { formatDate, STATUS_COLORS, STATUS_LABELS, LETTER_TYPES } from "@/lib/utils";
import { cn } from "@/lib/utils";

type LetterRequest = {
  id: string;
  ticketNumber: string;
  type: string;
  applicantName: string;
  nik: string;
  birthPlace: string | null;
  birthDate: Date | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  purpose: string | null;
  status: string;
  adminNote: string | null;
  pdfUrl: string | null;
  createdAt: Date;
};

const statusOptions = ["PENDING", "PROCESSING", "READY", "REJECTED"];

export default function AdminSuratClient({ initialData }: { initialData: LetterRequest[] }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [typeFilter, setTypeFilter] = useState("SEMUA");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const filtered = data.filter((d) => {
    const matchSearch =
      d.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      d.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.nik.includes(search);
    const matchStatus = statusFilter === "SEMUA" || d.status === statusFilter;
    const matchType = typeFilter === "SEMUA" || d.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const selected = data.find((d) => d.id === selectedId);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/surat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminNote }),
      });
      if (res.ok) {
        const json = await res.json();
        setData((prev) =>
          prev.map((d) => d.id === id ? { ...d, status, adminNote, pdfUrl: json.letter?.pdfUrl || d.pdfUrl } : d)
        );
        toast.success("Status permohonan surat diperbarui");
        setSelectedId(null);
      } else {
        toast.error("Gagal memperbarui status.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setUpdating(false);
    }
  };

  const getLetterTypeLabel = (type: string) => {
    return LETTER_TYPES.find((t) => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            id="admin-surat-search"
            placeholder="Cari nama pemohon, NIK, atau nomor tiket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input text-sm py-2 px-3 border border-gray-200 rounded-xl max-w-[200px]"
          >
            <option value="SEMUA">Semua Jenis Surat</option>
            {LETTER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">No. Tiket</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Pemohon & NIK</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Jenis Surat</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Tanggal</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-12">
                    Tidak ada permohonan surat
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 rounded px-2 py-0.5">
                        {item.ticketNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{item.applicantName}</p>
                      <p className="text-xs font-mono text-gray-400">{item.nik}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-emerald-50 text-emerald-700 rounded-lg px-2.5 py-1 font-medium">
                        {getLetterTypeLabel(item.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`badge text-xs ${STATUS_COLORS[item.status]}`}>
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedId(item.id);
                            setAdminNote(item.adminNote || "");
                          }}
                          id={`admin-view-surat-${item.id}`}
                          className="admin-action-btn hover:text-emerald-600"
                          title="Detail permohonan"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {(item.status === "READY" || item.status === "DONE") && (
                          <a
                            href={`/api/surat/${item.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-action-btn hover:text-blue-600 flex items-center justify-center"
                            title="Unduh PDF Resmi"
                          >
                            <Printer className="h-4 w-4" />
                          </a>
                        )}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Detail Permohonan Surat</h3>
                <span className="text-xs font-mono text-gray-500">{selected.ticketNumber}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Nama Pemohon</p>
                  <p className="font-medium">{selected.applicantName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">NIK</p>
                  <p className="font-mono">{selected.nik}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Jenis Surat</p>
                  <p className="font-medium">{getLetterTypeLabel(selected.type)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Tanggal Pengajuan</p>
                  <p className="font-medium">{formatDate(selected.createdAt)}</p>
                </div>
                {selected.birthPlace && (
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Tempat Lahir</p>
                    <p className="font-medium">{selected.birthPlace}</p>
                  </div>
                )}
                {selected.birthDate && (
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Tanggal Lahir</p>
                    <p className="font-medium">{formatDate(selected.birthDate)}</p>
                  </div>
                )}
                {selected.phone && (
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Telepon</p>
                    <p className="font-medium">{selected.phone}</p>
                  </div>
                )}
                {selected.email && (
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Email</p>
                    <p className="font-medium">{selected.email}</p>
                  </div>
                )}
              </div>

              {selected.address && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Alamat</p>
                  <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-3">{selected.address}</p>
                </div>
              )}

              {selected.purpose && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Tujuan / Keperluan</p>
                  <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-3">{selected.purpose}</p>
                </div>
              )}

              <hr className="border-gray-100" />

              <div>
                <label htmlFor="admin-note-input" className="form-label">Catatan Admin / Keterangan Penolakan</label>
                <textarea
                  id="admin-note-input"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="Tulis catatan atau tanggapan..."
                  className="form-input resize-none text-sm"
                />
              </div>

              <div>
                <p className="form-label">Update Status Permohonan</p>
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

              {(selected.status === "READY" || selected.status === "DONE") && (
                <div className="pt-2">
                  <a
                    href={`/api/surat/${selected.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md w-full text-sm"
                  >
                    <FileText className="h-4 w-4" /> Cetak Surat Keterangan (PDF)
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
