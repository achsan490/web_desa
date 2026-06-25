import type { Metadata } from "next";
import { db } from "@/lib/db";
import GaleriClient from "@/components/public/GaleriClient";

export const metadata: Metadata = {
  title: "Galeri Desa",
  description: "Foto dan video kegiatan Desa Sukamaju. Dokumentasi momen berharga kehidupan desa kami.",
};

export const revalidate = 300;

export default async function GaleriPage() {
  const galleries = await db.gallery.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-br from-purple-700 to-purple-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Galeri Desa</h1>
          <p className="text-purple-200 text-lg">{galleries.length} foto tersedia · Kenangan indah Desa Sukamaju</p>
        </div>
      </div>
      <GaleriClient galleries={galleries} />
    </div>
  );
}
