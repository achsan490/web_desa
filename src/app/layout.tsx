import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  ),
  title: {
    default: `${process.env.NEXT_PUBLIC_DESA_NAME || "Desa Pojok Klitih"} — Website Resmi Desa`,
    template: `%s | ${process.env.NEXT_PUBLIC_DESA_NAME || "Desa Pojok Klitih"}`,
  },
  description: `Website resmi ${process.env.NEXT_PUBLIC_DESA_NAME || "Desa Pojok Klitih"}, ${process.env.NEXT_PUBLIC_DESA_KECAMATAN || "Kecamatan Plandaan"}, ${process.env.NEXT_PUBLIC_DESA_KABUPATEN || "Kabupaten Jombang"}, ${process.env.NEXT_PUBLIC_DESA_PROVINSI || "Jawa Timur"}. Informasi desa, layanan publik, berita, agenda, dan potensi desa.`,
  keywords: [
    "desa pojok klitih",
    "website desa",
    "profil desa",
    "layanan surat desa",
    "pengaduan masyarakat",
    "berita desa",
    "potensi desa",
  ],
  authors: [{ name: "Pemerintah Desa Pojok Klitih" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: process.env.NEXT_PUBLIC_DESA_NAME || "Desa Pojok Klitih",
    title: `Website Resmi ${process.env.NEXT_PUBLIC_DESA_NAME || "Desa Pojok Klitih"}`,
    description: `Website resmi Desa Pojok Klitih — informasi, layanan publik, dan potensi desa`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakarta.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <meta name="theme-color" content="#059669" />
      </head>
      <body className="font-[family-name:var(--font-plus-jakarta)] antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
