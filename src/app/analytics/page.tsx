'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const CATEGORIES = ['Elektronik', 'Bahan Baku', 'Packaging', 'Perlengkapan', 'Lainnya'];
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const MOCK_STOCK = [
  { name: 'Elektronik', total: 4850000, items: 45, lowStock: 3 },
  { name: 'Bahan Baku', total: 2100000, items: 120, lowStock: 18 },
  { name: 'Packaging', total: 780000, items: 200, lowStock: 8 },
  { name: 'Perlengkapan', total: 320000, items: 60, lowStock: 2 },
  { name: 'Lainnya', total: 540000, items: 30, lowStock: 5 },
];

const TURNOVER_DATA = [
  { month: 'Jul', in: 12500000, out: 9800000 },
  { month: 'Aug', in: 14200000, out: 11500000 },
  { month: 'Sep', in: 13800000, out: 10200000 },
];

const TOP_SKUS = [
  { name: 'Resistor 10k', stock: 4500, velocity: 120 },
  { name: 'Kabel USB-C', stock: 890, velocity: 200 },
  { name: 'PCB Custom', stock: 120, velocity: 45 },
  { name: 'Box Kardus', stock: 5000, velocity: 80 },
  { name: 'Cat Silikon', stock: 60, velocity: 35 },
];

const PREDICTIONS = [
  { sku: 'Kabel USB-C', current: 890, velocity: 200, daysLeft: 4, recommend: 1000, estimatedOut: '2026-09-20' },
  { sku: 'PCB Custom', current: 120, velocity: 45, daysLeft: 2, recommend: 500, estimatedOut: '2026-09-18' },
  { sku: 'Cat Silikon', current: 60, velocity: 35, daysLeft: 1, recommend: 200, estimatedOut: '2026-09-17' },
];

const CATEGORY_PIE = [
  { name: 'Elektronik', value: 45 },
  { name: 'Bahan Baku', value: 120 },
  { name: 'Packaging', value: 200 },
  { name: 'Perlengkapan', value: 60 },
  { name: 'Lainnya', value: 30 },
];

const SOURCE_DATA = [
  { name: 'Direct', value: 12 },
  { name: 'Twitter', value: 8 },
  { name: 'LinkedIn', value: 5 },
  { name: 'WhatsApp', value: 20 },
];

function Badge({ className, variant = 'default', children }: { className?: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline'; children: React.ReactNode }) {
  const variants: Record<string, string> = {
    default: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
    secondary: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
    destructive: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
    outline: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
  };
  return <span className={variants[variant] + (className || '')}>{children}</span>;
}

export default function AnalyticsPage() {
  const totalValue = MOCK_STOCK.reduce((s: number, c: typeof MOCK_STOCK[0]) => s + c.total, 0);
  const totalItems = MOCK_STOCK.reduce((s: number, c: typeof MOCK_STOCK[0]) => s + c.items, 0);
  const totalLowStock = MOCK_STOCK.reduce((s: number, c: typeof MOCK_STOCK[0]) => s + c.lowStock, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-sm text-zinc-500 mb-1">Total Nilai Inventaris</p>
          <p className="text-3xl font-bold">Rp {totalValue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-sm text-zinc-500 mb-1">Total Item</p>
          <p className="text-3xl font-bold">{totalItems}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-sm text-zinc-500 mb-1">Low Stock Alert</p>
          <p className="text-3xl font-bold text-red-600">{totalLowStock}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Nilai Stok per Kategori</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_STOCK}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={v => `Rp ${v / 1000000}M`} />
              <Tooltip formatter={(v: number) => [`Rp ${(v as number).toLocaleString('id-ID')}`, 'Nilai']} />
              <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Distribusi Item per Kategori</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={CATEGORY_PIE}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {CATEGORY_PIE.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Stock Movement (Masuk vs Keluar)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={TURNOVER_DATA}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={v => `Rp ${v / 1000000}M`} />
              <Tooltip formatter={(v: number) => [`Rp ${(v as number).toLocaleString('id-ID')}`, '']} />
              <Legend />
              <Line type="monotone" dataKey="in" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Masuk" />
              <Line type="monotone" dataKey="out" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Keluar" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Top 5 SKU Berdasarkan Velocity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={TOP_SKUS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="name" width={100} fontSize={12} />
              <Tooltip />
              <Bar dataKey="velocity" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Velocity (unit/hari)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4">AI Restock Predictions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="text-left py-2 px-3 font-medium">SKU</th>
                <th className="text-right py-2 px-3 font-medium">Stok Saat Ini</th>
                <th className="text-right py-2 px-3 font-medium">Velocity</th>
                <th className="text-right py-2 px-3 font-medium">Hari Tersisa</th>
                <th className="text-right py-2 px-3 font-medium">Rekomendasi Order</th>
                <th className="text-right py-2 px-3 font-medium">Estimasi Habis</th>
              </tr>
            </thead>
            <tbody>
              {PREDICTIONS.map((p, i) => (
                <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="py-2 px-3 font-medium">{p.sku}</td>
                  <td className="py-2 px-3 text-right">{p.current.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">{p.velocity}/hari</td>
                  <td className="py-2 px-3 text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.daysLeft <= 3 ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {p.daysLeft} hari
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-indigo-600">{p.recommend.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-zinc-500">{p.estimatedOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-4">Traffic Source Attribution</h2>
        <p className="text-sm text-zinc-500 mb-4">Sumber kunjungan berdasarkan UTM parameter (tanpa Pixel/GA)</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={SOURCE_DATA}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
