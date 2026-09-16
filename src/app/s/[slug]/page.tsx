'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { useProducts } from '@/lib/db';
import { isShareExpired } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Package, MapPin, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export default function SharedPage({ params }: { params: { slug: string } }) {
  const { t } = useLang();
  const { t: tEn } = useLang();
  const products = useProducts();
  const [mounted, setMounted] = useState(false);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    // Read slug from URL - for static export we read from localStorage share
    const share = localStorage.getItem('inv_share');
    if (share) {
      try {
        const s = JSON.parse(share);
        if (s && s.productId) setSlug(s.productId);
      } catch {}
    }
  }, []);

  // For static export, the slug is embedded via the share store
  const product = products.find(p => p.id === slug);

  if (!mounted) return null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="justify-center">
            <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
            <CardTitle>{t['shared.notFound']}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t['shared.expired']}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const expired = isShareExpired(JSON.parse(localStorage.getItem('inv_share') || 'null'));

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
                <p className="font-medium text-lg">{product.name}</p>
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2"><Clock size={14} className="text-muted-foreground" /><span><strong>{t['shared.qty']}:</strong> {product.quantity}</span></div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-muted-foreground" /><span><strong>{t['shared.location']}:</strong> {product.location}</span></div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><RefreshCw size={12} /><span><strong>{t['shared.lastUpdated']}:</strong> {new Date(product.updatedAt).toLocaleString()}</span></div>
          </div>
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">{t['shared.sharedBy']} InvenSight User</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
