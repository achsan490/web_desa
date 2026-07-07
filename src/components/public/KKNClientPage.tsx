"use client";

import { useState } from "react";
import { Search, Users, GraduationCap, ArrowRight } from "lucide-react";
import Image from "next/image";
import { KKNMember } from "@/app/(public)/kkn-27/page";

interface KKNClientPageProps {
  initialMembers: KKNMember[];
}

export default function KKNClientPage({ initialMembers }: KKNClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("Semua");

  // Format ALL CAPS names to Title Case for better visual presentation
  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get initials for the placeholder avatar (max 2 characters)
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0] ? parts[0][0].toUpperCase() : "?";
  };

  // Extract unique majors for the filter dropdown/chips
  const uniqueMajors = [
    "Semua",
    ...Array.from(new Set(initialMembers.map((m) => m.major))),
  ];

  // Filter members based on search query and selected major
  const filteredMembers = initialMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.nim.includes(searchQuery);
    const matchesMajor = selectedMajor === "Semua" || member.major === selectedMajor;
    return matchesSearch && matchesMajor;
  });

  return (
    <div className="mb-20">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">Daftar Anggota</span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">Daftar Anggota Tim</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Menampilkan {filteredMembers.length} dari {initialMembers.length} Mahasiswa KKN
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Major Filter */}
          <div className="relative w-full sm:w-56">
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              {uniqueMajors.map((major) => (
                <option key={major} value={major}>
                  {major === "Semua" ? "Semua Program Studi" : major}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.nim}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/3] w-full bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 300px) 100vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  // Custom initials avatar with gradient based on gender
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold shadow-inner border border-white/20 select-none group-hover:scale-105 transition-transform duration-500 ${
                      member.gender === "Laki-laki"
                        ? "bg-gradient-to-tr from-sky-400 to-emerald-600"
                        : "bg-gradient-to-tr from-rose-400 to-indigo-600"
                    }`}
                  >
                    {getInitials(member.name)}
                  </div>
                )}
                
                {/* Gender Indicator Badge */}
                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border ${
                    member.gender === "Laki-laki"
                      ? "bg-sky-500/10 text-sky-600 border-sky-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}
                >
                  {member.gender}
                </span>
                
                {/* Custom Role Badge if exists */}
                {member.role && (
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-sm border border-amber-400">
                    {member.role}
                  </span>
                )}
              </div>

              {/* Detail Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-600 transition-colors">
                    {formatName(member.name)}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">NIM. {member.nim}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-gray-500 text-xs">
                  <GraduationCap className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{member.major}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Anggota Tidak Ditemukan</h3>
          <p className="text-gray-500 text-sm">
            Tidak ada anggota kelompok yang cocok dengan pencarian atau filter Anda.
          </p>
        </div>
      )}
    </div>
  );
}
