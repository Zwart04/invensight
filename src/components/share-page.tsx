'use client';
import { useState, useEffect, useCallback } from 'react';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { useShareStore, setShareItem, clearShare, isShareExpired } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/card';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Badge } from '@/components/badge';
import { Select } from '@/components/select';
import { Share2, Copy, Clock, Package, Truck, MapPin, Calendar, Check, Link } from 'lucide-react';

export default function SharePage({ products }: { products: any[] }) {
  const { t } = useLang();
  const { addToast } = useToast();
  const share = useShareStore();
  const [selectedId, setSelectedId] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  const selected = products.find(p => p.id === selectedId);

  const generateLink = useCallback(() => {
    if (!selected) { addToast(t['share.noItem'], 'error'); return; }
    const url = `${window.location.origin}/s/${selected.id}`;
    setLink(url);
    setShareItem({ productId: selected.id, name: selected.name, quantity: selected.quantity, location: selected.location, updatedAt: selected.updatedAt, sharedBy: 'InvenSight User' });
    addToast(t['share.linkGenerated'], 'success');
  }, [selected, addToast]);

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      addToast(t['share.linkCopied'], 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast(t['share.copyFailed'], 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t['share.title']}</h1>
        <p className="text-muted-foreground mt-1">{t['share.selectItem']}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t['share.selectItem']}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              <option value="">{t['share.selectItem']}</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (x{p.quantity})</option>)}
            </Select>
          </div>
          {selected && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-lg border"><Package size={20} className="text-muted-foreground" /></div>
                <div>
                  <p className="font-medium">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {selected.sku}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><Truck size={14} className="text-muted-foreground" /><span>Qty: {selected.quantity}</span></div>
                <div className="flex items-center gap-2"><MapPin size={14} className="text-muted-foreground" /><span>{selected.location}</span></div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button onClick={generateLink} disabled={!selected}><Share2 size={16} />{t['share.generate']}</Button>
        </CardFooter>
      </Card>

      {link && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t['shared.copyLink']}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input value={link} readOnly className="flex-1 font-mono text-sm" />
                <Button variant="outline" size="sm" onClick={copyLink}>
                  {copied ? <><Check size={14} />{t['shared.linkCopied']}</> : <><Copy size={14} />{t['shared.copyLink']}</>}
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock size={12} />{t['settings.shareExpiration']}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
