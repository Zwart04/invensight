'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { t } from './t';

type Locale = 'en' | 'id';

const STORAGE_LANG = 'inv_lang';

function readLang(): Locale {
  if (typeof window === 'undefined') return 'en';
  try { return (localStorage.getItem(STORAGE_LANG) as Locale) || 'en'; } catch { return 'en'; }
}
function writeLang(l: Locale) { if (typeof window !== 'undefined') localStorage.setItem(STORAGE_LANG, l); }

const LangContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: typeof t.en; mounted: boolean } | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocRaw] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);
  const [tcur, setTCur] = useState<typeof t.en>(t.en);

  useEffect(() => {
    setMounted(true);
    const l = readLang();
    setLocRaw(l);
    setTCur(l === 'id' ? t.id : t.en);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    writeLang(l);
    setLocRaw(l);
    setTCur(l === 'id' ? t.id : t.en);
  }, []);

  return <LangContext.Provider value={{ locale, setLocale, t: tcur, mounted }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
}
