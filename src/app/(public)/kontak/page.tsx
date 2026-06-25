import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Globe } from "lucide-react";
import KontakForm from "@/components/public/KontakForm";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Desa Sukamaju. Alamat, nomor telepon, email, dan media sosial kami.",
};

export default function KontakPage() {
  return (
    <div className="pt-20">
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Hubungi Kami</h1>
          <p className="text-emerald-200 text-lg">Kami siap membantu Anda</p>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: "Alamat Kantor",
                content: "Jl. Raya Sukamaju No. 1\nKecamatan Ciawi, Kabupaten Bogor\nJawa Barat 16730",
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                icon: Phone,
                title: "Telepon & WhatsApp",
                content: "(0251) 123456\nWA: 0812-3456-7890",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Mail,
                title: "Email",
                content: "desasukamaju@gmail.com",
                color: "bg-amber-100 text-amber-600",
              },
              {
                icon: Clock,
                title: "Jam Pelayanan",
                content: "Senin – Jumat: 08.00 – 16.00 WIB\nSabtu: 08.00 – 12.00 WIB\nMinggu & Libur: Tutup",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: Globe,
                title: "Media Sosial",
                content: "Facebook: @desasukamaju\nInstagram: @desasukamaju\nYouTube: Desa Sukamaju Official",
                color: "bg-pink-100 text-pink-600",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-gray-500 text-sm whitespace-pre-line">{item.content}</p>
                </div>
              </div>
            ))}

            {/* WA CTA */}
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
            >
              <MessageCircle className="h-5 w-5 fill-white" />
              Chat WhatsApp Sekarang
            </a>
          </div>

          {/* Form + Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="h-64 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.2!2d106.85!3d-6.627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzYnMzguNyJTIDEwNsKwNTEnMC4wIkU!5e0!3m2!1sid!2sid!4v1234567890"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Lokasi Desa Sukamaju"
              />
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Kirim Pesan</h2>
              <KontakForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
