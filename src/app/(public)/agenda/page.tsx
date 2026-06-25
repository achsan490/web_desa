import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatDate, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";
import { Calendar, Clock, MapPin } from "lucide-react";
import AgendaCalendarClient from "@/components/public/AgendaCalendarClient";

export const metadata: Metadata = {
  title: "Agenda Desa",
  description: "Jadwal kegiatan dan agenda resmi Desa Sukamaju.",
};

export const revalidate = 300;

export default async function AgendaPage() {
  const agendas = await db.agenda.findMany({
    where: { isPublished: true },
    orderBy: { date: "asc" },
  });

  const upcoming = agendas.filter((a) => new Date(a.date) >= new Date());
  const past = agendas.filter((a) => new Date(a.date) < new Date());

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-br from-amber-600 to-amber-800 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Agenda Desa</h1>
          <p className="text-amber-200 text-lg">{upcoming.length} kegiatan mendatang</p>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <AgendaCalendarClient agendas={agendas.map(a => ({ id: a.id, date: a.date.toISOString(), title: a.title }))} />
          </div>

          {/* Agenda List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Agenda Mendatang
                </h2>
                <div className="space-y-4">
                  {upcoming.map((item) => {
                    const d = new Date(item.date);
                    return (
                      <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex flex-col items-center justify-center text-white flex-shrink-0">
                          <span className="text-xl font-black leading-none">{d.getDate()}</span>
                          <span className="text-xs opacity-80">{d.toLocaleString("id-ID", { month: "short" })}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <span className={`badge text-xs flex-shrink-0 ${STATUS_COLORS[item.status]}`}>
                              {STATUS_LABELS[item.status]}
                            </span>
                          </div>
                          {item.description && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>}
                          <div className="flex flex-wrap gap-4 mt-2">
                            {item.startTime && (
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="h-3 w-3" />
                                {item.startTime}{item.endTime ? ` – ${item.endTime}` : ""} WIB
                              </span>
                            )}
                            {item.location && (
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <MapPin className="h-3 w-3" />
                                {item.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-500 mb-4">Agenda Selesai</h2>
                <div className="space-y-3 opacity-60">
                  {past.slice(0, 5).map((item) => {
                    const d = new Date(item.date);
                    return (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-200 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-gray-600">{d.getDate()}</span>
                          <span className="text-xs text-gray-400">{d.toLocaleString("id-ID", { month: "short" })}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 text-sm">{item.title}</p>
                          {item.location && <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{item.location}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
