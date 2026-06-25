"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, Loader } from "lucide-react";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah. Silakan coba lagi.");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30 overflow-hidden relative border border-emerald-100/50">
              <Image
                src="/logo.png"
                alt="Logo Desa"
                width={64}
                height={64}
                className="object-contain p-1.5"
              />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">
              Admin Panel
            </h1>
            <p className="text-gray-500 text-sm">Desa Sukamaju · Masuk ke akun Anda</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-5">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="form-label">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="admin-email"
                  {...register("email")}
                  type="email"
                  placeholder="admin@desasukamaju.id"
                  className="form-input pl-10"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="admin-password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="admin-password"
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="form-input pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Masuk ke Dashboard
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              🔑 Demo Login:
            </p>
            <div className="space-y-1 text-xs text-gray-500 font-mono">
              <p>admin@desasukamaju.id / admin123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-emerald-200/60 mt-6">
          © {new Date().getFullYear()} Pemerintah Desa Sukamaju
        </p>
      </div>
    </div>
  );
}
