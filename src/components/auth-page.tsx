import { useAuth } from '@/lib/auth';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { useState, FormEvent } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

export default function AuthPage() {
  const { t } = useLang();
  const { signIn, signUp, user } = useAuth();
  const { addToast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    let result: { id: string } | null = null;
    if (mode === 'login') {
      result = signIn(email, password);
      if (!result) {
        const users = JSON.parse(localStorage.getItem('invensight_users') || '[]');
        const exists = users.find((u: any) => u.email === email.toLowerCase());
        if (!exists) setErr(t['auth.invalidCredentials']);
        else setErr(t['auth.invalidCredentials']);
      }
    } else {
      result = signUp(name, email, password);
      if (!result) {
        const users = JSON.parse(localStorage.getItem('invensight_users') || '[]');
        if (users.find((u: any) => u.email === email.toLowerCase())) setErr('Email already registered');
        else if (!name.trim()) setErr(t['auth.nameRequired']);
        else if (!email.includes('@')) setErr(t['auth.emailInvalid']);
        else if (password.length < 6) setErr(t['auth.passwordMin']);
        else setErr(t['auth.invalidCredentials']);
      }
    }
    setLoading(false);
    if (result) {
      addToast(mode === 'login' ? 'Signed in' : 'Account created', 'success');
      window.location.href = '/';
    } else if (err) {
      addToast(err, 'error');
    }
  };

  if (user) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="hsl(var(--primary))"/>
              <path d="M12 16h24M12 24h24M12 32h16" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <h1 className="text-2xl font-bold tracking-tight">InvenSight</h1>
          </div>
          <p className="text-muted-foreground mt-2">{t['app.title']}</p>
        </div>

        <div className="flex justify-center gap-4 text-sm bg-muted/50 p-1 rounded-lg">
          <button onClick={() => setMode('login')} className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'login' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
            {t['auth.signInLink']}
          </button>
          <button onClick={() => setMode('register')} className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'register' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
            {t['auth.signUpLink']}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1.5">{t['auth.name']}</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t['auth.namePlaceholder']} className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">{t['auth.email']}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t['auth.emailPlaceholder']} className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t['auth.password']}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t['auth.passwordPlaceholder']} className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? '...' : mode === 'login' ? <><LogIn size={16} />{t['auth.signIn']}</> : <><UserPlus size={16} />{t['auth.signUp']}</>}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === 'login' ? <>{t['auth.noAccount']} <button onClick={() => setMode('register')} className="text-primary hover:underline font-medium">{t['auth.signUp']}</button></> : <>{t['auth.hasAccount']} <button onClick={() => setMode('login')} className="text-primary hover:underline font-medium">{t['auth.signIn']}</button></>}
        </p>
      </div>
    </div>
  );
}
