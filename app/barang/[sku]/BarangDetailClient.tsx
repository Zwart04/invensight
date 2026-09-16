"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Package } from "lucide-react";
import { useState } from "react";

type Props = { sku: string };

export default function BarangDetailClient({ sku }: Props) {
  const { t } = useApp();
  const { items, addStockIn, addStockOut, alerts, addAlert } = useInventory();
  const [stockInQty, setStockInQty] = useState("");
  const [stockOutQty, setStockOutQty] = useState("");
  const [note, setNote] = useState("");

  const item = items.find((i) => i.sku === sku);

  if (!item) {
    return (
      <main className="flex flex-col">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-gray-950">
          <div className="text-center">
            <Package size={32} className="mx-auto text-gray-600 mb-4" />
            <h1 className="text-xl font-medium text-white">Barang tidak ditemukan</h1>
            <p className="mt-1 text-sm text-gray-400">SKU {sku} tidak ada dalam sistem</p>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Kembali ke Dasbor
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleStockIn = () => {
    const qty = parseInt(stockInQty, 10);
    if (isNaN(qty) || qty <= 0) return;
    addStockIn(item.sku, qty, note || undefined);
    setStockInQty("");
    setNote("");
    addAlert({
      id: `alert-${Date.now()}`,
      type: "stock_update",
      severity: "low",
      sku: item.sku,
      message: `Stok ${item.name} ditambah ${qty} unit`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  };

  const handleStockOut = () => {
    const qty = parseInt(stockOutQty, 10);
    if (isNaN(qty) || qty <= 0) return;
    addStockOut(item.sku, qty, note || undefined);
    setStockOutQty("");
    setNote("");
    addAlert({
      id: `alert-${Date.now()}`,
      type: "stock_update",
      severity: item.quantity - qty <= item.minStock ? "high" : "medium",
      sku: item.sku,
      message: `Stok ${item.name} dikurangi ${qty} unit`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  };

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="mb-4 flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Kembali ke Dasbor
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{item.name}</h1>
            <p className="mt-1 text-sm text-gray-400 font-mono">{item.sku}</p>
          </div>

          <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: t("product.quantity"), value: item.quantity, color: item.status === "normal" ? "text-emerald-400" : item.status === "ready_restock" ? "text-rose-400" : "text-amber-400" },
                { label: t("product.minStock"), value: item.minStock, color: "text-gray-300" },
                { label: "Nilai total", value: `Rp ${(item.quantity * item.unitPrice).toLocaleString("id-ID")}`, color: "text-blue-400" },
                { label: t("product.location"), value: item.location, color: "text-gray-300" },
              ].map((stat, idx) => (
                <div key={idx} className="rounded-lg bg-gray-900/60 p-4">
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className={`mt-1 text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-4 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${item.status === "normal" ? "bg-emerald-900/30 text-emerald-300" : item.status === "minimal" ? "bg-amber-900/30 text-amber-300" : item.status === "ready_restock" ? "bg-rose-900/30 text-rose-300" : "bg-red-900/30 text-red-300"}`}>
                <div className={`h-2 w-2 rounded-full ${item.status === "normal" ? "bg-emerald-500" : item.status === "minimal" ? "bg-amber-500" : item.status === "ready_restock" ? "bg-rose-500" : "bg-red-500"}`} />
                {t(`dashboard.status${item.status.charAt(0).toUpperCase() + item.status.slice(1).replace("_", "")}`)}
              </span>
              <span className="text-xs text-gray-500">{t("product.category")}: {item.category}</span>
            </div>

            <div className="rounded-lg bg-gray-950/50 p-4">
              <h3 className="mb-3 text-sm font-medium text-gray-300">Aksi cepat stok</h3>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={t("product.quantity")}
                    value={stockInQty}
                    onChange={(e) => setStockInQty(e.target.value)}
                    min="1"
                    className="w-24 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none text-center"
                  />
                  <input
                    type="text"
                    placeholder="Catatan (opsional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                  />
                  <button
                    onClick={handleStockIn}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 flex items-center gap-1.5"
                  >
                    <TrendingDown size={14} />
                    Stok masuk
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={t("product.quantity")}
                    value={stockOutQty}
                    onChange={(e) => setStockOutQty(e.target.value)}
                    min="1"
                    className="w-24 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-rose-500 focus:outline-none text-center"
                  />
                  <input
                    type="text"
                    placeholder="Catatan (opsional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                  />
                  <button
                    onClick={handleStockOut}
                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 flex items-center gap-1.5"
                  >
                    <TrendingUp size={14} />
                    Stok keluar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <div className="border-b border-gray-800 px-4 py-3">
              <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} />
                Riwayat transaksi (terakhir 30)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {item.transactions.slice(-30).reverse().map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{tx.date}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${tx.type === "in" ? "border-emerald-700/30 bg-emerald-900/20 text-emerald-300" : "border-rose-700/30 bg-rose-900/20 text-rose-300"}`}>
                          {tx.type === "in" ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                          {tx.type === "in" ? "Masuk" : "Keluar"}
                        </span>
                      </td>
                      <td className={`px-4 py-2.5 font-mono ${tx.type === "in" ? "text-emerald-400" : "text-rose-400"}`}>
                        {tx.type === "in" ? "+" : "-"} {tx.quantity}
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs">{tx.note || "-"}</td>
                    </tr>
                  ))}
                  {item.transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-500 text-sm">Belum ada transaksi</td>
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
