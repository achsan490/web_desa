"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, Ticket, Clock, CheckCircle, XCircle, Loader, Download } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, LETTER_TYPES, formatDate } from "@/lib/utils";

type LetterStatus = {
  ticketNumber: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  adminNote: string | null;
  pdfUrl: string | null;
};

export default function SuratTracking() {
  const [ticket, setTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LetterStatus | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!ticket.trim()) { toast.error("Masukkan nomor tiket"); return; }
    setLoading(true);
    setData(null);
    setNotFound(false);
    try {
      const res = await fetch(`/api/surat/tracking?ticket=${encodeURIComponent(ticket.trim())}`);
      if (res.ok) setData(await res.json());
      else setNotFound(true);
    } catch { toast.error("Terjadi kesalahan."); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Ticket className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            id="surat-tracking-input"
            placeholder="Contoh: SRT-202501-1234"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="form-input pl-10"
          />
        </div>
        <button id="surat-tracking-btn" onClick={handleSearch} disabled={loading} className="btn-primary px-4 disabled:opacity-50">
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
      </div>

      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 font-medium text-sm">Nomor tiket tidak ditemukan</p>
        </div>
      )}

      {data && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-xs mb-0.5">Nomor Tiket</p>
                <p className="font-bold text-lg tracking-wider">{data.ticketNumber}</p>
              </div>
              <span className={`badge ${STATUS_COLORS[data.status]} text-xs`}>
                {STATUS_LABELS[data.status]}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Jenis Surat</span>
              <span className="font-medium text-gray-900">{LETTER_TYPES.find(t => t.value === data.type)?.label || data.type}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tanggal Pengajuan</span>
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
            {data.pdfUrl && data.status === "READY" && (
              <a
                href={data.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 btn-primary w-full mt-3 justify-center"
              >
                <Download className="h-4 w-4" />
                Unduh Surat PDF
              </a>
            )}
          </div>
        </div>
      )}

      {!data && !notFound && !loading && (
        <div className="text-center text-gray-400 text-sm py-8 bg-gray-50 rounded-2xl">
          <Ticket className="h-10 w-10 text-gray-200 mx-auto mb-2" />
          <p>Masukkan nomor tiket permohonan</p>
        </div>
      )}
    </div>
  );
}
