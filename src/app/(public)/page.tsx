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
  title: "Beranda — Website Resmi Desa Pojok Klitih",
  description:
    "Website resmi Desa Pojok Klitih, Kecamatan Plandaan, Kabupaten Jombang. Informasi desa, layanan surat online, berita, agenda, galeri, dan potensi desa.",
};

export const revalidate = 300; // Revalidate setiap 5 menit

async function getData() {
  const [news, agenda, galleries, potentials, profile] = await Promise.all([
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
    db.villageProfile.findFirst(),
  ]);

  return { news, agenda, galleries, potentials, profile };
}

export default async function HomePage() {
  const { news, agenda, galleries, potentials, profile } = await getData();

  const kepalaName = profile?.kepalaName || "Pemerintah Desa Pojok Klitih";
  const kepalaImage = profile?.kepalaImage || null;
  const kepalaQuote = profile?.kepalaQuote || "Bersama Membangun Desa yang Maju, Mandiri, Sejahtera, dan Berbudaya.";

  return (
    <>
      <HeroSection />
      <StatistikSection />
      <SambutanSection 
        kepalaName={kepalaName}
        kepalaImage={kepalaImage}
        kepalaQuote={kepalaQuote}
      />
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
