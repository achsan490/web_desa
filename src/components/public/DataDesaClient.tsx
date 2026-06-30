"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import { Users, GraduationCap, Briefcase, Heart, Clock, Home, Map, Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

type Stat = { id: string; category: string; label: string; value: number; year: number };

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#064e3b", "#047857", "#065f46"];

const TABS = [
  { value: "GENDER", label: "Jenis Kelamin", icon: Users },
  { value: "EDUCATION", label: "Pendidikan", icon: GraduationCap },
  { value: "OCCUPATION", label: "Pekerjaan", icon: Briefcase },
  { value: "RELIGION", label: "Agama", icon: Heart },
  { value: "AGE", label: "Usia", icon: Clock },
];

export default function DataDesaClient({ grouped }: { grouped: Record<string, Stat[]> }) {
  const [activeTab, setActiveTab] = useState("GENDER");

  const population = grouped["POPULATION"] || [];
  const currentData = grouped[activeTab] || [];

  const totalPop = population.find((p) => p.label === "Total Penduduk")?.value || 0;
  const totalKK = population.find((p) => p.label === "Jumlah KK")?.value || 0;
  const totalDusun = population.find((p) => p.label === "Jumlah Dusun")?.value || 0;
  const totalKetinggian = population.find((p) => p.label === "Ketinggian")?.value || 0;

  const isPie = activeTab === "GENDER" || activeTab === "RELIGION";

  return (
    <div className="container-custom section-padding">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Total Penduduk", value: totalPop, unit: "jiwa", color: "bg-emerald-600", icon: Users, customValue: null },
          { label: "Kepala Keluarga", value: totalKK, unit: "KK", color: "bg-blue-600", icon: Home, customValue: "±850–950" },
          { label: "Jumlah Dusun", value: totalDusun, unit: "dusun", color: "bg-amber-600", icon: Map, customValue: null },
          { label: "Ketinggian Wilayah", value: totalKetinggian, unit: "mdpl", color: "bg-purple-600", icon: Mountain, customValue: "±44" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3`}>
              <item.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-black text-gray-900">
              {item.customValue ? item.customValue : formatNumber(item.value)}
              <span className="text-xs font-semibold text-gray-450 ml-1">{item.unit}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              id={`data-tab-${tab.value.toLowerCase()}`}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px",
                activeTab === tab.value
                  ? "border-emerald-600 text-emerald-700 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Data {TABS.find((t) => t.value === activeTab)?.label}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Chart */}
            <div className="h-72">
              {isPie ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
                      labelLine={false}
                    >
                      {currentData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatNumber(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip
                      formatter={(value) => [formatNumber(value as number), "Jumlah"]}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
                    />
                    <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]}>
                      {currentData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Table */}
            <div className="space-y-2">
              {currentData.map((item, i) => {
                const total = currentData.reduce((sum, d) => sum + d.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700 truncate">{item.label}</span>
                        <span className="font-semibold text-gray-900 ml-2">
                          {formatNumber(item.value)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 w-10 text-right">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
