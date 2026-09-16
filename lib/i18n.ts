import { LucideIcon } from "lucide-react";

export type TData = {
  [key: string]: { id: string; icon: LucideIcon; label: { en: string; id: string } };
};

export const NAV_ITEMS: TData = {
  dashboard: {
    id: "dashboard",
    icon: null as any,
    label: { en: "Dashboard", id: "Dasbor" },
  },
  heatmap: {
    id: "heatmap",
    icon: null as any,
    label: { en: "Heatmap", id: "Peta Panas" },
  },
  restock: {
    id: "restock",
    icon: null as any,
    label: { en: "Restock AI", id: "Prediksi Restock" },
  },
  search: {
    id: "search",
    icon: null as any,
    label: { en: "Search", id: "Cari" },
  },
  reports: {
    id: "laporan",
    icon: null as any,
    label: { en: "Reports", id: "Laporan" },
  },
  suppliers: {
    id: "supplier",
    icon: null as any,
    label: { en: "Suppliers", id: "Supplier" },
  },
  alerts: {
    id: "alerts",
    icon: null as any,
    label: { en: "Alerts", id: "Peringatan" },
  },
  analytics: {
    id: "analytics",
    icon: null as any,
    label: { en: "Analytics", id: "Analitik" },
  },
  finance: {
    id: "finance",
    icon: null as any,
    label: { en: "Finance", id: "Keuangan" },
  },
  settings: {
    id: "settings",
    icon: null as any,
    label: { en: "Settings", id: "Pengaturan" },
  },
  share: {
    id: "share",
    icon: null as any,
    label: { en: "Share", id: "Bagikan" },
  },
};

export const T: Record<string, { en: string; id: string }> = {
  // Nav
  "nav.dashboard": { en: "Dashboard", id: "Dasbor" },
  "nav.heatmap": { en: "Heatmap", id: "Peta Panas" },
  "nav.restock": { en: "Restock AI", id: "Prediksi Restock" },
  "nav.search": { en: "Search", id: "Cari" },
  "nav.reports": { en: "Reports", id: "Laporan" },
  "nav.suppliers": { en: "Suppliers", id: "Supplier" },
  "nav.alerts": { en: "Alerts", id: "Peringatan" },
  "nav.analytics": { en: "Analytics", id: "Analitik" },
  "nav.finance": { en: "Finance", id: "Keuangan" },
  "nav.settings": { en: "Settings", id: "Pengaturan" },
  "nav.share": { en: "Share", id: "Bagikan" },

  // Common
  "common.search": { en: "Search", id: "Cari" },
  "common.filter": { en: "Filter", id: "Filter" },
  "common.export": { en: "Export", id: "Ekspor" },
  "common.download": { en: "Download", id: "Unduh" },
  "common.cancel": { en: "Cancel", id: "Batal" },
  "common.save": { en: "Save", id: "Simpan" },
  "common.delete": { en: "Delete", id: "Hapus" },
  "common.edit": { en: "Edit", id: "Edit" },
  "common.add": { en: "Add", id: "Tambah" },
  "common.close": { en: "Close", id: "Tutup" },
  "common.back": { en: "Back", id: "Kembali" },
  "common.next": { en: "Next", id: "Lanjut" },
  "common.prev": { en: "Previous", id: "Sebelumnya" },
  "common.language": { en: "Language", id: "Bahasa" },
  "common.darkMode": { en: "Dark mode", id: "Mode gelap" },
  "common.lightMode": { en: "Light mode", id: "Mode terang" },

  // Auth
  "auth.title": { en: "Sign in to InvenSight", id: "Masuk ke InvenSight" },
  "auth.email": { en: "Email", id: "Email" },
  "auth.password": { en: "Password", id: "Kata sandi" },
  "auth.registerTitle": { en: "Create your account", id: "Buat akun baru" },
  "auth.loginButton": { en: "Sign in", id: "Masuk" },
  "auth.registerButton": { en: "Create account", id: "Buat akun" },
  "auth.noAccount": { en: "Don't have an account?", id: "Belum punya akun?" },
  "auth.haveAccount": { en: "Already have an account?", id: "Sudah punya akun?" },
  "auth.emailInvalid": { en: "Enter a valid email", id: "Masukkan email yang valid" },
  "auth.passwordMin": { en: "Password must be at least 6 characters", id: "Kata sandi minimal 6 karakter" },
  "auth.welcome": { en: "Welcome back!", id: "Selamat datang kembali!" },

  // Dashboard
  "dashboard.title": { en: "Stock Dashboard", id: "Dasbor Stok" },
  "dashboard.totalSKU": { en: "Total SKU", id: "Total SKU" },
  "dashboard.lowStock": { en: "Low stock", id: "Stok sedikit" },
  "dashboard.outOfStock": { en: "Out of stock", id: "Habis" },
  "dashboard.restockNeeded": { en: "Restock needed", id: "Perlu restock" },
  "dashboard.lastUpdated": { en: "Last updated", id: "Terakhir diperbarui" },
  "dashboard.stockIn": { en: "Stock in", id: "Stok masuk" },
  "dashboard.stockOut": { en: "Stock out", id: "Stok keluar" },
  "dashboard.statusNormal": { en: "Normal", id: "Normal" },
  "dashboard.statusMinimal": { en: "Minimal", id: "Minim" },
  "dashboard.statusReadyRestock": { en: "Ready restock", id: "Siap restock" },
  "dashboard.statusOutOfStock": { en: "Out of stock", id: "Habis" },
  "dashboard.quickActions": { en: "Quick actions", id: "Aksi cepat" },
  "dashboard.recordStockIn": { en: "Record stock in", id: "Catat stok masuk" },
  "dashboard.recordStockOut": { en: "Record stock out", id: "Catat stok keluar" },

  // Heatmap
  "heatmap.title": { en: "Stock Distribution Heatmap", id: "Peta Panas Distribusi Stok" },
  "heatmap.legendNormal": { en: "Normal", id: "Normal" },
  "heatmap.legendMinimal": { en: "Minimal", id: "Minim" },
  "heatmap.legendRestock": { en: "Restock needed", id: "Perlu restock" },
  "heatmap.legendEmpty": { en: "Empty", id: "Kosong" },
  "heatmap.filterByCategory": { en: "Filter by category", id: "Filter per kategori" },
  "heatmap.filterByLocation": { en: "Filter by location", id: "Filter per lokasi" },
  "heatmap.showTooltip": { en: "Hover to see details", id: "Arahkan untuk detail" },

  // Restock
  "restock.title": { en: "Restock Prediction", id: "Prediksi Restock" },
  "restock.selectSKU": { en: "Select SKU", id: "Pilih SKU" },
  "restock.predictedQuantity": { en: "Predicted quantity", id: "Jumlah prediksi" },
  "restock.confidence": { en: "Confidence", id: "Keyakinan" },
  "restock.trend7Days": { en: "7-day trend", id: "Tren 7 hari" },
  "restock.prediction7Days": { en: "7-day prediction", id: "Prediksi 7 hari" },
  "restock.confidenceBand": { en: "Confidence band", id: "Banding keyakinan" },
  "restock.estimatedDate": { en: "Estimated restock date", id: "Estimasi tanggal restock" },
  "restock.velocity": { en: "Daily velocity", id: "Kecepatan harian" },
  "restock.alertRestockUpdated": { en: "Restock prediction updated", id: "Prediksi restock diperbarui" },

  // Search
  "search.title": { en: "Search Inventory", id: "Cari Inventaris" },
  "search.placeholder": { en: "Search by name, SKU, or category...", id: "Cari nama, SKU, atau kategori..." },
  "search.noResults": { en: "No results found", id: "Tidak ada hasil" },
  "search.sortByStock": { en: "Sort by stock", id: "Urutkan stok" },
  "search.sortByName": { en: "Sort by name", id: "Urutkan nama" },
  "search.sortByDate": { en: "Sort by date", id: "Urutkan tanggal" },

  // Reports
  "reports.title": { en: "Stock Reports", id: "Laporan Stok" },
  "reports.generate": { en: "Generate report", id: "Buat laporan" },
  "reports.dateRange": { en: "Date range", id: "Rentang tanggal" },
  "reports.pdfPreview": { en: "PDF preview", id: "Pratinjau PDF" },
  "reports.downloadPDF": { en: "Download PDF", id: "Unduh PDF" },
  "reports.exportComplete": { en: "Report exported", id: "Laporan diekspor" },
  "reports.totalItems": { en: "Total items", id: "Total barang" },
  "reports.totalValue": { en: "Total value", id: "Total nilai" },

  // Suppliers
  "suppliers.title": { en: "Supplier Management", id: "Manajemen Supplier" },
  "suppliers.name": { en: "Name", id: "Nama" },
  "suppliers.contact": { en: "Contact", id: "Kontak" },
  "suppliers.leadTime": { en: "Lead time (days)", id: "Lead time (hari)" },
  "suppliers.rating": { en: "Rating", id: "Rating" },
  "suppliers.history": { en: "Order history", id: "Riwayat order" },
  "suppliers.filterShort": { en: "Short lead time", id: "Lead time pendek" },
  "suppliers.filterLong": { en: "Long lead time", id: "Lead time panjang" },

  // Alerts
  "alerts.title": { en: "Alert Center", id: "Pusat Peringatan" },
  "alerts.lowStock": { en: "Low stock alert", id: "Peringatan stok rendah" },
  "alerts.restockPrediction": { en: "Restock prediction update", id: "Update prediksi restock" },
  "alerts.exportComplete": { en: "Export complete", id: "Ekspor selesai" },
  "alerts.severity": { en: "Severity", id: "Tingkat" },
  "alerts.high": { en: "High", id: "Tinggi" },
  "alerts.medium": { en: "Medium", id: "Sedang" },
  "alerts.low": { en: "Low", id: "Rendah" },
  "alerts.exportCSV": { en: "Export alert log CSV", id: "Ekspor log peringatan CSV" },

  // Analytics
  "analytics.title": { en: "Analytics", id: "Analitik" },
  "analytics.sourceAttribution": { en: "Source attribution", id: "Atribusi sumber" },
  "analytics.totalVisits": { en: "Total visits", id: "Total kunjungan" },
  "analytics.visitsBySource": { en: "Visits by source", id: "Kunjungan per sumber" },
  "analytics.topSKUs": { en: "Top SKUs", id: "SKU teratas" },
  "analytics.stockDistribution": { en: "Stock distribution", id: "Distribusi stok" },

  // Finance
  "finance.title": { en: "Finance Journal", id: "Jurnal Keuangan" },
  "finance.autoJournal": { en: "Auto-journal entries", id: "Entri jurnal otomatis" },
  "finance.totalEntries": { en: "Total entries", id: "Total entri" },
  "finance.byCategory": { en: "By category", id: "Per kategori" },
  "finance.cumulative": { en: "Cumulative", id: "Kumulatif" },

  // Settings
  "settings.title": { en: "Settings", id: "Pengaturan" },
  "settings.organization": { en: "Organization profile", id: "Profil organisasi" },
  "settings.notifications": { en: "Notification settings", id: "Pengaturan notifikasi" },
  "settings.stockThreshold": { en: "Stock threshold", id: "Ambang batas stok" },
  "settings.lowStockThreshold": { en: "Low stock threshold", id: "Ambang batas stok rendah" },
  "settings.apiKeys": { en: "API keys (mock)", id: "API key (mock)" },

  // Share
  "share.title": { en: "Share Inventory Config", id: "Bagikan Konfigurasi Inventaris" },
  "share.copyLink": { en: "Copy link", id: "Salin tautan" },
  "share.waLink": { en: "Share via WhatsApp", id: "Bagikan via WhatsApp" },
  "share.copySuccess": { en: "Link copied to clipboard", id: "Tautan disalin ke clipboard" },
  "share.linkCopied": { en: "Link copied!", id: "Tautan disalin!" },

  // Product
  "product.name": { en: "Name", id: "Nama" },
  "product.sku": { en: "SKU", id: "SKU" },
  "product.category": { en: "Category", id: "Kategori" },
  "product.quantity": { en: "Quantity", id: "Jumlah" },
  "product.minStock": { en: "Minimum stock", id: "Stok minimum" },
  "product.location": { en: "Location", id: "Lokasi" },
  "product.unitPrice": { en: "Unit price", id: "Harga per unit" },
  "product.totalValue": { en: "Total value", id: "Total nilai" },
  "product.daysUntilRestock": { en: "Days until restock", id: "Hari hingga restock" },
  "product.lastTransaction": { en: "Last transaction", id: "Transaksi terakhir" },

  // Footer
  "footer.copyright": { en: "InvenSight Inventory OS", id: "InvenSight Sistem Inventaris" },
  "footer.builtBy": { en: "Built by Zwart", id: "Dibuat oleh Zwart" },

  // Landing
  "landing.heroTitle": { en: "Inventory visibility for small businesses", id: "Visibilitas inventaris untuk usaha kecil" },
  "landing.heroSubtitle": { en: "Real-time stock tracking, AI restock prediction, and distribution heatmap — all in one dashboard.", id: "Pelacakan stok real-time, prediksi restock AI, dan peta panas distribusi — semuanya dalam satu dasbor." },
  "landing.feature1": { en: "Real-time stock dashboard", id: "Dasbor stok real-time" },
  "landing.feature2": { en: "Stock distribution heatmap", id: "Peta panas distribusi stok" },
  "landing.feature3": { en: "AI restock prediction", id: "Prediksi restock AI" },
  "landing.feature4": { en: "Weekly stock reports", id: "Laporan stok mingguan" },
  "landing.feature5": { en: "Central alert center", id: "Pusat peringatan terpusat" },
  "landing.feature6": { en: "Supplier management", id: "Manajemen supplier" },
  "landing.cta": { en: "Get started", id: "Mulai sekarang" },
  "landing.builtFor": { en: "Built for small warehouses and UMKM", id: "Dibuat untuk gudang kecil dan UMKM" },
  "landing.getStarted": { en: "Get Started", id: "Mulai Sekarang" },
  "landing.viewDemo": { en: "View live demo", id: "Lihat demo langsung" },
};
