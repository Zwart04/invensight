'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light' | 'system';

const STORAGE_THEME = 'inv_theme';

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try { return (localStorage.getItem(STORAGE_THEME) as Theme) || 'dark'; } catch { return 'dark'; }
}

function writeTheme(t: Theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_THEME, t);
}

function resolveTheme(t: Theme): 'light' | 'dark' {
  if (t === 'system') {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return t;
}

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void; resolved: 'light' | 'dark' } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeRaw] = useState<Theme>('dark');
  const [resolved, setResolved] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = readTheme();
    setThemeRaw(t);
    setResolved(resolveTheme(t));
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e: MediaQueryListEvent) => {
      if (theme === 'system') setResolved(e.matches ? 'light' : 'dark');
    };
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else mql.addListener(handler);
    return () => { if (mql.removeEventListener) mql.removeEventListener('change', handler); else mql.removeListener(handler); };
  }, []);

  const setTheme = useCallback((t: Theme) => {
    writeTheme(t);
    setThemeRaw(t);
    setResolved(resolveTheme(t));
    if (typeof document !== 'undefined') document.documentElement.classList.toggle('light', resolveTheme(t) === 'light');
  }, [theme]);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.classList.toggle('light', resolved === 'light');
  }, [resolved]);

  return <ThemeContext.Provider value={{ theme, setTheme, resolved }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
