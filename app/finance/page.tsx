"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { useMemo } from "react";
import { Receipt, TrendingUp, CreditCard, Banknote } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function FinancePage() {
  const { t } = useApp();
  const { finance } = useInventory();

  const stats = useMemo(() => {
    const entries = finance;
    const total = entries.length;
    const byCategory: Record<string, { count: number; amount: number }> = {};
    entries.forEach((e) => {
      if (!byCategory[e.category]) byCategory[e.category] = { count: 0, amount: 0 };
      byCategory[e.category].count++;
      byCategory[e.category].amount += e.amount;
    });
    const totalAmount = entries.reduce((s, e) => s + e.amount, 0);
    const autoTask = entries.filter((e) => e.type === "auto-task").length;
    const autoExport = entries.filter((e) => e.type === "auto-export").length;
    const autoVendor = entries.filter((e) => e.type === "auto-vendor").length;
    const trend: { date: string; entries: number; amount: number }[] = [];
    const today = new Date();
    for (let d = 29; d >= 0; d--) {
      const date = new Date(today.getTime() - d * 86400000);
      const dateStr = date.toISOString().split("T")[0];
      const dayEntries = entries.filter((e) => e.ts.startsWith(dateStr));
      trend.push({
        date: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
        entries: dayEntries.length,
        amount: dayEntries.reduce((s, e) => s + e.amount, 0),
      });
    }
    return { total, byCategory, totalAmount, autoTask, autoExport, autoVendor, trend };
  }, [finance]);

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t("finance.title")}</h1>
            <p className="mt-1 text-sm text-gray-400">{t("finance.autoJournal")} — entry otomatis dari aktivitas inventaris</p>
          </div>

          {/* KPI */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Total entries", value: stats.total, icon: <Receipt size={16} className="text-blue-400" />, color: "border-blue-500/20 bg-blue-900/20" },
              { label: "Total amount", value: `Rp ${Math.abs(stats.totalAmount).toLocaleString("id-ID")}`, icon: <CreditCard size={16} className="text-emerald-400" />, color: "border-emerald-500/20 bg-emerald-900/20" },
              { label: "Auto-task", value: stats.autoTask, icon: <TrendingUp size={16} className="text-amber-400" />, color: "border-amber-500/20 bg-amber-900/20" },
              { label: "Auto-export", value: stats.autoExport, icon: <Banknote size={16} className="text-violet-400" />, color: "border-violet-500/20 bg-violet-900/20" },
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
            {/* Finance trend chart */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" />
                {t("finance.cumulative")} 30 hari
              </h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.trend}>
                    <defs>
                      <linearGradient id="colorAmountFin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                    <YAxis stroke="#6b7280" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb", fontSize: "11px" }}
                      formatter={(value: number) => [`Rp ${Math.abs(value).toLocaleString("id-ID")}`, "Jumlah"]}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fill="url(#colorAmountFin)" name="Auto-journal" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* By category */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
                <CreditCard size={18} className="text-gray-400" />
                {t("finance.byCategory")}
              </h2>
              <div className="space-y-3">
                {Object.entries(stats.byCategory).map(([cat, data]) => (
                  <div key={cat} className="flex items-center justify-between rounded-lg bg-gray-900/40 p-3">
                    <span className="text-sm text-gray-300">{cat}</span>
                    <div className="text-right">
                      <p className="text-sm font-mono text-white">{data.count} entri</p>
                      <p className="text-xs font-mono text-gray-400">Rp {Math.abs(data.amount).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                ))}
                {Object.keys(stats.byCategory).length === 0 && (
                  <p className="text-sm text-gray-500 py-4 text-center">Belum ada entry keuangan</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent entries list */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <div className=" border-b border-gray-800 px-4 py-3">
              <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">{t("finance.autoJournal")} — {finance.length} entri terbaru</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {finance.slice(0, 20).map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-4 py-2.5 text-gray-400 text-xs">
                        {new Date(entry.ts).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`rounded border px-2 py-0.5 text-xs font-medium ${
                          entry.type === "auto-task" ? "border-blue-700/30 bg-blue-900/20 text-blue-300" :
                          entry.type === "auto-export" ? "border-emerald-700/30 bg-emerald-900/20 text-emerald-300" :
                          "border-violet-700/30 bg-violet-900/20 text-violet-300"
                        }`}>
                          {entry.type.replace("auto-", "")}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-300">{entry.category}</td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{entry.description}</td>
                      <td className={`px-4 py-2.5 text-right font-mono text-sm ${entry.amount >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {entry.amount >= 0 ? "+" : ""}Rp {Math.abs(entry.amount).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
