"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { useState, useMemo } from "react";
import { Briefcase, Star, Clock, Mail, Phone, Filter, Plus, Edit, Trash2 } from "lucide-react";

export default function SupplierPage() {
  const { t } = useApp();
  const { suppliers, setSuppliers } = useInventory();
  const [filterLead, setFilterLead] = useState<"all" | "short" | "long">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", leadTime: 5, rating: 4 });

  const filtered = useMemo(() => {
    if (filterLead === "all") return suppliers.filter((s) => s.active);
    if (filterLead === "short") return suppliers.filter((s) => s.active && s.leadTime <= 5);
    return suppliers.filter((s) => s.active && s.leadTime > 5);
  }, [suppliers, filterLead]);

  const handleSubmit = () => {
    if (!form.name || !form.contact) return;
    if (editingId) {
      setSuppliers(suppliers.map((s) => s.id === editingId ? { ...s, ...form } : s));
      setEditingId(null);
    } else {
      const newSup = { ...form, id: `sup-${Date.now()}`, active: true, rating: form.rating || 4 };
      setSuppliers([newSup, ...suppliers]);
    }
    setShowForm(false);
    setForm({ name: "", contact: "", leadTime: 5, rating: 4 });
  };

  const handleEdit = (s: any) => {
    setEditingId(s.id);
    setForm({ name: s.name, contact: s.contact, leadTime: s.leadTime, rating: s.rating });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus supplier ini?")) return;
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", contact: "", leadTime: 5, rating: 4 });
  };

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{t("suppliers.title")}</h1>
              <p className="mt-1 text-sm text-gray-400">{suppliers.filter((s) => s.active).length} supplier aktif</p>
            </div>
            <button
              onClick={() => { setEditingId(null); setForm({ name: "", contact: "", leadTime: 5, rating: 4 }); setShowForm(true); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              <Plus size={14} />
              {t("common.add")}
            </button>
          </div>

          {/* Filter */}
          <div className="mb-6 flex items-center gap-2">
            <Filter size={14} className="text-gray-500" />
            <div className="flex gap-1">
              {[
                { key: "all", label: "Semua" },
                { key: "short", label: "Lead time pendek" },
                { key: "long", label: "Lead time panjang" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilterLead(opt.key as any)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filterLead === opt.key ? "bg-emerald-900/40 text-emerald-300" : "bg-gray-800/50 text-gray-400 hover:text-white"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form modal */}
          {showForm && (
            <div className="mb-6 rounded-xl border border-gray-700 bg-gray-900/90 p-6">
              <h2 className="mb-4 text-lg font-medium text-white">{editingId ? "Edit Supplier" : "Tambah Supplier"}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder={t("suppliers.name")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
                <div>
                  <label className="mb-1 block text-xs text-gray-400">{t("suppliers.leadTime")}</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={form.leadTime}
                    onChange={(e) => setForm({ ...form, leadTime: parseInt(e.target.value, 10) || 1 })}
                    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 4 })}
                    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button onClick={handleCancel} className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-gray-300 hover:text-white">
                  {t("common.cancel")}
                </button>
                <button onClick={handleSubmit} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                  {t("common.save")}
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{t("suppliers.name")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{t("suppliers.contact")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{t("suppliers.leadTime")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{t("suppliers.rating")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/30 text-emerald-400 text-xs font-bold">
                            {s.name.charAt(0)}
                          </div>
                          <span className="text-white">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="text-gray-500" />
                          <span className="text-xs">{s.contact}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className={`text-${s.leadTime <= 5 ? "emerald" : "amber"}-400`} />
                          <span className="font-mono text-white">{s.leadTime} hari</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400/20" />
                          <span className="font-mono text-white">{s.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="rounded-lg border border-gray-700 bg-gray-800/50 p-1.5 text-gray-400 transition-colors hover:border-gray-600 hover:text-white"
                            aria-label="Edit"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="rounded-lg border border-gray-700 bg-gray-800/50 p-1.5 text-gray-400 transition-colors hover:border-rose-600 hover:text-rose-400"
                            aria-label="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Tidak ada supplier yang sesuai filter
                      </td>
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
