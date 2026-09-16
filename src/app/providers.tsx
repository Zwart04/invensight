'use client';

import { ThemeProvider } from '@/lib/theme';
import { LangProvider } from '@/lib/lang';
import { AppProvider } from '@/lib/app-provider';
import { ToastProvider } from '@/lib/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>
        <AppProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AppProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
