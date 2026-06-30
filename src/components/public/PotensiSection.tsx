"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, ExternalLink } from "lucide-react";
import { POTENTIAL_CATEGORIES } from "@/lib/utils";

type PotentialItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string | null;
  location: string | null;
  contact: string | null;
};

export default function PotensiSection({ potentials }: { potentials: PotentialItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getCategoryIcon = (cat: string) =>
    POTENTIAL_CATEGORIES.find((c) => c.value === cat)?.icon || "🌟";

  const getCategoryLabel = (cat: string) =>
    POTENTIAL_CATEGORIES.find((c) => c.value === cat)?.label || cat;

  return (
    <section className="section-padding bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div ref={ref} className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-sm font-medium text-emerald-200 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Unggulan Desa
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Potensi{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                Desa Pojok Klitih
              </span>
            </h2>
            <p className="text-emerald-200/80 mt-2">
              Kekayaan dan keunggulan yang menjadi daya saing desa kami
            </p>
          </div>
          <Link
            href="/potensi"
            className="flex items-center gap-2 text-emerald-300 font-semibold hover:gap-3 transition-all text-sm hover:text-white"
          >
            Lihat Semua Potensi <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {potentials.slice(0, 6).map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/potensi/${item.slug}`} className="group block">
                <div className="glass-card-dark rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={item.image || "https://picsum.photos/seed/potensimain/800/450"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-medium text-white">
                        {getCategoryIcon(item.category)} {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-white text-lg mb-2 group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-emerald-200/70 text-sm line-clamp-2 mb-4">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {item.location && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-300/70">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{item.location}</span>
                          </div>
                        )}
                        {item.contact && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-300/70">
                            <Phone className="h-3 w-3" />
                            <span>{item.contact}</span>
                          </div>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                        <ExternalLink className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
