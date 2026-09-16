export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  location: string;
  unitPrice: number;
  lastTransaction: string;
  transactions: Transaction[];
  supplierIds: string[];
  velocity30d: number;
}

export interface Transaction {
  id: string;
  type: "in" | "out";
  quantity: number;
  date: string;
  note?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  leadTime: number;
  rating: number;
  active: boolean;
}

export interface Alert {
  id: string;
  type: "low_stock" | "restock_prediction" | "export_complete" | "stock_update";
  severity: "high" | "medium" | "low";
  sku?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface FinanceEntry {
  id: string;
  type: "auto-task" | "auto-bill" | "auto-vendor";
  category: string;
  description: string;
  source: string;
  amount: number;
  ts: string;
}

export interface StockHistoryPoint {
  date: string;
  quantity: number;
}

export interface RestockPrediction {
  sku: string;
  predictedQuantity: number;
  confidence: number;
  estimatedDate: string;
  velocity: number;
  trend7d: number[];
  prediction7d: number[];
  lowerBand: number[];
  upperBand: number[];
}

export const MOCK_CATEGORIES = [
  "Electronics",
  "Food & Beverage",
  "Textiles",
  "Hardware",
  "Office Supplies",
  "Raw Materials",
] as const;

export const MOCK_LOCATIONS = [
  "Warehouse A",
  "Warehouse B",
  "Showroom",
  "Office Storage",
] as const;

export function generateMockStockItems(): StockItem[] {
  const items: StockItem[] = [];
  const namesByCategory: Record<string, string[]> = {
    Electronics: ["Wireless Mouse", "USB-C Cable", "LED Monitor 24\"", "Mechanical Keyboard", "Webcam HD", "Noise Cancelling Headphones", "Charger 65W", "HDMI Cable 2m", "USB Hub 4-port", "Laptop Stand"],
    "Food & Beverage": ["Organic Coffee 1kg", "Green Tea 500g", "Honey Jar 500ml", "Almond Snack 200g", "Dried Mango 100g", "Matcha Powder 200g", "Coconut Oil 500ml", "Dark Chocolate 80g", "Rice Cracker 150g", "Cashew Nuts 250g"],
    Textiles: ["Cotton T-shirt M", "Denim Jeans L", "Wool Scarf", "Linen Shirt XL", "Silk Blouse S", "Polyester Jacket", "Cashmere Sweater", "Canvas Backpack", "Leather Belt", "Bamboo Socks 3pk"],
    Hardware: ["Hex Bolt M6 10pk", "Wood Screw 40mm", "Drill Bit Set", "Toggle Switch", "Electrical Tape", "Measuring Tape 5m", "Level Tool", "Wrench Set", "Screwdriver Kit", "Sandpaper 200grit"],
    "Office Supplies": ["A4 Paper Ream 500", "Ballpoint Pen Black", "Sticky Notes 100", "Binder Clip 25mm", "Highlighters 5pk", "Stapler Desktop", "Paper Clips 100", "Whiteboard Markers", "Filing Folder", "Desk Organizer"],
    "Raw Materials": ["Polypropylene Pellets 5kg", "Cotton Fabric 2m", "Steel Rod 12mm", "Epoxy Resin 500ml", "Wood Glue 250ml", "Spray Paint Black", "Acrylic Sheet 3mm", "Silicone Sealant", "Copper Wire 2mm", "Beeswax Block 500g"],
  };

  const suppliers = generateMockSuppliers();

  MOCK_CATEGORIES.forEach((cat, ci) => {
    const names = namesByCategory[cat] || [];
    names.forEach((name, i) => {
      const supplier = suppliers[(ci + i) % suppliers.length];
      const baseQty = Math.floor(Math.random() * 80) + 5;
      const minStock = Math.floor(Math.random() * 15) + 5;
      const velocity = Math.floor(Math.random() * 8) + 1;
      const today = new Date();
      const lastTransaction = new Date(today.getTime() - Math.floor(Math.random() * 3) * 86400000).toISOString().split("T")[0];

      const transactions: Transaction[] = [];
      let qty = baseQty;
      for (let d = 29; d >= 0; d--) {
        const date = new Date(today.getTime() - d * 86400000);
        const dateStr = date.toISOString().split("T")[0];
        const change = Math.floor(Math.random() * velocity * 2) - Math.floor(Math.random() * velocity);
        const actualChange = change > 0 ? Math.floor(Math.random() * change) + 1 : 0;
        const outChange = change < 0 ? Math.floor(Math.random() * Math.abs(change)) + 1 : 0;
        if (actualChange > 0) {
          qty += actualChange;
          transactions.push({ id: `t-in-${d}`, type: "in", quantity: actualChange, date: dateStr });
        } else if (outChange > 0 && qty > 0) {
          qty = Math.max(0, qty - outChange);
          transactions.push({ id: `t-out-${d}`, type: "out", quantity: outChange, date: dateStr });
        }
      }

      const currentQty = Math.max(0, qty);
      const status: "normal" | "minimal" | "ready_restock" | "out_of_stock" =
        currentQty === 0 ? "out_of_stock" :
        currentQty <= minStock ? "ready_restock" :
        currentQty <= minStock + 10 ? "minimal" : "normal";

      items.push({
        id: `item-${ci}-${i}`,
        name,
        sku: `SKU${(ci + 1).toString().padStart(2, "0")}${(i + 1).toString().padStart(3, "0")}`,
        category: cat,
        quantity: currentQty,
        minStock,
        location: MOCK_LOCATIONS[(ci + i) % MOCK_LOCATIONS.length],
        unitPrice: Math.floor(Math.random() * 50000) + 1000,
        lastTransaction,
        transactions: transactions.slice(-30),
        supplierIds: [supplier.id],
        velocity30d: velocity,
      });
    });
  });

  return items.map((item) => ({
    ...item,
    status: (() => {
      if (item.quantity === 0) return "out_of_stock";
      if (item.quantity <= item.minStock) return "ready_restock";
      if (item.quantity <= item.minStock + 10) return "minimal";
      return "normal";
    })(),
  }));
}

export function generateMockSuppliers(): Supplier[] {
  const names = [
    "PT Maju Sentosa", "CV Mitra Jaya", "UD Makmur Abadi", "PT Garuda Logistics",
    "CV Nusantara Supply", "UD Sejahtera Jaya", "PT Bintang Timur", "CV Karya Mandiri",
    "UD Purnama Sukses", "PT Agung Persada",
  ];
  const contacts = [
    "supply@maju.com", "mitra@jaya.co.id", "makmur@ud.id", "garuda@logistics.com",
    "nusantara@cv.id", "sejahtera@ud.co.id", "bintang@timur.com", "karya@mandiri.id",
    "purnama@suksesor.id", "agung@persada.co.id",
  ];

  return names.map((name, i) => ({
    id: `sup-${i}`,
    name,
    contact: contacts[i],
    leadTime: Math.floor(Math.random() * 14) + 1,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    active: Math.random() > 0.2,
  }));
}

export function generateMockAlerts(items: StockItem[]): Alert[] {
  const alerts: Alert[] = [];
  const today = new Date();

  items.filter((i) => i.status === "ready_restock" || i.status === "minimal" || i.status === "out_of_stock").forEach((item, idx) => {
    const sev = item.status === "out_of_stock" ? "high" : item.status === "ready_restock" ? "medium" : "low";
    alerts.push({
      id: `alert-${idx}`,
      type: "low_stock",
      severity: sev,
      sku: item.sku,
      message: `${item.name} (${item.sku}) — stok saat ini ${item.quantity} unit, di bawah minimum ${item.minStock}`,
      createdAt: new Date(today.getTime() - idx * 3600000).toISOString(),
      read: idx > 3,
    });
  });

  alerts.push({
    id: "alert-export",
    type: "export_complete",
    severity: "low",
    message: "Laporan stok mingguan diekspor — 30 SKU tercakup",
    createdAt: new Date(today.getTime() - 86400000).toISOString(),
    read: true,
  });

  alerts.push({
    id: "alert-restock",
    type: "restock_prediction",
    severity: "medium",
    sku: "SKU01050",
    message: "Prediksi restock untuk Wireless Mouse diperbarui: 45 unit, confidence 85%",
    createdAt: new Date(today.getTime() - 43200000).toISOString(),
    read: false,
  });

  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function generateMockFinance(items: StockItem[]): FinanceEntry[] {
  const entries: FinanceEntry[] = [];
  const today = new Date();

  items.filter((i) => i.status === "ready_restock" || i.status === "out_of_stock").forEach((item, idx) => {
    entries.push({
      id: `fin-${idx}`,
      type: "auto-task",
      category: "Inventory Management",
      description: `Alert stok minimal: ${item.name} (${item.sku}) — stok ${item.quantity}/${item.minStock}`,
      source: "invensight:auto-alert",
      amount: item.unitPrice * Math.max(0, item.minStock - item.quantity),
      ts: new Date(today.getTime() - idx * 1800000).toISOString(),
    });
  });

  entries.push({
    id: "fin-export",
    type: "auto-export",
    category: "Inventory Export",
    description: "Laporan stok mingguan diekspor (30 SKU)",
    source: "invensight:export",
    amount: 0,
    ts: new Date(today.getTime() - 86400000).toISOString(),
  });

  entries.push({
    id: "fin-restock",
    type: "auto-task",
    category: "Restock",
    description: "Prediksi restock diperbarui untuk Wireless Mouse: 45 unit",
    source: "invensight:auto-restock",
    amount: 450000,
    ts: new Date(today.getTime() - 43200000).toISOString(),
  });

  return entries.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
}

export function computeRestockPrediction(item: StockItem): RestockPrediction {
  const velocity = Math.max(1, item.velocity30d);
  const dailyBurn = Math.max(1, velocity);
  const remainingDays = item.quantity > 0 ? Math.ceil(item.quantity / dailyBurn) : 0;
  const predictedQty = Math.max(item.minStock * 2, Math.ceil(dailyBurn * 14));
  const confidence = Math.min(95, Math.max(50, 80 - (item.quantity < item.minStock ? 10 : 0) + Math.floor(Math.random() * 10)));

  const today = new Date();
  const trend7d: number[] = [];
  const prediction7d: number[] = [];
  const lowerBand: number[] = [];
  const upperBand: number[] = [];

  let currentQty = item.quantity;
  for (let d = 6; d >= 0; d--) {
    const date = new Date(today.getTime() - d * 86400000);
    const dateStr = date.toISOString().split("T")[0];
    const historicalQty = Math.max(0, currentQty + Math.floor(dailyBurn * (6 - d) * 0.3));
    trend7d.push(historicalQty);

    if (d === 0) {
      currentQty = item.quantity;
    }
  }

  for (let d = 1; d <= 7; d++) {
    const forecast = Math.max(0, item.quantity - d * dailyBurn);
    prediction7d.push(forecast);
    const band = Math.max(5, Math.floor(dailyBurn * d * 0.2));
    lowerBand.push(Math.max(0, forecast - band));
    upperBand.push(forecast + band);
  }

  const estimatedDate = new Date(today.getTime() + remainingDays * 86400000).toISOString().split("T")[0];

  return {
    sku: item.sku,
    predictedQuantity: predictedQty,
    confidence,
    estimatedDate,
    velocity: dailyBurn,
    trend7d,
    prediction7d,
    lowerBand,
    upperBand,
  };
}
