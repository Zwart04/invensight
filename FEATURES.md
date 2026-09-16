# FEATURES.md — InvenSight

Fitur yang dibangun (8 fitur kompleks, NO CRUD sederhana, NO /waha/, NO Pixel/GA):

1. **Dashboard Realtime** — Recharts dashboard dengan stok per kategori (bar chart), stock-in vs stock-out tren 7 hari (area chart), low-stock alert cards, ringkasan inventaris. Bilingual EN/ID dengan toggle. Lucide icons di setiap card.

2. **Products CRUD + Catalogs** — Manajemen produk lengkap: create/read/update/delete produk dengan field nama, SKU, kategori, harga beli, harga jual, stok minimum, stok maksimum, satuan, supplier, foto produk (URL). Search + filter kategori + sort + paginasi 10/halaman. Export daftar produk ke CSV.

3. **Stock Transactions** — Pencatatan stock-in (penerimaan dari supplier), stock-out (penjualan/pengiriman), dan stock-adjustment (koreksi stok manual) dengan input jumlah, keterangan, dan tanggal. Setiap transaksi otomatis update stok produk. Riwayat transaksi dengan audit trail (siapa, kapan, perubahan stok berapa). Bulk import transaksi dari CSV.

4. **AI Restock Predictions** — Prediksi kapan stok akan habis menggunakan simple moving average 7 hari + safety stock heuristic. Tampilkan daftar produk yang perlu restock dalam 7 hari ke depan dengan level urgensi (kritis/sedang/tren). Export prediction ke CSV.

5. **Supplier Catalog (Mock External API)** — CRUD data supplier (nama, kontak, alamat, produk yang di-supply). Fitur katalog supplier yang menampilkan dummy data produk supplier (mock API call dengan delay simulasi) — pengguna bisa memilih produk dari katalog untuk melakukan stock-in.

6. **Canvas Heatmap Stock Distribution** — Visualisasi distribusi stok per kategori menggunakan canvas HTML5 dengan color intensity berdasarkan level stok (baz60 radix color scale). Hover menunjukkan angka detail. Klik kategori memfilter dashboard. Responsif dan GPU-acceleration friendly.

7. **Export PDF & Excel + Auto Finance Journal** — Export laporan stok ke PDF (jsPDF) dengan header perusahaan, tabel stok per produk, total nilai inventaris. Export transaksi ke Excel (xlsx/SheetJS) dengan sheet terpisah per kategori. Setiap stock-in/out otomatis mencatat jurnal keuangan di Finance tab dengan sumber "auto-stock".

8. **Analytics + Attribution + Share** — Tab analytics dengan Recharts bar chart sumber traffic (dari UTM params → localStorage.source). Share fitur: generate URL berisi state (kategori terpilih + rentang tanggal) yang bisa di-copy ke clipboard atau dibuka via wa.me deep-link. In-app toast notifikasi (shadcn Toast) untuk setiap aksi sukses/gagal.

NOTIFIKASI: in-app toast (shadcn Toast) + wa.me share-link. TIDAK ada WAHA, TIDAK ada Pixel/GA.
ATTRIBUTION: UTM/URL-param → localStorage.source → Recharts bar chart /analytics. TIDAK ada fbq/gtag/pixel.
FINANCE: Auto-journal terintegrasi — setiap stock-in/out muncul di Finance tab.

Total: 8 fitur kompleks, 14 route, Next.js 16 + TS + Tailwind v4 + shadcn/ui + Recharts + lucide-react + jsPDF + SheetJS.
