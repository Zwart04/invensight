'use client';
import { useState, useEffect } from 'react';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  createdAt: string;
}

const DEFAULT_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'PT Persada Elektronik', email: 'sales@persada.co.id', phone: '+62 21 555 0101', address: 'Jl. Industri Barat 88, Jakarta', active: true, createdAt: '2025-03-15' },
  { id: '2', name: 'CV Mitra Packaging', email: 'order@mitrapack.co.id', phone: '+62 21 555 0202', address: 'Jl. Packing Barat 12, Bekasi', active: true, createdAt: '2025-05-20' },
  { id: '3', name: 'UD Maju Karya', email: 'udmajukarya@gmail.com', phone: '+62 812 3456 7890', address: 'Jl. Raya Solo Km 5, Solo', active: true, createdAt: '2025-07-10' },
  { id: '4', name: 'Toko Bangunan Jaya', email: 'admin@jayabangun.com', phone: '+62 21 555 0303', address: 'Jl. C construction 7, Surabaya', active: false, createdAt: '2025-01-05' },
];

export default function SuppliersPage({ navigate }: { navigate: (href: string) => void }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', active: true });

  useEffect(() => {
    const stored = localStorage.getItem('inv_suppliers');
    if (stored) setSuppliers(JSON.parse(stored));
    else {
      localStorage.setItem('inv_suppliers', JSON.stringify(DEFAULT_SUPPLIERS));
      setSuppliers(DEFAULT_SUPPLIERS);
    }
  }, []);

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editing) {
      setSuppliers(prev => prev.map(s => s.id === editing.id ? { ...s, ...form, id: s.id, createdAt: s.createdAt } : s));
    } else {
      const newSup: Supplier = { ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString().split('T')[0] };
      setSuppliers(prev => [newSup, ...prev]);
    }
    localStorage.setItem('inv_suppliers', JSON.stringify(suppliers));
    setModalOpen(false);
    setEditing(null);
    setForm({ name: '', email: '', phone: '', address: '', active: true });
  };

  const remove = (id: string) => {
    if (!confirm('Hapus supplier ini?')) return;
    setSuppliers(prev => prev.filter(s => s.id !== id));
    localStorage.setItem('inv_suppliers', JSON.stringify(suppliers));
  };

  const startEdit = (s: Supplier) => { setEditing(s); setForm({ name: s.name, email: s.email, phone: s.phone, address: s.address, active: s.active }); setModalOpen(true); };

  const activeCount = suppliers.filter(s => s.active).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-zinc-500">
            <span className="font-semibold text-indigo-600">{activeCount}</span> aktif dari {suppliers.length}
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', address: '', active: true }); setModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Supplier Baru
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                <th className="text-left py-3 px-4 font-medium">Nama</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Telepon</th>
                <th className="text-left py-3 px-4 font-medium">Alamat</th>
                <th className="text-center py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                  <td className="py-3 px-4 font-medium">{s.name}</td>
                  <td className="py-3 px-4 text-zinc-500">{s.email}</td>
                  <td className="py-3 px-4 text-zinc-500 font-mono text-xs">{s.phone}</td>
                  <td className="py-3 px-4 text-zinc-500 text-xs max-w-xs truncate">{s.address}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.active ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
                    }`}>
                      {s.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => startEdit(s)} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium mr-3">Edit</button>
                    <button onClick={() => remove(s.id)} className="text-red-600 hover:text-red-700 text-xs font-medium">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{editing ? 'Edit Supplier' : 'Supplier Baru'}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Perusahaan</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="PT Persada Elektronik" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="sales@example.co.id" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Telepon</label>
                  <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={form.active ? 'true' : 'false'} onChange={e => setForm(f => ({ ...f, active: e.target.value === 'true' }))} className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800">
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={2} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Batal</button>
              <button onClick={save} className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
