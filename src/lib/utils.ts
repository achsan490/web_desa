import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, fmt = "dd MMMM yyyy"): string {
  return format(new Date(date), fmt, { locale: id });
}

export function formatDateRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function generateTicketNumber(prefix: string): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${year}${month}-${random}`;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

export const NEWS_CATEGORIES = [
  { value: "PEMERINTAHAN", label: "Pemerintahan", color: "blue" },
  { value: "PENDIDIKAN", label: "Pendidikan", color: "yellow" },
  { value: "KESEHATAN", label: "Kesehatan", color: "green" },
  { value: "UMKM", label: "UMKM", color: "orange" },
  { value: "PERTANIAN", label: "Pertanian", color: "emerald" },
  { value: "INFRASTRUKTUR", label: "Infrastruktur", color: "gray" },
  { value: "KEGIATAN", label: "Kegiatan Desa", color: "purple" },
];

export const POTENTIAL_CATEGORIES = [
  { value: "WISATA", label: "Wisata", icon: "🏞️" },
  { value: "UMKM", label: "UMKM", icon: "🏪" },
  { value: "PERTANIAN", label: "Pertanian", icon: "🌾" },
  { value: "PETERNAKAN", label: "Peternakan", icon: "🐄" },
  { value: "KERAJINAN", label: "Kerajinan", icon: "🎨" },
];

export const LETTER_TYPES = [
  { value: "DOMISILI", label: "Surat Keterangan Domisili" },
  { value: "USAHA", label: "Surat Keterangan Usaha" },
  { value: "TIDAK_MAMPU", label: "Surat Keterangan Tidak Mampu" },
  { value: "PENGANTAR_NIKAH", label: "Surat Pengantar Nikah" },
  { value: "KELAHIRAN", label: "Surat Keterangan Kelahiran" },
  { value: "KEMATIAN", label: "Surat Keterangan Kematian" },
];

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  DONE: "bg-green-100 text-green-800",
  READY: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  UPCOMING: "bg-emerald-100 text-emerald-800",
  ONGOING: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  PROCESSING: "Diproses",
  DONE: "Selesai",
  READY: "Siap Diambil",
  REJECTED: "Ditolak",
  UPCOMING: "Akan Datang",
  ONGOING: "Sedang Berlangsung",
  CANCELLED: "Dibatalkan",
};
