import type { Metadata } from "next";
import { db } from "@/lib/db";
import AdminStatistikClient from "@/components/admin/AdminStatistikClient";

export const metadata: Metadata = { title: "Admin — Statistik Desa" };

export default async function AdminStatistikPage() {
  const stats = await db.statistic.findMany({
    orderBy: [{ category: "asc" }, { label: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Manajemen Statistik Desa</h1>
        <p className="text-gray-500 text-sm mt-1">{stats.length} total data statistik kependudukan</p>
      </div>
      <AdminStatistikClient initialData={stats} />
    </div>
  );
}
