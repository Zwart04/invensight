{
  "project": "InvenSight — Inventory & Stock Visibility OS",
  "slug": "invensight",
  "problem": "UMKM gudang/toko punya masalah: stok tidak real-time, sering kehabisan barang di waktu sibuk, tidak tahu kapan harus restock, tidak ada prediksi permintaan, dan pencatatan manual berantakan di Excel.",
  "target": "Toko/gudang UMKM 1-20 karyawan, pengurus komplek, penjaga gudang, distributor kecil.",
  "heavy_categories": [
    "AI/ML (restock prediction heuristic + demand trend)",
    "Real-time (WebSocket/BroadcastChannel live stock updates)",
    "Media processing (canvas heatmap stok distribusi, tag cloud kategori)",
    "External API (mock supplier catalog API)",
    "Background workers (auto-export PDF/Excel, health check, IndexedDB sync)"
  ],
  "features_mvp": [
    {
      "id": 1,
      "name": "dashboard",
      "desc": "Recharts dashboard: stok per kategori (bar), stock-in vs stock-out 7 hari (area), low-stock alert cards, recent transactions list. Bilingual EN/ID."
    },
    {
      "id": 2,
      "name": "products-crud",
      "desc": "CRUD produk lengkap: nama, SKU, kategori, harga beli/jual, stok minimum, stok maksimum, satuan, supplier, foto produk (URL/file). Search + filter + sort + paginasi."
    },
    {
      "id": 3,
      "name": "stock-transactions",
      "desc": "Stock-in (penerimaan barang dari supplier), stock-out (pengiriman/penjualan), stock-adjustment (koreksi manual), dengan riwayat audit trail. Bulk import dari CSV."
    },
    {
      "id": 4,
      "name": "ai-restock-predictions",
      "desc": "Prediksi kapan stok akan habis berdasarkan tren 30 hari terakhir (simple moving average + safety stock heuristic). Highlight produk yang perlu restock dalam 7 hari. Export prediction CSV."
    },
    {
      "id": 5,
      "name": "supplier-catalog",
      "desc": "CRUD supplier + mock external API integrasi: tampilkan katalog produk supplier (dummy data yang di-render seperti API real). Pilih produk dari katalog untuk stock-in."
    },
    {
      "id": 6,
      "name": "heatmap-stock-distribution",
      "desc": "Canvas-based heatmap: visualisasi distribusi stok per kategori dalam bentuk grid warna (baz60 radix). Interaktif: hover lihat angka, klik kategori → filter dashboard."
    },
    {
      "id": 7,
      "name": "export-pdf-excel",
      "desc": "Export laporan stok (PDF via jsPDF) dan transaksi (Excel xlsx via SheetJS) dengan logo/header perusahaan, rentang tanggal, dan grouping. Auto-journal keuangan: setiap stock-in/out otomatis generate jurnal di tab Finance."
    },
    {
      "id": 8,
      "name": "analytics-attribution-share",
      "desc": "Tab analytics: Recharts bar sumber traffic (UTM → localStorage.source). Share-link: generate URL dengan encoded state (selected category + date range) → clipboard + wa.me deep-link. In-app toast notifikasi saat operasi sukses/gagal."
    }
  ],
  "notification": "in-app toast (shadcn Toast) + wa.me share-link. NO WAHA.",
  "attribution": "UTM param → localStorage.source → Recharts bar chart /analytics. NO fbq/gtag/pixel.",
  "finance": "auto-journal: setiap stock-in (pembelian) dan stock-out (penjualan) otomatis muncul di Finance tab dengan sumber 'auto-stock'.",
  "routes": [
    "/", "/login", "/register", "/dashboard", "/products", "/products/[id]",
    "/transactions", "/suppliers", "/heatmap", "/predictions", "/finance",
    "/analytics", "/settings", "/s/[slug]"
  ],
  "stack": "Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + Recharts + lucide-react + jsPDF + SheetJS + BroadcastChannel",
  "domain": "invensight.zwart.qzz.io",
  "deploy": "Cloudflare Pages (output:export)"
}
