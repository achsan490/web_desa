"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

export default function SambutanSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      <div className="container-custom">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:mx-0">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-200 rounded-3xl -z-10" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-100 rounded-3xl -z-10" />
              {/* Main image */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=600&q=80"
                  alt="Kepala Desa Sukamaju"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Badge */}
              <div className="absolute bottom-6 left-6 right-6 glass-card rounded-2xl p-4">
                <p className="font-bold text-gray-900 text-sm">
                  H. Ahmad Fauzi, S.Sos
                </p>
                <p className="text-emerald-600 text-xs font-medium">
                  Kepala Desa Sukamaju
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Periode 2021 – 2027
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sambutan Kepala Desa
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
              Bersama Wujudkan{" "}
              <span className="gradient-text">Desa yang Maju</span> dan
              Sejahtera
            </h2>

            {/* Quote */}
            <div className="relative mb-6">
              <Quote className="absolute -top-2 -left-2 h-8 w-8 text-emerald-200" />
              <blockquote className="pl-8 text-gray-600 leading-relaxed text-base md:text-lg italic">
                Bersama warga, kita wujudkan Desa Sukamaju yang maju, mandiri,
                dan sejahtera. Setiap langkah pembangunan adalah wujud nyata
                dari komitmen kita untuk masa depan yang lebih baik.
              </blockquote>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              Puji syukur kehadirat Allah SWT atas berkat dan rahmat-Nya,
              pemerintah Desa Sukamaju terus berkomitmen untuk memberikan
              pelayanan terbaik kepada seluruh masyarakat. Melalui program-program
              inovatif dan semangat gotong royong, kami yakin Desa Sukamaju akan
              terus berkembang menjadi desa yang mandiri dan berdaya saing.
            </p>

            {/* Signature */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                AF
              </div>
              <div>
                <p className="font-bold text-gray-900">H. Ahmad Fauzi, S.Sos</p>
                <p className="text-sm text-gray-500">
                  Kepala Desa Sukamaju · Periode 2021–2027
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
