"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, X, ShieldAlert, Key } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type SystemUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
};

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_DESA: "Admin Desa",
  OPERATOR: "Operator / Staf",
};

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
  ADMIN_DESA: "bg-emerald-100 text-emerald-700",
  OPERATOR: "bg-blue-100 text-blue-700",
};

export default function AdminPenggunaClient({
  initialData,
  currentUserId,
}: {
  initialData: SystemUser[];
  currentUserId: string;
}) {
  const [data, setData] = useState<SystemUser[]>(initialData);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SystemUser | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OPERATOR");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const filtered = data.filter((d) => {
    return (
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openAddModal = () => {
    setEditingItem(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("OPERATOR");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: SystemUser) => {
    setEditingItem(item);
    setName(item.name);
    setEmail(item.email);
    setPassword("");
    setRole(item.role);
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Nama dan Email wajib diisi");
      return;
    }
    if (!editingItem && !password) {
      toast.error("Password wajib diisi untuk pengguna baru");
      return;
    }

    setSubmitting(true);
    const payload: Record<string, unknown> = {
      name,
      email,
      role,
      isActive,
    };
    if (password) payload.password = password;

    try {
      if (editingItem) {
        // Edit mode
        const res = await fetch(`/api/pengguna/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) => prev.map((d) => (d.id === editingItem.id ? json.user : d)));
          toast.success("Akun pengguna berhasil diperbarui");
          setIsModalOpen(false);
        } else {
          const json = await res.json();
          toast.error(json.error || "Gagal memperbarui pengguna");
        }
      } else {
        // Add mode
        const res = await fetch("/api/pengguna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          setData((prev) => [json.user, ...prev]);
          toast.success("Pengguna baru berhasil ditambahkan");
          setIsModalOpen(false);
        } else {
          const json = await res.json();
          toast.error(json.error || "Gagal menambahkan pengguna");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: SystemUser) => {
    if (item.id === currentUserId) {
      toast.error("Anda tidak bisa menghapus akun Anda sendiri");
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna ${item.name}?`)) return;

    try {
      const res = await fetch(`/api/pengguna/${item.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((d) => d.id !== item.id));
        toast.success("Pengguna berhasil dihapus");
      } else {
        const json = await res.json();
        toast.error(json.error || "Gagal menghapus pengguna");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  const handleToggleActive = async (item: SystemUser) => {
    if (item.id === currentUserId) {
      toast.error("Anda tidak bisa menonaktifkan akun Anda sendiri");
      return;
    }

    try {
      const res = await fetch(`/api/pengguna/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });

      if (res.ok) {
        setData((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, isActive: !d.isActive } : d))
        );
        toast.success(item.isActive ? "Akun dinonaktifkan" : "Akun diaktifkan");
      } else {
        toast.error("Gagal mengubah status aktif");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            id="admin-pengguna-search"
            placeholder="Cari nama atau email pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Tambah Operator
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Nama</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Hak Akses / Role</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-12">
                    Tidak ada pengguna sistem ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      {item.id === currentUserId && (
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 rounded px-1.5 py-0.5 mt-0.5 inline-block">
                          Akun Saya
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {item.email}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("badge text-xs font-semibold", roleColors[item.role])}>
                        {roleLabels[item.role] || item.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleActive(item)}
                        disabled={item.id === currentUserId}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold border transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-red-50 text-red-500 border-red-100"
                        )}
                      >
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="admin-action-btn hover:text-emerald-600"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={item.id === currentUserId}
                          className="admin-action-btn hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Hapus"
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingItem ? "Edit Pengguna Sistem" : "Tambah Operator Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="user-name" className="form-label">Nama Pengguna / Petugas</label>
                <input
                  type="text"
                  id="user-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Cahyono"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="user-email" className="form-label">Alamat Email</label>
                <input
                  type="email"
                  id="user-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: budi@desapojokklitih.go.id"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="user-password" className="form-label">
                  Password {editingItem && <span className="text-gray-400 font-normal">(Biarkan kosong jika tidak diganti)</span>}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    id="user-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="form-input pl-10"
                    required={!editingItem}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-role" className="form-label">Hak Akses / Role</label>
                  <select
                    id="user-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-input text-sm"
                    disabled={editingItem?.id === currentUserId}
                  >
                    <option value="OPERATOR">Operator / Staf</option>
                    <option value="ADMIN_DESA">Admin Desa</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                <div className="flex items-center pt-8">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="user-is-active"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      disabled={editingItem?.id === currentUserId}
                      className="sr-only peer"
                      title="Status keaktifan akun"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2 text-sm font-semibold text-gray-700">Status Aktif</span>
                  </label>
                </div>
              </div>

              {editingItem?.id === currentUserId && (
                <div className="bg-amber-50 rounded-xl p-3 flex gap-2.5 text-xs text-amber-700 border border-amber-100">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>Anda sedang mengedit akun Anda sendiri. Demi keamanan, Anda tidak dapat menonaktifkan akun sendiri atau mengubah hak akses Anda.</p>
                </div>
              )}

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
