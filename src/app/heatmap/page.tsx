'use client';
import { useEffect, useRef, useState } from 'react';

const SKU_COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6b7280',
  '#84cc16', '#d946ef', '#0ea5e9', '#eab308', '#a855f7'
];

const generateMockData = () => {
  const categories = ['Elektronik', 'Bahan Baku', 'Packaging', 'Perlengkapan', 'Lainnya'];
  const skus: any[] = [];
  for (let i = 0; i < 20; i++) {
    const cat = categories[i % categories.length];
    skus.push({
      id: `SKU-${String(i + 1).padStart(3, '0')}`,
      category: cat,
      stock: Math.floor(Math.random() * 5000) + 50,
      color: SKU_COLORS[i % SKU_COLORS.length],
    });
  }
  return skus;
};

export default function HeatmapPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; sku: string; stock: number } | null>(null);
  const [cellW, setCellW] = useState(40);
  const [cellH, setCellH] = useState(24);

  useEffect(() => {
    setData(generateMockData());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, w, h);

    const gap = 2;
    const maxCols = Math.floor((w - 20) / (cellW + gap));
    const totalRows = Math.ceil(data.length / maxCols);

    let maxStock = 0;
    data.forEach(d => { if (d.stock > maxStock) maxStock = d.stock; });

    const drawCell = (x: number, y: number, stock: number, color: string) => {
      const intensity = Math.min(1, stock / (maxStock || 1));
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      // Gradient from light to full color
      const lr = Math.round(240 + (r - 240) * intensity);
      const lg = Math.round(240 + (g - 240) * intensity);
      const lb = Math.round(240 + (b - 240) * intensity);

      ctx.fillStyle = `rgb(${lr}, ${lg}, ${lb})`;
      ctx.beginPath();
      ctx.roundRect(x, y, cellW, cellH, 4);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, cellW, cellH, 4);
      ctx.stroke();

      // Stock number
      ctx.fillStyle = intensity > 0.5 ? 'white' : '#333';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stock > 9999 ? `${(stock / 1000).toFixed(1)}k` : String(stock), x + cellW / 2, y + cellH / 2);
    };

    // Draw grid
    let idx = 0;
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < maxCols && idx < data.length; col++) {
        const x = 10 + col * (cellW + gap);
        const y = 10 + row * (cellH + gap);
        drawCell(x, y, data[idx].stock, data[idx].color);
        idx++;
      }
    }
  }, [data, cellW, cellH]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const gap = 2;
    const col = Math.floor((mx - 10) / (cellW + gap));
    const row = Math.floor((my - 10) / (cellH + gap));
    const maxCols = Math.floor((rect.width - 20) / (cellW + gap));
    const idx = row * maxCols + col;

    if (idx >= 0 && idx < data.length && mx > 10 && my > 10) {
      const d = data[idx];
      setTooltip({ x: mx + 10, y: my + 10, sku: d.id, stock: d.stock });
    } else {
      setTooltip(null);
    }
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Stock Heatmap</h1>
      <p className="text-zinc-500 mb-6">Visualisasi stok per SKU dalam grid warna intensitas. Klik cell untuk detail.</p>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <div className="overflow-x-auto">
          <canvas
            ref={canvasRef}
            className="w-full h-auto cursor-pointer"
            style={{ minHeight: Math.ceil(data.length / 8) * (cellH + 2) + 20 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <span className="font-medium">{tooltip.sku}</span> — Stok: {tooltip.stock.toLocaleString()}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {data.slice(0, 10).map((d) => (
          <div key={d.id} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: d.color }} />
            <span className="text-zinc-600 dark:text-zinc-400">{d.id}</span>
            <span className="text-zinc-400">({d.stock})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
