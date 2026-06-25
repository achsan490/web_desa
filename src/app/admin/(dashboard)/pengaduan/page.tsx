import type { Metadata } from "next";
import { db } from "@/lib/db";
import AdminPengaduanClient from "@/components/admin/AdminPengaduanClient";

export const metadata: Metadata = { title: "Admin — Pengaduan" };

export default async function AdminPengaduanPage() {
  const complaints = await db.complaint.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Manajemen Pengaduan</h1>
        <p className="text-gray-500 text-sm mt-1">{complaints.length} total pengaduan</p>
      </div>
      <AdminPengaduanClient initialData={complaints} />
    </div>
  );
}
