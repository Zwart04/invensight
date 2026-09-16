"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, Users, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const { t } = useApp();
  const { items, suppliers, alerts, setItems, setSuppliers, setAlerts, addAlert, addFinanceEntry } = useInventory();

  const [orgName, setOrgName] = useState("UMKM Toko Bersama");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleSaveSettings = () => {
    addAlert({
      id: `alert-settings-${Date.now()}`,
      type: "stock_update",
      severity: "low",
      message: `Pengaturan disimpan — organisasi: ${orgName}, threshold stok: ${lowStockThreshold} unit`,
      createdAt: new Date().toISOString(),
      read: false,
    });
    addFinanceEntry({
      id: `fin-settings-${Date.now()}`,
      type: "auto-task",
      category: "Settings",
      description: `Pengaturan disimpan: ${orgName}`,
      source: "invensight:auto-task",
      amount: 0,
      ts: new Date().toISOString(),
    });
    alert(t("common.save") + " — pengaturan tersimpan di localStorage");
  };

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t("settings.title")}</h1>
            <p className="mt-1 text-sm text-gray-400">Kelola profil dan preferensi aplikasi</p>
          </div>

          <div className="space-y-6">
            {/* Organization */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Users size={18} className="text-gray-400" />
                <h2 className="text-lg font-medium text-white">{t("settings.organization")}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Nama organisasi</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Lokasi gudang</label>
                  <input
                    type="text"
                    value="Jl. Industri No. 42, Surabaya"
                    readOnly
                    className="w-full rounded-lg bg-gray-900/50 border border-gray-800 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Operator</label>
                  <input
                    type="text"
                    value="Admin Utama"
                    readOnly
                    className="w-full rounded-lg bg-gray-900/50 border border-gray-800 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Bell size={18} className="text-gray-400" />
                <h2 className="text-lg font-medium text-white">{t("settings.notifications")}</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">Notifikasi in-app (toast)</p>
                    <p className="text-xs text-gray-500">Tampilkan toast untuk alert stok dan ekspor</p>
                  </div>
                  <button
                    onClick={() => setNotifEnabled(!notifEnabled)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      notifEnabled
                        ? "border-emerald-600 bg-emerald-900/30 text-emerald-300"
                        : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-white"
                    }`}
                  >
                    {notifEnabled ? "Aktif" : "Nonaktif"}
                  </button>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">{t("settings.lowStockThreshold")}</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* API keys (mock) */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Shield size={18} className="text-gray-400" />
                <h2 className="text-lg font-medium text-white">{t("settings.apiKeys")}</h2>
              </div>
              <p className="mb-3 text-xs text-gray-500">Kunci API berikut adalah mock/data dummy untuk demonstrasi.</p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">Supplier API Key</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="sk_mock_supplier_abc123"
                      readOnly
                      className="flex-1 rounded-lg bg-gray-900/50 border border-gray-800 px-3 py-2 text-xs font-mono text-gray-400 cursor-not-allowed"
                    />
                    <button
                      className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-xs text-gray-400 hover:text-white"
                      onClick={() => navigator.clipboard?.writeText("sk_mock_supplier_abc123")}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">BMKG Weather API Key</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="mock_bmkg_weather_xyz"
                      readOnly
                      className="flex-1 rounded-lg bg-gray-900/50 border border-gray-800 px-3 py-2 text-xs font-mono text-gray-400 cursor-not-allowed"
                    />
                    <button
                      className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-xs text-gray-400 hover:text-white"
                      onClick={() => navigator.clipboard?.writeText("mock_bmkg_weather_xyz")}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="mb-3 text-lg font-medium text-white">Tentang</h2>
              <div className="space-y-2 text-sm text-gray-400">
                <p><span className="text-gray-300">Versi:</span> 1.0.0</p>
                <p><span className="text-gray-300">Build:</span> {new Date().toISOString().split("T")[0]}</p>
                <p><span className="text-gray-300">Stack:</span> Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui</p>
                <p><span className="text-gray-300">Lisensi:</span> MIT — Open Source</p>
                <p className="mt-2">Dibuat oleh Zwart — InvenSight Inventory OS</p>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              <Save size={14} />
              {t("common.save")} Pengaturan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
