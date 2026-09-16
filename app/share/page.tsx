"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { useState } from "react";
import { Link as LinkIcon, Copy, Check, MessageSquare, ExternalLink } from "lucide-react";

export default function SharePage() {
  const { t } = useApp();
  const { items } = useInventory();
  const [shareText, setShareText] = useState("");

  const encodedConfig = typeof window !== "undefined" ? btoa(JSON.stringify({
    items: items.slice(0, 20).map((i) => ({ sku: i.sku, name: i.name, category: i.category, quantity: i.quantity, minStock: i.minStock, status: i.status })),
    exportedAt: new Date().toISOString(),
    source: "invensight",
  })) : "";

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share?config=${encodedConfig}`
    : `https://invensight.zwart.qzz.io/share?config=${encodedConfig}`;

  const waUrl = `https://wa.me/?text=${encodeURIComponent(`InvenSight Inventory Config\n${shareUrl}`)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareText(t("share.copySuccess"));
      setTimeout(() => setShareText(""), 2500);
    } catch {
      setShareText("Gagal menyalin — coba manual");
      setTimeout(() => setShareText(""), 2500);
    }
  };

  const handleOpenWA = () => {
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank", "noopener");
    }
  };

  const handleDecode = () => {
    const configParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("config") : null;
    if (!configParam) return;
    try {
      const data = JSON.parse(atob(configConfig));
      alert(`Config decoded: ${data.items?.length || 0} items, exported ${new Date(data.exportedAt || "").toLocaleString()}`);
    } catch {
      alert("Config tidak valid");
    }
  };

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t("share.title")}</h1>
            <p className="mt-1 text-sm text-gray-400">Bagikan konfigurasi stok tanpa data sensitif — hanya snapshot katalog</p>
          </div>

          <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
              <LinkIcon size={18} className="text-gray-400" />
              Tautan Share
            </h2>

            <div className="mb-4 overflow-hidden rounded-lg border border-gray-700 bg-gray-950 py-2">
              <p className="mx-3 truncate text-xs text-gray-400 font-mono">{shareUrl}</p>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-xs text-gray-400 font-mono cursor-pointer focus:border-emerald-500 focus:outline-none"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={handleCopyLink}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 flex items-center gap-1.5"
              >
                {shareText === t("share.copySuccess") ? <Check size={14} /> : <Copy size={14} />}
                {shareText || "Salin tautan"}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Ceklis konfigurasi: snapshot {items.length} SKU pertama (nama, stok, status) — tanpa harga atau data keuangan
            </p>

            {shareText && (
              <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
                <Check size={14} />
                {shareText}
              </div>
            )}
          </div>

          <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-gray-400" />
              {t("share.waLink")}
            </h2>
            <p className="mb-4 text-sm text-gray-400">Buka WhatsApp dengan tautan share sudah terisi di pesan</p>
            <button
              onClick={handleOpenWA}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-gray-600 hover:text-white flex-wrap"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Buka WhatsApp
            </button>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
              <ExternalLink size={18} className="text-gray-400" />
              Decode Config
            </h2>
            <p className="mb-4 text-sm text-gray-400">Masukkan tautan share atau kode config untuk melihat snapshot</p>
            <button
              onClick={handleDecode}
              className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
            >
              Decode dari URL saat ini
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
