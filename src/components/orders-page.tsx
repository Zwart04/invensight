'use client';
import { useState, useMemo } from 'react';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/card';
import { Badge } from '@/components/badge';
import { Select } from '@/components/select';
import { Plus, ShoppingCart, CheckCircle, XCircle, Clock, Truck, FileText } from 'lucide-react';
import type { Order, Product } from '@/lib/types';

interface Props {
  products: Product[];
  suppliers: any[];
  orders: any[];
  addToast: (msg: string, type?: 'default' | 'success' | 'error' | 'info') => void;
}

export default function OrdersPage({ products, suppliers, orders, addToast }: Props) {
  const { t } = useLang();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: '', supplierId: '', quantity: '1', status: 'pending' });
  const [submitting, setSubmitting] = useState(false);

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    received: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    delayed: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const resetForm = () => {
    setForm({ productId: '', supplierId: '', quantity: '1', status: 'pending' });
    setShowForm(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId) { addToast(t['orders.productRequired'], 'error'); return; }
    if (!form.supplierId) { addToast(t['orders.supplierRequired'], 'error'); return; }
    if (!form.quantity || Number(form.quantity) < 1) { addToast(t['orders.quantityMin'], 'error'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 200));
    const product = products.find(p => p.id === form.productId);
    const newOrder: Order = {
      id: crypto.randomUUID(),
      supplierId: form.supplierId,
      productId: form.productId,
      quantity: Number(form.quantity),
      status: form.status as any,
      date: new Date().toISOString(),
      total: product ? product.price * Number(form.quantity) : 0,
    };
    const all = JSON.parse(localStorage.getItem('inv_ord') || '[]');
    all.push(newOrder);
    localStorage.setItem('inv_ord', JSON.stringify(all));
    // Update supplier active orders
    const supps = JSON.parse(localStorage.getItem('inv_supp') || '[]');
    const sIdx = supps.findIndex((s: any) => s.id === form.supplierId);
    if (sIdx !== -1) {
      supps[sIdx].activeOrders = (supps[sIdx].activeOrders || 0) + 1;
      supps[sIdx].lastOrder = new Date().toISOString();
      localStorage.setItem('inv_supp', JSON.stringify(supps));
    }
    setSubmitting(false);
    addToast(t['orders.addSuccess'], 'success');
    resetForm();
  };

  const updateStatus = (id: string, status: Order['status']) => {
    const all = JSON.parse(localStorage.getItem('inv_ord') || '[]');
    const idx = all.findIndex((o: any) => o.id === id);
    if (idx !== -1) {
      all[idx].status = status;
      localStorage.setItem('inv_ord', JSON.stringify(all));
      addToast(status === 'confirmed' ? t['orders.confirmSuccess'] : status === 'received' ? t['orders.receivedSuccess'] : t['orders.cancelSuccess'], 'success');
    }
  };

  const productOptions = products.map(p => ({ value: p.id, label: `${p.name} ($${p.price})` }));
  const supplierOptions = suppliers.map(s => ({ value: s.id, label: s.name }));

  const sorted = useMemo(() => [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [orders]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t['orders.title']}</h1>
          <p className="text-muted-foreground mt-1">{t['orders.newOrder']}</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} />{t['orders.newOrder']}</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShoppingCart size={48} className="mb-3 opacity-50" />
              <p className="text-lg font-medium">{t['orders.empty']}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t['orders.orderId']}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">{t['orders.product']}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">{t['orders.supplier']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">{t['orders.quantity']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">{t['orders.total']}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">{t['orders.date']}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t['orders.status']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">{t['orders.actions']}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(o => {
                  const product = products.find(p => p.id === o.productId);
                  const supplier = suppliers.find(s => s.id === o.supplierId);
                  return (
                    <tr key={o.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                      <td className="p-3 hidden md:table-cell">{product?.name || '-'}</td>
                      <td className="p-3 hidden lg:table-cell">{supplier?.name || '-'}</td>
                      <td className="p-3 text-right font-mono">{o.quantity}</td>
                      <td className="p-3 text-right font-mono hidden sm:table-cell">${o.total.toFixed(2)}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell text-xs">{new Date(o.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Badge className={statusColors[o.status] || ''}>
                          {o.status === 'pending' ? t['orders.statuspending'] : o.status === 'confirmed' ? t['orders.statusconfirmed'] : o.status === 'received' ? t['orders.statusreceived'] : o.status === 'cancelled' ? t['orders.statuscancelled'] : t['orders.statusdelayed']}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {o.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => updateStatus(o.id, 'confirmed')} title={t['orders.confirmOrder']}><CheckCircle size={14} /></Button>
                              <Button variant="ghost" size="sm" onClick={() => updateStatus(o.id, 'cancelled')} title={t['orders.cancelOrder']} className="text-destructive"><XCircle size={14} /></Button>
                            </>
                          )}
                          {o.status === 'confirmed' && (
                            <Button variant="ghost" size="sm" onClick={() => updateStatus(o.id, 'received')} title={t['orders.receivedOrder']}><Truck size={14} /></Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={resetForm}>
          <Card className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{t['orders.newOrder']}</CardTitle>
            </CardHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['orders.product']}</label>
                    <Select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} required>
                      <option value="">{t['orders.selectProduct']}</option>
                      {productOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['orders.supplier']}</label>
                    <Select value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} required>
                      <option value="">{t['orders.selectSupplier']}</option>
                      {supplierOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['orders.quantity']}</label>
                    <Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} min={1} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['orders.status']}</label>
                    <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="pending">{t['orders.statuspending']}</option>
                      <option value="confirmed">{t['orders.statusconfirmed']}</option>
                      <option value="delayed">{t['orders.statusdelayed']}</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? '...' : t['orders.newOrder']}</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
