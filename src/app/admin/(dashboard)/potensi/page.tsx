import type { Metadata } from "next";
import { db } from "@/lib/db";
import AdminPotensiClient from "@/components/admin/AdminPotensiClient";

export const metadata: Metadata = { title: "Admin — Potensi Desa" };

export default async function AdminPotensiPage() {
  const potentials = await db.potential.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Manajemen Potensi Desa</h1>
        <p className="text-gray-500 text-sm mt-1">{potentials.length} total potensi terdaftar</p>
      </div>
      <AdminPotensiClient initialData={potentials} />
    </div>
  );
}
