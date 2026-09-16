'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import type { Toast } from './types';

const ToastContext = createContext<{ toasts: Toast[]; addToast: (msg: string, type?: Toast['type']) => void; removeToast: (id: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((msg: string, type: Toast['type'] = 'default') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message: msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
