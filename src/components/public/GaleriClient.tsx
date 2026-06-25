"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ZoomIn, Image as ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryItem = {
  id: string;
  title: string;
  url: string;
  type: string;
  category: string | null;
};

const allCategories = ["Semua", "Fasilitas", "Pertanian", "Kegiatan", "Kesehatan", "UMKM", "Wisata", "Infrastruktur"];

export default function GaleriClient({ galleries }: { galleries: GalleryItem[] }) {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [activeType, setActiveType] = useState("SEMUA");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filtered = galleries.filter((g) => {
    const typeMatch = activeType === "SEMUA" || g.type === activeType;
    const catMatch = activeFilter === "Semua" || g.category === activeFilter;
    return typeMatch && catMatch;
  });

  const slides = filtered.map((g) => ({ src: g.url, alt: g.title }));

  return (
    <div className="container-custom section-padding">
      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Type filter */}
        <div className="flex gap-3">
          {[
            { value: "SEMUA", label: "Semua", icon: null },
            { value: "PHOTO", label: "Foto", icon: ImageIcon },
            { value: "VIDEO", label: "Video", icon: Video },
          ].map((t) => (
            <button
              key={t.value}
              id={`galeri-type-${t.value.toLowerCase()}`}
              onClick={() => setActiveType(t.value)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                activeType === t.value
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-400"
              )}
            >
              {t.icon && <t.icon className="h-4 w-4" />}
              {t.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              id={`galeri-cat-${cat.toLowerCase()}`}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
                activeFilter === cat
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 mb-6">
        Menampilkan {filtered.length} item
      </p>

      {/* Masonry Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <ImageIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <p>Belum ada foto di kategori ini</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((item, i) => (
            <div key={item.id} className="break-inside-avoid">
              <button
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                className="group relative w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  width={400}
                  height={i % 3 === 0 ? 500 : 300}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium">{item.title}</p>
                  {item.category && <p className="text-white/60 text-xs">{item.category}</p>}
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </div>
  );
}
