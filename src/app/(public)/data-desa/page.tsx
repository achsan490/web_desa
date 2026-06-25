import type { Metadata } from "next";
import { db } from "@/lib/db";
import DataDesaClient from "@/components/public/DataDesaClient";

export const metadata: Metadata = {
  title: "Data Desa",
  description: "Data statistik kependudukan Desa Sukamaju: penduduk, pendidikan, pekerjaan, agama, dan usia.",
};

export const revalidate = 3600;

export default async function DataDesaPage() {
  const statistics = await db.statistic.findMany({ orderBy: { category: "asc" } });

  const grouped = statistics.reduce((acc, stat) => {
    if (!acc[stat.category]) acc[stat.category] = [];
    acc[stat.category].push(stat);
    return acc;
  }, {} as Record<string, typeof statistics>);

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Data Desa</h1>
          <p className="text-blue-200 text-lg">Statistik kependudukan Desa Sukamaju tahun 2025</p>
        </div>
      </div>
      <DataDesaClient grouped={grouped} />
    </div>
  );
}
