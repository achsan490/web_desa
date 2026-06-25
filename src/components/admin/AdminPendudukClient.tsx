"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, X, Users, UserPlus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Resident = {
  id: string;
  nik: string;
  name: string;
  birthPlace: string | null;
  birthDate: Date | null;
  gender: string;
  address: string | null;
  rt: string | null;
  rw: string | null;
  religion: string | null;
  education: string | null;
  occupation: string | null;
  maritalStatus: string | null;
  createdAt: Date;
};

const genderOptions = [
  { value: "LAKI_LAKI", label: "Laki-laki" },
  { value: "PEREMPUAN", label: "Perempuan" },
];

const religionOptions = ["ISLAM", "KRISTEN", "KATOLIK", "HINDU", "BUDHA", "KONGHUCU", "LAINNYA"];
const educationOptions = ["TIDAK_SEKOLAH", "SD", "SMP", "SMA", "D3", "S1", "S2", "S3"];
const maritalOptions = ["BELUM_KAWIN", "KAWIN", "CERAI_HIDUP", "CERAI_MATI"];

export default function AdminPendudukClient({ initialData }: { initialData: Resident[] }) {
  const [data, setData] = useState<Resident[]>(initialData);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("SEMUA");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Resident | null>(null);

  // Form states
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("LAKI_LAKI");
  const [address, setAddress] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [religion, setReligion] = useState("ISLAM");
  const [education, setEducation] = useState("SMA");
  const [occupation, setOccupation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("BELUM_KAWIN");
  const [submitting, setSubmitting] = useState(false);

  const filtered = data.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.nik.includes(search);
    const matchGender = genderFilter === "SEMUA" || d.gender === genderFilter;
    return matchSearch && matchGender;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setNik("");
    setName("");
    setBirthPlace("");
    setBirthDate("");
    setGender("LAKI_LAKI");
    setAddress("");
    setRt("");
    setRw("");
    setReligion("ISLAM");
    setEducation("SMA");
    setOccupation("");
    setMaritalStatus("BELUM_KAWIN");
    setIsModalOpen(true);
  };

  const openEditModal = (item: Resident) => {
    setEditingItem(item);
    setNik(item.nik);
    setName(item.name);
    setBirthPlace(item.birthPlace || "");
    setBirthDate(item.birthDate ? new Date(item.birthDate).toISOString().split("T")[0] : "");
    setGender(item.gender);
    setAddress(item.address || "");
    setRt(item.rt || "");
    setRw(item.rw || "");
    setReligion(item.religion || "ISLAM");
    setEducation(item.education || "SMA");
    setOccupation(item.occupation || "");
    setMaritalStatus(item.maritalStatus || "BELUM_KAWIN");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik || nik.length !== 16) {
      toast.error("NIK harus diisi dan tepat 16 karakter");
      return;
    }
    if (!name) {
      toast.error("Nama lengkap harus diisi");
      return;
    }

    setSubmitting(true);
    const payload = {
      nik,
      name,
      birthPlace: birthPlace || null,
      birthDate: birthDate || null,
      gender,
      address: address || null,
      rt: rt || null,
      rw: rw || null,
      religion: religion || null,
      education: education || null,
      occupation: occupation || null,
      maritalStatus: maritalStatus || null,
    };

    try {
      if (editingItem) {
        // Edit mode
        const res = await fetch(`/api/penduduk/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) =>
            prev.map((d) => (d.id === editingItem.id ? { ...json.resident, birthDate: json.resident.birthDate ? new Date(json.resident.birthDate) : null } : d))
          );
          toast.success("Data penduduk berhasil diperbarui");
          setIsModalOpen(false);
        } else {
          const json = await res.json();
          toast.error(json.error || "Gagal memperbarui data penduduk");
        }
      } else {
        // Add mode
        const res = await fetch("/api/penduduk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) => [{ ...json.resident, birthDate: json.resident.birthDate ? new Date(json.resident.birthDate) : null }, ...prev]);
          toast.success("Penduduk baru berhasil ditambahkan");
          setIsModalOpen(false);
        } else {
          const json = await res.json();
          toast.error(json.error || "Gagal menambahkan penduduk baru");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data penduduk ini?")) return;

    try {
      const res = await fetch(`/api/penduduk/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((d) => d.id !== id));
        toast.success("Data penduduk berhasil dihapus");
      } else {
        toast.error("Gagal menghapus data penduduk");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-1 gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="admin-penduduk-search"
              placeholder="Cari NIK atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="form-input text-sm py-2 px-3 border border-gray-200 rounded-xl max-w-[160px]"
          >
            <option value="SEMUA">Semua Gender</option>
            {genderOptions.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md whitespace-nowrap"
        >
          <UserPlus className="h-4 w-4" /> Tambah Penduduk
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Nama & NIK</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">TTL & Gender</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">RT/RW & Alamat</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Pendidikan & Pekerjaan</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-12">
                    Tidak ada data penduduk ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">{item.nik}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      <p>
                        {item.birthPlace || "-"}
                        {item.birthDate ? `, ${formatDate(item.birthDate)}` : ""}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.gender === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      <p className="font-semibold">RT {item.rt || "00"} / RW {item.rw || "00"}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{item.address || "-"}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      <p>{item.education || "-"}</p>
                      <p className="text-xs text-gray-400">{item.occupation || "-"}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="admin-action-btn hover:text-emerald-600"
                          title="Edit Penduduk"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="admin-action-btn hover:text-red-600"
                          title="Hapus Penduduk"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingItem ? "Edit Data Penduduk" : "Tambah Penduduk Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="penduduk-nik" className="form-label">NIK (Nomor Induk Kependudukan)</label>
                  <input
                    type="text"
                    id="penduduk-nik"
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="Wajib 16 digit angka"
                    className="form-input font-mono"
                    required
                    disabled={!!editingItem}
                  />
                </div>
                <div>
                  <label htmlFor="penduduk-name" className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    id="penduduk-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="form-input font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label htmlFor="penduduk-birth-place" className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    id="penduduk-birth-place"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="Contoh: Bandung"
                    className="form-input text-sm"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="penduduk-birth-date" className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    id="penduduk-birth-date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="form-input text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="penduduk-gender" className="form-label">Jenis Kelamin</label>
                  <select
                    id="penduduk-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="form-input text-sm"
                  >
                    {genderOptions.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="penduduk-religion" className="form-label">Agama</label>
                  <select
                    id="penduduk-religion"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="form-input text-sm"
                  >
                    {religionOptions.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0) + r.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="penduduk-education" className="form-label">Pendidikan Terakhir</label>
                  <select
                    id="penduduk-education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="form-input text-sm"
                  >
                    {educationOptions.map((ed) => (
                      <option key={ed} value={ed}>
                        {ed.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="penduduk-marital" className="form-label">Status Hubungan</label>
                  <select
                    id="penduduk-marital"
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="form-input text-sm"
                  >
                    {maritalOptions.map((m) => (
                      <option key={m} value={m}>
                        {m.replace("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="penduduk-occupation" className="form-label">Pekerjaan</label>
                  <input
                    type="text"
                    id="penduduk-occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="Contoh: Petani, Wiraswasta, Pelajar"
                    className="form-input text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="penduduk-rt" className="form-label">RT</label>
                    <input
                      type="text"
                      id="penduduk-rt"
                      maxLength={3}
                      value={rt}
                      onChange={(e) => setRt(e.target.value)}
                      placeholder="01"
                      className="form-input text-sm text-center"
                    />
                  </div>
                  <div>
                    <label htmlFor="penduduk-rw" className="form-label">RW</label>
                    <input
                      type="text"
                      id="penduduk-rw"
                      maxLength={3}
                      value={rw}
                      onChange={(e) => setRw(e.target.value)}
                      placeholder="06"
                      className="form-input text-sm text-center"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="penduduk-address" className="form-label">Alamat Lengkap</label>
                <textarea
                  id="penduduk-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  placeholder="Nama jalan, nomor rumah, nama dusun..."
                  className="form-input resize-none text-sm"
                />
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
                  disabled={submitting}
                  className="rounded-xl px-4 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
