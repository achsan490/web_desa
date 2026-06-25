"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, Ticket, Clock, CheckCircle, XCircle, Loader } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, formatDate } from "@/lib/utils";

type ComplaintStatus = {
  ticketNumber: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  adminNote: string | null;
};

const categoryLabels: Record<string, string> = {
  INFRASTRUKTUR: "Infrastruktur & Jalan",
  PELAYANAN: "Pelayanan Publik",
  KEAMANAN: "Keamanan & Ketertiban",
  LINGKUNGAN: "Lingkungan Hidup",
  SOSIAL: "Masalah Sosial",
  LAINNYA: "Lainnya",
};

export default function PengaduanTracking() {
  const [ticket, setTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComplaintStatus | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!ticket.trim()) {
      toast.error("Masukkan nomor tiket terlebih dahulu");
      return;
    }
    setLoading(true);
    setData(null);
    setNotFound(false);
    try {
      const res = await fetch(`/api/pengaduan/tracking?ticket=${encodeURIComponent(ticket.trim())}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        setNotFound(true);
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "DONE") return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === "REJECTED") return <XCircle className="h-5 w-5 text-red-600" />;
    if (status === "PROCESSING") return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
    return <Clock className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <div>
      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Ticket className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            id="tracking-ticket-input"
            placeholder="Contoh: PGD-202501-1234"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="form-input pl-10"
          />
        </div>
        <button
          id="tracking-search-btn"
          onClick={handleSearch}
          disabled={loading}
          className="btn-primary px-4 disabled:opacity-50"
        >
          {loading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Result */}
      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 font-medium text-sm">Nomor tiket tidak ditemukan</p>
          <p className="text-red-400 text-xs mt-1">Pastikan nomor tiket sudah benar</p>
        </div>
      )}

      {data && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-xs mb-0.5">Nomor Tiket</p>
                <p className="font-bold text-lg tracking-wider">{data.ticketNumber}</p>
              </div>
              <div className={`badge ${STATUS_COLORS[data.status]} text-xs`}>
                {getStatusIcon(data.status)}
                <span className="ml-1">{STATUS_LABELS[data.status]}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Kategori</span>
              <span className="font-medium text-gray-900">{categoryLabels[data.category] || data.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tanggal Masuk</span>
              <span className="font-medium text-gray-900">{formatDate(data.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Terakhir Update</span>
              <span className="font-medium text-gray-900">{formatDate(data.updatedAt)}</span>
            </div>
            {data.adminNote && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-gray-500 text-xs mb-1">Catatan Admin:</p>
                <p className="text-gray-700 text-sm">{data.adminNote}</p>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-0">
              {["PENDING", "PROCESSING", "DONE"].map((step, i) => {
                const steps = ["PENDING", "PROCESSING", "DONE"];
                const currentIdx = steps.indexOf(data.status === "REJECTED" ? "PENDING" : data.status);
                const stepIdx = steps.indexOf(step);
                const isCompleted = stepIdx <= currentIdx;
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </div>
                    {i < 2 && (
                      <div
                        className={`h-1 flex-1 mx-1 rounded ${
                          stepIdx < currentIdx ? "bg-emerald-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>Diterima</span>
              <span>Diproses</span>
              <span>Selesai</span>
            </div>
          </div>
        </div>
      )}

      {!data && !notFound && !loading && (
        <div className="text-center text-gray-400 text-sm py-8 bg-gray-50 rounded-2xl">
          <Ticket className="h-10 w-10 text-gray-200 mx-auto mb-2" />
          <p>Masukkan nomor tiket untuk melihat status</p>
        </div>
      )}
    </div>
  );
}
