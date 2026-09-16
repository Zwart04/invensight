import { useLang } from '@/lib/lang';
import { useTheme } from '@/lib/theme';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card';
import { Button } from '@/components/button';
import { Package, AlertCircle, RefreshCw, Clock } from 'lucide-react';

export default function ShareLanding() {
  const { t } = useLang();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('inv_share');
        if (raw) setData(JSON.parse(raw));
      } catch {}
    }
  }, []);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">Loading...</div></div>;

  if (!data || !data.productId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="justify-center">
            <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
            <CardTitle>InvenSight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t['shared.notFound']}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const expired = isShareExpired(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="hsl(var(--primary))"/>
              <path d="M12 16h24M12 24h24M12 32h16" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <CardTitle className="text-xl">InvenSight</CardTitle>
          <p className="text-sm text-muted-foreground">{t['shared.title']}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {expired && (
            <div className="flex items-center justify-center gap-2 text-destructive bg-destructive/10 rounded-lg p-3">
              <AlertCircle size={16} />
              <span className="text-sm">{t['shared.expired']}</span>
            </div>
          )}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-lg border w-10 h-10 flex items-center justify-center"><Package size={20} className="text-muted-foreground" /></div>
              <div>
                <p className="font-medium text-lg">{data.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2"><Clock size={14} className="text-muted-foreground" /><span><strong>{t['shared.qty']}:</strong> {data.quantity}</span></div>
              <div className="flex items-center gap-2"><RefreshCw size={14} className="text-muted-foreground" /><span><strong>{t['shared.location']}:</strong> {data.location}</span></div>
            </div>
          </div>
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">{t['shared.sharedBy']} InvenSight User</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function isShareExpired(item: any) {
  if (!item || !item.expiresAt) return false;
  return new Date(item.expiresAt) < new Date();
}
