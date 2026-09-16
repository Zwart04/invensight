'use client';

import { useState, useEffect, useCallback } from 'react';

interface LanguageResult { lang: string; setLang: (v: string) => void }

export function useLanguage(): LanguageResult {
  const [lang, setLang] = useState<string>('en');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('inv_lang') : null;
    if (stored === 'en' || stored === 'id') {
      setLang(stored);
    }
  }, []);

  const set = useCallback((v: string) => {
    setLang(v);
    if (typeof window !== 'undefined') {
      localStorage.setItem('inv_lang', v);
    }
  }, []);

  return { lang, setLang: set };
}

interface ThemeResult { theme: string; setTheme: (v: string) => void }

export function useTheme(): ThemeResult {
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('inv_theme') : null;
    if (stored === 'dark' || stored === 'light' || stored === 'system') {
      setTheme(stored);
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    const handler = () => {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handler);
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handler);
  }, []);

  const set = useCallback((v: string) => {
    setTheme(v);
    if (typeof window !== 'undefined') {
      localStorage.setItem('inv_theme', v);
      if (v === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return { theme, setTheme: set };
}

export function useAttribution(): string {
  const [source, setSource] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const getParams = () => {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('utm_source') || params.get('source');
      return s || '';
    };
    const existing = localStorage.getItem('inv_source');
    if (!existing) {
      const fresh = getParams();
      if (fresh) {
        localStorage.setItem('inv_source', fresh);
        setSource(fresh);
      }
    } else {
      setSource(existing);
    }
  }, []);

  return source;
}
