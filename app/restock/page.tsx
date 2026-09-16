"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { computeRestockPrediction } from "@/lib/data";
import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import { Sparkles, Calendar, TrendingUp, ArrowRight } from "lucide-react";

export default function RestockPage() {
  const { t } = useApp();
  const { items, addAlert, addFinanceEntry } = useInventory();
  const [selectedSku, setSelectedSku] = useState("");
  const [prediction, setPrediction] = useState<any>(null);

  const skus = items.map((i) => ({ value: i.sku, label: `${i.name} (${i.sku})` }));

  useEffect(() => {
    if (!selectedSku) { setPrediction(null); return; }
    const item = items.find((i) => i.sku === selectedSku);
    if (item) {
      const pred = computeRestockPrediction(item);
      setPrediction(pred);
      addAlert({
        id: `alert-restock-${Date.now()}`,
        type: "restock_prediction",
        severity: "medium",
        sku: item.sku,
        message: `Prediksi restock untuk ${item.name} diperbarui: ${pred.predictedQuantity} unit, confidence ${pred.confidence}%`,
        createdAt: new Date().toISOString(),
        read: false,
      });
      addFinanceEntry({
        id: `fin-restock-${Date.now()}`,
        type: "auto-task",
        category: "Restock",
        description: `Prediksi restock diperbarui untuk ${item.name}: ${pred.predictedQuantity} unit (confidence ${pred.confidence}%)`,
        source: "invensight:auto-restock",
        amount: item.unitPrice * pred.predictedQuantity,
        ts: new Date().toISOString(),
      });
    }
  }, [selectedSku, items, addAlert, addFinanceEntry]);

  const selectedItem = selectedSku ? items.find((i) => i.sku === selectedSku) : null;

  const chartData = prediction ? [
    { date: "D-6", actual: prediction.trend7d[0] ?? 0, forecast: null },
    { date: "D-5", actual: prediction.trend7d[1] ?? 0, forecast: null },
    { date: "D-4", actual: prediction.trend7d[2] ?? 0, forecast: null },
    { date: "D-3", actual: prediction.trend7d[3] ?? 0, forecast: null },
    { date: "D-2", actual: prediction.trend7d[4] ?? 0, forecast: null },
    { date: "D-1", actual: prediction.trend7d[5] ?? 0, forecast: null },
    { date: "D0", actual: prediction.trend7d[6] ?? items.find((i) => i.sku === selectedSku)?.quantity ?? 0, forecast: null },
    { date: "D+1", actual: null, forecast: prediction.prediction7d[0] ?? 0, lower: prediction.lowerBand[0] ?? 0, upper: prediction.upperBand[0] ?? 0 },
    { date: "D+2", actual: null, forecast: prediction.prediction7d[1] ?? 0, lower: prediction.lowerBand[1] ?? 0, upper: prediction.upperBand[1] ?? 0 },
    { date: "D+3", actual: null, forecast: prediction.prediction7d[2] ?? 0, lower: prediction.lowerBand[2] ?? 0, upper: prediction.upperBand[2] ?? 0 },
    { date: "D+4", actual: null, forecast: prediction.prediction7d[3] ?? 0, lower: prediction.lowerBand[3] ?? 0, upper: prediction.upperBand[3] ?? 0 },
    { date: "D+5", actual: null, forecast: prediction.prediction7d[4] ?? 0, lower: prediction.lowerBand[4] ?? 0, upper: prediction.upperBand[4] ?? 0 },
    { date: "D+6", actual: null, forecast: prediction.prediction7d[5] ?? 0, lower: prediction.lowerBand[5] ?? 0, upper: prediction.upperBand[5] ?? 0 },
    { date: "D+7", actual: null, forecast: prediction.prediction7d[6] ?? 0, lower: prediction.lowerBand[6] ?? 0, upper: prediction.upperBand[6] ?? 0 },
  ] : [];

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t("restock.title")}</h1>
            <p className="mt-1 text-sm text-gray-400">Prediksi berdasarkan kecepatan stok 30 hari terakhir</p>
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-3">
            {/* Form */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="mb-4 text-lg font-medium text-white">{t("restock.selectSKU")}</h2>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2.5 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Pilih SKU...</option>
                {skus.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              {selectedItem && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("product.name")}:</span>
                    <span className="text-white">{selectedItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("product.quantity")}:</span>
                    <span className="text-white font-mono">{selectedItem.quantity} unit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("product.velocity")}:</span>
                    <span className="text-white font-mono">{selectedItem.velocity30d} unit/hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("product.minStock")}:</span>
                    <span className="text-white font-mono">{selectedItem.minStock} unit</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prediction result */}
            {prediction && (
              <div className="lg:col-span-2 rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-white">{t("restock.predictedQuantity")}</h2>
                    <p className="mt-1 text-3xl font-bold text-emerald-400 font-mono">{prediction.predictedQuantity} <span className="text-lg text-emerald-300">unit</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{t("restock.confidence")}</p>
                      <p className="text-2xl font-bold text-white font-mono">{prediction.confidence}%</p>
                    </div>
                    <ArrowRight size={20} className="text-emerald-500" />
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-gray-900/60 p-3">
                    <p className="text-xs text-gray-400">{t("restock.velocity")}</p>
                    <p className="text-lg font-medium text-white font-mono">{prediction.velocity} <span className="text-sm text-gray-400">unit/hari</span></p>
                  </div>
                  <div className="rounded-lg bg-gray-900/60 p-3">
                    <p className="text-xs text-gray-400">{t("restock.estimatedDate")}</p>
                    <p className="text-lg font-medium text-white font-mono">{prediction.estimatedDate}</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }}
                        labelStyle={{ color: "#9ca3af" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="none"
                        fill="url(#colorForecast)"
                        name="upper"
                      />
                      <Area
                        type="monotone"
                        dataKey="lower"
                        stroke="none"
                        fill="url(#colorForecast)"
                        name="lower"
                      />
                      <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t("restock.trend7Days")} />
                      <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }} name={t("restock.prediction7Days")} />
                      <ReferenceLine y={selectedItem?.minStock ?? 0} stroke="#f43f5e" strokeDasharray="5 5" label={{ value: "Min stock", fill: "#f43f5e", fontSize: 10 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  <span className="text-blue-400">{t("restock.trend7Days")}</span> |{" "}
                  <span className="text-emerald-400">{t("restock.prediction7Days")}</span> |{" "}
                  <span className="text-gray-500">{t("restock.confidenceBand")} (area)</span> |{" "}
                  <span className="text-rose-400">Min stock line</span>
                </p>
              </div>
            )}

            {!prediction && (
              <div className="lg:col-span-2 rounded-xl border border-dashed border-gray-700 bg-gray-900/30 p-12 text-center">
                <Sparkles size={32} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">Pilih SKU untuk melihat prediksi restock</p>
                <p className="mt-1 text-sm text-gray-500">Prediksi didasarkan pada kecepatan stok 30 hari terakhir</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
