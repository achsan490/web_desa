"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  History,
  Eye,
  Target,
  Users,
  Map,
  Layers,
  GraduationCap,
  Building2,
  HeartPulse,
  Heart,
  Milestone,
  Mountain,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Ganti ID Video TikTok Anda di bawah ini
const TIKTOK_VIDEO_ID = "7659560744521878791"; // ID Video TikTok Kelompok 27


type Profile = {
  id: string;
  history: string;
  vision: string;
  mission: string;
  kepalaName: string;
  kepalaImage: string | null;
  kepalaQuote: string | null;
  address: string;
  phone: string | null;
  email: string | null;
};

type OrgMember = {
  id: string;
  name: string;
  position: string;
  image: string | null;
  phone: string | null;
  order: number;
};

const tabs = [
  { id: "sejarah", label: "Profil & Sejarah", icon: History },
  { id: "visi-misi", label: "Visi & Misi", icon: Eye },
  { id: "struktur", label: "Struktur Organisasi", icon: Users },
  { id: "wilayah", label: "Wilayah & Lingkungan", icon: Map },
  { id: "sarana", label: "Sarana & Prasarana", icon: Layers },
];

export default function ProfilTabs({
  profile,
  org,
}: {
  profile: Profile;
  org: OrgMember[];
}) {
  const [activeTab, setActiveTab] = useState("sejarah");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="container-custom section-padding">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-10 bg-gray-100 rounded-2xl p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 flex-1 justify-center",
              activeTab === tab.id
                ? "bg-white text-emerald-700 shadow-sm font-semibold"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "sejarah" && (
          <motion.div
            key="sejarah"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start"
          >
            <div className="lg:col-span-3 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  Tentang & Sejarah <span className="gradient-text">Desa Pojok Klitih</span>
                </h2>
                <div className="prose prose-gray max-w-none text-gray-650 leading-relaxed space-y-4">
                  {profile.history.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Video Sejarah Desa (Opsi A: Kolom Kiri) */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                  <Play className="h-5 w-5 text-emerald-600 fill-emerald-600/10" />
                  Video Dokumenter Sejarah Desa
                </h3>
                
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-950 group">
                  <video
                    ref={videoRef}
                    src="/videos/sejarah-desa.mp4"
                    poster="/images/gambar1.jpg"
                    className="w-full h-full object-cover"
                    controls={isPlaying}
                    onPlay={() => setIsPlaying(true)}
                    onPause={handlePause}
                    onEnded={handlePause}
                  />
                  
                  {!isPlaying && (
                    <button
                      onClick={handlePlay}
                      className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 z-10 text-left bg-gradient-to-t from-black/85 via-black/35 to-transparent group-hover:from-black/90 transition-all duration-300"
                    >
                      {/* Top Badge */}
                      <div className="self-start bg-emerald-650/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        Video Dokumenter
                      </div>

                      {/* Center Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                          <Play className="h-8 w-8 ml-1 fill-current" />
                        </div>
                      </div>

                      {/* Bottom Title & Description */}
                      <div className="space-y-1">
                        <p className="text-white font-bold text-base md:text-lg line-clamp-1 group-hover:text-emerald-300 transition-colors">
                          Sejarah Desa Pojok Klitih
                        </p>
                        <p className="text-gray-300 text-xs font-medium">
                          Klik untuk memutar video lokal
                        </p>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Motto Desa */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-2xl">
                <h3 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-1">Motto Desa</h3>
                <p className="text-amber-850 font-semibold italic text-lg leading-relaxed">
                  &ldquo;Bersama Membangun Desa yang Maju, Mandiri, Sejahtera, dan Berbudaya.&rdquo;
                </p>
              </div>

              {/* Kondisi Sosial */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Kondisi Sosial Masyarakat
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  {[
                    "Budaya gotong royong yang tinggi.",
                    "Kehidupan masyarakat yang harmonis.",
                    "Tradisi keagamaan yang masih terjaga.",
                    "Partisipasi aktif dalam kegiatan kemasyarakatan.",
                    "Kepedulian terhadap pembangunan desa."
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">
                {/* Kantor Desa / Balai Desa */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-white/50 border border-emerald-200">
                    <Image
                      src="/images/gambar3.jpg"
                      alt="Balai Desa Pojok Klitih"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-bold text-gray-900">Kantor Balai Desa</h3>
                  <p className="text-emerald-600 text-sm font-medium">Pemerintah Desa Pojok Klitih</p>
                  <p className="text-gray-600 text-sm mt-3 italic leading-relaxed">
                    &ldquo;Bersama Membangun Desa yang Maju, Mandiri, Sejahtera, dan Berbudaya.&rdquo;
                  </p>
                </div>

                {/* Info Desa */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Informasi Desa</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex gap-2"><span className="font-medium w-24 flex-shrink-0">Alamat:</span><span>{profile.address}</span></div>
                    <div className="flex gap-2"><span className="font-medium w-24 flex-shrink-0">Email:</span><span>{profile.email}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "visi-misi" && (
          <motion.div
            key="visi-misi"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {/* Visi */}
            <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-8 mb-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
                  <Eye className="h-3.5 w-3.5" />
                  Visi
                </div>
                <h2 className="text-2xl md:text-3xl font-black leading-tight">
                  {profile.vision}
                </h2>
              </div>
            </div>

            {/* Misi */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 text-sm font-medium text-amber-700 mb-6">
                <Target className="h-3.5 w-3.5" />
                Misi
              </div>
              <div className="space-y-4">
                {profile.mission.split("\n").filter(Boolean).map((m, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {m.replace(/^\d+\.\s*/, "")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "struktur" && (
          <motion.div
            key="struktur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">
              Struktur <span className="gradient-text">Organisasi Desa</span>
            </h2>
            {/* Kepala Desa (featured) */}
            {org.slice(0, 1).map((m) => (
              <div key={m.id} className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white text-center w-64 shadow-xl">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden mx-auto mb-4">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center text-2xl font-black">
                        {m.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-lg">{m.name}</p>
                  <p className="text-emerald-200 text-sm mt-1">{m.position}</p>
                  {m.phone && <p className="text-emerald-300 text-xs mt-2">{m.phone}</p>}
                </div>
              </div>
            ))}
            {/* Rest of org */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {org.slice(1).map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                        {m.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{m.name}</p>
                    <p className="text-emerald-600 text-xs font-medium">{m.position}</p>
                    {m.phone && <p className="text-gray-400 text-xs">{m.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "wilayah" && (
          <motion.div
            key="wilayah"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            <h2 className="text-2xl font-black text-gray-900 text-center">
              Wilayah & <span className="gradient-text">Kondisi Lingkungan</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profil Wilayah */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Map className="h-5 w-5 text-emerald-600" />
                  Profil Wilayah
                </h3>
                <div className="space-y-2.5 text-xs text-gray-650">
                  {[
                    { label: "Nama Desa", value: "Desa Pojok Klitih" },
                    { label: "Kecamatan", value: "Plandaan" },
                    { label: "Kabupaten", value: "Jombang" },
                    { label: "Provinsi", value: "Jawa Timur" },
                    { label: "Negara", value: "Indonesia" },
                    { label: "Kode Pos", value: "61456" },
                    { label: "Karakter Wilayah", value: "Pedesaan / Agraris" },
                    { label: "Topografi", value: "Dataran Rendah" },
                    { label: "Ketinggian", value: "±44 mdpl" },
                    { label: "Luas Kecamatan", value: "96,79 km²" },
                    { label: "Jumlah Desa", value: "13 desa di Kecamatan" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500 font-medium">{item.label}</span>
                      <span className="font-semibold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Batas Wilayah */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-emerald-600" />
                    Batas Wilayah
                  </h3>
                  <div className="space-y-3 text-xs mb-6">
                    {[
                      { label: "Utara", value: "Kabupaten Bojonegoro" },
                      { label: "Selatan", value: "Kecamatan Megaluh" },
                      { label: "Timur", value: "Kecamatan Ploso" },
                      { label: "Barat", value: "Kabupaten Nganjuk" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500 font-medium">{item.label}</span>
                        <span className="font-semibold text-emerald-700">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-bold text-gray-900 mb-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-emerald-600" />
                    Kondisi Lingkungan
                  </h3>
                  <ul className="space-y-1.5 text-xs text-gray-600 list-disc list-inside">
                    <li>Lahan pertanian yang luas</li>
                    <li>Area perkebunan rakyat</li>
                    <li>Permukiman pedesaan</li>
                    <li>Saluran irigasi pertanian</li>
                    <li>Potensi konservasi alam</li>
                  </ul>
                </div>
              </div>

              {/* Peta Wilayah */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Map className="h-5 w-5 text-emerald-600" />
                    Peta Administrasi
                  </h3>
                  <div className="relative w-full aspect-square max-h-52 rounded-xl overflow-hidden mb-3 border border-gray-100 bg-gray-50">
                    <Image
                      src="/images/gambar4.jpg"
                      alt="Peta Administrasi Jombang Plandaan"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 italic text-center leading-normal">
                    Peta Kecamatan Plandaan, Kabupaten Jombang
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Iframe */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-950 text-sm mb-4">Peta Lokasi Interaktif</h3>
              <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-150">
                <iframe
                  src="https://maps.google.com/maps?q=Klitih,%20Plandaan,%20Jombang&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Desa Pojok Klitih"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "sarana" && (
          <motion.div
            key="sarana"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            <h2 className="text-2xl font-black text-gray-900 text-center">
              Sarana & <span className="gradient-text">Prasarana Desa</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pemerintahan */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-base">Sarana Pemerintahan</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>Kantor Desa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>Balai Pertemuan Desa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>Pos Kamling</span>
                  </li>
                </ul>
              </div>

              {/* Pendidikan */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-base">Pendidikan & Sekolah</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>PAUD / TK</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>Sekolah Dasar (SD) / MI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>Sekolah Menengah Pertama (SMP)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>Pondok Pesantren</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>Lembaga Pendidikan Nonformal</span>
                  </li>
                </ul>
              </div>

              {/* Kesehatan */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-base">Sarana Kesehatan</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span>Posyandu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span>Poskesdes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span>Puskesmas Kecamatan Plandaan</span>
                  </li>
                </ul>
              </div>

              {/* Keagamaan */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-base">Sarana Keagamaan</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span>Masjid</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span>Mushola</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span>Madrasah Diniyah</span>
                  </li>
                </ul>
              </div>

              {/* Infrastruktur */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-2 lg:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Milestone className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-base">Sarana Infrastruktur</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    <span>Jalan desa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    <span>Jalan lingkungan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    <span>Jembatan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    <span>Saluran irigasi pertanian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    <span>Lampu penerangan jalan</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
