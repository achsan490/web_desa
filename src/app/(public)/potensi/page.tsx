import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { POTENTIAL_CATEGORIES } from "@/lib/utils";
import { MapPin, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Potensi Desa",
  description: "Potensi wisata, UMKM, pertanian, peternakan, dan kerajinan Desa Pojok Klitih.",
};

export const revalidate = 3600;

export default async function PotensiPage() {
  const potentials = await db.potential.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { createdAt: "asc" }],
  });

  const getCategoryIcon = (cat: string) =>
    POTENTIAL_CATEGORIES.find((c) => c.value === cat)?.icon || "🌟";
  const getCategoryLabel = (cat: string) =>
    POTENTIAL_CATEGORIES.find((c) => c.value === cat)?.label || cat;

  const grouped = potentials.reduce<Record<string, typeof potentials>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Potensi Desa</h1>
          <p className="text-emerald-200 text-lg">{potentials.length} potensi unggulan Desa Pojok Klitih</p>
        </div>
      </div>

      <div className="container-custom section-padding space-y-16">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">{getCategoryIcon(category)}</span>
              <div>
                <h2 className="text-2xl font-black text-gray-900">{getCategoryLabel(category)}</h2>
                <p className="text-gray-500 text-sm">{items.length} item</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Link href={`/potensi/${item.slug}`} key={item.id} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={item.image || "https://picsum.photos/seed/potensi/800/450"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3 mb-4">{item.description}</p>
                        <div className="space-y-1.5 mb-4">
                          {item.location && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <MapPin className="h-3.5 w-3.5" />{item.location}
                            </div>
                          )}
                          {item.contact && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Phone className="h-3.5 w-3.5" />{item.contact}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-gray-50 pt-4 flex items-center text-xs font-bold text-emerald-600 group-hover:text-emerald-700 gap-1 mt-auto">
                        Lihat Selengkapnya <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
