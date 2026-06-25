"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  History,
  Eye,
  Target,
  Users,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  { id: "sejarah", label: "Sejarah Desa", icon: History },
  { id: "visi-misi", label: "Visi & Misi", icon: Eye },
  { id: "struktur", label: "Struktur Organisasi", icon: Users },
  { id: "wilayah", label: "Data Wilayah", icon: Map },
];

export default function ProfilTabs({
  profile,
  org,
}: {
  profile: Profile;
  org: OrgMember[];
}) {
  const [activeTab, setActiveTab] = useState("sejarah");

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
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Sejarah <span className="gradient-text">Desa Sukamaju</span>
              </h2>
              <div className="prose prose-gray max-w-none">
                {profile.history.split("\n\n").map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">
                {/* Kepala Desa */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 max-h-64">
                    <Image
                      src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&q=80"
                      alt={profile.kepalaName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900">{profile.kepalaName}</h3>
                  <p className="text-emerald-600 text-sm font-medium">Kepala Desa</p>
                  {profile.kepalaQuote && (
                    <p className="text-gray-600 text-sm mt-3 italic leading-relaxed">
                      &ldquo;{profile.kepalaQuote}&rdquo;
                    </p>
                  )}
                </div>

                {/* Info Desa */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Informasi Desa</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex gap-2"><span className="font-medium w-24 flex-shrink-0">Alamat:</span><span>{profile.address}</span></div>
                    {profile.phone && <div className="flex gap-2"><span className="font-medium w-24 flex-shrink-0">Telepon:</span><span>{profile.phone}</span></div>}
                    {profile.email && <div className="flex gap-2"><span className="font-medium w-24 flex-shrink-0">Email:</span><span>{profile.email}</span></div>}
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
                  <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4 text-2xl font-black">
                    {m.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
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
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
                    {m.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
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
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">
              Data <span className="gradient-text">Wilayah Desa</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Luas Wilayah", value: "234.5 Ha" },
                { label: "Ketinggian dari Laut", value: "320 mdpl" },
                { label: "Jumlah Dusun", value: "2 Dusun" },
                { label: "Jumlah RW", value: "6 RW" },
                { label: "Jumlah RT", value: "24 RT" },
                { label: "Batas Utara", value: "Desa Ciawi" },
                { label: "Batas Selatan", value: "Desa Bojong" },
                { label: "Batas Barat", value: "Desa Bendungan" },
                { label: "Batas Timur", value: "Desa Banjarsari" },
                { label: "Orbitasi Kecamatan", value: "3 km" },
                { label: "Orbitasi Kabupaten", value: "45 km" },
                { label: "Orbitasi Provinsi", value: "85 km" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                >
                  <span className="text-gray-600 text-sm">{item.label}</span>
                  <span className="font-semibold text-emerald-700 text-sm">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
