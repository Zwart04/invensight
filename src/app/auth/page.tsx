'use client';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';
import { useState, FormEvent } from 'react';

export default function AuthPage() {
  const { t } = useLang();
  const { user, signUp, signIn, signOut } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Signed in as {user.email}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => { signOut(); window.location.href = '/auth'; }}>{t['nav.logout']}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    let result: any = null;
    if (mode === 'login') {
      result = signIn(email, password);
      if (!result) {
        const users = JSON.parse(localStorage.getItem('invensight_users') || '[]');
        if (!users.find((u: any) => u.email === email.toLowerCase())) {
          setErr(t['auth.invalidCredentials']);
        } else {
          setErr(t['auth.invalidCredentials']);
        }
      }
    } else {
      result = signUp(name, email, password);
      if (!result) {
        const users = JSON.parse(localStorage.getItem('invensight_users') || '[]');
        if (users.find((u: any) => u.email === email.toLowerCase())) {
          setErr('Email already registered');
        } else if (!name.trim()) {
          setErr(t['auth.nameRequired']);
        } else if (!email.includes('@')) {
          setErr(t['auth.emailInvalid']);
        } else if (password.length < 6) {
          setErr(t['auth.passwordMin']);
        } else {
          setErr(t['auth.invalidCredentials']);
        }
      }
    }
    setLoading(false);
    if (result) {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="hsl(var(--primary))"/>
              <path d="M12 16h24M12 24h24M12 32h16" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <CardTitle className="text-xl">InvenSight</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{t['app.title']}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant={mode === 'login' ? 'default' : 'outline'} onClick={() => setMode('login')} className="flex-1">
              {t['auth.signInLink']}
            </Button>
            <Button variant={mode === 'register' ? 'default' : 'outline'} onClick={() => setMode('register')} className="flex-1">
              {t['auth.signUpLink']}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-1.5">{t['auth.name']}</label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t['auth.namePlaceholder']}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5">{t['auth.email']}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t['auth.emailPlaceholder']}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t['auth.password']}</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t['auth.passwordPlaceholder']}
                  className="pl-9"
                  required
                  minLength={6}
                />
              </div>
            </div>
            {err && <p className="text-sm text-destructive text-center">{err}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '...' : mode === 'login' ? <><LogIn size={16} />{t['auth.signIn']}</> : <><UserPlus size={16} />{t['auth.signUp']}</>}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                {t['auth.noAccount']}{' '}
                <button onClick={() => setMode('register')} className="text-primary hover:underline">
                  {t['auth.signUp']}
                </button>
              </>
            ) : (
              <>
                {t['auth.hasAccount']}{' '}
                <button onClick={() => setMode('login')} className="text-primary hover:underline">
                  {t['auth.signIn']}
                </button>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
