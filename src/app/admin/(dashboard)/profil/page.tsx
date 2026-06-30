import type { Metadata } from "next";
import { db } from "@/lib/db";
import AdminProfilClient from "@/components/admin/AdminProfilClient";

export const metadata: Metadata = { title: "Admin — Profil & Perangkat Desa" };

export default async function AdminProfilPage() {
  // Fetch profile or create default if not found
  let profile = await db.villageProfile.findFirst();
  if (!profile) {
    profile = await db.villageProfile.create({
      data: {
        id: "village-profile-1",
        history: "Sejarah Desa Pojok Klitih...",
        vision: "Visi Desa Pojok Klitih...",
        mission: "Misi Desa Pojok Klitih...",
        kepalaName: "Pemerintah Desa Pojok Klitih",
        kepalaImage: "/images/gambar5.jfif",
        kepalaQuote: "Bersama Membangun Desa yang Maju, Mandiri, Sejahtera, dan Berbudaya.",
        address: "Kantor Desa Pojok Klitih, Kecamatan Plandaan, Kabupaten Jombang, Jawa Timur 61456",
        phone: "-",
        email: "desapojokklitih@gmail.com",
        whatsapp: "",
      },
    });
  }

  // Fetch organization members sorted by order
  const members = await db.organization.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <AdminProfilClient initialProfile={profile} initialMembers={members} />
  );
}
