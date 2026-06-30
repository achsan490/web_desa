import type { Metadata } from "next";
import { db } from "@/lib/db";
import {
  Users,
  Newspaper,
  MessageSquare,
  FileText,
  Calendar,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard Admin" };

async function getData() {
  const [
    newsCount,
    pendingComplaints,
    pendingLetters,
    totalComplaints,
    totalLetters,
    upcomingAgenda,
    latestNews,
    recentComplaints,
  ] = await Promise.all([
    db.news.count({ where: { isPublished: true } }),
    db.complaint.count({ where: { status: "PENDING" } }),
    db.letterRequest.count({ where: { status: "PENDING" } }),
    db.complaint.count(),
    db.letterRequest.count(),
    db.agenda.count({ where: { date: { gte: new Date() }, isPublished: true } }),
    db.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: { id: true, title: true, category: true, publishedAt: true, views: true },
    }),
    db.complaint.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, ticketNumber: true, name: true, category: true, status: true, createdAt: true },
    }),
  ]);

  return {
    newsCount, pendingComplaints, pendingLetters, totalComplaints,
    totalLetters, upcomingAgenda, latestNews, recentComplaints,
  };
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  PROCESSING: "Diproses",
  DONE: "Selesai",
  REJECTED: "Ditolak",
};

export default async function DashboardPage() {
  const {
    newsCount, pendingComplaints, pendingLetters, totalComplaints,
    totalLetters, upcomingAgenda, latestNews, recentComplaints,
  } = await getData();

  const statCards = [
    {
      label: "Berita Terpublish",
      value: newsCount,
      icon: Newspaper,
      href: "/admin/berita",
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Pengaduan Pending",
      value: pendingComplaints,
      icon: MessageSquare,
      href: "/admin/pengaduan",
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
      badge: pendingComplaints > 0,
    },
    {
      label: "Surat Pending",
      value: pendingLetters,
      icon: FileText,
      href: "/admin/surat",
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
      badge: pendingLetters > 0,
    },
    {
      label: "Agenda Mendatang",
      value: upcomingAgenda,
      icon: Calendar,
      href: "/admin/agenda",
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Selamat datang di panel admin Desa Pojok Klitih
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="stat-card relative group">
              {card.badge && (
                <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
              <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {card.value}
              </div>
              <div className="text-sm text-gray-500">{card.label}</div>
              <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Lihat Detail
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <TrendingUp className="h-4 w-4" />
            Total Pengaduan
          </div>
          <p className="text-2xl font-black text-gray-900">{totalComplaints}</p>
          <p className="text-xs text-gray-400 mt-1">
            {pendingComplaints} menunggu tindak lanjut
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <FileText className="h-4 w-4" />
            Total Surat Masuk
          </div>
          <p className="text-2xl font-black text-gray-900">{totalLetters}</p>
          <p className="text-xs text-gray-400 mt-1">
            {pendingLetters} perlu diproses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Latest News */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Berita Terbaru</h2>
            <Link href="/admin/berita" className="text-emerald-600 text-xs font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {latestNews.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Newspaper className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">
                    {item.publishedAt ? formatDate(item.publishedAt) : "-"} · {item.views} dilihat
                  </p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 rounded-lg px-2 py-0.5 flex-shrink-0">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Pengaduan Terbaru</h2>
            <Link href="/admin/pengaduan" className="text-emerald-600 text-xs font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentComplaints.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{item.ticketNumber}</p>
                </div>
                <span className={`text-xs rounded-lg px-2 py-0.5 flex-shrink-0 font-medium ${STATUS_STYLES[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
