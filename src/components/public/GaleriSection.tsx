"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ArrowRight, ZoomIn } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  url: string;
  category: string | null;
};

export default function GaleriSection({ galleries }: { galleries: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const slides = galleries.map((g) => ({ src: g.url, alt: g.title }));

  return (
    <section className="section-padding bg-white">
      <div ref={ref} className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700 mb-3">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Foto & Video
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Galeri <span className="gradient-text">Desa</span>
            </h2>
            <p className="text-gray-500 mt-2">
              Momen berharga kehidupan Desa Pojok Klitih
            </p>
          </div>
          <Link
            href="/galeri"
            className="flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all text-sm"
          >
            Lihat Galeri Lengkap <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleries.slice(0, 8).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="break-inside-avoid"
            >
              <button
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
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
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium truncate">
                    {item.title}
                  </p>
                  {item.category && (
                    <p className="text-white/70 text-xs">{item.category}</p>
                  )}
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIndex}
        />
      </div>
    </section>
  );
}
