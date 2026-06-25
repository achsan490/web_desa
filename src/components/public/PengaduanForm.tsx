"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Tag,
  MessageSquare,
  Upload,
  Send,
  CheckCircle,
  Ticket,
} from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya angka"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().min(10, "Nomor HP minimal 10 digit").optional().or(z.literal("")),
  category: z.string().min(1, "Pilih kategori"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
});

type FormData = z.infer<typeof schema>;

const categories = [
  "INFRASTRUKTUR",
  "PELAYANAN",
  "KEAMANAN",
  "LINGKUNGAN",
  "SOSIAL",
  "LAINNYA",
];

const categoryLabels: Record<string, string> = {
  INFRASTRUKTUR: "Infrastruktur & Jalan",
  PELAYANAN: "Pelayanan Publik",
  KEAMANAN: "Keamanan & Ketertiban",
  LINGKUNGAN: "Lingkungan Hidup",
  SOSIAL: "Masalah Sosial",
  LAINNYA: "Lainnya",
};

export default function PengaduanForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pengaduan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setTicketNumber(result.ticketNumber);
        reset();
      } else {
        toast.error("Gagal mengirim pengaduan. Silakan coba lagi.");
      }
    } catch {
      toast.error("Terjadi kesalahan. Periksa koneksi internet Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (ticketNumber) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Pengaduan Berhasil Dikirim!
        </h3>
        <p className="text-gray-600 mb-6">
          Simpan nomor tiket Anda untuk memantau status pengaduan.
        </p>
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 inline-block mb-6">
          <p className="text-sm text-gray-500 mb-1">Nomor Tiket</p>
          <p className="text-2xl font-black text-emerald-700 tracking-wider flex items-center gap-2 justify-center">
            <Ticket className="h-6 w-6" />
            {ticketNumber}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setTicketNumber(null)}
            className="btn-secondary"
          >
            Buat Pengaduan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name & NIK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pengaduan-name" className="form-label">
            Nama Lengkap *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              id="pengaduan-name"
              {...register("name")}
              placeholder="Nama sesuai KTP"
              className="form-input pl-10"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="pengaduan-nik" className="form-label">
            NIK *
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              id="pengaduan-nik"
              {...register("nik")}
              placeholder="16 digit NIK"
              maxLength={16}
              className="form-input pl-10"
            />
          </div>
          {errors.nik && (
            <p className="text-red-500 text-xs mt-1">{errors.nik.message}</p>
          )}
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pengaduan-email" className="form-label">
            Email (opsional)
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              id="pengaduan-email"
              {...register("email")}
              type="email"
              placeholder="email@contoh.com"
              className="form-input pl-10"
            />
          </div>
        </div>
        <div>
          <label htmlFor="pengaduan-phone" className="form-label">
            Nomor HP (opsional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              id="pengaduan-phone"
              {...register("phone")}
              placeholder="08xxxxxxxxxx"
              className="form-input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="pengaduan-category" className="form-label">
          Kategori Pengaduan *
        </label>
        <div className="relative">
          <Tag className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <select
            id="pengaduan-category"
            {...register("category")}
            className="form-input pl-10 appearance-none"
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat]}
              </option>
            ))}
          </select>
        </div>
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="pengaduan-desc" className="form-label">
          Isi Pengaduan *
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <textarea
            id="pengaduan-desc"
            {...register("description")}
            rows={5}
            placeholder="Jelaskan pengaduan Anda secara detail: apa, di mana, kapan, dan siapa yang terlibat..."
            className="form-input pl-10 resize-none"
          />
        </div>
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        id="pengaduan-submit-btn"
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Mengirim Pengaduan...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Kirim Pengaduan
          </>
        )}
      </button>
    </form>
  );
}
