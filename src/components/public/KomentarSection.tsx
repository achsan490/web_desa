"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MessageSquare, Send, User, Mail, ThumbsUp } from "lucide-react";
import { formatDateRelative } from "@/lib/utils";

const commentSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  content: z.string().min(10, "Komentar minimal 10 karakter"),
});

type CommentForm = z.infer<typeof commentSchema>;

type Comment = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
};

export default function KomentarSection({
  newsId,
  comments,
}: {
  newsId: string;
  comments: Comment[];
}) {
  const [localComments, setLocalComments] = useState(comments);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentForm) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/komentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, newsId }),
      });
      if (res.ok) {
        toast.success(
          "Komentar berhasil dikirim! Menunggu persetujuan admin."
        );
        reset();
      } else {
        toast.error("Gagal mengirim komentar. Coba lagi.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-emerald-600" />
        Komentar ({localComments.length})
      </h3>

      {/* Comment List */}
      {localComments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {localComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {comment.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDateRelative(comment.createdAt)}
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8 mb-8 bg-gray-50 rounded-2xl">
          <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-2" />
          <p className="text-sm">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      )}

      {/* Comment Form */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-5">Tinggalkan Komentar</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="comment-name" className="form-label">
                Nama *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="comment-name"
                  {...register("name")}
                  placeholder="Nama Anda"
                  className="form-input pl-10"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="comment-email" className="form-label">
                Email (opsional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="comment-email"
                  {...register("email")}
                  placeholder="email@contoh.com"
                  className="form-input pl-10"
                  type="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="comment-content" className="form-label">
              Komentar *
            </label>
            <textarea
              id="comment-content"
              {...register("content")}
              placeholder="Tulis komentar Anda di sini..."
              rows={4}
              className="form-input resize-none"
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            id="comment-submit-btn"
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Kirim Komentar
              </>
            )}
          </button>
          <p className="text-xs text-gray-400">
            * Komentar akan tampil setelah disetujui oleh admin.
          </p>
        </form>
      </div>
    </div>
  );
}
