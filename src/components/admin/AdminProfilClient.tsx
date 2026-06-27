"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  Save, Plus, Pencil, Trash2, Phone, MapPin, Mail, 
  Upload, Loader, User, HelpCircle, X, ChevronRight,
  Sparkles, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type VillageProfile = {
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
  whatsapp: string | null;
  latitude: number | null;
  longitude: number | null;
};

type OrganizationMember = {
  id: string;
  name: string;
  position: string;
  image: string | null;
  phone: string | null;
  order: number;
};

interface AdminProfilClientProps {
  initialProfile: VillageProfile;
  initialMembers: OrganizationMember[];
}

export default function AdminProfilClient({ initialProfile, initialMembers }: AdminProfilClientProps) {
  const [activeTab, setActiveTab] = useState<"profil" | "perangkat">("profil");
  
  // Profile States
  const [profile, setProfile] = useState<VillageProfile>(initialProfile);
  const [history, setHistory] = useState(initialProfile.history);
  const [vision, setVision] = useState(initialProfile.vision);
  const [mission, setMission] = useState(initialProfile.mission);
  const [kepalaName, setKepalaName] = useState(initialProfile.kepalaName);
  const [kepalaQuote, setKepalaQuote] = useState(initialProfile.kepalaQuote || "");
  const [kepalaImage, setKepalaImage] = useState(initialProfile.kepalaImage || "");
  const [address, setAddress] = useState(initialProfile.address);
  const [phone, setPhone] = useState(initialProfile.phone || "");
  const [email, setEmail] = useState(initialProfile.email || "");
  const [whatsapp, setWhatsapp] = useState(initialProfile.whatsapp || "");
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingKadesImage, setUploadingKadesImage] = useState(false);

  // Organization (Perangkat Desa) States
  const [members, setMembers] = useState<OrganizationMember[]>(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(null);
  
  // Member Form States
  const [memberName, setMemberName] = useState("");
  const [memberPosition, setMemberPosition] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberImage, setMemberImage] = useState("");
  const [memberOrder, setMemberOrder] = useState(0);
  
  const [savingMember, setSavingMember] = useState(false);
  const [uploadingMemberImage, setUploadingMemberImage] = useState(false);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "kades" | "member") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    if (target === "kades") setUploadingKadesImage(true);
    else setUploadingMemberImage(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      
      if (target === "kades") {
        setKepalaImage(json.url);
        toast.success("Foto Kepala Desa berhasil diunggah!");
      } else {
        setMemberImage(json.url);
        toast.success("Foto Perangkat berhasil diunggah!");
      }
    } catch {
      toast.error("Gagal mengunggah foto. Pastikan Cloudinary terkonfigurasi dengan benar.");
    } finally {
      if (target === "kades") setUploadingKadesImage(false);
      else setUploadingMemberImage(false);
    }
  };

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!history || !vision || !mission || !kepalaName || !address) {
      toast.error("Harap isi semua kolom wajib");
      return;
    }

    setSavingProfile(true);
    const payload = {
      history,
      vision,
      mission,
      kepalaName,
      kepalaQuote: kepalaQuote || null,
      kepalaImage: kepalaImage || null,
      address,
      phone: phone || null,
      email: email || null,
      whatsapp: whatsapp || null,
    };

    try {
      const res = await fetch("/api/admin/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        setProfile(json.profile);
        toast.success("Profil Desa berhasil diperbarui!");
      } else {
        toast.error("Gagal memperbarui profil desa");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Open Add/Edit Modal
  const openAddMemberModal = () => {
    setEditingMember(null);
    setMemberName("");
    setMemberPosition("");
    setMemberPhone("");
    setMemberImage("");
    setMemberOrder(members.length + 1);
    setIsModalOpen(true);
  };

  const openEditMemberModal = (member: OrganizationMember) => {
    setEditingMember(member);
    setMemberName(member.name);
    setMemberPosition(member.position);
    setMemberPhone(member.phone || "");
    setMemberImage(member.image || "");
    setMemberOrder(member.order);
    setIsModalOpen(true);
  };

  // Save/Update Member Handler
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberPosition) {
      toast.error("Nama dan Jabatan wajib diisi");
      return;
    }

    setSavingMember(true);
    const payload = {
      name: memberName,
      position: memberPosition,
      phone: memberPhone || null,
      image: memberImage || null,
      order: Number(memberOrder),
    };

    try {
      if (editingMember) {
        // Edit Mode
        const res = await fetch(`/api/admin/organisasi/${editingMember.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setMembers((prev) =>
            prev
              .map((m) => (m.id === editingMember.id ? json.member : m))
              .sort((a, b) => a.order - b.order)
          );
          toast.success("Data perangkat desa berhasil diperbarui");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal memperbarui perangkat desa");
        }
      } else {
        // Add Mode
        const res = await fetch("/api/admin/organisasi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setMembers((prev) => 
            [...prev, json.member].sort((a, b) => a.order - b.order)
          );
          toast.success("Perangkat desa baru berhasil ditambahkan");
          setIsModalOpen(false);
        } else {
          toast.error("Gagal menambahkan perangkat desa");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSavingMember(false);
    }
  };

  // Delete Member Handler
  const handleDeleteMember = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data perangkat desa ini?")) return;

    try {
      const res = await fetch(`/api/admin/organisasi/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        toast.success("Data perangkat desa berhasil dihapus");
      } else {
        toast.error("Gagal menghapus perangkat desa");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Profil & Perangkat Desa</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data sejarah, visi-misi, foto Kepala Desa, serta anggota Perangkat Desa.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-100 flex gap-4">
        <button
          onClick={() => setActiveTab("profil")}
          className={cn(
            "pb-3 text-sm font-bold border-b-2 transition-all relative px-1",
            activeTab === "profil"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          Profil & Kepala Desa
        </button>
        <button
          onClick={() => setActiveTab("perangkat")}
          className={cn(
            "pb-3 text-sm font-bold border-b-2 transition-all relative px-1",
            activeTab === "perangkat"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          Struktur Perangkat Desa
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "profil" ? (
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Fields */}
          <div className="lg:col-span-2 space-y-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" /> Informasi Utama Desa
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="history" className="form-label font-bold text-gray-700">Sejarah Desa</label>
                <textarea
                  id="history"
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  rows={6}
                  className="form-input text-sm resize-none"
                  placeholder="Ceritakan sejarah berdirinya desa secara lengkap..."
                  required
                />
              </div>

              <div>
                <label htmlFor="vision" className="form-label font-bold text-gray-700">Visi Desa</label>
                <textarea
                  id="vision"
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  rows={2}
                  className="form-input text-sm resize-none"
                  placeholder="Visi pembangunan desa..."
                  required
                />
              </div>

              <div>
                <label htmlFor="mission" className="form-label font-bold text-gray-700">Misi Desa</label>
                <textarea
                  id="mission"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={5}
                  className="form-input text-sm resize-none"
                  placeholder="1. Misi kesatu&#10;2. Misi kedua..."
                  required
                />
              </div>

              <div className="border-t border-gray-50 pt-4">
                <h3 className="font-bold text-gray-900 mb-3">Kontak & Alamat Desa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address" className="form-label">Alamat Kantor Desa</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-input pl-10"
                        placeholder="Jl. Raya Desa No. 1..."
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="form-label">Nomor WhatsApp Desa</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        id="whatsapp"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="form-input pl-10"
                        placeholder="Contoh: 628123456789"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="form-label">Telepon Kantor</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input pl-10"
                        placeholder="Contoh: (0251) 123456"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">Email Desa</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input pl-10"
                        placeholder="kantordesaku@gmail.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kepala Desa Info & Photo */}
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-3 w-full mb-4 flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Foto Kepala Desa
              </h3>
              
              {/* Photo Upload Zone */}
              <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-50 border-2 border-emerald-500/20 mb-4 shadow-inner flex items-center justify-center">
                {kepalaImage ? (
                  <Image
                    src={kepalaImage}
                    alt="Foto Kepala Desa"
                    fill
                    sizes="192px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="h-20 w-20 text-gray-300" />
                )}
                
                {uploadingKadesImage && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                    <Loader className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer transition border border-emerald-200 shadow-sm">
                <Upload className="h-3.5 w-3.5" />
                {uploadingKadesImage ? "Mengunggah..." : "Unggah Foto Kepala Desa"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "kades")}
                  className="hidden"
                  disabled={uploadingKadesImage}
                  title="Pilih gambar kepala desa"
                />
              </label>
              <p className="text-[10px] text-gray-400 mt-2">Format: JPG, PNG, WEBP. Maks 5MB.</p>
              
              <div className="w-full text-left space-y-4 mt-6 border-t border-gray-50 pt-5">
                <div>
                  <label htmlFor="kades-name" className="form-label font-bold">Nama Kepala Desa</label>
                  <input
                    type="text"
                    id="kades-name"
                    value={kepalaName}
                    onChange={(e) => setKepalaName(e.target.value)}
                    className="form-input text-sm"
                    placeholder="Nama lengkap & gelar..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="kades-quote" className="form-label font-bold">Kutipan / Sambutan Singkat</label>
                  <textarea
                    id="kades-quote"
                    value={kepalaQuote}
                    onChange={(e) => setKepalaQuote(e.target.value)}
                    rows={4}
                    className="form-input text-sm resize-none"
                    placeholder="Kalimat motivasi/sambutan hangat dari Kepala Desa..."
                  />
                </div>
              </div>
            </div>

            {/* Form Save Button */}
            <button
              type="submit"
              disabled={savingProfile}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl transition shadow-md disabled:opacity-50"
            >
              {savingProfile ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Simpan Semua Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Perangkat Desa Tab */
        <div className="space-y-5">
          {/* Controls */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900">Struktur Pemerintahan</h3>
              <p className="text-xs text-gray-400 mt-0.5">Daftar perangkat desa yang ditampilkan di halaman profil publik.</p>
            </div>
            <button
              onClick={openAddMemberModal}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> Tambah Perangkat
            </button>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3.5">Urutan</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3.5">Nama Perangkat</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3.5">Jabatan</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3.5">Kontak</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-6 py-3.5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-12">
                        Belum ada data perangkat desa. Klik "Tambah Perangkat" untuk menambahkan.
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-500 font-mono">#{member.order}</span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                            {member.image ? (
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <User className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{member.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-emerald-50 text-emerald-700 rounded-lg px-2.5 py-1 font-semibold">
                            {member.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {member.phone ? (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              <span>{member.phone}</span>
                            </div>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openEditMemberModal(member)}
                              className="admin-action-btn hover:text-emerald-600"
                              title="Edit Perangkat"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id)}
                              className="admin-action-btn hover:text-red-600"
                              title="Hapus Perangkat"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingMember ? "Edit Perangkat Desa" : "Tambah Perangkat Desa"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveMember} className="p-6 space-y-4">
              {/* Image Upload Area */}
              <div className="flex flex-col items-center pb-4 border-b border-gray-50">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-50 border border-gray-200 mb-3 shadow-inner flex items-center justify-center">
                  {memberImage ? (
                    <Image
                      src={memberImage}
                      alt="Foto Perangkat"
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="h-10 w-10 text-gray-300" />
                  )}

                  {uploadingMemberImage && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader className="h-5 w-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black px-3.5 py-2 rounded-xl cursor-pointer transition border border-emerald-200">
                  <Upload className="h-3 w-3" />
                  {uploadingMemberImage ? "Mengunggah..." : "Unggah Foto"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "member")}
                    className="hidden"
                    disabled={uploadingMemberImage}
                    title="Pilih gambar perangkat desa"
                  />
                </label>
              </div>

              <div>
                <label htmlFor="member-name" className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  id="member-name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Contoh: Drs. Hendra Gunawan"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="member-position" className="form-label">Jabatan</label>
                <input
                  type="text"
                  id="member-position"
                  value={memberPosition}
                  onChange={(e) => setMemberPosition(e.target.value)}
                  placeholder="Contoh: Sekretaris Desa"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="member-order" className="form-label">No. Urut Urutan Tampil</label>
                  <input
                    type="number"
                    id="member-order"
                    value={memberOrder}
                    onChange={(e) => setMemberOrder(Number(e.target.value))}
                    min={0}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="member-phone" className="form-label">Nomor Telepon/HP</label>
                  <input
                    type="text"
                    id="member-phone"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    placeholder="Contoh: 081234567"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingMember || uploadingMemberImage}
                  className="rounded-xl px-4 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-50"
                >
                  {savingMember ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
