import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  ChevronRight,
  Heart,
} from "lucide-react";

const desaName = process.env.NEXT_PUBLIC_DESA_NAME || "Desa Sukamaju";
const kecamatan = process.env.NEXT_PUBLIC_DESA_KECAMATAN || "Kecamatan Ciawi";
const kabupaten = process.env.NEXT_PUBLIC_DESA_KABUPATEN || "Kabupaten Bogor";
const provinsi = process.env.NEXT_PUBLIC_DESA_PROVINSI || "Jawa Barat";
const kodePos = process.env.NEXT_PUBLIC_DESA_KODE_POS || "16730";
const telepon = process.env.NEXT_PUBLIC_DESA_TELEPON || "(0251) 123456";
const email = process.env.NEXT_PUBLIC_DESA_EMAIL || "desasukamaju@gmail.com";
const whatsapp = process.env.NEXT_PUBLIC_DESA_WHATSAPP || "628123456789";

const quickLinks = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil Desa" },
  { href: "/berita", label: "Berita Desa" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/potensi", label: "Potensi Desa" },
];

const serviceLinks = [
  { href: "/layanan-surat", label: "Surat Domisili" },
  { href: "/layanan-surat", label: "Surat Keterangan Usaha" },
  { href: "/layanan-surat", label: "Surat Tidak Mampu" },
  { href: "/pengaduan", label: "Pengaduan Masyarakat" },
  { href: "/data-desa", label: "Data Statistik" },
  { href: "/kontak", label: "Hubungi Kami" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden relative border border-gray-800">
                <Image
                  src="/logo.png"
                  alt="Logo Desa"
                  width={48}
                  height={48}
                  className="object-contain p-1"
                />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-tight">
                  {desaName}
                </p>
                <p className="text-xs text-emerald-400">{kecamatan}</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Website resmi {desaName}, {kecamatan}, {kabupaten}, {provinsi}.
              Melayani masyarakat dengan sepenuh hati.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-200"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-200"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-200"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Menu Utama
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition-colors group"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Layanan
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition-colors group"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Kontak
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400 leading-relaxed">
                  Jl. Raya Sukamaju No. 1, {kecamatan}, {kabupaten}, {provinsi}{" "}
                  {kodePos}
                </p>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <a
                  href={`tel:${telepon}`}
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  {telepon}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  desasukamaju.id
                </span>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white w-fit hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {desaName}. Hak Cipta Dilindungi.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Dibuat dengan <Heart className="h-3 w-3 text-red-500 fill-red-500" /> oleh Tim IT Desa Sukamaju
          </p>
        </div>
      </div>
    </footer>
  );
}
