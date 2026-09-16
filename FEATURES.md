---
project: InvenSight
date: 2026-09-16
status: ideation
---

# InvenSight — Inventory Visibility OS

## Problem
UMKM retailer dan distributor sering kehilangan visibility stok secara real-time, menyebabkan stockout, overstock, dan ketidaktepatan prediksi pengisian. Tools inventory yang ada seringkali berbayar mahal atau terlalu kompleks.

## Target Audience
- UMKM toko/retailer dengan 50-2000 SKU
- Distributor kecil dengan multiple supplier
- Warehouse kecil yang butuh visibility stok

## Features (8 fitur berat)

### 1. Dashboard Realtime + Recharts + Status Overview
Dashboard utama dengan statistik total produk, stok rendah, stok habis, nilai inventaris, pembelian pending. Visualisasi Recharts bar chart, pie chart distribusi stok, dan line chart tren 7 hari. Widget Realtime stock alerts.

### 2. Inventory CRUD Kompleks + Search + Filter
CRUD produk lengkap dengan search real-time, filter kategori, filter status (low/out/good). Stock level warning otomatis berdasarkan minStock. Export individual. Simpan ke localStorage.

### 3. Stock Heatmap Canvas GPU-accelerated
Visualisasi grid produk dengan warna berbasis stock ratio (hijau → kuning → merah). Menggunakan HTML5 Canvas dengan render per-item card berwarna gradient. Interactive: hover show tooltip, klik item masuk ke detail. GPU-friendly canvas.

### 4. AI-powered Restock Prediction Heuristic
Prediksi kapan stok akan habis berdasarkan:
- Current stock level
- Average daily consumption (dihitung dari riwayat order/pergantian stok, dengan fallback mock data)
- Supplier lead time (konfigurasi per kategori)
- Alert threshold
Tampilkan jumlah hari sampai stockout, rekomendasi quantity order, dan urgency level (low/medium/high/critical). Tanpa ML model berat — heuristic rule-based dengan mock data yang realistis.

### 5. Supplier Management + Order Management (CRUD ganda)
CRUD supplier (nama, email, phone, address, notes, contact person). CRUD pembelian (order) yang terhubung ke supplier + produk. Status order: pending/confirmed/received/cancelled/delayed. Update stock otomatis saat order received. Histories dan audit trail sederhana.

### 6. Supplier Order Tracking + Lead Time Calendar
Track pembelian per supplier dengan status visual. Realtime timeline order dengan tanggal menerima. Lead time per supplier disimpan dan digunakan untuk restock prediction. Integrasi dengan kalender sederhana.

### 7. Analytics + Charts + Financial Journal
- Recharts: stock value per category, stock level distribution pie, monthly trend area chart, top products by value
- Financial auto-journal: setiap order (purchase) dan stok adjustment otomatis tercatat di journal. Tag: auto-vendor, auto-task, auto-bill. Tampilkan total nilai, total pengeluaran, per supplier. Export journal.
- Source attribution: baca UTM param `?utm_source=...` di first visit → localStorage.source → Recharts bar chart di halaman analytics menunjukkan sumber traffic.

### 8. Bilingual EN/ID + Theme Toggle + Settings + Share + Export PDF/Excel
- Bilingual: EN/ID toggle di navbar, semua teks pakai t.* dictionary
- Theme: dark/light/system toggle
- Settings: business name, notification email mock, share link generator
- Share: share single product via `wa.me` link dengan pre-filled message (tanpa WAHA API). Link berisi produk name, qty, location, updatedAt.
- Export PDF: jspdf generate laporan inventory. Export Excel/CSV: generate file CSV download.
- Auth: local-first login/register dengan localStorage hf_user/hf_users.

## Notification (Boss policy 2026-08-29)
- In-app toast (shadcn Toast) untuk semua aksi: save success, delete success, error
- Email mock: di settings user bisa set notification email → sistem "mengirim" email mock (hanya toast "Email sent to X")
- Share: `wa.me` link dengan pre-filled message (tanpa WAHA API, tanpa QR scan)

## Attribution (Boss policy 2026-08-29)
- Baca UTM params `?utm_source=...&utm_medium=...` di first visit
- Simpan ke `localStorage.source` sekali saja
- Di halaman `/analytics`, tampilkan Recharts bar chart "Traffic Sources" berdasarkan localStorage.source
- TIDAK ADA fbq, gtag, NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GOOGLE_ADS_ID

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind v4 + shadcn/ui (component primitives: Button, Input, Card, Badge, Select, Textarea, Dialog)
- Recharts untuk chart
- lucide-react untuk icon
- jspdf untuk PDF export
- HTML5 Canvas untuk heatmap
- localStorage untuk semua data (no backend)
- CSS-first design, no emoji

## Route Map (12+ route)
1. `/` — Dashboard (Recharts + stats + alerts)
2. `/inventory` — Inventory CRUD + search + filter + heatmap canvas
3. `/orders` — Order management CRUD + status tracking
4. `/suppliers` — Supplier CRUD
5. `/analytics` — Analytics dashboard (Recharts: breakdown, distribution, trend, top products, source attribution)
6. `/settings` — Settings (profile, business name, theme, notification email mock, share link)
7. `/categories` — Category management CRUD + stock/value per category
8. `/share` — Share single product halaman (select product, generate wa.me link)
9. `/export` — Export PDF + CSV
10. `/auth` — Login/Register page
11. `/s/[slug]` — Shared item public page (product detail untuk yang di-share)
12. `/s` — Shared items listing (public)

## Data Model (localStorage)
- `inv_prod`: Product[]
- `inv_supp`: Supplier[]
- `inv_ord`: Order[]
- `inv_cat`: Category[]
- `inv_journal`: JournalEntry[] (auto-finance)
- `inv_source`: string (attribution)
- `inv_theme`: 'dark'|'light'|'system'
- `inv_lang`: 'en'|'id'
- `inv_user`: User | null
- `inv_users`: User[]

## Notification Spec
- Toast: shadcn-style toast container di bottom-right
- Email mock: toast "Email notification sent to [email]" saat order confirmed atau restock critical
- Share: generate wa.me link dengan format `https://wa.me/?text=<encoded message>` — tanpa API, tanpa WAHA

## Anti-duplicate check
InvenSight berbeda dari FleetMile (primary hari ini):
- FleetMile: fleet/vehicle management, GPS tracking, ETA, fuel monitoring
- InvenSight: inventory/stock management, supplier, order, restock prediction
- Tidak ada overlap domain. Keduanya inventory/fleet tapi berbeda subdomain secara spesifik.
