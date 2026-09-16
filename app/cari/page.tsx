"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { StatusBadge } from "@/lib/components/status-badge";
import { useState, useMemo, useCallback } from "react";
import { Search, X, ArrowUpDown, Download } from "lucide-react";

export default function SearchPage() {
  const { t } = useApp();
  const { items, addStockIn, addStockOut } = useInventory();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"stock" | "name" | "date">("stock");
  const [quickInSku, setQuickInSku] = useState("");
  const [quickInQty, setQuickInQty] = useState("");
  const [quickOutSku, setQuickOutSku] = useState("");
  const [quickOutQty, setQuickOutQty] = useState("");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    let result = items.filter((item) => {
      if (query && !item.name.toLowerCase().includes(query.toLowerCase()) &&
        !item.sku.toLowerCase().includes(query.toLowerCase()) &&
        !item.category.toLowerCase().includes(query.toLowerCase())) return false;
      if (category !== "all" && item.category !== category) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "stock") return b.quantity - a.quantity;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.lastTransaction).getTime() - new Date(a.lastTransaction).getTime();
    });

    return result;
  }, [items, query, category, statusFilter, sortBy]);

  const handleQuickIn = useCallback(() => {
    if (!quickInSku || !quickInQty) return;
    const qty = parseInt(quickInQty, 10);
    if (isNaN(qty) || qty <= 0) return;
    addStockIn(quickInSku, qty);
    setQuickInSku("");
    setQuickInQty("");
  }, [quickInSku, quickInQty, addStockIn]);

  const handleQuickOut = useCallback(() => {
    if (!quickOutSku || !quickOutQty) return;
    const qty = parseInt(quickOutQty, 10);
    if (isNaN(qty) || qty <= 0) return;
    addStockOut(quickOutSku, qty);
    setQuickOutSku("");
    setQuickOutQty("");
  }, [quickOutSku, quickOutQty, addStockOut]);

  const exportCSV = () => {
    const header = "Name,SKU,Category,Quantity,MinStock,Location,UnitPrice,Status\n";
    const rows = filtered.map((i) =>
      `"${i.name}","${i.sku}","${i.category}",${i.quantity},${i.minStock},"${i.location}",${i.unitPrice},"${i.status}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invensight-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t("search.title")}</h1>
            <p className="mt-1 text-sm text-gray-400">{t("search.placeholder")}</p>
          </div>

          {/* Search bar */}
          <div className="mb-6">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder={t("search.placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 pl-11 pr-10 text-base text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Filters row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-300 focus:border-gray-600 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === "all" ? "Semua kategori" : c}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-300 focus:border-gray-600 focus:outline-none"
            >
              <option value="all">Semua status</option>
              <option value="normal">Normal</option>
              <option value="minimal">Minimal</option>
              <option value="ready_restock">Siap restock</option>
              <option value="out_of_stock">Habis</option>
            </select>
            <div className="flex items-center gap-1">
              <ArrowUpDown size={14} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-300 focus:border-gray-600 focus:outline-none"
              >
                <option value="stock">Urutkan stok</option>
                <option value="name">Urutkan nama</option>
                <option value="date">Urutkan tanggal</option>
              </select>
            </div>
            <span className="text-sm text-gray-400 ml-auto">{filtered.length} {t("product.name").toLowerCase()}</span>
          </div>

          {/* Quick actions */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-700/30 bg-emerald-950/20 p-3">
              <p className="mb-2 text-xs font-medium text-emerald-400">{t("dashboard.recordStockIn")}</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("product.sku")}
                  value={quickInSku}
                  onChange={(e) => setQuickInSku(e.target.value.toUpperCase())}
                  className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder={t("product.quantity")}
                  value={quickInQty}
                  onChange={(e) => setQuickInQty(e.target.value)}
                  min="1"
                  className="w-20 rounded-lg bg-gray-900 border border-gray-700 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={handleQuickIn}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  {t("common.save")}
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-rose-700/30 bg-rose-950/20 p-3">
              <p className="mb-2 text-xs font-medium text-rose-400">{t("dashboard.recordStockOut")}</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("product.sku")}
                  value={quickOutSku}
                  onChange={(e) => setQuickOutSku(e.target.value.toUpperCase())}
                  className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-rose-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder={t("product.quantity")}
                  value={quickOutQty}
                  onChange={(e) => setQuickOutQty(e.target.value)}
                  min="1"
                  className="w-20 rounded-lg bg-gray-900 border border-gray-700 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-rose-500 focus:outline-none"
                />
                <button
                  onClick={handleQuickOut}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-500"
                >
                  {t("common.save")}
                </button>
              </div>
            </div>
          </div>

          {/* Results table */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t("search.title")} — {filtered.length} hasil</span>
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
              >
                <Download size={12} />
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">{t("product.name")}</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">{t("product.sku")}</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">{t("product.category")}</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">{t("product.quantity")}</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">{t("product.minStock")}</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">{t("product.location")}</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">{t("product.lastTransaction")}</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-4 py-2.5 text-white font-medium">{item.name}</td>
                      <td className="px-4 py-2.5 text-gray-400 font-mono text-xs">{item.sku}</td>
                      <td className="px-4 py-2.5 text-gray-300">{item.category}</td>
                      <td className="px-4 py-2.5 text-white font-mono">{item.quantity}</td>
                      <td className="px-4 py-2.5 text-gray-400 font-mono">{item.minStock}</td>
                      <td className="px-4 py-2.5 text-gray-300">{item.location}</td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{item.lastTransaction}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                        <Search size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t("search.noResults")}</p>
                        <p className="mt-1 text-xs text-gray-600">Coba ubah kata kunci atau filter</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
