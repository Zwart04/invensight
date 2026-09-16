'use client';
import { useState, useMemo } from 'react';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/card';
import { Badge } from '@/components/badge';
import { Select } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { Plus, Phone, Mail, MapPin, Edit, Trash2, Warehouse, Package } from 'lucide-react';

interface Props {
  suppliers: any[];
  products: any[];
  orders: any[];
  addToast: (msg: string, type?: 'default' | 'success' | 'error' | 'info') => void;
}

export default function SuppliersPage({ suppliers, products, orders, addToast }: Props) {
  const { t } = useLang();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '', contactPerson: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', address: '', notes: '', contactPerson: '' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (s: any) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email, phone: s.phone, address: s.address, notes: s.notes || '', contactPerson: s.contactPerson || '' });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { addToast(t['suppliers.nameRequired'], 'error'); return; }
    if (!form.email.trim() || !form.email.includes('@')) { addToast(t['suppliers.emailInvalid'], 'error'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 200));
    if (editing) {
      const all = JSON.parse(localStorage.getItem('inv_supp') || '[]');
      const idx = all.findIndex((s: any) => s.id === editing.id);
      if (idx !== -1) all[idx] = { ...all[idx], ...form };
      localStorage.setItem('inv_supp', JSON.stringify(all));
      addToast(t['suppliers.saveSuccess'], 'success');
    } else {
      const newS = { id: crypto.randomUUID(), ...form, lastOrder: '', activeOrders: 0 };
      const all = JSON.parse(localStorage.getItem('inv_supp') || '[]');
      all.push(newS);
      localStorage.setItem('inv_supp', JSON.stringify(all));
      addToast(t['suppliers.addSuccess'], 'success');
    }
    setSubmitting(false);
    resetForm();
  };

  const handleDelete = (s: any) => setDeleteConfirm(s);
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const all = JSON.parse(localStorage.getItem('inv_supp') || '[]');
    localStorage.setItem('inv_supp', JSON.stringify(all.filter((s: any) => s.id !== deleteConfirm.id)));
    const oAll = JSON.parse(localStorage.getItem('inv_ord') || '[]');
    localStorage.setItem('inv_ord', JSON.stringify(oAll.filter((o: any) => o.supplierId !== deleteConfirm.id)));
    addToast(t['suppliers.deleteSuccess'], 'success');
    setDeleteConfirm(null);
  };

  const enriched = useMemo(() => suppliers.map(s => ({
    ...s,
    productCount: products.filter(p => p.supplierId === s.id).length,
    activeOrders: orders.filter(o => o.supplierId === s.id && (o.status === 'pending' || o.status === 'confirmed')).length,
  })), [suppliers, products, orders]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t['suppliers.title']}</h1>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} />{t['suppliers.addSupplier']}</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {enriched.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Warehouse size={48} className="mb-3 opacity-50" />
              <p className="text-lg font-medium">{t['suppliers.empty']}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t['suppliers.name']}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">{t['suppliers.email']}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">{t['suppliers.phone']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">{t['suppliers.productsSupplied']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">{t['suppliers.activeOrders']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">{t['suppliers.actions']}</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map(s => (
                  <tr key={s.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell"><a href={`mailto:${s.email}`} className="text-primary hover:underline">{s.email}</a></td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell"><span className="flex items-center gap-1"><Phone size={12} />{s.phone}</span></td>
                    <td className="p-3 text-right hidden sm:table-cell"><Badge variant="secondary">{s.productCount}</Badge></td>
                    <td className="p-3 text-right hidden md:table-cell"><Badge variant={s.activeOrders > 0 ? 'default' : 'outline'}>{s.activeOrders}</Badge></td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Edit size={14} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(s)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={resetForm}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{editing ? t['suppliers.editSupplier'] : t['suppliers.addSupplier']}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">{t['suppliers.name']}</label>
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['suppliers.email']}</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="pl-9" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['suppliers.phone']}</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="pl-9" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['suppliers.contactPerson']}</label>
                    <Input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">{t['suppliers.address']}</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="pl-9" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">{t['suppliers.notes']}</label>
                    <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? '...' : (editing ? 'Update' : 'Add')}</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t['suppliers.deleteSupplier']}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t['suppliers.confirmDelete']}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
