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
import { Plus, Search, Edit, Trash2, AlertTriangle, Package, Grid3X3 } from 'lucide-react';
import type { Product } from '@/lib/types';
import dynamic from 'next/dynamic';

const StockHeatmap = dynamic(() => import('@/components/stock-heatmap'), { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-muted-foreground">Loading heatmap...</div> });

interface Props {
  products: Product[];
  categories: any[];
  suppliers: any[];
  addToast: (msg: string, type?: 'default' | 'success' | 'error' | 'info') => void;
  refresh: () => void;
}

export default function InventoryPage({ products, categories, suppliers, addToast, refresh }: Props) {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', sku: '', category: '', quantity: '', price: '', location: '', minStock: '', maxStock: '', supplierId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !categoryFilter || p.category === categoryFilter;
      let matchStatus = true;
      if (statusFilter === 'low') matchStatus = p.quantity > 0 && p.quantity <= p.minStock;
      else if (statusFilter === 'out') matchStatus = p.quantity === 0;
      else if (statusFilter === 'good') matchStatus = p.quantity > p.minStock;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const supplierOptions = suppliers.map(s => ({ value: s.id, label: s.name }));

  const resetForm = () => {
    setForm({ name: '', sku: '', category: '', quantity: '', price: '', location: '', minStock: '', maxStock: '', supplierId: '' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      quantity: String(p.quantity),
      price: String(p.price),
      location: p.location,
      minStock: String(p.minStock),
      maxStock: String(p.maxStock),
      supplierId: p.supplierId,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { addToast(t['inventory.nameRequired'], 'error'); return; }
    if (!form.sku.trim()) { addToast(t['inventory.skuRequired'], 'error'); return; }
    if (!form.quantity || Number(form.quantity) < 0) { addToast(t['inventory.quantityMin'], 'error'); return; }
    if (!form.price || Number(form.price) < 0) { addToast(t['inventory.priceMin'], 'error'); return; }
    if (!form.category) { addToast(t['inventory.categoryRequired'], 'error'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 200));
    if (editing) {
      // update
      const updated = { ...editing, name: form.name, sku: form.sku, category: form.category, quantity: Number(form.quantity), price: Number(form.price), location: form.location, minStock: Number(form.minStock), maxStock: Number(form.maxStock), supplierId: form.supplierId, updatedAt: new Date().toISOString() };
      const all = JSON.parse(localStorage.getItem('inv_prod') || '[]');
      const idx = all.findIndex((p: any) => p.id === editing.id);
      if (idx !== -1) all[idx] = updated;
      localStorage.setItem('inv_prod', JSON.stringify(all));
      addToast(t['inventory.saveSuccess'], 'success');
    } else {
      const newP: Product = {
        id: crypto.randomUUID(),
        name: form.name,
        sku: form.sku,
        category: form.category,
        quantity: Number(form.quantity),
        price: Number(form.price),
        location: form.location,
        minStock: Number(form.minStock || 10),
        maxStock: Number(form.maxStock || 100),
        supplierId: form.supplierId || '',
        updatedAt: new Date().toISOString(),
      };
      const all = JSON.parse(localStorage.getItem('inv_prod') || '[]');
      all.push(newP);
      localStorage.setItem('inv_prod', JSON.stringify(all));
      addToast(t['inventory.addSuccess'], 'success');
    }
    setSubmitting(false);
    resetForm();
    refresh();
  };

  const handleDelete = (p: Product) => {
    setDeleteConfirm(p);
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const all = JSON.parse(localStorage.getItem('inv_prod') || '[]');
    localStorage.setItem('inv_prod', JSON.stringify(all.filter((p: any) => p.id !== deleteConfirm.id)));
    addToast(t['inventory.deleteSuccess'], 'success');
    setDeleteConfirm(null);
    refresh();
  };

  const qtyLabel = (p: Product) => {
    if (p.quantity === 0) return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle size={12} />{t['inventory.outOfStockWarning']}</Badge>;
    if (p.quantity <= p.minStock) return <Badge variant="secondary" className="flex items-center gap-1"><AlertTriangle size={12} />{t['inventory.lowStockWarning']}</Badge>;
    return <Badge variant="default">{t['inventory.goodStock']}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t['inventory.title']}</h1>
          <p className="text-muted-foreground mt-1">{t['inventory.search']}</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} />{t['inventory.addProduct']}</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t['inventory.search']} className="pl-9" />
        </div>
        <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full sm:w-40">
          <option value="">{t['inventory.category']}</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Select>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-40">
          <option value="all">{t['inventory.goodStock']}</option>
          <option value="low">{t['inventory.lowStockWarning']}</option>
          <option value="out">{t['inventory.outOfStockWarning']}</option>
        </Select>
      </div>

      {/* Heatmap Canvas */}
      <Card>
        <CardHeader>
          <CardTitle>{t['inventory.heatmap']}</CardTitle>
        </CardHeader>
        <CardContent>
          <StockHeatmap products={filtered} />
        </CardContent>
      </Card>

      {/* Product table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package size={48} className="mb-3 opacity-50" />
              <p className="text-lg font-medium">{t['inventory.empty']}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t['inventory.productName']}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">{t['inventory.sku']}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">{t['inventory.category']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">{t['inventory.quantity']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">{t['inventory.price']}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">{t['inventory.location']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">{t['inventory.actions']}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{p.sku}</td>
                    <td className="p-3 hidden lg:table-cell"><Badge variant="secondary">{p.category}</Badge></td>
                    <td className="p-3 text-right font-mono">{p.quantity}</td>
                    <td className="p-3 text-right font-mono hidden sm:table-cell">${p.price.toFixed(2)}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{p.location}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Edit size={14} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={resetForm}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{editing ? t['inventory.editProduct'] : t['inventory.addProduct']}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['inventory.productName']}</label>
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['inventory.sku']}</label>
                    <Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['inventory.category']}</label>
                    <Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                      <option value="">Pilih...</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['inventory.location']}</label>
                    <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['inventory.quantity']}</label>
                    <Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} min={0} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['inventory.price']}</label>
                    <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} min={0} step={0.01} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['inventory.minStock']}</label>
                    <Input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} min={0} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t['inventory.maxStock']}</label>
                    <Input type="number" value={form.maxStock} onChange={e => setForm({ ...form, maxStock: e.target.value })} min={0} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">{t['inventory.supplier']}</label>
                    <Select value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}>
                      <option value="">Pilih...</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
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

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t['inventory.deleteProduct']}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t['inventory.confirmDelete']}</p>
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
