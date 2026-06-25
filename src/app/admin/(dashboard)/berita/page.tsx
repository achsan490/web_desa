import type { Metadata } from "next";
import { db } from "@/lib/db";
import AdminBeritaClient from "@/components/admin/AdminBeritaClient";

export const metadata: Metadata = { title: "Admin — Berita" };

export default async function AdminBeritaPage() {
  const news = await db.news.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manajemen Berita</h1>
          <p className="text-gray-500 text-sm mt-1">{news.length} total berita</p>
        </div>
      </div>
      <AdminBeritaClient initialNews={news} />
    </div>
  );
}
