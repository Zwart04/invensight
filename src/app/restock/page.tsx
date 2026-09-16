'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

interface Prediction {
  sku: string;
  current: number;
  velocity: number;
  daysLeft: number;
  recommend: number;
  estimatedOut: string;
  category: string;
}

const PREDICTIONS: Prediction[] = [
  { sku: 'Kabel USB-C 2m', current: 890, velocity: 200, daysLeft: 4, recommend: 1000, estimatedOut: '2026-09-20', category: 'Elektronik' },
  { sku: 'PCB Custom 5x5cm', current: 120, velocity: 45, daysLeft: 2, recommend: 500, estimatedOut: '2026-09-18', category: 'Elektronik' },
  { sku: 'Cat Silikon Hitam', current: 60, velocity: 35, daysLeft: 1, recommend: 200, estimatedOut: '2026-09-17', category: 'Perlengkapan' },
  { sku: 'Box Kardus 40x40', current: 5000, velocity: 80, daysLeft: 62, recommend: 1000, estimatedOut: '2026-11-16', category: 'Packaging' },
  { sku: 'Resistor 10k Ohm', current: 4500, velocity: 120, daysLeft: 37, recommend: 500, estimatedOut: '2026-10-23', category: 'Elektronik' },
  { sku: 'Kabel HDMI 1.5m', current: 320, velocity: 55, daysLeft: 5, recommend: 300, estimatedOut: '2026-09-21', category: 'Elektronik' },
  { sku: 'Tutup Plastik 50ml', current: 800, velocity: 40, daysLeft: 20, recommend: 400, estimatedOut: '2026-10-06', category: 'Packaging' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Elektronik': '#6366f1',
  'Bahan Baku': '#22c55e',
  'Packaging': '#f59e0b',
  'Perlengkapan': '#ef4444',
  'Lainnya': '#8b5cf6',
};

export default function RestockPage() {
  const [predictions, setPredictions] = useState<Prediction[]>(PREDICTIONS);
  const [selected, setSelected] = useState<Prediction | null>(null);

  const totalRecommend = predictions.reduce((s, p) => s + p.recommend, 0);
  const urgent = predictions.filter(p => p.daysLeft <= 3).length;
  const critical = predictions.filter(p => p.daysLeft <= 1).length;

  const categorySummary = predictions.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { total: 0, count: 0 };
    acc[p.category].total += p.recommend;
    acc[p.category].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">AI Restock Predictions</h1>
      <p className="text-zinc-500 mb-6">Prediksi kapan stok akan habis berdasarkan velocity dan seasonality.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-sm text-zinc-500 mb-1">Total Rekomendasi Order</p>
          <p className="text-3xl font-bold text-indigo-600">{totalRecommend.toLocaleString()} unit</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-sm text-zinc-500 mb-1">Urgent (&lt;=3 hari)</p>
          <p className="text-3xl font-bold text-yellow-600">{urgent} SKU</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-sm text-zinc-500 mb-1">Critical (&lt;=1 hari)</p>
          <p className="text-3xl font-bold text-red-600">{critical} SKU</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4">Rekomendasi per Kategori</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(categorySummary).map(([cat, data]) => (
            <div key={cat} className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800" style={{ backgroundColor: `${CATEGORY_COLORS[cat]}10` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                <span className="font-medium text-sm">{cat}</span>
              </div>
              <p className="text-2xl font-bold">{data.total.toLocaleString()}</p>
              <p className="text-xs text-zinc-500">{data.count} SKU</p>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Detail Prediksi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                <th className="text-left py-3 px-5 font-medium">SKU</th>
                <th className="text-left py-3 px-5 font-medium">Kategori</th>
                <th className="text-right py-3 px-5 font-medium">Stok Saat Ini</th>
                <th className="text-right py-3 px-5 font-medium">Velocity (per hari)</th>
                <th className="text-right py-3 px-5 font-medium">Estimasi Hari Tersisa</th>
                <th className="text-right py-3 px-5 font-medium">Estimasi Kapan Habis</th>
                <th className="text-right py-3 px-5 font-medium">Rekomendasi Order</th>
                <th className="text-right py-3 px-5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr
                  key={p.sku}
                  className={`border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors ${
                    selected?.sku === p.sku ? 'bg-indigo-50 dark:bg-indigo-950/30' : ''
                  }`}
                  onClick={() => setSelected(selected?.sku === p.sku ? null : p)}
                >
                  <td className="py-3 px-5 font-medium">{p.sku}</td>
                  <td className="py-3 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${CATEGORY_COLORS[p.category]}15`, color: CATEGORY_COLORS[p.category] }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[p.category] }} />
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right font-mono">{p.current.toLocaleString()}</td>
                  <td className="py-3 px-5 text-right text-zinc-500">{p.velocity}/hari</td>
                  <td className="py-3 px-5 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.daysLeft <= 1
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                        : p.daysLeft <= 3
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                    }`}>
                      {p.daysLeft === 1 ? '1 hari' : `${p.daysLeft} hari`}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right text-zinc-500">{p.estimatedOut}</td>
                  <td className="py-3 px-5 text-right font-medium text-indigo-600">+{p.recommend.toLocaleString()}</td>
                  <td className="py-3 px-5 text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.daysLeft <= 1 ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : p.daysLeft <= 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                    }`}>
                      {p.daysLeft <= 1 ? 'CRIT' : p.daysLeft <= 3 ? 'URGENT' : 'OK'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected detail */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-lg w-full p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{selected.sku}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Kategori</span><span className="font-medium">{selected.category}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Stok Saat Ini</span><span className="font-mono font-medium">{selected.current.toLocaleString()} unit</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Velocity Rata-rata</span><span className="font-mono">{selected.velocity} unit/hari</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Estimasi Habis</span><span className="font-medium text-red-600">{selected.estimatedOut}</span></div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 mt-3 flex justify-between">
                <span className="text-zinc-500">Rekomendasi Order</span>
                <span className="text-xl font-bold text-indigo-600">{selected.recommend.toLocaleString()} unit</span>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
