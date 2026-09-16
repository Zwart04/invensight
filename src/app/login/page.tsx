'use client';
import Image from 'next/image';
import { useApp } from '@/lib/app-context';

export default function AuthPage() {
  const { t, locale, setLocale, mounted } = useApp();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="mx-auto max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Image src="/icon.svg" alt="logo" width={28} height={28} className="text-primary" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">{t['login.title']}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t['login.subtitle']}</p>
        </div>
        <div className="rounded-md border bg-card p-8 shadow-sm">
          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">{t['login.email']}</label>
              <div>
                <input
                  type="email"
                  required
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="user@example.com"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t['login.password']}</label>
              <div>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="******"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-primary" />
              <label htmlFor="remember" className="text-sm text-muted-foreground">Ingat saya</label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex h-10 w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {t['login.signIn']}
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t['login.noAccount']}{' '}
            <a href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              {t['login.registerHere']}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
