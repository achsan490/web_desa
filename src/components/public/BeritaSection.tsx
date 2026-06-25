"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Eye, Tag } from "lucide-react";
import { formatDate, NEWS_CATEGORIES, truncate } from "@/lib/utils";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  category: string;
  views: number;
  publishedAt: Date | null;
  author: { name: string };
};

export default function BeritaSection({ news }: { news: NewsItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getCategoryLabel = (cat: string) =>
    NEWS_CATEGORIES.find((c) => c.value === cat)?.label || cat;

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      PEMERINTAHAN: "bg-blue-100 text-blue-700",
      PENDIDIKAN: "bg-yellow-100 text-yellow-700",
      KESEHATAN: "bg-green-100 text-green-700",
      UMKM: "bg-orange-100 text-orange-700",
      PERTANIAN: "bg-emerald-100 text-emerald-700",
      INFRASTRUKTUR: "bg-gray-100 text-gray-700",
      KEGIATAN: "bg-purple-100 text-purple-700",
    };
    return colors[cat] || "bg-gray-100 text-gray-700";
  };

  const featured = news[0];
  const rest = news.slice(1, 5);

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
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Terbaru
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Berita <span className="gradient-text">Desa</span>
            </h2>
            <p className="text-gray-500 mt-2">
              Informasi dan kegiatan terkini dari Desa Sukamaju
            </p>
          </div>
          <Link
            href="/berita"
            className="flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all text-sm"
          >
            Lihat Semua Berita <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {news.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            Belum ada berita yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured News */}
            {featured && (
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-7"
              >
                <Link href={`/berita/${featured.slug}`} className="group block">
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg mb-4">
                    <Image
                      src={featured.image || "https://picsum.photos/seed/news/800/450"}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`badge ${getCategoryColor(featured.category)}`}
                      >
                        {getCategoryLabel(featured.category)}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight mb-2">
                    {featured.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.publishedAt
                        ? formatDate(featured.publishedAt)
                        : "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {featured.views} dilihat
                    </span>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* News List */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {rest.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <Link
                    href={`/berita/${item.slug}`}
                    className="flex gap-4 group"
                  >
                    <div className="relative w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={item.image || "https://picsum.photos/seed/news2/200/150"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`badge text-xs mb-1 ${getCategoryColor(item.category)}`}
                      >
                        <Tag className="h-2.5 w-2.5 mr-1" />
                        {getCategoryLabel(item.category)}
                      </span>
                      <h4 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {truncate(item.title, 70)}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.publishedAt ? formatDate(item.publishedAt) : "-"}
                      </p>
                    </div>
                  </Link>
                  {i < rest.length - 1 && (
                    <hr className="mt-5 border-gray-100" />
                  )}
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
