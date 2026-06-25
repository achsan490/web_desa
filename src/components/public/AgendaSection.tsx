"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { formatDate, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";

type AgendaItem = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: Date;
  startTime: string | null;
  endTime: string | null;
  status: string;
};

export default function AgendaSection({ agenda }: { agenda: AgendaItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <div ref={ref} className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700 mb-3">
              <Calendar className="h-3.5 w-3.5" />
              Jadwal
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Agenda <span className="gradient-text">Desa</span>
            </h2>
            <p className="text-gray-500 mt-2">
              Kegiatan dan acara yang akan segera dilaksanakan
            </p>
          </div>
          <Link
            href="/agenda"
            className="flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all text-sm"
          >
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Agenda Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agenda.slice(0, 6).map((item, i) => {
            const dateObj = new Date(item.date);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex gap-4"
              >
                {/* Date Badge */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex flex-col items-center justify-center text-white shadow-md">
                    <span className="text-xl font-black leading-none">
                      {dateObj.getDate()}
                    </span>
                    <span className="text-xs font-medium opacity-80">
                      {dateObj.toLocaleString("id-ID", { month: "short" })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <span
                      className={`badge text-xs flex-shrink-0 ${STATUS_COLORS[item.status]}`}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}

                  <div className="space-y-1">
                    {item.startTime && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>
                          {item.startTime}
                          {item.endTime ? ` – ${item.endTime}` : ""} WIB
                        </span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {agenda.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            Belum ada agenda yang akan datang.
          </div>
        )}
      </div>
    </section>
  );
}
