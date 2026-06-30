import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, NEWS_CATEGORIES, truncate } from "@/lib/utils";
import { Clock, Eye, Search, Tag } from "lucide-react";
import BeritaFilter from "@/components/public/BeritaFilter";

export const metadata: Metadata = {
  title: "Berita Desa",
  description:
    "Berita dan informasi terkini dari Desa Pojok Klitih. Pemerintahan, kesehatan, pendidikan, UMKM, dan kegiatan desa.",
};

export const revalidate = 300;

interface SearchParams {
  page?: string;
  category?: string;
  q?: string;
}

async function getData(params: SearchParams) {
  const page = parseInt(params.page || "1");
  const pageSize = 9;
  const skip = (page - 1) * pageSize;

  const where: {
    isPublished: boolean;
    category?: string;
    OR?: { title?: { contains: string }; excerpt?: { contains: string } }[];
  } = { isPublished: true };

  if (params.category && params.category !== "SEMUA") {
    where.category = params.category;
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { excerpt: { contains: params.q } },
    ];
  }

  const [news, total] = await Promise.all([
    db.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        category: true,
        views: true,
        publishedAt: true,
        author: { select: { name: true } },
      },
    }),
    db.news.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  return { news, total, page, totalPages };
}

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { news, total, page, totalPages } = await getData(params);

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      PEMERINTAHAN: "badge-blue",
      PENDIDIKAN: "bg-yellow-100 text-yellow-700",
      KESEHATAN: "badge-emerald",
      UMKM: "bg-orange-100 text-orange-700",
      PERTANIAN: "bg-lime-100 text-lime-700",
      INFRASTRUKTUR: "bg-gray-100 text-gray-700",
      KEGIATAN: "bg-purple-100 text-purple-700",
    };
    return colors[cat] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-16 md:py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Berita Desa
          </h1>
          <p className="text-emerald-200 text-lg">
            {total} artikel tersedia · Informasi terkini Desa Pojok Klitih
          </p>
        </div>
      </div>

      <div className="container-custom section-padding">
        {/* Filter & Search */}
        <BeritaFilter currentCategory={params.category} currentQ={params.q} />

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="text-center py-24">
            <Search className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              Tidak ada berita ditemukan
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Coba ubah kata kunci atau kategori pencarian
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <Link href={`/berita/${item.slug}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={item.image || "https://picsum.photos/seed/berita/800/450"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`badge ${getCategoryColor(item.category)}`}>
                        <Tag className="h-2.5 w-2.5 mr-1" />
                        {NEWS_CATEGORIES.find((c) => c.value === item.category)?.label || item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                    {item.excerpt && (
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                        {item.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {item.publishedAt ? formatDate(item.publishedAt) : "-"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {item.views} dilihat
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={{
                  query: {
                    ...(params.category && { category: params.category }),
                    ...(params.q && { q: params.q }),
                    page: p,
                  },
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                  p === page
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
