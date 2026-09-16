import Link from "next/link";
import { useApp } from "@/lib/app-provider";

export default function LandingPage() {
  const { t } = useApp();

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-700/50 bg-gray-900/60 px-4 py-1.5 text-xs text-gray-300">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Open Source — MIT License
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("landing.heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
            {t("landing.heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-950"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              {t("landing.getStarted")}
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800/50 px-8 py-3.5 text-base font-semibold text-gray-200 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              {t("landing.viewDemo")} (demo account)
            </Link>
          </div>
        </div>
        {/* Decorative grid */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[500px] opacity-10">
            <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: 20 }).map((_, i) => (
                <rect key={i} x={i * 42} y="0" width="1" height="500" fill="currentColor" className="text-emerald-400" />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <rect key={`v${i}`} x="0" y={i * 42} width="800" height="1" fill="currentColor" className="text-emerald-400" />
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-800 bg-gray-900/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t("landing.builtFor")}</h2>
          </div>
          <div className="mx-auto mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: "landing.feature1", desc: "Tampilan stok real-time dengan status warna, filter cepat, dan aksi stok masuk/keluar dalam satu dasbor." },
              { key: "landing.feature2", desc: "Peta panas distribusi stok interaktif 800x600 dengan gradien warna berdasarkan level stok dan animasi perubahan." },
              { key: "landing.feature3", desc: "Prediksi restock berbasis kecepatan 30 hari dengan confidence band dan estimasi tanggal — tanpa model eksternal." },
              { key: "landing.feature4", desc: "Generate laporan stok mingguan dalam PDF dengan jsPDF, bilingual, siap cetak atau email." },
              { key: "landing.feature5", desc: "Pusat peringatan terpusat untuk stok minimal, prediksi restock update, dan notifikasi ekspor — semua via toast." },
              { key: "landing.feature6", desc: "Kelola daftar supplier per SKU dengan lead time, rating, dan riwayat order — filter by lead time." },
            ].map((f, idx) => (
              <div key={idx} className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 transition-all hover:border-gray-700 hover:bg-gray-900/60">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/30">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                    <path d="M12 20V10M18 20V4M6 20v-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">{t(f.key)}</h3>
                <p className="mt-2 text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech / footer */}
      <section className="border-t border-gray-800 bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
            <span className="rounded bg-gray-800 px-2.5 py-1">Next.js 16</span>
            <span className="rounded bg-gray-800 px-2.5 py-1">TypeScript</span>
            <span className="rounded bg-gray-800 px-2.5 py-1">Tailwind v4</span>
            <span className="rounded bg-gray-800 px-2.5 py-1">shadcn/ui</span>
            <span className="rounded bg-gray-800 px-2.5 py-1">Recharts</span>
            <span className="rounded bg-gray-800 px-2.5 py-1">jsPDF</span>
            <span className="rounded bg-gray-800 px-2.5 py-1">lucide-react</span>
          </div>
          <p className="text-sm text-gray-400">{t("footer.builtBy")} — {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  );
}
