"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  subject: z.string().min(5, "Subjek minimal 5 karakter"),
  message: z.string().min(20, "Pesan minimal 20 karakter"),
});

type FormData = z.infer<typeof schema>;

export default function KontakForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
    toast.success("Pesan berhasil dikirim! Kami akan merespons dalam 1-2 hari kerja.");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Pesan Terkirim!</h3>
        <p className="text-gray-500">Terima kasih. Kami akan merespons pesan Anda segera.</p>
        <button onClick={() => setSent(false)} className="btn-secondary mt-5">
          Kirim Pesan Lagi
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="kontak-name" className="form-label">Nama *</label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input id="kontak-name" {...register("name")} placeholder="Nama Anda" className="form-input pl-10" />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="kontak-email" className="form-label">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input id="kontak-email" {...register("email")} type="email" placeholder="email@contoh.com" className="form-input pl-10" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="kontak-subject" className="form-label">Subjek *</label>
        <input id="kontak-subject" {...register("subject")} placeholder="Subjek pesan" className="form-input" />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
      </div>
      <div>
        <label htmlFor="kontak-message" className="form-label">Pesan *</label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <textarea id="kontak-message" {...register("message")} rows={4} placeholder="Tulis pesan Anda..." className="form-input pl-10 resize-none" />
        </div>
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} id="kontak-submit-btn" className="btn-primary w-full disabled:opacity-50">
        {isSubmitting ? <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</> : <><Send className="h-4 w-4" /> Kirim Pesan</>}
      </button>
    </form>
  );
}
