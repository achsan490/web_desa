import type { Metadata } from "next";
import { db } from "@/lib/db";
import AdminGaleriClient from "@/components/admin/AdminGaleriClient";

export const metadata: Metadata = { title: "Admin — Galeri" };

export default async function AdminGaleriPage() {
  const galleries = await db.gallery.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Manajemen Galeri Desa</h1>
        <p className="text-gray-500 text-sm mt-1">{galleries.length} total media foto dan video</p>
      </div>
      <AdminGaleriClient initialData={galleries} />
    </div>
  );
}
