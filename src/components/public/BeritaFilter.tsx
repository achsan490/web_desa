"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { NEWS_CATEGORIES } from "@/lib/utils";
import { cn } from "@/lib/utils";

const allCategories = [
  { value: "SEMUA", label: "Semua" },
  ...NEWS_CATEGORIES,
];

export default function BeritaFilter({
  currentCategory,
  currentQ,
}: {
  currentCategory?: string;
  currentQ?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentQ || "");
  const [isPending, startTransition] = useTransition();

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.delete("page");
    startTransition(() => router.push(`/berita?${params.toString()}`));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ q: search });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berita..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input pl-11 pr-10"
          id="berita-search-input"
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              updateQuery({ q: "" });
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat.value}
            id={`berita-category-${cat.value.toLowerCase()}`}
            onClick={() => updateQuery({ category: cat.value === "SEMUA" ? "" : cat.value })}
            disabled={isPending}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
              (cat.value === "SEMUA"
                ? !currentCategory || currentCategory === "SEMUA"
                : currentCategory === cat.value)
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
