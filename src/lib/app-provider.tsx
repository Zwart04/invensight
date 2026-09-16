'use client';
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/lib/theme';
import { LangProvider } from '@/lib/lang';
import { ToastProvider } from '@/lib/toast';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LangProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </LangProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
