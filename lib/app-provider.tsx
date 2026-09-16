"use client";

import { useEffect, useState, useMemo, createContext, useContext, useCallback } from "react";
import { T } from "@/lib/i18n";

type Language = "en" | "id";

interface AppState {
  language: Language;
  setLanguage: (l: Language) => void;
  setLanguageID: () => void;
  setLanguageEN: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("iv_lang");
    if (stored === "id" || stored === "en") setLanguageState(stored);
  }, []);

  const setLanguage = useCallback((l: Language) => {
    setLanguageState(l);
    localStorage.setItem("iv_lang", l);
  }, []);

  const setLanguageID = useCallback(() => setLanguage("id"), [setLanguage]);
  const setLanguageEN = useCallback(() => setLanguage("en"), [setLanguage]);

  const t = useCallback((key: string): string => {
    const entry = T[key];
    if (!entry) return key;
    return language === "id" ? entry.id : entry.en;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    setLanguageID,
    setLanguageEN,
    t,
  }), [language, t]);

  return (
    <AppContext.Provider value={value}>
      <div className="flex min-h-screen flex-col">
        {mounted && children}
      </div>
    </AppContext.Provider>
  );
}

export { useMountedGuard } from "@/lib/app-provider";
