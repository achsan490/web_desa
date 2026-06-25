import type { Metadata } from "next";
import { db } from "@/lib/db";
import AdminPendudukClient from "@/components/admin/AdminPendudukClient";

export const metadata: Metadata = { title: "Admin — Data Penduduk" };

export default async function AdminPendudukPage() {
  const residents = await db.resident.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Manajemen Data Penduduk</h1>
        <p className="text-gray-500 text-sm mt-1">{residents.length} total penduduk terdaftar</p>
      </div>
      <AdminPendudukClient initialData={residents} />
    </div>
  );
}
