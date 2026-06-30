import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { POTENTIAL_CATEGORIES } from "@/lib/utils";
import { ArrowLeft, MapPin, Phone } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const potential = await db.potential.findUnique({
    where: { slug },
    select: { title: true, description: true, image: true },
  });
  if (!potential) return { title: "Potensi Tidak Ditemukan" };
  return {
    title: `${potential.title} — Potensi Desa Pojok Klitih`,
    description: potential.description,
    openGraph: {
      title: potential.title,
      description: potential.description,
      images: potential.image ? [potential.image] : [],
    },
  };
}

async function getData(slug: string) {
  const potential = await db.potential.findUnique({
    where: { slug, isPublished: true },
  });
  return potential;
}

export default async function PotensiDetailPage({ params }: Props) {
  const { slug } = await params;
  const potential = await getData(slug);
  if (!potential) notFound();

  const catObj = POTENTIAL_CATEGORIES.find((c) => c.value === potential.category);
  const categoryLabel = catObj?.label || potential.category;
  const categoryIcon = catObj?.icon || "🌟";

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={potential.image || "/images/gambar2.jfif"}
          alt={potential.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom pb-10 text-white">
            <Link
              href="/potensi"
              className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-400 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Potensi
            </Link>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-3">
              <span>{categoryIcon}</span> {categoryLabel}
            </div>
            <h1 className="text-3xl md:text-5xl font-black">{potential.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Content Description */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Deskripsi Potensi</h2>
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                {potential.description}
              </p>
            </div>
          </div>

          {/* Sidebar Info Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
              <h3 className="font-bold text-gray-900 text-lg border-b pb-3">Detail Informasi</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lokasi</h4>
                    <p className="text-sm text-gray-700 font-medium mt-0.5">{potential.location || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 mt-0.5">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kontak / Pengelola</h4>
                    <p className="text-sm text-gray-700 font-medium mt-0.5">{potential.contact || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {potential.contact && potential.contact !== "-" && (
                <a
                  href={`https://wa.me/${potential.contact.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/10"
                >
                  Hubungi Pengelola
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
