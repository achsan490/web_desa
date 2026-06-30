import type { Metadata } from "next";
import Image from "next/image";
import { db } from "@/lib/db";
import ProfilTabs from "@/components/public/ProfilTabs";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Profil Desa",
  description:
    "Profil lengkap Desa Pojok Klitih: sejarah, visi misi, struktur organisasi, dan data wilayah.",
};

export const revalidate = 3600;

async function getData() {
  const [profile, org] = await Promise.all([
    db.villageProfile.findFirst(),
    db.organization.findMany({ orderBy: { order: "asc" } }),
  ]);
  return { profile, org };
}

export default async function ProfilPage() {
  const { profile, org } = await getData();
  if (!profile) notFound();

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="/images/gambar15.jpg"
          alt="Profil Desa Pojok Klitih"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <p className="text-emerald-300 text-sm font-medium uppercase tracking-widest mb-2">
              Website Resmi Desa
            </p>
            <h1 className="text-4xl md:text-5xl font-black">Profil Desa</h1>
            <p className="text-white/70 mt-2">
              Mengenal lebih dekat Desa Pojok Klitih
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ProfilTabs profile={profile} org={org} />
    </div>
  );
}
