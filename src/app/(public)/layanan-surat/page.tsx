import type { Metadata } from "next";
import SuratForm from "@/components/public/SuratForm";
import SuratTracking from "@/components/public/SuratTracking";
import { LETTER_TYPES } from "@/lib/utils";
import { FileText, Clock, Download, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Layanan Surat Online",
  description:
    "Ajukan permohonan surat keterangan desa secara online. Surat domisili, usaha, tidak mampu, pengantar nikah, kelahiran, dan kematian.",
};

export default function LayananSuratPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Layanan Surat Online
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl">
            Ajukan surat keterangan desa dari mana saja, kapan saja. Tanpa
            perlu antri di kantor desa.
          </p>
        </div>
      </div>

      <div className="container-custom section-padding">
        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: FileText, title: "6 Jenis Surat", desc: "Berbagai jenis surat tersedia", color: "bg-emerald-100 text-emerald-600" },
            { icon: Clock, title: "1-3 Hari Kerja", desc: "Surat selesai diproses", color: "bg-blue-100 text-blue-600" },
            { icon: Download, title: "Download PDF", desc: "Unduh surat langsung online", color: "bg-amber-100 text-amber-600" },
            { icon: Shield, title: "Data Aman", desc: "Informasi terjaga keamanannya", color: "bg-purple-100 text-purple-600" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3`}>
                <item.icon className="h-6 w-6" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Jenis Surat */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Jenis Surat yang Tersedia</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LETTER_TYPES.map((type) => (
              <div key={type.value} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Form Permohonan Surat
              </h2>
              <SuratForm />
            </div>
          </div>

          {/* Tracking */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Cek Status Permohonan
              </h2>
              <SuratTracking />
            </div>

            {/* Syarat */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-bold text-amber-800 mb-3 text-sm">📋 Syarat & Ketentuan</h3>
              <ul className="space-y-1.5 text-sm text-amber-700">
                <li>• Pemohon adalah warga Desa Sukamaju</li>
                <li>• Melampirkan fotokopi KTP</li>
                <li>• Data diisi dengan benar dan lengkap</li>
                <li>• Surat diambil di kantor desa atau diunduh PDF</li>
                <li>• Gratis / tidak dipungut biaya</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
