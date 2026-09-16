'use client';
import { useState, useMemo } from 'react';
import {downloadCSV, downloadExcel, downloadPDF} from '@/lib/export';

const MOVEMENTS = [
  { id: 1, date: '2026-09-15', sku: 'Kabel USB-C 2m', type: 'Masuk', qty: 500, ref: 'PO-2026-042', notes: 'Penerimaan dari supplier' },
  { id: 2, date: '2026-09-15', sku: 'Resistor 10k', type: 'Keluar', qty: 120, ref: 'SO-2026-018', notes: 'Pengiriman ke customer' },
  { id: 3, date: '2026-09-14', sku: 'PCB Custom 5x5cm', type: 'Masuk', qty: 200, ref: 'PO-2026-041', notes: 'Manufacturing batch #44' },
  { id: 4, date: '2026-09-14', sku: 'Box Kardus 40x40', type: 'Masuk', qty: 1000, ref: 'PO-2026-040', notes: 'Supplier: PT Persada' },
  { id: 5, date: '2026-09-13', sku: 'Cat Silikon Hitam', type: 'Keluar', qty: 35, ref: 'SO-2026-017', notes: 'Retail outlet Jakarta' },
  { id: 6, date: '2026-09-13', sku: 'Kabel HDMI 1.5m', type: 'Adjustment', qty: 5, ref: '-', notes: 'Found damaged during QC' },
  { id: 7, date: '2026-09-12', sku: 'Tutup Plastik 50ml', type: 'Masuk', qty: 1500, ref: 'PO-2026-039', notes: 'Restock terjadwal' },
  { id: 8, date: '2026-09-12', sku: 'Resistor 100k', type: 'Keluar', qty: 200, ref: 'SO-2026-016', notes: 'Bulk order PT Maju' },
  { id: 9, date: '2026-09-11', sku: 'Kabel USB-C 2m', type: 'Return', qty: 10, ref: 'SO-2026-015', notes: 'Customer return — defective' },
  { id: 10, date: '2026-09-10', sku: 'PCB Custom 5x5cm', type: 'Masuk', qty: 150, ref: 'PO-2026-038', notes: 'Urgent order' },
];

const TYPES = ['Semua', 'Masuk', 'Keluar', 'Adjustment', 'Return'];
const TYPE_COLORS: Record<string, string> = {
  Masuk: '#22c55e',
  Keluar: '#ef4444',
  Adjustment: '#f59e0b',
  Return: '#8b5cf6',
};

export default function JournalPage({ navigate }: { navigate: (href: string) => void }) {
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return MOVEMENTS.filter(m => {
      if (filter !== 'Semua' && m.type !== filter) return false;
      if (search && !m.sku.toLowerCase().includes(search.toLowerCase()) && !m.ref.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filter, search]);

  const totalIn = MOVEMENTS.filter(m => m.type === 'Masuk').reduce((s, m) => s + m.qty, 0);
  const totalOut = MOVEMENTS.filter(m => m.type === 'Keluar' || m.type === 'Return').reduce((s, m) => s + m.qty, 0);
  const totalAdj = MOVEMENTS.filter(m => m.type === 'Adjustment').reduce((s, m) => s + Math.abs(m.qty), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Stock Movement Journal</h1>
        <div className="flex gap-2">
          <button
            onClick={() => downloadCSV(MOVEMENTS)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => downloadExcel(MOVEMENTS)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg transition-colors"
          >
            Export Excel
          </button>
          <button
            onClick={() => downloadPDF(MOVEMENTS, 'Stock Movement Journal')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-zinc-500 mb-1">Total Masuk</p>
          <p className="text-xl font-bold text-green-600">{totalIn.toLocaleString()} unit</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-zinc-500 mb-1">Total Keluar</p>
          <p className="text-xl font-bold text-red-600">{totalOut.toLocaleString()} unit</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-zinc-500 mb-1">Adjustment</p>
          <p className="text-xl font-bold text-yellow-600">{totalAdj.toLocaleString()} unit</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === t
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari SKU atau referensi..."
          className="flex-1 min-w-[200px] px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                <th className="text-left py-3 px-4 font-medium">Tanggal</th>
                <th className="text-left py-3 px-4 font-medium">SKU</th>
                <th className="text-left py-3 px-4 font-medium">Jenis</th>
                <th className="text-right py-3 px-4 font-medium">Qty</th>
                <th className="text-left py-3 px-4 font-medium">Referensi</th>
                <th className="text-left py-3 px-4 font-medium">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                  <td className="py-3 px-4 text-zinc-500">{m.date}</td>
                  <td className="py-3 px-4 font-medium">{m.sku}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${TYPE_COLORS[m.type]}15`, color: TYPE_COLORS[m.type] }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: TYPE_COLORS[m.type] }} />
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {m.type === 'Keluar' || m.type === 'Return' ? '-' : '+'}{m.qty.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-zinc-500 font-mono text-xs">{m.ref}</td>
                  <td className="py-3 px-4 text-zinc-500 max-w-xs truncate">{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-zinc-500">
            Tidak ada data yang cocok dengan filter.
          </div>
        )}
      </div>
    </div>
  );
}
