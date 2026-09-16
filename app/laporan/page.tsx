"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { StatusBadge } from "@/lib/components/status-badge";
import { useState, useMemo } from "react";
import { Download, FileText, Calendar, Printer, CheckCircle, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";

export default function LaporanPage() {
  const { t } = useApp();
  const { items, alerts, addAlert, addFinanceEntry } = useInventory();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const stats = useMemo(() => {
    const total = items.length;
    const totalValue = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const totalMin = items.reduce((sum, i) => sum + i.minStock, 0);
    const lowStock = items.filter((i) => i.status === "minimal" || i.status === "ready_restock" || i.status === "out_of_stock").length;
    const categoryBreakdown: Record<string, { count: number; value: number }> = {};
    items.forEach((i) => {
      if (!categoryBreakdown[i.category]) categoryBreakdown[i.category] = { count: 0, value: 0 };
      categoryBreakdown[i.category].count++;
      categoryBreakdown[i.category].value += i.quantity * i.unitPrice;
    });
    return { total, totalValue, totalMin, lowStock, categoryBreakdown };
  }, [items]);

  const handleGeneratePDF = () => {
    setGenerating(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = 210;
        let y = 20;

        // Header
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageW, 35, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("InvenSight — Laporan Stok Mingguan", 14, 18);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`, 14, 26);

        y = 45;
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        // Date range
        const from = dateFrom ? new Date(dateFrom + "T00:00:00") : new Date();
        const to = dateTo ? new Date(dateTo + "T23:59:59") : new Date();
        doc.text(`Rentang: ${from.toLocaleDateString("id-ID")} — ${to.toLocaleDateString("id-ID")}`, 14, y);
        y += 8;

        // Summary stats
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(14, y, pageW - 28, 22, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(`Total SKU: ${stats.total}  |  Total Nilai: Rp ${stats.totalValue.toLocaleString("id-ID")}  |  Stok Minim: ${stats.lowStock}`, 18, y + 8);
        y += 28;

        // Low stock warning
        const lowItems = items.filter((i) => i.status !== "normal");
        if (lowItems.length > 0) {
          doc.setTextColor(244, 63, 94);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(`Peringatan: ${lowItems.length} item di bawah stok minimum`, 14, y);
          y += 8;
          doc.setTextColor(107, 114, 128);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          lowItems.forEach((item) => {
            const label = item.status === "out_of_stock" ? "HABIS" : item.status === "ready_restock" ? "SIAP RESTOCK" : "MINIMAL";
            doc.text(`  • ${item.name} (${item.sku}): ${item.quantity}/${item.minStock} unit [${label}]`, 18, y);
            y += 5;
            if (y > 270) { doc.addPage(); y = 20; }
          });
          y += 5;
        }

        // Table header
        y += 3;
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(14, y - 2, pageW - 28, 8, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        const colW = (pageW - 28) / 5;
        doc.text("Nama Barang", 16, y + 3);
        doc.text("SKU", 16 + colW * 1, y + 3);
        doc.text("Kategori", 16 + colW * 2, y + 3);
        doc.text("Stok", 16 + colW * 3, y + 3);
        doc.text("Nilai", 16 + colW * 4, y + 3);
        y += 10;

        // Table rows
        doc.setTextColor(209, 213, 219);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        items.forEach((item) => {
          const rowH = 5;
          doc.text(item.name.substring(0, 28), 16, y);
          doc.text(item.sku, 16 + colW * 1, y);
          doc.text(item.category.substring(0, 18), 16 + colW * 2, y);
          doc.text(String(item.quantity), 16 + colW * 3, y);
          doc.text(`Rp ${Math.round(item.quantity * item.unitPrice).toLocaleString("id-ID")}`, 16 + colW * 4, y);
          y += rowH;
          if (y > 270) { doc.addPage(); y = 20; }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let p = 1; p <= pageCount; p++) {
          doc.setPage(p);
          doc.setTextColor(107, 114, 128);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.text(`Halaman ${p} dari ${pageCount}`, pageW / 2, 290, { align: "center" });
          doc.text("InvenSight Inventory OS — Confidential", 14, 290);
          doc.text(`Page ${p}`, pageW - 14, 290, { align: "right" });
        }

        doc.save(`invensight-laporan-${new Date().toISOString().split("T")[0]}.pdf`);

        setGenerated(true);
        setGenerating(false);
        addAlert({
          id: `alert-export-${Date.now()}`,
          type: "export_complete",
          severity: "low",
          message: `Laporan stok mingguan diekspor — ${items.length} SKU tercakup`,
          createdAt: new Date().toISOString(),
          read: false,
        });
        addFinanceEntry({
          id: `fin-export-${Date.now()}`,
          type: "auto-export",
          category: "Inventory Export",
          description: `Laporan stok mingguan diekspor (${items.length} SKU)`,
          source: "invensight:export",
          amount: 0,
          ts: new Date().toISOString(),
        });
      } catch (err) {
        console.error("PDF generation failed:", err);
        setGenerating(false);
      }
    }, 300);
  };

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t("reports.title")}</h1>
            <p className="mt-1 text-sm text-gray-400">Generate laporan stok mingguan dalam PDF</p>
          </div>

          {generated && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-700/50 bg-emerald-950/30 px-4 py-3">
              <CheckCircle size={16} className="text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-300">{t("reports.exportComplete")}</p>
                <p className="text-xs text-emerald-400/70">{items.length} SKU tercakup dalam laporan</p>
              </div>
            </div>
          )}

          <div className="mb-8 grid gap-6 lg:grid-cols-3">
            {/* Config */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
                <FileText size={18} className="text-gray-400" />
                {t("reports.generate")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">{t("reports.dateRange")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white focus:border-gray-600 focus:outline-none"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white focus:border-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleGeneratePDF}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      {t("reports.downloadPDF")}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <h3 className="mb-3 text-sm font-medium text-gray-300">Ringkasan</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("reports.totalItems")}:</span>
                    <span className="text-white font-mono">{stats.total} SKU</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("reports.totalValue")}:</span>
                    <span className="text-white font-mono">Rp {stats.totalValue.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minimal threshold total:</span>
                    <span className="text-white font-mono">{stats.totalMin} unit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Perlu perhatian:</span>
                    <span className={`font-mono ${stats.lowStock > 0 ? "text-rose-400" : "text-emerald-400"}`}>{stats.lowStock} item</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <h3 className="mb-3 text-sm font-medium text-gray-300">Per kategori</h3>
                <div className="space-y-2">
                  {Object.entries(stats.categoryBreakdown).map(([cat, data]) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{cat}</span>
                      <span className="text-gray-400 font-mono text-xs">{data.count} SKU · Rp {Math.round(data.value).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview area */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
            {!generated ? (
              <>
                <Printer size={40} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Konfigurasikan rentang tanggal lalu klik {t("reports.downloadPDF")}</p>
                <p className="mt-1 text-sm text-gray-500">PDF akan mencakup: ringkasan stok, daftar per SKU, peringatan stok minim</p>
              </>
            ) : (
              <div className="flex items-center justify-center gap-3 text-emerald-400">
                <CheckCircle size={24} />
                <p className="text-sm font-medium">Laporan siap — cek file download di browser</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
