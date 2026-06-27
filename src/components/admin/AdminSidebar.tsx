"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import NextImage from "next/image";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Image,
  Sparkles,
  MessageSquare,
  FileText,
  Users,
  UserCog,
  ChevronRight,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Konten",
    items: [
      { href: "/admin/berita", label: "Berita", icon: Newspaper },
      { href: "/admin/agenda", label: "Agenda", icon: Calendar },
      { href: "/admin/galeri", label: "Galeri", icon: Image },
      { href: "/admin/potensi", label: "Potensi Desa", icon: Sparkles },
      { href: "/admin/profil", label: "Profil & Perangkat", icon: UserCog },
    ],
  },
  {
    label: "Layanan",
    items: [
      { href: "/admin/pengaduan", label: "Pengaduan", icon: MessageSquare },
      { href: "/admin/surat", label: "Surat Online", icon: FileText },
    ],
  },
  {
    label: "Data",
    items: [
      { href: "/admin/penduduk", label: "Data Penduduk", icon: Users },
      { href: "/admin/statistik", label: "Statistik", icon: BarChart3 },
    ],
  },
  {
    label: "Sistem",
    items: [
      { href: "/admin/pengguna", label: "Pengguna", icon: UserCog },
    ],
  },
];

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-64 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden relative border border-emerald-100/50">
            <NextImage
              src="/logo.png"
              alt="Logo Desa"
              width={36}
              height={36}
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Admin Panel</p>
            <p className="text-xs text-gray-400">Desa Sukamaju</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "admin-sidebar-item",
                      isActive && "active"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-emerald-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="mb-3 px-3">
          <span className={cn(
            "badge text-xs",
            role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" :
            role === "ADMIN_DESA" ? "badge-emerald" : "badge-blue"
          )}>
            {role === "SUPER_ADMIN" ? "Super Admin" : role === "ADMIN_DESA" ? "Admin Desa" : "Operator"}
          </span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="admin-sidebar-item text-gray-500"
        >
          <ExternalLink className="h-4 w-4" />
          Lihat Website
        </Link>
      </div>
    </motion.aside>
  );
}
