"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { BarChart3, TrendingUp, Users, TrendingDown } from "lucide-react";

const SOURCE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AnalyticsPage() {
  const { t } = useApp();
  const { items, alerts, finance } = useInventory();
  const [source, setSource] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source") || params.get("utm_medium") || params.get("utm_campaign") || "direct";
    const stored = localStorage.getItem("iv_source");
    if (!stored) {
      localStorage.setItem("iv_source", utm);
      setSource(utm);
    } else {
      setSource(stored);
    }
  }, []);

  const visitsBySource = useMemo(() => {
    const stored = localStorage.getItem("iv_source_visits");
    const data = stored ? JSON.parse(stored) : {};
    const current = localStorage.getItem("iv_source") || "direct";
    data[current] = (data[current] || 0) + 1;
    localStorage.setItem("iv_source_visits", JSON.stringify(data));
    return Object.entries(data).map(([name, value]) => ({ source: name, visits: value }));
  }, []);

  const stats = useMemo(() => ({
    totalSKU: items.length,
    totalValue: items.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
    lowStock: items.filter((i) => i.status === "ready_restock" || i.status === "out_of_stock").length,
    minimalStock: items.filter((i) => i.status === "minimal").length,
    normalStock: items.filter((i) => i.status === "normal").length,
    totalAlerts: alerts.length,
    unreadAlerts: alerts.filter((a) => !a.read).length,
    totalExports: finance.filter((f) => f.type === "auto-export").length,
    totalFinanceEntries: finance.length,
    totalRestockPredicted: finance.filter((f) => f.source.includes("restock")).length,
  }), [items, alerts, finance]);

  // Stock distribution by category
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((i) => { map[i.category] = (map[i.category] || 0) + i.quantity; });
    return Object.entries(map).map(([name, value]) => ({ category: name, quantity: value }));
  }, [items]);

  // Finance trend last 14 days
  const financeTrend = useMemo(() => {
    const today = new Date();
    const data: { date: string; entries: number; amount: number }[] = [];
    for (let d = 13; d >= 0; d--) {
      const date = new Date(today.getTime() - d * 86400000);
      const dateStr = date.toISOString().split("T")[0];
      const entries = finance.filter((f) => f.ts.startsWith(dateStr));
      data.push({
        date: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
        entries: entries.length,
        amount: entries.reduce((s, e) => s + e.amount, 0),
      });
    }
    return data;
  }, [finance]);

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t("analytics.title")}</h1>
            <p className="mt-1 text-sm text-gray-400">Dashboard analitik — visibilitas penuh atas operasi inventaris</p>
          </div>

          {/* KPI cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Total SKU", value: stats.totalSKU, icon: <BarChart3 size={16} className="text-blue-400" />, color: "border-blue-500/20 bg-blue-900/20" },
              { label: "Total Value", value: `Rp ${stats.totalValue.toLocaleString("id-ID")}`, icon: <TrendingUp size={16} className="text-emerald-400" />, color: "border-emerald-500/20 bg-emerald-900/20" },
              { label: "Low Stock Alerts", value: stats.lowStock, icon: <TrendingDown size={16} className="text-rose-400" />, color: "border-rose-500/20 bg-rose-900/20" },
              { label: "Unread Alerts", value: stats.unreadAlerts, icon: <Users size={16} className="text-amber-400" />, color: "border-amber-500/20 bg-amber-900/20" },
            ].map((kpi, idx) => (
              <div key={idx} className={`rounded-xl border ${kpi.color} p-4`}>
                <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-400">
                  {kpi.icon}
                  {kpi.label}
                </div>
                <p className="text-2xl font-bold text-white font-mono">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {/* Stock distribution pie */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
                <PieChart size={18} className="text-gray-400" />
                {t("analytics.stockDistribution")}
              </h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="quantity"
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                {categoryData.map((d, i) => (
                  <div key={d.category} className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                    <span className="text-gray-300">{d.category}</span>
                    <span className="text-gray-500 font-mono">{d.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top SKUs by value */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-gray-400" />
                {t("analytics.topSKUs")}
              </h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={items.sort((a, b) => b.quantity * b.unitPrice - a.quantity * a.unitPrice).slice(0, 8).map((i) => ({
                    name: i.name.length > 12 ? i.name.substring(0, 12) + "..." : i.name,
                    value: i.quantity * i.unitPrice,
                    sku: i.sku,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={9} />
                    <YAxis stroke="#6b7280" fontSize={9} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb", fontSize: "11px" }}
                      formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, "Nilai Stok"]}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Nilai Stok" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Finance trend */}
          <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              {t("finance.cumulative")} — {t("finance.autoJournal")}
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financeTrend}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb", fontSize: "11px" }}
                    formatter={(value: number) => [`Rp ${Math.abs(value).toLocaleString("id-ID")}`, "Jumlah"]}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fill="url(#colorAmount)" name="Auto-journal" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {t("finance.autoJournal")}: {stats.totalFinanceEntries} entri · {stats.totalExports} ekspor · {stats.totalRestockPredicted} prediksi restock
            </p>
          </div>

          {/* Source attribution */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
              <Users size={18} className="text-violet-400" />
              {t("analytics.sourceAttribution")}
            </h2>
            {visitsBySource.length > 0 ? (
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitsBySource.sort((a, b) => b.visits - a.visits)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                    <XAxis type="number" stroke="#6b7280" fontSize={10} />
                    <YAxis dataKey="source" type="category" stroke="#6b7280" fontSize={10} width={80} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb", fontSize: "11px" }}
                    />
                    <Bar dataKey="visits" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Kunjungan" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
                Belum ada kunjungan dengan UTM source
              </div>
            )}
            {source && (
              <p className="mt-2 text-xs text-gray-500">Sumber saat ini: {source} (disimpan di localStorage.iv_source)</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
