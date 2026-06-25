"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Clock, Phone } from "lucide-react";

export default function MapsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-gray-50">
      <div ref={ref} className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-3">
            <MapPin className="h-3.5 w-3.5" />
            Lokasi
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Temukan <span className="gradient-text">Lokasi Kami</span>
          </h2>
          <p className="text-gray-500 mt-2">
            Desa Sukamaju, Kecamatan Ciawi, Kabupaten Bogor, Jawa Barat
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {[
              {
                icon: MapPin,
                title: "Alamat Kantor",
                content:
                  "Jl. Raya Sukamaju No. 1, Kecamatan Ciawi, Kabupaten Bogor, Jawa Barat 16730",
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                icon: Clock,
                title: "Jam Pelayanan",
                content: "Senin – Jumat: 08.00 – 16.00 WIB\nSabtu: 08.00 – 12.00 WIB",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Phone,
                title: "Telepon",
                content: "(0251) 123456\nWhatsApp: 0812-3456-7890",
                color: "bg-amber-100 text-amber-600",
              },
            ].map((info) => (
              <div
                key={info.title}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${info.color} flex items-center justify-center flex-shrink-0`}
                >
                  <info.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">
                    {info.title}
                  </p>
                  <p className="text-gray-500 text-sm whitespace-pre-line">
                    {info.content}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.2!2d106.85!3d-6.627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzYnMzguNyJTIDEwNsKwNTEnMC4wIkU!5e0!3m2!1sid!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Desa Sukamaju"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
