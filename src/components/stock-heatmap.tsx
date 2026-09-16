'use client';
import { useEffect, useRef } from 'react';
import type { Product } from '@/lib/types';

export default function StockHeatmap({ products }: { products: Product[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    if (products.length === 0) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('No data', W / 2, H / 2);
      return;
    }

    // Grid layout: 5 columns
    const cols = 5;
    const rows = Math.ceil(products.length / cols);
    const cardW = (W - 40) / cols;
    const cardH = (H - 60) / rows;
    const gap = 10;

    products.forEach((p, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 20 + col * (cardW + gap);
      const y = 20 + row * (cardH + gap);

      // Stock ratio 0..1
      const ratio = p.maxStock > 0 ? Math.min(p.quantity / p.maxStock, 1) : 0;

      // Color: green (good) -> amber (low) -> red (out)
      let r: number, g: number, b: number;
      if (p.quantity === 0) { r = 239; g = 68; b = 68; }
      else if (ratio <= 0.3) { // low
        const t2 = ratio / 0.3;
        r = Math.round(245 + (239 - 245) * t2);
        g = Math.round(158 + (68 - 158) * t2);
        b = Math.round(11 + (68 - 11) * t2);
      } else {
        const t2 = (ratio - 0.3) / 0.7;
        r = Math.round(239 + (16 - 239) * t2);
        g = Math.round(68 + (185 - 68) * t2);
        b = Math.round(68 + (129 - 68) * t2);
      }

      // Card background (vertical gradient from top color to slightly darker)
      const grad = ctx.createLinearGradient(x, y, x, y + cardH);
      grad.addColorStop(0, `rgb(${r},${g},${b})`);
      grad.addColorStop(1, `rgb(${Math.max(0, r-30)},${Math.max(0, g-30)},${Math.max(0, b-30)})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 6);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 6);
      ctx.stroke();

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      // Truncate name
      const name = p.name.length > 12 ? p.name.slice(0, 12) + '...' : p.name;
      ctx.fillText(name, x + 8, y + 6);

      ctx.font = '10px system-ui';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(`Qty: ${p.quantity}`, x + 8, y + 22);

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText(`${p.category}`, x + 8, y + 36);
    });
  }, [products]);

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-card">
      <canvas ref={canvasRef} width={700} height={200} className="w-full h-auto" style={{ display: 'block' }} />
    </div>
  );
}
