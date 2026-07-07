import type { Metadata } from "next";
import Image from "next/image";
import { Award, BookOpen, Calendar, GraduationCap, Heart, Instagram, Linkedin, Mail, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelompok 27 KKN Angkatan 2026",
  description:
    "Profil Dosen Pembimbing Lapangan (DPL) dan seluruh anggota Kelompok 27 KKN Angkatan 2026 Universitas yang bertugas di Desa Pojok Klitih.",
};

interface Member {
  name: string;
  role: string;
  major: string;
  imageUrl: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

const dpl: Member = {
  name: "Dr. H. Ahmad Fauzi, M.T.",
  role: "Dosen Pembimbing Lapangan (DPL)",
  major: "Fakultas Teknik & Ilmu Komputer",
  imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  linkedinUrl: "#",
};

const members: Member[] = [
  {
    name: "Rian Hidayat",
    role: "Ketua Kelompok",
    major: "S1 Teknik Informatika",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    instagramUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Siti Aminah",
    role: "Sekretaris",
    major: "S1 Administrasi Publik",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    instagramUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Dewi Lestari",
    role: "Bendahara",
    major: "S1 Akuntansi",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    instagramUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Budi Santoso",
    role: "Divisi Program Kerja",
    major: "S1 Agribisnis",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    instagramUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Lani Rahmawati",
    role: "Divisi Humas & Publikasi",
    major: "S1 Ilmu Komunikasi",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    instagramUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Farhan Ramadhan",
    role: "Divisi Perlengkapan",
    major: "S1 Teknik Sipil",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop",
    instagramUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Diana Putri",
    role: "Divisi Kesehatan & Kebersihan",
    major: "S1 Kesehatan Masyarakat",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    instagramUrl: "#",
    linkedinUrl: "#",
  },
];

const programs = [
  {
    title: "Digitalisasi Desa Pojok Klitih",
    description: "Pengembangan website profil desa resmi yang dilengkapi dengan sistem administrasi layanan surat digital secara mandiri dan modul pengaduan warga.",
    icon: BookOpen,
  },
  {
    title: "Branding & Pemasaran UMKM",
    description: "Pendampingan bagi pelaku UMKM di desa mulai dari pembuatan identitas visual produk, packaging menarik, hingga teknik pemasaran digital melalui e-commerce.",
    icon: Award,
  },
  {
    title: "Sosialisasi Sanitasi & Lingkungan",
    description: "Program edukasi dan aksi nyata pemeliharaan kebersihan lingkungan, pemilahan sampah organik & non-organik, serta pentingnya sanitasi yang higienis.",
    icon: Heart,
  },
];

export default function KKN27Page() {
  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="/images/gambar1.jpg"
          alt="KKN Kelompok 27"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4 backdrop-blur-md">
              <Users className="w-3.5 h-3.5" /> Kuliah Kerja Nyata (KKN)
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Kelompok 27 KKN Angkatan 2026
            </h1>
            <p className="text-gray-300 mt-3 text-sm md:text-lg max-w-2xl mx-auto">
              Berdedikasi membangun sinergi digital, memperkuat potensi lokal, dan mengabdi untuk kemajuan Desa Pojok Klitih.
            </p>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="container-custom py-16">
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Mengenal Kelompok 27</h2>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg">
            Kami adalah mahasiswa dari berbagai program studi yang melaksanakan program Kuliah Kerja Nyata (KKN) di Desa Pojok Klitih. Fokus utama pengabdian kami adalah digitalisasi pelayanan desa melalui pengembangan portal web interaktif, pemberdayaan ekonomi masyarakat, serta edukasi kesehatan lingkungan demi terwujudnya Pojok Klitih yang lebih maju dan mandiri.
          </p>
        </div>

        {/* DPL Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase">Dosen Pembimbing Lapangan</span>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Pembimbing KKN</h3>
          </div>
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-center p-6 gap-6">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                <Image
                  src={dpl.imageUrl}
                  alt={dpl.name}
                  fill
                  sizes="(max-width: 120px) 100vw, 120px"
                  className="object-cover"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 mb-2">
                  {dpl.role}
                </span>
                <h4 className="text-lg font-bold text-gray-900 leading-tight">{dpl.name}</h4>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-gray-500 text-sm mt-1">
                  <GraduationCap className="w-4 h-4 flex-shrink-0" />
                  <span>{dpl.major}</span>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                  {dpl.linkedinUrl && (
                    <a
                      href={dpl.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      <Linkedin className="w-4.5 h-4.5" />
                    </a>
                  )}
                  <a
                    href="mailto:#"
                    className="text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    <Mail className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase">Anggota Kelompok</span>
            <h3 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">Susunan Anggota Tim</h3>
            <p className="text-gray-500 mt-2 text-sm md:text-base">Kolaborasi multi-disiplin mahasiswa KKN Kelompok 27</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                {/* Photo container */}
                <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 300px) 100vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex gap-3">
                      {member.instagramUrl && (
                        <a
                          href={member.instagramUrl}
                          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-600 transition-colors"
                          aria-label="Instagram"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-600 transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-2">
                    {member.role}
                  </span>
                  <h4 className="font-bold text-gray-900 text-base leading-tight mb-1">{member.name}</h4>
                  <p className="text-xs text-gray-500">{member.major}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proker Section */}
        <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 select-none">
            <Award className="w-96 h-96" />
          </div>
          <div className="max-w-3xl relative z-10">
            <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Program Kerja Utama</span>
            <h3 className="text-2xl md:text-4xl font-extrabold mt-1 mb-10">Fokus Program Pengabdian</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {programs.map((program, index) => {
                const IconComponent = program.icon;
                return (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-lg text-white leading-tight">{program.title}</h4>
                    <p className="text-emerald-100/80 text-sm leading-relaxed">{program.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
