import type { Metadata } from "next";
import PengaduanForm from "@/components/public/PengaduanForm";
import PengaduanTracking from "@/components/public/PengaduanTracking";
import { Shield, Clock, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pengaduan Masyarakat",
  description:
    "Sampaikan pengaduan Anda kepada pemerintah Desa Pojok Klitih. Kami berkomitmen untuk menangani setiap pengaduan dengan cepat dan profesional.",
};

export default function PengaduanPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Pengaduan Masyarakat
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Kami mendengar Anda. Sampaikan pengaduan untuk membuat Desa
            Pojok Klitih lebih baik.
          </p>
        </div>
      </div>

      <div className="container-custom section-padding">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Shield,
              title: "Aman & Rahasia",
              desc: "Identitas Anda terlindungi dan data dijaga kerahasiaannya",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Clock,
              title: "Respon Cepat",
              desc: "Kami berkomitmen merespons setiap pengaduan dalam 3 hari kerja",
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              icon: CheckCircle,
              title: "Tracking Real-time",
              desc: "Pantau status pengaduan Anda kapan saja dengan nomor tiket",
              color: "bg-amber-50 text-amber-600",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Form Pengaduan
              </h2>
              <PengaduanForm />
            </div>
          </div>

          {/* Tracking */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Cek Status Pengaduan
              </h2>
              <PengaduanTracking />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
