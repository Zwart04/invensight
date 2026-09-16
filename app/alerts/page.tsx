"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { useState, useMemo } from "react";
import { AlertTriangle, Bell, Check, X, Download, Filter, Eye } from "lucide-react";

export default function AlertsPage() {
  const { t } = useApp();
  const { alerts, markAlertRead, setAlerts } = useInventory();
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "low_stock" | "restock_prediction" | "export_complete" | "stock_update">("all");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== "all" && a.severity !== severityFilter) return false;
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (readFilter === "unread" && a.read) return false;
      if (readFilter === "read" && !a.read) return false;
      return true;
    });
  }, [alerts, severityFilter, typeFilter, readFilter]);

  const stats = useMemo(() => ({
    total: alerts.length,
    unread: alerts.filter((a) => !a.read).length,
    high: alerts.filter((a) => a.severity === "high" && !a.read).length,
    medium: alerts.filter((a) => a.severity === "medium" && !a.read).length,
  }), [alerts]);

  const handleMarkAllRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
  };

  const handleExportCSV = () => {
    const header = "Tanggal,Tipe,Severity,SKU,Pesan,Dibaca\n";
    const rows = filtered.map((a) =>
      `"${a.createdAt}","${a.type}","${a.severity}","${a.sku || "-"}","${(a.message).replace(/"/g, '""')}","${a.read}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invensight-alerts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const typeLabel = (type: string) => {
    if (type === "low_stock") return t("alerts.lowStock");
    if (type === "restock_prediction") return t("alerts.restockPrediction");
    if (type === "export_complete") return t("alerts.exportComplete");
    return t("dashboard.stockIn");
  };

  const severityColor = (s: string) => {
    if (s === "high") return "text-red-400 bg-red-900/30 border-red-700/30";
    if (s === "medium") return "text-amber-400 bg-amber-900/30 border-amber-700/30";
    return "text-gray-400 bg-gray-800/50 border-gray-700";
  };

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{t("alerts.title")}</h1>
              <p className="mt-1 text-sm text-gray-400">{stats.unread} belum dibaca dari {stats.total} total</p>
            </div>
            <div className="flex items-center gap-2">
              {stats.unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
                >
                  <Check size={12} />
                  Tandai semua dibaca
                </button>
              )}
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
              >
                <Download size={12} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-400">{t("alerts.severity")} Tinggi (belum dibaca)</p>
              <p className="mt-1 text-2xl font-bold text-red-400">{stats.high}</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-400">{t("alerts.severity")} Sedang (belum dibaca)</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">{stats.medium}</p>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Filter size={12} className="text-gray-500" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-1.5 text-xs text-gray-300 focus:border-gray-600 focus:outline-none"
            >
              <option value="all">Semua tingkat</option>
              <option value="high">{t("alerts.high")}</option>
              <option value="medium">{t("alerts.medium")}</option>
              <option value="low">{t("alerts.low")}</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-1.5 text-xs text-gray-300 focus:border-gray-600 focus:outline-none"
            >
              <option value="all">Semua tipe</option>
              <option value="low_stock">{t("alerts.lowStock")}</option>
              <option value="restock_prediction">{t("alerts.restockPrediction")}</option>
              <option value="export_complete">{t("alerts.exportComplete")}</option>
              <option value="stock_update">Update stok</option>
            </select>
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value as any)}
              className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-1.5 text-xs text-gray-300 focus:border-gray-600 focus:outline-none"
            >
              <option value="all">Semua status baca</option>
              <option value="unread">Belum dibaca</option>
              <option value="read">Sudah dibaca</option>
            </select>
          </div>

          {/* Alert list */}
          <div className="space-y-2">
            {filtered.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl border p-4 transition-colors ${alert.read ? "border-gray-800 bg-gray-900/30 opacity-70" : "border-gray-700/50 bg-gray-900/60 hover:bg-gray-900/80"}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => !alert.read && markAlertRead(alert.id)}
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${alert.read ? "border-gray-700 text-gray-600" : "border-emerald-600 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50"}`}
                    aria-label={alert.read ? "Sudah dibaca" : "Tandai dibaca"}
                  >
                    {alert.read ? <Check size={12} /> : <Bell size={12} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`rounded border px-2 py-0.5 text-xs font-medium ${severityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500">{typeLabel(alert.type)}</span>
                      {alert.sku && <span className="text-xs text-gray-600 font-mono">{alert.sku}</span>}
                    </div>
                    <p className="mt-1 text-sm text-gray-200">{alert.message}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(alert.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-700 py-12 text-center">
                <AlertTriangle size={28} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">Tidak ada peringatan untuk filter ini</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
