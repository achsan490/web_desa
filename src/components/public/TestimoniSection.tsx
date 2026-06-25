"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ibu Sari Wulandari",
    role: "Warga RW 02",
    content:
      "Website desa sangat membantu saya. Sekarang saya bisa mengajukan surat keterangan dari rumah tanpa harus antri di kantor desa. Pelayanannya cepat dan responsif!",
    rating: 5,
    avatar: "SW",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 2,
    name: "Bapak Ahmad Maulana",
    role: "Ketua RT 08",
    content:
      "Informasi desa sekarang sangat mudah diakses. Berita, agenda kegiatan, semua ada di satu tempat. Warga jadi lebih mudah untuk mengikuti perkembangan desa.",
    rating: 5,
    avatar: "AM",
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: 3,
    name: "Pak Hendra Kusuma",
    role: "Pelaku UMKM",
    content:
      "Melalui fitur potensi desa, produk batik saya kini lebih dikenal luas. Sudah banyak pembeli yang datang dari luar kecamatan karena melihat profil di website ini.",
    rating: 5,
    avatar: "HK",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: 4,
    name: "Ibu Dewi Rahayu",
    role: "Anggota PKK",
    content:
      "Fitur pengaduan online sangat membantu. Saya bisa langsung melaporkan masalah di lingkungan dan bisa memantau statusnya. Pemerintah desa juga cepat meresponnya.",
    rating: 5,
    avatar: "DR",
    color: "from-emerald-400 to-teal-500",
  },
];

export default function TestimoniSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div ref={ref} className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700 mb-3">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            Testimoni Warga
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Apa Kata <span className="gradient-text">Warga Kami</span>?
          </h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Kepuasan dan kepercayaan warga adalah prioritas utama kami
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-gray-100" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed text-sm mb-6">
                &ldquo;{item.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
                >
                  {item.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
