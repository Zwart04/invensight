"use client";

import { useApp } from "@/lib/app-provider";
import { useInventory } from "@/lib/store";
import { Navbar } from "@/lib/components/navbar";
import { useEffect, useRef, useState, useMemo } from "react";

export default function HeatmapPage() {
  const { t } = useApp();
  const { items } = useInventory();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSKU, setHoveredSKU] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    if (categoryFilter === "all") return items;
    return items.filter((i) => i.category === categoryFilter);
  }, [items, categoryFilter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const w = rect.width;
    const h = Math.max(400, Math.min(600, w * 0.6));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#0a0f14";
    ctx.fillRect(0, 0, w, h);

    const items_list = filtered;
    if (items_list.length === 0) {
      ctx.fillStyle = "#374151";
      ctx.font = "14px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(t("search.noResults"), w / 2, h / 2);
      return;
    }

    const cols = Math.min(items_list.length, Math.floor(w / 42));
    const rows = Math.ceil(items_list.length / cols);
    const cellW = (w - 20) / cols;
    const cellH = (h - 20) / rows;

    items_list.forEach((item, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 10 + col * cellW;
      const y = 10 + row * cellH;

      let color: string;
      if (item.status === "out_of_stock") color = "#991b1b";
      else if (item.status === "ready_restock") color = "#9f1239";
      else if (item.status === "minimal") color = "#92400e";
      else color = "#065f46";

      const gradient = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, item.status === "normal" ? "#064e3b" : item.status === "minimal" ? "#78350f" : "#450a0a");
      ctx.fillStyle = gradient;

      const pad = 2;
      ctx.beginPath();
      const r = 4;
      ctx.moveTo(x + pad + r, y + pad);
      ctx.lineTo(x + cellW - pad - r, y + pad);
      ctx.quadraticCurveTo(x + cellW - pad, y + pad, x + cellW - pad, y + pad + r);
      ctx.lineTo(x + cellW - pad, y + cellH - pad - r);
      ctx.quadraticCurveTo(x + cellW - pad, y + cellH - pad, x + cellW - pad - r, y + cellH - pad);
      ctx.lineTo(x + pad + r, y + cellH - pad);
      ctx.quadraticCurveTo(x + pad, y + cellH - pad, x + pad, y + cellH - pad - r);
      ctx.lineTo(x + pad, y + pad + r);
      ctx.quadraticCurveTo(x + pad, y + pad, x + pad + r, y + pad);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(item.sku, x + 4, y + 10);
      ctx.font = "9px system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(`${item.quantity}`, x + cellW - 4, y + 10, cellW - 8);
    });

    canvasRef.current = canvas;
  }, [filtered, categoryFilter, t, items]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const items_list = filtered;
    if (items_list.length === 0) {
      setHoveredSKU(null);
      setTooltip(null);
      return;
    }

    const w = rect.width;
    const h = rect.height;
    const cols = Math.min(items_list.length, Math.floor(w / 42));
    const rows = Math.ceil(items_list.length / cols);
    const cellW = (w - 20) / cols;
    const cellH = (h - 20) / rows;

    const col = Math.floor((mx - 10) / cellW);
    const row = Math.floor((my - 10) / cellH);
    const idx = row * cols + col;

    if (idx >= 0 && idx < items_list.length && mx >= 10 && mx < w - 10 && my >= 10 && my < h - 10) {
      const item = items_list[idx];
      setHoveredSKU(item.sku);
      setTooltip({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        minStock: item.minStock,
        status: item.status,
        transactions: item.transactions.length,
        unitPrice: item.unitPrice,
        totalValue: item.quantity * item.unitPrice,
        daysUntilRestock: item.quantity > 0 ? Math.ceil(item.quantity / Math.max(1, item.velocity30d)) : 0,
      });
    } else {
      setHoveredSKU(null);
      setTooltip(null);
    }
  };

  const statusLabel = (status: string) => {
    if (status === "normal") return t("heatmap.legendNormal");
    if (status === "minimal") return t("heatmap.legendMinimal");
    if (status === "ready_restock") return t("heatmap.legendRestock");
    return t("heatmap.legendEmpty");
  };

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{t("heatmap.title")}</h1>
              <p className="mt-1 text-sm text-gray-400">{t("heatmap.showTooltip")}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
            {[
              { status: "normal", color: "bg-emerald-700" },
              { status: "minimal", color: "bg-amber-700" },
              { status: "ready_restock", color: "bg-rose-700" },
              { status: "out_of_stock", color: "bg-red-800" },
            ].map((s) => (
              <div key={s.status} className="flex items-center gap-1.5">
                <div className={`h-3 w-3 rounded ${s.color}`} />
                <span>{statusLabel(s.status)}</span>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="mb-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-300 focus:border-gray-600 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === "all" ? t("heatmap.filterByCategory") + " semua" : c}</option>
              ))}
            </select>
          </div>

          {/* Canvas */}
          <div
            ref={containerRef}
            className="relative rounded-xl border border-gray-800 bg-gray-900/80 overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { setHoveredSKU(null); setTooltip(null); }}
              className="cursor-crosshair"
            />
            {/* Tooltip */}
            {tooltip && (
              <div
                className="pointer-events-none absolute z-10 rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 text-xs shadow-xl"
                style={{
                  left: 12,
                  top: 12,
                  transform: "translateX(calc(100% + 8px))",
                }}
              >
                <p className="font-medium text-white">{tooltip.name}</p>
                <p className="text-gray-400 font-mono">{tooltip.sku}</p>
                <div className="mt-1.5 space-y-0.5 text-gray-300">
                  <p>{t("product.quantity")}: <span className="text-white font-mono">{tooltip.quantity}</span></p>
                  <p>{t("product.minStock")}: <span className="text-white font-mono">{tooltip.minStock}</span></p>
                  <p>{t("product.totalValue")}: <span className="text-white font-mono">Rp {tooltip.totalValue.toLocaleString("id-ID")}</span></p>
                  <p>{t("product.daysUntilRestock")}: <span className="text-white font-mono">{tooltip.daysUntilRestock} hari</span></p>
                  <p>{t("product.lastTransaction")}: <span className="text-gray-400">{tooltip.transactions} transaksi</span></p>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${tooltip.status === "normal" ? "bg-emerald-500" : tooltip.status === "minimal" ? "bg-amber-500" : tooltip.status === "ready_restock" ? "bg-rose-500" : "bg-red-500"}`} />
                  <span className="text-gray-400">{statusLabel(tooltip.status)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
