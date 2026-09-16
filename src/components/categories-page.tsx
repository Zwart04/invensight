'use client';
import { useState } from 'react';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/card';
import { Badge } from '@/components/badge';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

interface Props {
  categories: any[];
  products: any[];
  addToast: (msg: string, type?: 'default' | 'success' | 'error' | 'info') => void;
}

export default function CategoriesPage({ categories, products, addToast }: Props) {
  const { t } = useLang();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', color: '#3b82f6' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const resetForm = () => {
    setForm({ name: '', color: '#3b82f6' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ name: c.name, color: c.color });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { addToast(t['categories.nameRequired'], 'error'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 200));
    if (editing) {
      const all = JSON.parse(localStorage.getItem('inv_cat') || '[]');
      const idx = all.findIndex((c: any) => c.id === editing.id);
      if (idx !== -1) all[idx] = { ...all[idx], ...form };
      localStorage.setItem('inv_cat', JSON.stringify(all));
      addToast(t['categories.saveSuccess'], 'success');
    } else {
      const newC = { id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() };
      const all = JSON.parse(localStorage.getItem('inv_cat') || '[]');
      all.push(newC);
      localStorage.setItem('inv_cat', JSON.stringify(all));
      addToast(t['categories.addSuccess'], 'success');
    }
    setSubmitting(false);
    resetForm();
  };

  const handleDelete = (c: any) => setDeleteConfirm(c);
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const all = JSON.parse(localStorage.getItem('inv_cat') || '[]');
    localStorage.setItem('inv_cat', JSON.stringify(all.filter((c: any) => c.id !== deleteConfirm.id)));
    addToast(t['categories.deleteSuccess'], 'success');
    setDeleteConfirm(null);
  };

  const enriched = categories.map(c => ({
    ...c,
    productCount: products.filter(p => p.category === c.name).length,
    totalStock: products.filter(p => p.category === c.name).reduce((s, p) => s + p.quantity, 0),
    totalValue: products.filter(p => p.category === c.name).reduce((s, p) => s + p.quantity * p.price, 0),
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t['categories.title']}</h1>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} />{t['categories.addCategory']}</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {enriched.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Tag size={48} className="mb-3 opacity-50" />
              <p className="text-lg font-medium">{t['categories.empty']}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t['categories.name']}</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">{t['categories.color']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">{t['categories.productCount']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">{t['categories.totalStock']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">{t['categories.totalValue']}</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">{t['inventory.actions']}</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map(c => (
                  <tr key={c.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 hidden md:table-cell"><span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />{c.color}</span></td>
                    <td className="p-3 text-right"><Badge variant="secondary">{c.productCount}</Badge></td>
                    <td className="p-3 text-right hidden sm:table-cell font-mono">{c.totalStock}</td>
                    <td className="p-3 text-right hidden md:table-cell font-mono">${c.totalValue.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Edit size={14} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(c)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
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
          <Card className="w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{editing ? t['categories.editSupplier'] : t['categories.addCategory']}</CardTitle>
              {/* Note: group label reused intentionally since no dedicated edit title key */}
            </CardHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <CardContent>
                <div>
                  <label className="block text-sm font-medium mb-1">{t['categories.name']}</label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t['categories.color']}</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded border border-input cursor-pointer" />
                    <Input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="flex-1 font-mono" />
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
              <CardTitle className="text-lg">{t['categories.confirmDelete']}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t['categories.confirmDelete']}</p>
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
