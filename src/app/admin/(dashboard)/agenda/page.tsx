import type { Metadata } from "next";
import { db } from "@/lib/db";
import AdminAgendaClient from "@/components/admin/AdminAgendaClient";

export const metadata: Metadata = { title: "Admin — Agenda Kegiatan" };

export default async function AdminAgendaPage() {
  const agendas = await db.agenda.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manajemen Agenda Kegiatan</h1>
          <p className="text-gray-500 text-sm mt-1">{agendas.length} total agenda kegiatan</p>
        </div>
      </div>
      <AdminAgendaClient initialData={agendas} />
    </div>
  );
}
