"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, MessageSquare, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-br from-emerald-600 to-emerald-800 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Butuh Bantuan?
          </h2>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Kami siap melayani Anda. Ajukan permohonan surat online atau sampaikan
            pengaduan Anda dengan mudah dan cepat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/layanan-surat"
              className="flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-emerald-700 shadow-xl hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
            >
              <FileText className="h-5 w-5" />
              Ajukan Surat Online
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pengaduan"
              className="flex items-center gap-2.5 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <MessageSquare className="h-5 w-5" />
              Sampaikan Pengaduan
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
