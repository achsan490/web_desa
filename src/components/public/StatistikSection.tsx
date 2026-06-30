"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Home, Map, Mountain } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const stats = [
  {
    icon: Users,
    label: "Jumlah Penduduk",
    value: 3372,
    unit: "jiwa",
    prefix: "",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Home,
    label: "Jumlah KK",
    value: 900,
    unit: "KK",
    prefix: "±",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Map,
    label: "Jumlah Dusun",
    value: 14,
    unit: "dusun",
    prefix: "",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Mountain,
    label: "Ketinggian",
    value: 44,
    unit: "mdpl",
    prefix: "±",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

function CountUp({
  target,
  duration = 2,
  started,
}: {
  target: number;
  duration?: number;
  started: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return <>{formatNumber(count)}</>;
}

export default function StatistikSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative -mt-16 z-20 pb-0">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1 flex items-center justify-center gap-0.5">
                {stat.prefix && <span className="text-gray-400 font-semibold">{stat.prefix}</span>}
                <CountUp
                  target={stat.value}
                  duration={2}
                  started={isInView}
                />
                <span className="text-xs font-semibold text-gray-500 ml-1">{stat.unit}</span>
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
