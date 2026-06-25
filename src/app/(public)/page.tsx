import type { Metadata } from "next";
import { db } from "@/lib/db";
import HeroSection from "@/components/public/HeroSection";
import StatistikSection from "@/components/public/StatistikSection";
import SambutanSection from "@/components/public/SambutanSection";
import BeritaSection from "@/components/public/BeritaSection";
import AgendaSection from "@/components/public/AgendaSection";
import GaleriSection from "@/components/public/GaleriSection";
import PotensiSection from "@/components/public/PotensiSection";
import TestimoniSection from "@/components/public/TestimoniSection";
import MapsSection from "@/components/public/MapsSection";
import CTASection from "@/components/public/CTASection";

export const metadata: Metadata = {
  title: "Beranda — Website Resmi Desa Sukamaju",
  description:
    "Website resmi Desa Sukamaju, Kecamatan Ciawi, Kabupaten Bogor. Informasi desa, layanan surat online, berita, agenda, galeri, dan potensi desa.",
};

export const revalidate = 300; // Revalidate setiap 5 menit

async function getData() {
  const [news, agenda, galleries, potentials] = await Promise.all([
    db.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 5,
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
    db.agenda.findMany({
      where: { isPublished: true, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 6,
    }),
    db.gallery.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.potential.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "asc" },
      take: 6,
    }),
  ]);

  return { news, agenda, galleries, potentials };
}

export default async function HomePage() {
  const { news, agenda, galleries, potentials } = await getData();

  return (
    <>
      <HeroSection />
      <StatistikSection />
      <SambutanSection />
      <BeritaSection news={news} />
      <AgendaSection agenda={agenda} />
      <GaleriSection galleries={galleries} />
      <PotensiSection potentials={potentials} />
      <TestimoniSection />
      <MapsSection />
      <CTASection />
    </>
  );
}
