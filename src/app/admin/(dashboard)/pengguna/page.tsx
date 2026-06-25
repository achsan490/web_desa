import type { Metadata } from "next";
import { db } from "@/lib/db";
import AdminPenggunaClient from "@/components/admin/AdminPenggunaClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Admin — Pengguna Sistem" };

export default async function AdminPenggunaPage() {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Manajemen Pengguna Sistem</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} akun operator / admin terdaftar</p>
      </div>
      <AdminPenggunaClient initialData={users} currentUserId={session.user.id} />
    </div>
  );
}
