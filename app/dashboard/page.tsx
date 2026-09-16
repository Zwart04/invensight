"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { StatusBadge } from "@/lib/components/status-badge";
import { useState, useMemo } from "react";
import { ArrowUpRight, ArrowDownRight, Search, Filter, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { t } = useApp();
  const { items, addStockIn, addStockOut } = useInventory();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showStockIn, setShowStockIn] = useState(false);
  const [showStockOut, setShowStockOut] = useState(false);
  const [skuInput, setSkuInput] = useState("");
  const [qtyInput, setQtyInput] = useState("");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "all" && item.category !== category) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      return true;
    });
  }, [items, search, category, statusFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const low = items.filter((i) => i.status === "minimal" || i.status === "ready_restock").length;
    const out = items.filter((i) => i.status === "out_of_stock").length;
    const restock = items.filter((i) => i.status === "ready_restock").length;
    return { total, low, out, restock };
  }, [items]);

  const handleStockIn = () => {
    if (!skuInput || !qtyInput) return;
    const qty = parseInt(qtyInput, 10);
    if (isNaN(qty) || qty <= 0) return;
    addStockIn(skuInput, qty);
    setSkuInput("");
    setQtyInput("");
    setShowStockIn(false);
  };

  const handleStockOut = () => {
    if (!skuInput || !qtyInput) return;
    const qty = parseInt(qtyInput, 10);
    if (isNaN(qty) || qty <= 0) return;
    addStockOut(skuInput, qty);
    setSkuInput("");
    setQtyInput("");
    setShowStockOut(false);
  };

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{t("dashboard.title")}</h1>
              <p className="mt-1 text-sm text-gray-400">{t("dashboard.lastUpdated")}: {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</p>
            </div>
            <button
              onClick={() => {}}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: t("dashboard.totalSKU"), value: stats.total, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, color: "border-blue-500/30 bg-blue-900/20" },
              { label: t("dashboard.lowStock"), value: stats.low, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>, color: "border-amber-500/30 bg-amber-900/20" },
              { label: t("dashboard.outOfStock"), value: stats.out, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>, color: "border-red-500/30 bg-red-900/20" },
              { label: t("dashboard.restockNeeded"), value: stats.restock, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 11v6"/></svg>, color: "border-emerald-500/30 bg-emerald-900/20" },
            ].map((s, idx) => (
              <div key={idx} className={`rounded-xl border ${s.color} p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className="mt-1 text-2xl font-bold text-white">{s.value}</p>
                  </div>
                  <div className="text-gray-500">{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-400">{t("dashboard.quickActions")}:</span>
            <button
              onClick={() => setShowStockIn(!showStockIn)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${showStockIn ? "border-emerald-500 bg-emerald-900/30 text-emerald-300" : "border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white"}`}
            >
              <ArrowDownRight size={12} />
              {t("dashboard.recordStockIn")}
            </button>
            <button
              onClick={() => setShowStockOut(!showStockOut)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${showStockOut ? "border-rose-500 bg-rose-900/30 text-rose-300" : "border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white"}`}
            >
              <ArrowUpRight size={12} />
              {t("dashboard.recordStockOut")}
            </button>
          </div>

          {/* Stock in modal */}
          {showStockIn && (
            <div className="mb-6 rounded-xl border border-emerald-700/50 bg-emerald-950/40 p-4">
              <h3 className="mb-3 text-sm font-medium text-emerald-300">{t("dashboard.recordStockIn")}</h3>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder={t("product.sku")}
                  value={skuInput}
                  onChange={(e) => setSkuInput(e.target.value.toUpperCase())}
                  className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder={t("product.quantity")}
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  min="1"
                  className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={handleStockIn}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  {t("common.save")}
                </button>
              </div>
            </div>
          )}

          {/* Stock out modal */}
          {showStockOut && (
            <div className="mb-6 rounded-xl border border-rose-700/50 bg-rose-950/40 p-4">
              <h3 className="mb-3 text-sm font-medium text-rose-300">{t("dashboard.recordStockOut")}</h3>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder={t("product.sku")}
                  value={skuInput}
                  onChange={(e) => setSkuInput(e.target.value.toUpperCase())}
                  className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-rose-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder={t("product.quantity")}
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  min="1"
                  className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-rose-500 focus:outline-none"
                />
                <button
                  onClick={handleStockOut}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500"
                >
                  {t("common.save")}
                </button>
              </div>
            </div>
          )}

          {/* Search + Filter */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder={t("search.placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-gray-900 border border-gray-700 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className=" rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-300 focus:border-gray-600 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === "all" ? t("common.filter") + " semua" : c}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-300 focus:border-gray-600 focus:outline-none"
            >
              <option value="all">{t("common.filter")} semua status</option>
              <option value="normal">{t("dashboard.statusNormal")}</option>
              <option value="minimal">{t("dashboard.statusMinimal")}</option>
              <option value="ready_restock">{t("dashboard.statusReadyRestock")}</option>
              <option value="out_of_stock">{t("dashboard.statusOutOfStock")}</option>
            </select>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("product.name")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("product.sku")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("product.category")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("product.quantity")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("product.minStock")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("product.location")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{item.sku}</td>
                      <td className="px-4 py-3 text-gray-300">{item.category}</td>
                      <td className="px-4 py-3 text-white font-mono">{item.quantity}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono">{item.minStock}</td>
                      <td className="px-4 py-3 text-gray-300">{item.location}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        {t("search.noResults")}
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
