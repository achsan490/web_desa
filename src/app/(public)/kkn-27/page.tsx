import type { Metadata } from "next";
import Image from "next/image";
import { Award, BookOpen, Calendar, GraduationCap, Heart, Mail, MapPin, MessageCircle, Phone, Search, Users } from "lucide-react";
import KKNClientPage from "@/components/public/KKNClientPage";

export const metadata: Metadata = {
  title: "Kelompok 27 KKN UNWAHA Angkatan 2026",
  description:
    "Profil Dosen Pembimbing Lapangan (DPL) dan seluruh anggota Kelompok 27 KKN Angkatan 2026 Universitas KH. A. Wahab Hasbullah Jombang di Desa Pojok Klitih.",
};

export interface KKNMember {
  nim: string;
  name: string;
  gender: "Laki-laki" | "Perempuan";
  major: string;
  role?: string;
  imageUrl?: string;
}

const dpl = {
  name: "Fitri Umardiyah, M. Pd.",
  role: "Dosen Pembimbing Lapangan (DPL)",
  university: "Universitas KH. A. Wahab Hasbullah (UNWAHA)",
  whatsapp: "6285730403338",
  imageUrl: "", // Kosongkan agar menggunakan avatar inisial default yang estetik
};

const members: KKNMember[] = [
  { nim: "2301012961", name: "ANANDA NURIA HALIZA PUTRI", gender: "Perempuan", major: "Pendidikan Agama Islam" },
  { nim: "2301012981", name: "ARIEJ MASHITOH AL BANY", gender: "Perempuan", major: "Pendidikan Agama Islam" },
  { nim: "2301013028", name: "SERLINA MAGFIROH", gender: "Perempuan", major: "Pendidikan Agama Islam" },
  { nim: "2301013076", name: "A'A KAFABIHI DZULQORNAIN", gender: "Laki-laki", major: "Pendidikan Agama Islam" },
  { nim: "2301013108", name: "DIMAS EKA PRASETYO", gender: "Laki-laki", major: "Pendidikan Agama Islam" },
  { nim: "2301013118", name: "NADIA RAMA DIWANTI", gender: "Perempuan", major: "Pendidikan Agama Islam" },
  { nim: "2301013182", name: "MOH. THOILUN NI'AM", gender: "Laki-laki", major: "Pendidikan Agama Islam" },
  { nim: "2301021002", name: "MURNI", gender: "Perempuan", major: "Pendidikan Bahasa Arab" },
  { nim: "2301290363", name: "TYAS ARTIKA ANGGRAINI", gender: "Perempuan", major: "Ekonomi Syariah" },
  { nim: "2301290376", name: "MOHAMAD YUSRIL BAIHAQI", gender: "Laki-laki", major: "Ekonomi Syariah" },
  { nim: "2302041163", name: "SALMAN ALFARIDHO FARDIANSYAH", gender: "Laki-laki", major: "Informatika" },
  { nim: "2202041078", name: "M. ACHSANUL KHULUQ IZZULCHAQ", gender: "Laki-laki", major: "Informatika", role: "Developer Website" },
  { nim: "2302050817", name: "YOGI BACHTIAR", gender: "Laki-laki", major: "Sistem Informasi" },
  { nim: "2302050834", name: "ALMA NUR KURNIAWAN", gender: "Laki-laki", major: "Sistem Informasi" },
  { nim: "2303070212", name: "HAKIKI RAMADHAN", gender: "Laki-laki", major: "Agroekoteknologi" },
  { nim: "2304100179", name: "LAILATUL MUFIDAH", gender: "Perempuan", major: "Pendidikan Biologi" },
  { nim: "2304130230", name: "KIA SALUNG SHAFA", gender: "Perempuan", major: "Pendidikan Bahasa Inggris" },
  { nim: "2305140670", name: "AKHLIS BUDIANTO", gender: "Laki-laki", major: "Manajemen" },
  { nim: "2305140682", name: "NADYA HUSNUL KHOTIMAH", gender: "Perempuan", major: "Manajemen" },
  { nim: "2305140704", name: "DIVA NUGRAHANI", gender: "Perempuan", major: "Manajemen" },
  { nim: "2305140736", name: "ARINDA ISLAMIYAH", gender: "Perempuan", major: "Manajemen" },
  { nim: "2305140737", name: "MUKHAMMAD DANU ARTA", gender: "Laki-laki", major: "Manajemen" },
];

export default function KKN27Page() {
  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-80 md:h-[400px] overflow-hidden">
        <Image
          src="/images/gambar1.jpg"
          alt="KKN Kelompok 27 UNWAHA"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 mb-4 backdrop-blur-md">
              <Users className="w-3.5 h-3.5" /> Kuliah Kerja Nyata (KKN)
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Kelompok 27 KKN UNWAHA 2026
            </h1>
            <p className="text-gray-300 mt-3 text-sm md:text-lg max-w-2xl mx-auto font-light">
              Mengabdi dengan Hati, Membangun Desa Pojok Klitih Melalui Inovasi Digital dan Kolaborasi Kemasyarakatan.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Lokasi Pengabdian</p>
              <p className="font-bold text-gray-800 text-sm">Desa Pojok Klitih, Jombang</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Asal Universitas</p>
              <p className="font-bold text-gray-800 text-sm">UNWAHA Jombang</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Jumlah Anggota</p>
              <p className="font-bold text-gray-800 text-sm">22 Mahasiswa (11 L/11 P)</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Status Batch KKN</p>
              <p className="font-bold text-gray-800 text-sm">Published — 30 Juni 2026</p>
            </div>
          </div>
        </div>

        {/* DPL Card */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">Dosen Pembimbing Lapangan</span>
            <h2 className="text-2xl font-black text-gray-900 mt-1">Pembimbing KKN</h2>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Initials Avatar for DPL */}
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-md border border-white/20">
                FU
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3">
                  {dpl.role}
                </span>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">{dpl.name}</h3>
                <p className="text-emerald-600 font-semibold mt-1 text-sm">{dpl.university}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                  <a
                    href={`https://wa.me/${dpl.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat WhatsApp
                  </a>
                  <a
                    href={`tel:${dpl.whatsapp}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors border border-gray-200"
                  >
                    <Phone className="w-4 h-4" />
                    Hubungi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client interactive member section with Search and filter capability */}
        <KKNClientPage initialMembers={members} />

        {/* Program Kerja Section */}
        <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl mt-16">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-16 translate-y-16 select-none pointer-events-none">
            <Award className="w-96 h-96" />
          </div>
          <div className="relative z-10">
            <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">Program Kerja Utama</span>
            <h2 className="text-2xl md:text-4xl font-extrabold mt-1 mb-10">Fokus Pengabdian Kelompok 27</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white">Digitalisasi Desa</h3>
                <p className="text-emerald-100/80 text-sm leading-relaxed">
                  Pembuatan website resmi Desa Pojok Klitih yang memfasilitasi publikasi informasi desa, pengaduan masyarakat, serta otomatisasi surat pelayanan warga.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white">Pengembangan UMKM</h3>
                <p className="text-emerald-100/80 text-sm leading-relaxed">
                  Membantu pendampingan pemasaran dan perancangan kemasan produk UMKM lokal agar memiliki daya saing yang tinggi di era digital.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white">Pemberdayaan Masyarakat</h3>
                <p className="text-emerald-100/80 text-sm leading-relaxed">
                  Sosialisasi pengelolaan kebersihan lingkungan hidup secara berkelanjutan dan optimalisasi keterlibatan aktif pemuda desa Pojok Klitih.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
