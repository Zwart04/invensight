'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/lang';
import { useTheme } from '@/lib/theme';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card';
import { Button } from '@/components/button';
import { Package, AlertCircle, RefreshCw, Clock, Copy, Check } from 'lucide-react';
import { useShareStore, isShareExpired, clearShare } from '@/lib/db';

type SharedData = {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  location: string;
  category: string;
  updatedAt: string;
  sharedBy: string;
  expiresAt: string;
};

export default function SharedPageClient({ productId }: { productId: string }) {
  const { t } = useLang();
  const { theme } = useTheme();
  const share = useShareStore();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const item = share as SharedData | null;
  const expired = item ? isShareExpired(item) : false;
  const match = item && item.productId === productId;

  const handleCopy = async () => {
    if (!item) return;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!item || !match) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="hsl(var(--primary))" />
              <path d="M12 16h24M12 24h24M12 32h16" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round" />
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
              <div className="p-2 bg-background rounded-lg border w-10 h-10 flex items-center justify-center">
                <Package size={20} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-lg">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.sku}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted-foreground" />
                <span><strong>{t['shared.qty']}:</strong> {item.quantity}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={14} className="text-muted-foreground" />
                <span><strong>{t['shared.location']}:</strong> {item.location}</span>
              </div>
            </div>
            <div className="border-t pt-3 space-y-1 text-xs text-muted-foreground">
              <p>{t['shared.sharedBy']}: {item.sharedBy}</p>
              <p className="text-xs text-muted-foreground">{new Date(item.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1">
              {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
              {copied ? t['shared.linkCopied'] : t['shared.copyLink']}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">{t['shared.fallback']}</p>
        </CardContent>
      </Card>
    </div>
  );
}
