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
        history: "Sejarah Desa Sukamaju...",
        vision: "Visi Desa Sukamaju...",
        mission: "Misi Desa Sukamaju...",
        kepalaName: "H. Ahmad Fauzi, S.Sos",
        kepalaImage: null,
        kepalaQuote: "Membangun bersama warga.",
        address: "Jl. Raya Sukamaju No. 1",
        phone: "(0251) 123456",
        email: "desasukamaju@gmail.com",
        whatsapp: "628123456789",
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
