"use client";

import { useApp } from "@/lib/app-provider";
import Link from "next/link";

const LINKS = [
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/heatmap", key: "nav.heatmap" },
  { href: "/restock", key: "nav.restock" },
  { href: "/cari", key: "nav.search" },
  { href: "/laporan", key: "nav.reports" },
  { href: "/supplier", key: "nav.suppliers" },
  { href: "/alerts", key: "nav.alerts" },
  { href: "/analytics", key: "nav.analytics" },
  { href: "/finance", key: "nav.finance" },
  { href: "/settings", key: "nav.settings" },
  { href: "/share", key: "nav.share" },
];

export function Navbar() {
  const { t, language, setLanguageID, setLanguageEN } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <path d="M3 3h18v18H3z" />
              <path d="M9 9h6v6H9z" />
              <path d="M3 9h6M15 9h6M3 15h6M15 15h6" />
            </svg>
            InvenSight
          </Link>
          <nav className="hidden items-center gap-1 md:flex lg:flex">
            {LINKS.map((link) => (
              <Link key={link.key} href={link.href} className="rounded px-2.5 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={setLanguageID}
            className="rounded px-2 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Indonesian"
          >
            ID
          </button>
          <button
            onClick={setLanguageEN}
            className="rounded px-2 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white md:hidden"
            aria-label="English"
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
