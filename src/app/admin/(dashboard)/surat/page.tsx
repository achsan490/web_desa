import type { Metadata } from "next";
import { db } from "@/lib/db";
import AdminSuratClient from "@/components/admin/AdminSuratClient";

export const metadata: Metadata = { title: "Admin — Surat Online" };

export default async function AdminSuratPage() {
  const letters = await db.letterRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Manajemen Surat Online</h1>
        <p className="text-gray-500 text-sm mt-1">{letters.length} total permohonan</p>
      </div>
      <AdminSuratClient initialData={letters} />
    </div>
  );
}
