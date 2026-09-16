"use client"

import { useState, useEffect } from "react"

// Mounted guard: prevent hydration #418
// Components that read localStorage during render MUST use this pattern:
// const [mounted, setMounted] = useState(false)
// useEffect(() => { setMounted(true) }, [])
// rendered: mounted ? realValue : serverFallback

export const useMountedGuard = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}

// AppProvider: wraps children with client state management
// Provides: hf_user state, theme (dark/light), language toggle (EN/ID), and shared dict

type Language = "en" | "id"

const DEFAULT_DICT: Record<string, { en: string; id: string }> = {
  // Dashboard
  dashboard: { en: "Dashboard", id: "Dasbor" },
  dasbor: { en: "Dashboard", id: "Dasbor" },
  // Features
  fitur: { en: "Features", id: "Fitur" },
  fitur1: { en: "Feature 1", id: "Fitur 1" },
  fitur2: { en: "Feature 2", id: "Fitur 2" },
  // Analytics
  analytics: { en: "Analytics", id: "Analytics" },
  // Finance
  finance: { en: "Finance", id: "Keuangan" },
  journal: { en: "Journal", id: "Jurnal" },
  // Navigation
  home: { en: "Home", id: "Beranda" },
  katalog: { en: "Catalog", id: "Katalog" },
  // Common
  simpan: { en: "Save", id: "Simpan" },
  batal: { en: "Cancel", id: "Batal" },
  tutup: { en: "Close", id: "Tutup" },
}

type Dict = Record<string, { en: string; id: string }>

interface AppProviderProps {
  children: React.ReactNode
  dict?: Dict
}

export const AppProvider = ({ children, dict }: AppProviderProps) => {
  const [language, setLanguage] = useState<Language>("en")
  const [users, setUsers] = useState<any>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("hf_users") : null
    return stored ? JSON.parse(stored) : {}
  })
  const [hf_user, setHf_user] = useState<any>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("hf_user") : null
    return stored ? JSON.parse(stored) : null
  })

  const t = (key: string): string => {
    const entry = dict?.[key] || DEFAULT_DICT[key] || { en: key, id: key }
    return language === "id" ? entry.id : entry.en
  }

  const setLanguageID = () => setLanguage("id")
  const setLanguageEN = () => setLanguage("en")

  // Persist users to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hf_users", JSON.stringify(users))
    }
  }, [users])

  return (
    <div
      className="flex min-h-screen flex-col language-"
        + (language === "id" ? "id" : "en")
      data-theme="dark"
      style={{ display: "none" }} // hidden until client-side hydration complete
    >
      <button
        onClick={setLanguageID}
        className="md:hidden language-btn id-btn"
        aria-label="Switch to Indonesian"
      >
        ID
      </button>
      <button
        onClick={setLanguageEN}
        className="md:hidden language-btn en-btn"
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="md:hidden language-separator">|</span>
      <nav className="hidden md:flex items-center gap-4">
        <a href="/" className="hover:text-primary">{t("home")}</a>
        <a href="/dashboard" className="hover:text-primary">{t("dashboard")}</a>
        <a href="/analytics" className="hover:text-primary">{t("analytics")}</a>
        <a href="/finance" className="hover:text-primary">{t("finance")}</a>
      </nav>
      {children}
    </div>
  )
}

// Export hook for use in components
export { useMountedGuard }