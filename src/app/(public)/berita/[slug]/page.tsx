import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  formatDate,
  NEWS_CATEGORIES,
  truncate,
} from "@/lib/utils";
import {
  Clock,
  Eye,
  User,
  ArrowLeft,
  Tag,
  Facebook,
  Twitter,
  Link2,
} from "lucide-react";
import KomentarSection from "@/components/public/KomentarSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await db.news.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, image: true },
  });
  if (!news) return { title: "Berita Tidak Ditemukan" };
  return {
    title: news.title,
    description: news.excerpt || undefined,
    openGraph: {
      title: news.title,
      description: news.excerpt || undefined,
      images: news.image ? [news.image] : [],
    },
  };
}

async function getData(slug: string) {
  const news = await db.news.findUnique({
    where: { slug, isPublished: true },
    include: {
      author: { select: { name: true } },
      comments: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!news) return null;

  // Increment views
  await db.news.update({ where: { id: news.id }, data: { views: { increment: 1 } } });

  // Related news
  const related = await db.news.findMany({
    where: { isPublished: true, category: news.category, id: { not: news.id } },
    take: 3,
    select: { id: true, title: true, slug: true, image: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  return { news, related };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) notFound();

  const { news, related } = data;
  const categoryLabel =
    NEWS_CATEGORIES.find((c) => c.value === news.category)?.label || news.category;

  return (
    <div className="pt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Back */}
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Berita
            </Link>

            {/* Category */}
            <div className="mb-4">
              <span className="badge badge-emerald">
                <Tag className="h-3 w-3 mr-1" />
                {categoryLabel}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              {news.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {news.author.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {news.publishedAt ? formatDate(news.publishedAt, "dd MMMM yyyy, HH:mm") : "-"} WIB
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {news.views + 1} kali dilihat
              </span>
            </div>

            {/* Featured Image */}
            {news.image && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 shadow-lg">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Excerpt */}
            {news.excerpt && (
              <p className="text-lg text-gray-700 font-medium leading-relaxed mb-6 italic border-l-4 border-emerald-500 pl-4 py-1">
                {news.excerpt}
              </p>
            )}

            {/* Content */}
            <div className="prose prose-gray prose-lg max-w-none">
              {news.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">
                  {para}
                </p>
              ))}
            </div>

            {/* Share */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">
                Bagikan:
              </span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/berita/${news.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-3.5 w-3.5" />
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(`/berita/${news.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-600 transition-colors"
              >
                <Twitter className="h-3.5 w-3.5" />
                Twitter
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Link2 className="h-3.5 w-3.5" />
                Salin Link
              </button>
            </div>

            {/* Comments */}
            <div className="mt-12">
              <KomentarSection newsId={news.id} comments={news.comments} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Related News */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Berita Terkait
                  </h3>
                  <div className="space-y-4">
                    {related.map((item) => (
                      <Link
                        key={item.id}
                        href={`/berita/${item.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="relative w-20 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                          <Image
                            src={item.image || "https://picsum.photos/seed/rel/200/150"}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {truncate(item.title, 60)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.publishedAt ? formatDate(item.publishedAt) : ""}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4">Kategori</h3>
                <div className="flex flex-wrap gap-2">
                  {NEWS_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.value}
                      href={`/berita?category=${cat.value}`}
                      className="badge badge-emerald hover:bg-emerald-200 transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
