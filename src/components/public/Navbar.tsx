"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Info,
  Newspaper,
  Calendar,
  Image,
  BarChart3,
  MessageSquare,
  FileText,
  Phone,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const desaName = process.env.NEXT_PUBLIC_DESA_NAME || "Desa Pojok Klitih";

const navLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/profil", label: "Profil", icon: Info },
  { href: "/berita", label: "Berita", icon: Newspaper },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/galeri", label: "Galeri", icon: Image },
  { href: "/potensi", label: "Potensi", icon: Sparkles },
  { href: "/data-desa", label: "Data Desa", icon: BarChart3 },
  {
    label: "Layanan",
    icon: FileText,
    children: [
      { href: "/pengaduan", label: "Pengaduan", icon: MessageSquare },
      { href: "/layanan-surat", label: "Surat Online", icon: FileText },
    ],
  },
  { href: "/kontak", label: "Kontak", icon: Phone },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const isHomePage = pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled || !isHomePage
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        )}
      >
        <div className="container-custom">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden relative border border-emerald-100/50">
                <NextImage
                  src="/logo.png"
                  alt="Logo Desa"
                  width={40}
                  height={40}
                  className="object-contain p-1"
                />
              </div>
              <div className="hidden sm:block">
                <p
                  className={cn(
                    "font-bold text-base leading-tight transition-colors",
                    isScrolled || !isHomePage
                      ? "text-gray-900"
                      : "text-white"
                  )}
                >
                  {desaName}
                </p>
                <p
                  className={cn(
                    "text-xs transition-colors",
                    isScrolled || !isHomePage
                      ? "text-gray-500"
                      : "text-emerald-200"
                  )}
                >
                  Kab. Jombang, Jawa Timur
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.children) {
                  return (
                    <div key={link.label} className="relative">
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === link.label ? null : link.label
                          )
                        }
                        className={cn(
                          "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                          isScrolled || !isHomePage
                            ? "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform",
                            openDropdown === link.label && "rotate-180"
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {openDropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden"
                          >
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                              >
                                <child.icon className="h-4 w-4" />
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href!);

                return (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? isScrolled || !isHomePage
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "bg-white/20 text-white font-semibold"
                        : isScrolled || !isHomePage
                        ? "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/layanan-surat"
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                  isScrolled || !isHomePage
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
                    : "bg-white text-emerald-700 hover:bg-emerald-50 shadow-md"
                )}
              >
                Layanan Surat
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={cn(
                "lg:hidden rounded-xl p-2.5 transition-colors",
                isScrolled || !isHomePage
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              )}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-40 w-80 bg-white shadow-2xl lg:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden relative border border-emerald-100/50">
                  <NextImage
                    src="/logo.png"
                    alt="Logo Desa"
                    width={36}
                    height={36}
                    className="object-contain p-0.5"
                  />
                </div>
                <span className="font-bold text-gray-900">{desaName}</span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navLinks.map((link) => {
                if (link.children) {
                  return (
                    <div key={link.label}>
                      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </div>
                      <div className="ml-4 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                              pathname.startsWith(child.href)
                                ? "bg-emerald-50 text-emerald-700 font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            <child.icon className="h-4 w-4" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href!);

                return (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile CTA */}
            <div className="p-4 border-t border-gray-100">
              <Link href="/layanan-surat" className="btn-primary w-full">
                <FileText className="h-4 w-4" />
                Layanan Surat Online
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
