"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  User, CreditCard, MapPin, Phone, Mail, FileText, Send, CheckCircle, Ticket,
} from "lucide-react";
import { LETTER_TYPES } from "@/lib/utils";

const schema = z.object({
  type: z.string().min(1, "Pilih jenis surat"),
  applicantName: z.string().min(2, "Nama minimal 2 karakter"),
  nik: z.string().length(16, "NIK harus 16 digit"),
  birthPlace: z.string().optional(),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  phone: z.string().min(10, "Nomor HP minimal 10 digit"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  purpose: z.string().min(5, "Keperluan minimal 5 karakter"),
});

type FormData = z.infer<typeof schema>;

export default function SuratForm() {
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
      const res = await fetch("/api/surat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setTicketNumber(result.ticketNumber);
        reset();
      } else {
        toast.error("Gagal mengirim permohonan. Silakan coba lagi.");
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
          Permohonan Berhasil Dikirim!
        </h3>
        <p className="text-gray-600 mb-6">
          Surat Anda sedang diproses. Estimasi selesai 1-3 hari kerja.
        </p>
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 inline-block mb-6">
          <p className="text-sm text-gray-500 mb-1">Nomor Tiket Permohonan</p>
          <p className="text-2xl font-black text-emerald-700 tracking-wider flex items-center gap-2 justify-center">
            <Ticket className="h-6 w-6" />
            {ticketNumber}
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Simpan nomor tiket ini untuk mengecek status permohonan Anda.
        </p>
        <button onClick={() => setTicketNumber(null)} className="btn-secondary">
          Ajukan Surat Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Jenis Surat */}
      <div>
        <label htmlFor="surat-type" className="form-label">Jenis Surat *</label>
        <div className="relative">
          <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <select id="surat-type" {...register("type")} className="form-input pl-10 appearance-none">
            <option value="">-- Pilih Jenis Surat --</option>
            {LETTER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
      </div>

      {/* Nama & NIK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="surat-name" className="form-label">Nama Lengkap *</label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input id="surat-name" {...register("applicantName")} placeholder="Nama sesuai KTP" className="form-input pl-10" />
          </div>
          {errors.applicantName && <p className="text-red-500 text-xs mt-1">{errors.applicantName.message}</p>}
        </div>
        <div>
          <label htmlFor="surat-nik" className="form-label">NIK *</label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input id="surat-nik" {...register("nik")} placeholder="16 digit NIK" maxLength={16} className="form-input pl-10" />
          </div>
          {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik.message}</p>}
        </div>
      </div>

      {/* Tempat Lahir & Alamat */}
      <div>
        <label htmlFor="surat-birthplace" className="form-label">Tempat Lahir (opsional)</label>
        <input id="surat-birthplace" {...register("birthPlace")} placeholder="Kota tempat lahir" className="form-input" />
      </div>
      <div>
        <label htmlFor="surat-address" className="form-label">Alamat Lengkap *</label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <textarea id="surat-address" {...register("address")} rows={2} placeholder="Alamat lengkap sesuai KTP" className="form-input pl-10 resize-none" />
        </div>
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="surat-phone" className="form-label">Nomor HP *</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input id="surat-phone" {...register("phone")} placeholder="08xxxxxxxxxx" className="form-input pl-10" />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="surat-email" className="form-label">Email (opsional)</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input id="surat-email" {...register("email")} type="email" placeholder="email@contoh.com" className="form-input pl-10" />
          </div>
        </div>
      </div>

      {/* Keperluan */}
      <div>
        <label htmlFor="surat-purpose" className="form-label">Keperluan *</label>
        <textarea id="surat-purpose" {...register("purpose")} rows={3} placeholder="Jelaskan keperluan pengajuan surat ini..." className="form-input resize-none" />
        {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} id="surat-submit-btn" className="btn-primary w-full disabled:opacity-50">
        {isSubmitting ? (
          <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
        ) : (
          <><Send className="h-4 w-4" /> Kirim Permohonan</>
        )}
      </button>
    </form>
  );
}
